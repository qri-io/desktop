import React from 'react'
import moment from 'moment'
import numeral from 'numeral'
import ReactTooltip from 'react-tooltip'

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

const zeroTimeString = '0001-01-01T00:00:00Z'

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
        <ReactTooltip type='dark' effect='solid' delayShow={200} multiline />
        <CheckboxInput
          name='selected'
          checked={selected}
          onChange={(_: string, v: boolean) => { onToggleSelect(data, v) }}
        />
      </td>
      <td>
        <span className='ref text' onClick={(e: React.MouseEvent) => { onClick(data, e) }}>{username}/{name}</span>
      </td>
      <td>
        <span data-tip={commitTime}>{commitTime !== zeroTimeString ? moment(commitTime).fromNow() : '--'}</span>
      </td>
      <td>{bodySize ? numeral(bodySize).format('0.00 b') : '--'}</td>
      <td>
        <span data-tip={bodyRows}>{bodyRows ? numeral(bodyRows).format('0a') : '--'}</span>
      </td>
      <td className='icons'>
        <span className="dataset-link" data-tip={published ? 'published' : 'unpublished'}>
          <ExternalLink href={`${QRI_CLOUD_URL}/${username}/${name}`}>
            <Icon icon="publish" size="sm" color={published ? 'dark' : 'medium'}/>
          </ExternalLink>
        </span>
        {onClickFolder && <a onClick={(e: React.MouseEvent) => onClickFolder(data, e)} className="dataset-link" data-tip={fsiPath ? 'working directory' : 'no working directory'}>
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
