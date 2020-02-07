import React from 'react'
import { Action } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import classNames from 'classnames'

interface HistoryListItemProps {
  id: string
  path: string
  commitTitle: string
  timeMessage: string
  selected: boolean
  first: boolean
  last: boolean
  onClick: (selectedListItem: string) => Action
}

const HistoryListItem: React.FunctionComponent<HistoryListItemProps> = (props) => {
  const { id, selected, path, commitTitle, timeMessage, first, last } = props
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
          last
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
            <FontAwesomeIcon icon={faClock} size='sm'/> {timeMessage}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HistoryListItem
