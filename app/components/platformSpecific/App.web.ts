export function addRendererListener (eventType: string, func: (e?: any, s?: string) => void) {}

export function removeRendererListener (eventType: string, func: (e?: any, s?: string) => void) {}

export function sendElectronEventToMain (eventType: string) {}

export function saveDialogSync (opts: Electron.SaveDialogSyncOptions): string | undefined { return undefined }

export function reloadWindow () {}
