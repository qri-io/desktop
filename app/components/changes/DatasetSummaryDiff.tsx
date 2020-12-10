import React from 'react'

import { IVersionInfoDiff } from '../../models/changes'
import { VersionInfo } from '../../models/store'
import Commitish from '../chrome/Commitish'
import CommitDetails from '../CommitDetails'

const CommitItem: React.FC<VersionInfo> = (props) => {
  const {
    path,
    commitTitle,
    commitTime,
    bodySize,
    bodyRows,
    username,
    name
  } = props

  return (
    <div style={{ margin: 20 } }>
      <div
        style={ {
          fontFamily: 'monospace',
          fontSize: 18,
          color: 'black',
          textOverflow: 'ellipsis'
        }}>{username}/{name}</div>
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
            <CommitItem {...left} />
          </td>
          <td>
            <CommitItem {...right} />
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default DatasetSummaryDiff
