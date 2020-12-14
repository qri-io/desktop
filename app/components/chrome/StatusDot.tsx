import React from 'react'
import classNames from 'classnames'
import { faExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ComponentStatus } from '../../models/store'

export interface StatusDotProps {
  status: ComponentStatus
  showNoChanges?: boolean
}

export const StatusDot: React.FunctionComponent<StatusDotProps> = (props) => {
  const {
    status,
    showNoChanges = false
  } = props
  let statusTooltip
  switch (status) {
    case 'modified':
      statusTooltip = 'modified'
      break
    case 'add':
    case 'added':
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
      if (showNoChanges) {
        return <div>No Changes</div>
      }
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
