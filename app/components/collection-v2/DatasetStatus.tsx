import React from 'react'

import { QriRef } from '../../models/qriRef'
import { QRI_CLOUD_URL } from '../../constants'
import { onClickOpenInFinder } from '../platformSpecific/DatasetStatus.TARGET_PLATFORM'
import { ApiActionThunk } from '../../store/api'

import Icon from '../chrome/Icon'
import ExternalLink from '../ExternalLink'

export interface DatasetStatusProps {
  qriRef: QriRef
  fsiPath: string
  published: boolean
  linkedToFilesystem: boolean
  updatesAvailable: boolean

  // fetching action
  updateDataset(username: string, name: string): ApiActionThunk
}

const DatasetStatus: React.FC<DatasetStatusProps> = ({ published, linkedToFilesystem, qriRef: { username, name }, fsiPath, updatesAvailable, updateDataset }) => (
  <div className="flex-space-between">
    <ExternalLink href={`${QRI_CLOUD_URL}/${username}/${name}`} className="dataset-link" tooltip="Published">
      <Icon icon="publish" size="sm" color={published ? 'dark' : 'medium'}/>
    </ExternalLink>
    <a onClick={(e) => onClickOpenInFinder(e, fsiPath)} className="dataset-link" data-tip="Linked to filesystem">
      <Icon icon="openInFinder" size="sm" color={linkedToFilesystem ? 'dark' : 'medium'}/>
    </a>
    <button onClick={() => updateDataset(username, name)} className="dataset-button" data-tip="Updates available">
      <Icon icon="sync" size="sm" color={updatesAvailable ? 'dark' : 'medium'}/>
    </button>
  </div>
)

export default DatasetStatus
