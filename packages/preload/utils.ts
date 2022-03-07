import { ipcRenderer } from 'electron'

export default {
  markdownToHTML(markdown: string) {
    return ipcRenderer.invoke('markdownToHTML', markdown)
  },

  // option参数见https://www.npmjs.com/package/node-downloader-helper
  download(url: string, savePath: string, option: any) {
    return ipcRenderer.invoke('download', url, savePath, option)
  },

  isProblemUpToDate(problemID: number) {
    return ipcRenderer.invoke('isProblemUpToDate', problemID)
  },

  downloadProblem(
    problemID: string,
    input: string,
    output: string,
    description: string,
    token: string
  ) {
    return ipcRenderer.invoke('downloadProblem', ...arguments)
  },

  judgeProblem(srcFilePath: string, problemID: string, language: string) {
    return ipcRenderer.invoke('judgeProblem', srcFilePath, problemID, language)
  }
}
