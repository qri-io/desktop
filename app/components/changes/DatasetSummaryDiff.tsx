import React from 'react'

import { IVersionInfoDiff } from '../../models/changes'
import { VersionInfo } from '../../models/store'
import Commitish from '../chrome/Commitish'
import CommitDetails from '../CommitDetails'

interface DatasetSummaryItemProps {
  data: VersionInfo
  /**
   * displayName - defaults to true, when false, doesn not show the dataset
   * username/name combination
   */
  shouldDisplayName?: boolean
}

const DatasetSummaryItem: React.FC<DatasetSummaryItemProps> = (props) => {
  const {
    data,
    shouldDisplayName = true
  } = props

  const {
    path,
    commitTitle,
    commitTime,
    bodySize,
    bodyRows,
    username,
    name
  } = data

  return (
    <div style={{ margin: 20 } }>
      {shouldDisplayName && <div
        style={ {
          fontFamily: 'monospace',
          fontSize: 18,
          color: 'black',
          textOverflow: 'ellipsis'
        }}>{username}/{name}</div>}
      {path && <Commitish text={path}/>}
      <div><CommitDetails
        commitTitle={commitTitle || ''}
        commitTime={commitTime}
        bodyRows={bodyRows}
        bodySize={bodySize}
      />
      </div>
    </div>
  )
}

const DatasetSummaryDiff: React.FC<IVersionInfoDiff> = (props) => {
  const {
    left,
    right
  } = props

  const shouldDisplayName = !(left.name === right.name && left.username === right.username)
  return (
    <table style={{ width: '100%', marginTop: 40 }}>
      <thead>
        <tr>
          <th style={{
            fontSize: 16,
            fontWeight: 400,
            textTransform: 'uppercase',
            color: 'red'
          }}>
            BASE
          </th>
          <th style={{
            fontSize: 16,
            fontWeight: 400,
            textTransform: 'uppercase',
            color: 'green'
          }}>
            COMPARE
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td >
            <DatasetSummaryItem data={left} shouldDisplayName={shouldDisplayName} />
          </td>
          <td>
            <DatasetSummaryItem data={right} shouldDisplayName={shouldDisplayName} />
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default DatasetSummaryDiff
