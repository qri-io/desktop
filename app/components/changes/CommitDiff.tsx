import React from 'react'
import { ICommitDiff, ICommitItem } from '../../models/changes'
import { pathToDataset } from '../../paths'
import Commitish from '../chrome/Commitish'
import CommitDetails from '../CommitDetails'

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
      <a
        href={pathToDataset(username, name, path)}
        style={ {
          fontFamily: 'monospace',
          fontSize: 18,
          color: 'black',
          textOverflow: 'ellipsis'
        }}>{username}/{name}</a>
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
