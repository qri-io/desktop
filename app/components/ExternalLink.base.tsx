import * as React from 'react'

export interface ExternalLinkProps {
  id: string
  href: string
  onClick?: (e: React.MouseEvent) => void
  children: React.ReactNode
}

const ExternalLink: React.FunctionComponent<ExternalLinkProps> = ({ id, href, onClick, children }) =>
  <a id={id} href={href} onClick={onClick} target='_blank' rel="noopener noreferrer">{children}</a>

export default ExternalLink
