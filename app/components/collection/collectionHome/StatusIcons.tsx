import React from 'react'

import { VersionInfo } from '../../../models/store'
import { QRI_CLOUD_URL } from '../../../constants'

import ExternalLink from '../../ExternalLink'
import Icon from '../../chrome/Icon'

interface StatusIconsProps {
  data: VersionInfo
  onClickFolder: (data: VersionInfo, e: React.MouseEvent) => void
}

const StatusIcons: React.FC<StatusIconsProps> = ({ data, onClickFolder }) => {
  const { published, username, name, fsiPath } = data
  return (
    <>
      <span className="dataset-link" data-tip={published ? 'published' : 'unpublished'}>
        {published && <ExternalLink href={`${QRI_CLOUD_URL}/${username}/${name}`}>
          <Icon icon="publish" size="sm" color={published ? 'dark' : 'medium'}/>
        </ExternalLink>}
        {!published && <Icon icon="publish" size="sm" color={published ? 'dark' : 'medium'}/>}
      </span>
      {onClickFolder && <a onClick={(e: React.MouseEvent) => onClickFolder(row, e)} className="dataset-link" data-tip={fsiPath ? 'working directory' : 'no working directory'}>
        <Icon icon="openInFinder" size="sm" color={fsiPath ? 'dark' : 'medium'}/>
      </a>}
    </>
  )
}

export default StatusIcons
