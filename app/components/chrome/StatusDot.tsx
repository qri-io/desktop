import React from 'react'
import classNames from 'classnames'
import { faExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ComponentState } from '../../models/store'

export interface StatusDotProps {
  status: ComponentState
}

export const StatusDot: React.FunctionComponent<StatusDotProps> = (props) => {
  let statusTooltip
  switch (props.status) {
    case 'modified':
      statusTooltip = 'modified'
      break
    case 'add':
      statusTooltip = 'added'
      break
    case 'removed':
      statusTooltip = 'removed'
      break
    case 'parse error':
      return (<FontAwesomeIcon
        icon={faExclamation}
        className='parse-error'
        style={{ color: '#e04f4f' }}
        data-tip='Parsing Error'
        size='sm' />)
    default:
      statusTooltip = 'unmodified'
  }

  return <div
    className={classNames('status-dot', {
      'status-dot-modified': statusTooltip === 'modified',
      'status-dot-removed': statusTooltip === 'removed',
      'status-dot-added': statusTooltip === 'added',
      'status-dot-transparent': statusTooltip === 'unmodified' })}
    data-tip={statusTooltip} />
}

export default StatusDot
