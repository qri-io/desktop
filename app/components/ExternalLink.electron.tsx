import * as React from 'react'
import { shell } from 'electron'

export interface ExternalLinkProps {
  id: string
  href: string
  children: React.ReactNode
}
const ExternalLink: React.FunctionComponent<ExternalLinkProps> = ({ id, href, children }) =>
  <a id={id} href={href} onClick={(e) => {
    e.preventDefault()
    shell.openExternal(href)
  }} >{children}</a>

export default ExternalLink
