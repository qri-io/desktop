import { shell } from 'electron'

export const onClick = (e: React.MouseEvent, href: string) => {
  e.preventDefault()
  shell.openExternal(href)
}
