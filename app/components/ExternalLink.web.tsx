import React from 'react'

export interface ExternalLinkProps {
  id: string
  href: string
  children: React.ReactNode
}

const ExternalLink: React.FunctionComponent<ExternalLinkProps> = ({ id, href, children }) =>
  <a id={id} href={href} target='_blank' rel="noopener noreferrer">{children}</a>

export default ExternalLink
