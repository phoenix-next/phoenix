import { ipcRenderer } from 'electron'

export default {
  judge() {
    return ipcRenderer.invoke('judge')
  },
}
