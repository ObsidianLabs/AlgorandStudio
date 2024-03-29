import React, { PureComponent } from 'react'

import { connect } from '@obsidians/redux'
import { IpcChannel } from '@obsidians/ipc'

import headerActions, { Header, NavGuard, AuthModal } from '@obsidians/header'
import { networkManager, networks } from '@obsidians/network'
import { BaseProjectManager } from '@obsidians/workspace'
import { actions } from '@obsidians/workspace'
import keypairManager from '@obsidians/keypair'
import { createProject } from '../lib/bsn'
import { kp } from '@obsidians/sdk'

import { List } from 'immutable'

keypairManager.kp = kp

class HeaderWithRedux extends PureComponent {
  state = {
    interval: null
  }

  componentDidMount () {
    actions.history = this.props.history
    headerActions.history = this.props.history
    this.refresh()
    this.navGuard = new NavGuard(this.props.history)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.network && prevProps.network !== this.props.network) {
      this.refresh()
    }
  }

  async refresh () {
    if (process.env.DEPLOY === 'bsn') {
      this.getNetworks()
      clearInterval(this.state.interval)
      const interval = setInterval(() => this.getNetworks(), 30 * 1000)
      this.setState({ interval })
    } else {
      networkManager.networks = networks
      this.setNetwork({ notify: true })
    }
  }

  async getNetworks () {
    try {
      const ipc = new IpcChannel('bsn')
      const projects = await ipc.invoke('projects', { chain: 'algo' })
      networkManager.networks = projects.map(project => {
        const url = project.endpoints?.find(endpoint => endpoint.startsWith('http'))
        return {
          id: `bsn_${project.id}`,
          group: 'BSN',
          name: `${project.network.name}/${project.name}`,
          fullName: `${project.network.name} - ${project.name}`,
          icon: 'fas fa-globe',
          notification: `Switched to <b>${project.name}</b>.`,
          url,
          projectKey: project.key,
          raw: project,
        }
      })
      this.setNetwork({ redirect: false, notify: false })
    } catch (error) {
      networkManager.networks = []
    }
  }

  setNetwork (options) {
    if (!networkManager.network && networkManager.networks.length) {
      networkManager.setNetwork(networkManager.networks[0], options)
    }
  }

  networkList = networksByGroup => {
    const networkList = []
    const groups = networksByGroup.toJS()
    const keys = Object.keys(groups)
    keys.forEach((key, index) => {
      if (key !== 'default') {
        networkList.push({ header: key })
      }
      const networkGroup = groups[key].sort((b, a) => b.name < a.name ? -1 : 1)
      networkGroup.forEach(network => networkList.push(network))
      if (index !== keys.length - 1) {
        networkList.push({ divider: true })
      }
    })
    return networkList
  }

  setCreateProject = () => {
    const cp = async function (params) {
      return await createProject.call(this, {
        networkManager,
        bsnChannel: new IpcChannel('bsn'),
        projectChannel: BaseProjectManager.channel
      }, params)
    }
    return process.env.DEPLOY === 'bsn' && cp
  }

  renderLogo () {
    if (process.env.REACT_APP_LOGO) {
      return (
        <div className='d-flex align-items-center' style={{ margin: '7px 17px' }}>
          <img src={require(process.env.REACT_APP_LOGO).default} style={{ background: 'transparent', height: '100%' }}/>
        </div>
      )
    }
    return null
  }

  render () {
    console.debug('[render] HeaderWithRedux')
    const { profile, projects, contracts, accounts, network } = this.props

    const selectedProject = projects.get('selected')?.toJS() || {}

    const list = List(networkManager.networks)
    const networkGroups = list.groupBy(n => n.group)
    const networkList = this.networkList(networkGroups)
    const selectedNetwork = list.find(n => n.id === network) || {}

    const starred = accounts.getIn([network, 'accounts'])?.toJS() || []
    const selectedContract = contracts.getIn([network, 'selected']) || ''
    const selectedAccount = accounts.getIn([network, 'selected']) || ''

    return (
      <Header
        profile={profile}
        projects={projects}
        selectedProject={selectedProject}
        selectedContract={selectedContract}
        selectedAccount={selectedAccount}
        starred={starred}
        network={selectedNetwork}
        networkList={networkList}
        AuthModal={AuthModal}
        createProject={this.setCreateProject()}
        logo={this.renderLogo()}
      />
    )
  }
}

export default connect([
  'profile',
  'projects',
  'contracts',
  'accounts',
  'network',
])(HeaderWithRedux)
