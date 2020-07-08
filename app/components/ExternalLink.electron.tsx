import * as React from 'react'
import { shell } from 'electron'
import ExternalLink, { ExternalLinkProps } from './ExternalLink.base'

const ExternalLinkElectron: React.FC<ExternalLinkProps> = (props) => {
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault()
    shell.openExternal(props.href)
  }
  return <ExternalLink {...props} onClick={onClick}/>
}

export default ExternalLinkElectron
