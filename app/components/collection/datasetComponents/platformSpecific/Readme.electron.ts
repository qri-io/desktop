import React from 'react'
import { shell } from 'electron'

export function openExternal (e: React.MouseEvent, href: string) {
  e.preventDefault()
  e.stopPropagation()
  shell.openExternal(href)
}
