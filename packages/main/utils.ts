import { ipcMain } from 'electron'

export function handleUtils() {
  ipcMain.handle('judge', () => {
    return 'pseudo judge result'
  })
}
