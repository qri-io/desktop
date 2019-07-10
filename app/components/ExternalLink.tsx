import * as React from 'react'
import { shell } from 'electron'

export interface ExternalLinkProps {
  href: string
  children: React.ReactNode
}
const ExternalLink: React.FunctionComponent<ExternalLinkProps> = ({ href, children }) =>
  <a href={href} onClick={(e) => {
    e.preventDefault()
    shell.openExternal(href)
  }} >{children}</a>

export default ExternalLink
