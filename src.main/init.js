const { IpcChannel } = require('@obsidians/ipc')
const { AutoUpdate } = require('@obsidians/algorand-welcome')
const AlgorandCompilerManager = require('@obsidians/algorand-compiler')
const { AlgorandInstanceManager } = require('@obsidians/algorand-instances')
const AlgorandKeypairManager = require('@obsidians/algorand-keypair')
const AlgorandProjectChannel = require('@obsidians/algorand-project')

let ipcChannel, autoUpdate, algorandCompilerManager, algorandInstanceManager, algorandKeypairManager, algorandProjectChannel
module.exports = function () {
  ipcChannel = new IpcChannel()
  autoUpdate = new AutoUpdate('https://app.eosstudio.io/api/v1/check-update-algorand/')
  algorandCompilerManager = new AlgorandCompilerManager()
  algorandInstanceManager = new AlgorandInstanceManager()
  algorandKeypairManager = new AlgorandKeypairManager()
  algorandProjectChannel = new AlgorandProjectChannel()
}
