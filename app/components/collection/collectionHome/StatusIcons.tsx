import React from 'react'

import { VersionInfo } from '../../../models/store'

import ExternalLink from '../../ExternalLink'
import Icon from '../../chrome/Icon'
import { QRI_CLOUD_URL } from '../../../constants'

interface StatusIconsProps {
  row: VersionInfo
  onClickFolder: (data: VersionInfo, e: React.MouseEvent) => void
}

const StatusIcons: React.FC<StatusIconsProps> = ({ row, onClickFolder }) => {
  const { published, username, name, fsiPath } = row
  return (
    <>
      <span className="dataset-link" data-tip={published ? 'published' : 'unpublished'}>
        <ExternalLink href={`${QRI_CLOUD_URL}/${username}/${name}`}>
          <Icon icon="publish" size="sm" color={published ? 'dark' : 'medium'}/>
        </ExternalLink>
      </span>
      {onClickFolder && <a onClick={(e: React.MouseEvent) => onClickFolder(row, e)} className="dataset-link" data-tip={fsiPath ? 'working directory' : 'no working directory'}>
        <Icon icon="openInFinder" size="sm" color={fsiPath ? 'dark' : 'medium'}/>
      </a>}
    </>
  )
}

export default StatusIcons
