import { ipcRenderer } from 'electron'

export default {
  markdownToHTML(markdown: string) {
    return ipcRenderer.invoke('markdownToHTML', ...arguments)
  },

  // option参数见https://www.npmjs.com/package/node-downloader-helper
  download(url: string, savePath: string, option: any) {
    return ipcRenderer.invoke('download', ...arguments)
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

  downloadTutorial(tutorialID: string, detail: string, token: string) {
    return ipcRenderer.invoke('downloadTutorial', ...arguments)
  },

  judgeProblem(srcFilePath: string, problemID: string, language: string) {
    return ipcRenderer.invoke('judgeProblem', ...arguments)
  },

  runCode(code: string) {
    return ipcRenderer.invoke('runCode', code)
  }
}
