import React from 'react'
import moment from 'moment'
import filesize from 'filesize'

import { VersionInfo } from '../../models/store'
import CheckboxInput from '../form/CheckboxInput'
import { QRI_CLOUD_URL } from '../../constants'

import Icon from '../chrome/Icon'
import ExternalLink from '../ExternalLink'

interface VersionInfoItemProps {
  data: VersionInfo
  selected: boolean

  onToggleSelect: (data: VersionInfo, selected: boolean) => void
  onClick: (data: VersionInfo, e?: React.MouseEvent) => void
  onClickFolder?: (data: VersionInfo, e: React.MouseEvent) => void
}

const VersionInfoItem: React.FC<VersionInfoItemProps> = (props) => {
  const { data, selected = false, onToggleSelect, onClick, onClickFolder } = props
  const { username, name, commitTime, bodySize, bodyRows, fsiPath, published } = data
  return (
    <tr
      id={`${username}-${name}`}
      key={`${username}/${name}`}
      className='version-info-item'
    >
      <td>
        <CheckboxInput
          name='selected'
          checked={selected}
          onChange={(_: string, v: boolean) => { onToggleSelect(data, v) }}
        />
      </td>
      <td className='ref text' onClick={(e: React.MouseEvent) => { onClick(data, e) }}>{username}/{name}</td>
      <td>{commitTime ? moment(commitTime).fromNow() : '--'}</td>
      <td>{bodySize ? filesize(bodySize) : '--'}</td>
      <td>{bodyRows || '--'}</td>
      <td className='icons'>
        <ExternalLink href={`${QRI_CLOUD_URL}/${username}/${name}`} className="dataset-link" tooltip="Published">
          <Icon icon="publish" size="sm" color={published ? 'dark' : 'medium'}/>
        </ExternalLink>
        {onClickFolder && <a onClick={(e: React.MouseEvent) => onClickFolder(data, e)} className="dataset-link" data-tip="Linked to filesystem">
          <Icon icon="openInFinder" size="sm" color={fsiPath ? 'dark' : 'medium'}/>
        </a>}
        {/* <button onClick={() => updateDataset(username, name)} className="dataset-button" data-tip="Updates available">
          <Icon icon="sync" size="sm" color={updatesAvailable ? 'dark' : 'medium'}/>
        </button> */}
      </td>
    </tr>
  )
}

export default VersionInfoItem
