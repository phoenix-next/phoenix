import { ipcRenderer } from 'electron'

export default {
  isProblemUpToDate(problemID: number) {
    return ipcRenderer.invoke('isProblemUpToDate', problemID)
  },
  cacheProblem(problem: any) {
    return ipcRenderer.invoke('cacheProblem', problem)
  },
  judgeProblem(srcFilePath: string, problemID: number) {
    return ipcRenderer.invoke('judgeProblem', srcFilePath, problemID)
  },
}
