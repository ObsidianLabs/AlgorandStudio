const os = require('os')
const path = require('path')
const webpack = require('webpack')
const {
  override,
  addWebpackAlias,
  addWebpackPlugin
} = require('customize-cra')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

function findWebpackPlugin (plugins, pluginName) {
  return plugins.find(plugin => plugin.constructor.name === pluginName)
}

function overrideProcessEnv (value) {
  return config => {
    const plugin = findWebpackPlugin(config.plugins, 'DefinePlugin')
    const processEnv = plugin.definitions['process.env'] || {}
    plugin.definitions['process.env'] = {
      ...processEnv,
      ...value
    }
    return config
  }
}

function addWasmLoader (options) {
  return config => {
    config.resolve.extensions.push('.wasm')
    config.module.rules.forEach(rule => {
      (rule.oneOf || []).forEach(oneOf => {
        if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
          oneOf.exclude.push(/\.wasm$/);
        }
      })
    })
    return config
  }
}

const overrides = [
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src/lib'),
    '@obsidians/bottombar': `@obsidians/${process.env.BUILD}-bottombar`,
    '@obsidians/explorer': `@obsidians/${process.env.BUILD}-explorer`,
    '@obsidians/header': `@obsidians/${process.env.BUILD}-header`,
    '@obsidians/instances': `@obsidians/${process.env.BUILD}-instances`,
    '@obsidians/project': `@obsidians/${process.env.BUILD}-project`,
    '@obsidians/sdk': `@obsidians/${process.env.BUILD}-sdk`,
    '@obsidians/welcome': `@obsidians/${process.env.BUILD}-welcome`,
  }),
  overrideProcessEnv({
    BUILD: JSON.stringify(process.env.BUILD),
    PROJECT_NAME: JSON.stringify(process.env.PROJECT_NAME),
    OS_IS_LINUX: JSON.stringify(os.type() === 'Linux'),
  }),
  addWasmLoader(),
]

overrides.push(addWebpackPlugin(
  new MonacoWebpackPlugin({
    languages: ['json', 'javascript', 'typescript', 'css', 'html', 'markdown', 'c', 'cpp', 'shell']
  })
))

module.exports = {
  webpack: override(...overrides)
}