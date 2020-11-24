import React from 'react'
import { VersionInfo } from '../../models/store'
import Commitish from '../chrome/Commitish'
import CommitDetails from '../CommitDetails'

interface ICommitItem extends VersionInfo {
  title: string
  timestamp: Date
}

export interface ICommitDiff {
  left: ICommitItem
  right: ICommitItem
}

const CommitItem: React.FC<ICommitItem> = (props) => {
  const {
    path,
    title,
    timestamp,
    bodySize,
    bodyRows,
    username,
    name
  } = props

  return (
    <div style={{ margin: 20 } }>
      <div style={ {
        fontFamily: 'monospace',
        fontSize: 18,
        color: 'black',
        textOverflow: 'ellipsis'
      }}>{username}/{name}</div>
      {path && <Commitish text={path}/>}
      <div><CommitDetails
        commitTitle={title || ''}
        commitTime={timestamp}
        bodyRows={bodyRows}
        bodySize={bodySize}
      />
      </div>
    </div>
  )
}

const CommitDiff: React.FC<ICommitDiff> = (props) => {
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
            fontWeight: 300,
            textTransform: 'uppercase',
            color: '#737373'
          }}>
            BASE
          </th>
          <th style={{
            fontSize: 16,
            fontWeight: 300,
            textTransform: 'uppercase',
            color: '#737373'
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

export default CommitDiff
