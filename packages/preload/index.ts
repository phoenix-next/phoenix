import { contextBridge } from 'electron'
import utilsBridge from './utils'

// --------- Expose some API to the Renderer process. ---------
contextBridge.exposeInMainWorld('utilsBridge', utilsBridge)
