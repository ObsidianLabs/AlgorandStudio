const { IpcChannel } = require('@obsidians/ipc')
const { AutoUpdate } = require('@obsidians/algorand-welcome')
const CompilerManager = require('@obsidians/algorand-compiler')
const { InstanceManager } = require('@obsidians/algorand-instances')
const KeypairManager = require('@obsidians/algorand-keypair')
const ProjectChannel = require('@obsidians/algorand-project')

let ipcChannel, autoUpdate, compilerManager, instanceManager, keypairManager, projectChannel
module.exports = function () {
  ipcChannel = new IpcChannel()
  autoUpdate = new AutoUpdate('https://app.eosstudio.io/api/v1/check-update-algorand/')
  compilerManager = new CompilerManager()
  instanceManager = new InstanceManager()
  keypairManager = new KeypairManager()
  projectChannel = new ProjectChannel()
}
