import * as React from 'react'
import { onClick } from './platformSpecific/ExternalLink.TARGET_PLATFORM'

export interface ExternalLinkProps {
  id?: string
  href: string
  children: React.ReactNode
  className?: string
  tooltip?: string
}

const ExternalLink: React.FunctionComponent<ExternalLinkProps> = ({ id, href, children, className, tooltip }) =>
  <a id={id} href={href} onClick={(e) => onClick(e, href)} target='_blank' rel="noopener noreferrer" className={className} data-tip={tooltip}>{children}</a>

export default ExternalLink
