import * as React from 'react'
import { shell } from 'electron'

export interface ExternalLinkProps {
  href: string
  children: React.ReactNode
}
const ExternalLink: React.FunctionComponent<ExternalLinkProps> = (props: ExternalLinkProps) =>
  <a href={props.href} onClick={(e) => {
    e.preventDefault()
    shell.openExternal(props.href)
  }} {...props}>{props.children}</a>

export default ExternalLink
