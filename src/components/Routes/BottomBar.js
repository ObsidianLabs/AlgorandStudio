import React from 'react'

import BottomBar from '@obsidians/bottombar'

import { connect, dispatch } from '@/redux'

function BottomBarWithProps (props) {
  const selected = props.projects.get('selected')
  const projectValid = selected && !selected.get('invalid')

  return (
    <BottomBar
      projectValid={projectValid}
      nodeVersion={props.globalConfig.get('nodeVersion')}
      compilerVersion={props.globalConfig.get('compilerVersion')}
      onSelectNodeVersion={nodeVersion => dispatch('UPDATE_GLOBAL_CONFIG', { nodeVersion })}
      onSelectCompiler={compilerVersion => dispatch('UPDATE_GLOBAL_CONFIG', { compilerVersion })}
    />
  )
}

export default connect(['projects', 'globalConfig'])(BottomBarWithProps)
