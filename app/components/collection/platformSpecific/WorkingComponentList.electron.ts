import { clipboard, shell } from 'electron'

export function showItemInFolder (path: string) {
  shell.showItemInFolder(path)
}

export function copyToClipboard (text: string) {
  clipboard.writeText(text)
}
