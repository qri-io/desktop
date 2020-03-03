import React from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons'

import { Structure, Commit } from '../../models/dataset'
import fileSize from '../../utils/fileSize'

interface CommitDetailsHeaderProps {
  structure: Structure
  commit: Commit
}

const CommitDetailsHeader: React.FunctionComponent<CommitDetailsHeaderProps> = ({ structure, commit }) => {
  return (
    <div className='commit-details-header'>
      {structure && commit && <div className='details-flex'>
        <div className='text-column'>
          <div id='commit-title' className='text'>{commit.title}</div>
          <div className='subtext'>
            {/* <img className= 'user-image' src = {'https://avatars0.githubusercontent.com/u/1154390?s=60&v=4'} /> */}
            <div className='time-message'>
              <FontAwesomeIcon icon={faClock} size='sm'/>&nbsp;
              {moment(commit.timestamp).format('MMMM Do YYYY, h:mm:ss a')}
            </div>
          </div>
        </div>
        <div className='details-column'>
          {structure.length && <div className='detail' id='commit-details-header-file-size'>{fileSize(structure.length)}</div>}
          {structure.format && <div className='detail' id='commit-details-header-format'>{structure.format.toUpperCase()}</div>}
          {structure.entries && <div className='detail' id='commit-details-header-entries'>{structure.entries.toLocaleString()} {structure.entries !== 1 ? 'entries' : 'entry'}</div>}
          {structure.errCount && <div className='detail' id='commit-details-header-errors'>{structure.errCount.toLocaleString()} {structure.errCount !== 1 ? 'errors' : 'error'}</div>}
        </div>
      </div>}
    </div>
  )
}

export default CommitDetailsHeader
