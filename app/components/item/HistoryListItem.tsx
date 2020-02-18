import React from 'react'
import { Action } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import classNames from 'classnames'
import { VersionInfo } from '../../models/store'
import moment from 'moment'

interface HistoryListItemProps {
  id: string
  data: VersionInfo
  selected: boolean
  first: boolean
  last: boolean
  onClick: (path: string | undefined) => Action | void
}

const HistoryListItem: React.FunctionComponent<HistoryListItemProps> = (props) => {
  const { id, selected, data, first, last } = props
  const { path = '', commitTitle, commitTime, foreign } = data
  return (
    <div
      id={id}
      className={classNames(
        'sidebar-list-item',
        'sidebar-list-item-text',
        'history-list-item',
        {
          selected,
          first,
          last,
          foreign
        })
      }
      onClick={() => { props.onClick(path) }}
    >
      <div className='icon-column'>
        <div className='history-timeline-line history-timeline-line-top' />
        <div className='history-timeline-dot' />
        <div className='history-timeline-line history-timeline-line-bottom' />
      </div>
      <div className='text-column'>
        <div className='text'>{commitTitle}</div>
        <div className='subtext'>
          {/* Bring back avatar later <img className= 'user-image' src = {props.avatarUrl} /> */}
          <div className='time-message'>
            <FontAwesomeIcon icon={faClock} size='sm'/> {moment(commitTime).fromNow()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HistoryListItem
