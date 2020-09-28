import React from 'react'
import moment from 'moment'
import filesize from 'filesize'

import { VersionInfo } from '../../models/store'
import CheckboxInput from '../form/CheckboxInput'

interface VersionInfoItemProps {
  data: VersionInfo
  selected: boolean

  onToggleSelect: (data: VersionInfo, selected: boolean) => void
  onClick: (data: VersionInfo, e?: React.MouseEvent) => void
}

const VersionInfoItem: React.FC<VersionInfoItemProps> = (props) => {
  const { data, selected = false, onToggleSelect, onClick } = props
  const { username, name, commitTime, bodySize, numCommits } = data
  return (
    <tr
      id={`${username}-${name}`}
      key={`${username}/${name}`}
      className=''
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
      <td>{numCommits || '--'}</td>
    </tr>
  )
}

export default VersionInfoItem
