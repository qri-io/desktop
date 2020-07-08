import * as React from 'react'
import { onClick } from './platformSpecific/ExternalLink.TARGET_PLATFORM'

export interface ExternalLinkProps {
  id: string
  href: string
  children: React.ReactNode
}

const ExternalLink: React.FunctionComponent<ExternalLinkProps> = ({ id, href, children }) =>
  <a id={id} href={href} onClick={(e) => onClick(e, href)} target='_blank' rel="noopener noreferrer">{children}</a>

export default ExternalLink
