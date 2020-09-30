import React from 'react'
import { Action } from 'redux'
import classNames from 'classnames'

export interface HeadLogListItemProps {
  selected?: boolean
  last?: boolean
  onClick?: () => Action
}

const HeadLogListItem: React.FunctionComponent<HeadLogListItemProps> = ({ last, selected, onClick }) => {
  return (
    <div
      id='head'
      className={classNames(
        'sidebar-list-item',
        'sidebar-list-item-text',
        'history-list-item',
        'first',
        'working-dataset',
        {
          selected,
          last
        }
      )}
      data-tip='click here to edit the dataset'
      onClick={() => onClick && onClick()}
    >
      <div className='icon-column'>
        <div className='history-timeline-line history-timeline-line-top' />
        <div className='history-timeline-dot' />
        <div className='history-timeline-line history-timeline-line-bottom' />
      </div>
      <div className='text-column'>
        <div className='text'>working dataset</div>
      </div>
    </div>
  )
}

export default HeadLogListItem
