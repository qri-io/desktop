import React from 'react'
import { Action } from 'redux'
import classNames from 'classnames'
import { VersionInfo } from '../../models/store'
import moment from 'moment'

export interface LogListItemProps {
  id: string
  data: VersionInfo
  selected: boolean
  first: boolean
  last: boolean
  onClick: (path: string | undefined) => Action | void
  /**
   * in some appearances of the LogList, we want to have the option to disable
   * certain items in the list if the version of the dataset is foreign
   * in other appearances, we want the item to still remain clickable and active
   * looking, regardless if the version is foreign or not
   * When allowDisable is true, we can have a foreign dataset version, but still
   * take actions on the item
   *
   * defaults to true (aka the normal behavior you expect when something is disabled)
   */
  allowDisable?: boolean
}

const LogListItem: React.FunctionComponent<LogListItemProps> = (props) => {
  const { id, selected, data, first, last, allowDisable = true } = props
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
          foreign: allowDisable && foreign
        })
      }
      data-tip={allowDisable && foreign && 'This version is unavailable'}
      onClick={() => { if (!(foreign && allowDisable)) props.onClick(path) }}
    >
      <div className='icon-column'>
        <div className='history-timeline-dot' />
        <div className='history-timeline-line history-timeline-line-bottom' />
      </div>
      <div className='text-column'>
        <div className='text'>{commitTitle}</div>
        <div className='subtext'>
          {/* Bring back avatar later <img className= 'user-image' src = {props.avatarUrl} /> */}
          <div className='time-message'>
            {moment(commitTime).fromNow()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogListItem
