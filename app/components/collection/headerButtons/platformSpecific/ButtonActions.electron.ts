import { shell, clipboard } from 'electron'

export const openItem = (path: string) => shell.openItem(path)

export const addToClipboard = (text: string) => clipboard.writeText(text)

export const openInExternalWindow = async (url: string) => shell.openExternal(url)
