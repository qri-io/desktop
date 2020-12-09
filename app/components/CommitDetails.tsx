import React from 'react'
import numeral from 'numeral'

import { VersionInfo } from '../models/store'

import Icon from './chrome/Icon'
import RelativeTimestamp from './RelativeTimestamp'
import { getCommitishFromPath } from '../utils/commitish'

const CommitDetails: React.FunctionComponent<VersionInfo> = ({
  commitTitle,
  commitTime,
  bodySize,
  bodyRows,
  path
}) => {
  let commitish = ''
  if (path) {
    commitish = getCommitishFromPath(path)
  }
  return (
    <>
      {commitTitle && <span className='dataset-details' style={{ marginBottom: '6px' }}><Icon icon='stickyNote' size='sm' color='medium' />{commitTitle}</span>}
      <div className='dataset-details-container'>
        {path && <span className='dataset-details'><Icon icon='commit' size='sm' color='medium' /><span title={path}><span className='commitish-qm'>{commitish.substr(0, 2)}</span>{commitish.substr(2)}</span></span>}
        {commitTime && <span className='dataset-details'><Icon icon='clock' size='sm' color='medium' /><RelativeTimestamp timestamp={commitTime}/></span>}
        {bodySize && <span className='dataset-details'><Icon icon='hdd' size='sm' color='medium' />{numeral(bodySize).format('0.0b')}</span>}
        {bodyRows && <span className='dataset-details'><Icon icon='bars' size='sm' color='medium' />{numeral(bodyRows).format('0,0')} rows</span>}
      </div>
    </>
  )
}

export default CommitDetails
