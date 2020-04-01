import React from 'react'
import classNames from 'classnames'
import { Action } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

import { ComponentStatus, SelectedComponent } from '../../models/store'

import Icon from '../chrome/Icon'
import StatusDot from '../chrome/StatusDot'

export interface ComponentItemProps {
  displayName: string

  color?: 'light' | 'dark'
  icon?: string
  filename?: string
  selected?: boolean
  status?: ComponentStatus
  disabled?: boolean
  tooltip?: string
  onClick?: (component: SelectedComponent) => Action
}

export const ComponentItem: React.FunctionComponent<ComponentItemProps> = (props) => {
  const { status = 'unmodified' } = props

  let statusIcon = <StatusDot status={status} />

  if (props.displayName.toLowerCase() === 'commit') {
    statusIcon = <FontAwesomeIcon icon={faArrowRight} style={{ color: '#FFF' }} size='lg' />
  }

  return (
    <div
      id={`${props.displayName.toLowerCase()}-status`}
      className={classNames('sidebar-list-item', 'sidebar-list-item-text', {
        'selected': props.selected,
        'disabled': props.disabled
      })}
      // TODO(ramfox): when we pull out the selections reducer, this should be
      // replaced by a push() to the correct location
      // `/workbench/:peername/:name/at:path/:component` or
      // `/workbench/:peername/:name/:component`
      onClick={() => {
        if (props.onClick && props.displayName) {
          props.onClick(props.displayName.toLowerCase() as SelectedComponent)
        }
      }}
    >
      {props.icon && (<div className='icon-column'>
        <Icon icon={props.icon} size='sm' color={props.disabled ? 'medium' : props.color}/>
      </div>)}
      <div className='text-column'>
        <div className='text'>{props.displayName}</div>
        <div className='subtext'>{props.filename}</div>
      </div>
      <div className={classNames('status-column', { 'disabled': props.disabled })}>
        {statusIcon}
      </div>
    </div>
  )
}

export default ComponentItem
