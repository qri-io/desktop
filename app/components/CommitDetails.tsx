import * as React from 'react'
import numeral from 'numeral'

import { Structure, Commit } from '../models/dataset'

import Icon from './chrome/Icon'
import RelativeTimestamp from './RelativeTimestamp'

interface CommitDetailsProps {
  structure: Structure
  commit: Commit
  path: string
}

const CommitDetails: React.FunctionComponent<CommitDetailsProps> = (props) => {
  const { structure, commit, path } = props
  return (
    <>
      <span className='dataset-details' style={{ marginBottom: '6px' }}><Icon icon='stickyNote' size='sm' color='medium' />{commit.title}</span>
      <div className='dataset-details-container'>
        <span className='dataset-details'><Icon icon='commit' size='sm' color='medium' /><span title={path}>{path.substring(path.length - 7)}</span></span>
        <span className='dataset-details'><Icon icon='clock' size='sm' color='medium' /><RelativeTimestamp timestamp={commit.timestamp}/></span>
        <span className='dataset-details'><Icon icon='hdd' size='sm' color='medium' />{numeral(structure.length).format('0.0b')}</span>
        <span className='dataset-details'><Icon icon='bars' size='sm' color='medium' />{numeral(structure.entries).format('0,0')} rows</span>
      </div>
    </>
  )
}

export default CommitDetails
