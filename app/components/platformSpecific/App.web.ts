export function addRendererListener (eventType: string, func: (e?: any, s?: string) => void) {}

export function removeRendererListener (eventType: string, func: (e?: any, s?: string) => void) {}

export function sendElectronEventToMain (eventType: string) {}

export function exportDebugLog (path: string, opts: any) {}

export function reloadWindow () {}
