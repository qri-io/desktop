import { shell } from 'electron'

export const openItem = (path: string) => shell.openItem(path)
