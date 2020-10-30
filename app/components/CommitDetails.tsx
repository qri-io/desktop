import React from 'react'
import numeral from 'numeral'

import { VersionInfo } from '../models/store'

import Icon from './chrome/Icon'
import RelativeTimestamp from './RelativeTimestamp'

const CommitDetails: React.FunctionComponent<VersionInfo> = ({
  commitTitle,
  commitTime,
  bodySize,
  bodyRows,
  path
}) => (
  <>
    {commitTitle && <span className='dataset-details' style={{ marginBottom: '6px' }}><Icon icon='stickyNote' size='sm' color='medium' />{commitTitle}</span>}
    <div className='dataset-details-container'>
      <span className='dataset-details'><Icon icon='commit' size='sm' color='medium' /><span title={path}>{path.substring(path.length - 7)}</span></span>
      <span className='dataset-details'><Icon icon='clock' size='sm' color='medium' /><RelativeTimestamp timestamp={commitTime}/></span>
      <span className='dataset-details'><Icon icon='hdd' size='sm' color='medium' />{numeral(bodySize).format('0.0b')}</span>
      <span className='dataset-details'><Icon icon='bars' size='sm' color='medium' />{numeral(bodyRows).format('0,0')} rows</span>
    </div>
  </>
)

export default CommitDetails
