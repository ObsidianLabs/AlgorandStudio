const { IpcChannel } = require('@obsidians/ipc')
const KeypairManager = require('@obsidians/keypair')
const { AutoUpdate } = require('@obsidians/global')
const CompilerManager = require('@obsidians/algorand-compiler')
const { InstanceManager } = require('@obsidians/algorand-network')
const ProjectChannel = require('@obsidians/algorand-project')
const AuthChannel = require('@obsidians/auth')

let ipcChannel, keypairManager, autoUpdate, compilerManager, instanceManager, projectChannel, authChannel
module.exports = function () {
  ipcChannel = new IpcChannel()
  keypairManager = new KeypairManager(process.env.BUILD)
  autoUpdate = new AutoUpdate('https://app.obsidians.io/api/v1/check-update/algorand/')
  compilerManager = new CompilerManager()
  instanceManager = new InstanceManager()
  projectChannel = new ProjectChannel()
  authChannel = new AuthChannel()
}
