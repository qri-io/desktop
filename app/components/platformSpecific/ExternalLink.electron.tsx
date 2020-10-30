import React from 'react'
import { shell } from 'electron'

export interface ExternalLinkProps {
  id?: string
  href: string
  children: React.ReactNode
  className?: string
  tooltip?: string
}

export function openExternal (e: React.MouseEvent, href: string) {
  e.preventDefault()
  shell.openExternal(href)
}

export const ExternalLink: React.FunctionComponent<ExternalLinkProps> = ({ id, href, children, className, tooltip }) =>
  <a id={id}
    href={href}
    onClick={(e) => openExternal(e, href)}
    target='_blank'
    rel="noopener noreferrer"
    className={className}
    data-tip={tooltip}
  >{children}</a>

export default ExternalLink
