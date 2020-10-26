import React, { PureComponent } from 'react'

import { connect } from '@obsidians/redux'
import Network from '@obsidians/network'

import { withRouter } from 'react-router-dom'

class NetworkWithProps extends PureComponent {
  state = {
    active: true
  }

  componentDidMount () {
    this.props.cacheLifecycles.didCache(() => this.setState({ active: false }))
    this.props.cacheLifecycles.didRecover(() => this.setState({ active: true }))
  }

  render () {
    return (
      <Network
        network={this.props.network}
        active={this.state.active}
      />
    )
  }
}

export default connect([
  'network',
])(withRouter(NetworkWithProps))
