import { shell } from 'electron'

export function openInExternalWindow (uri: string) {
  shell.openExternal(uri)
}
