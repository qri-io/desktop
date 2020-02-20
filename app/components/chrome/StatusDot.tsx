import React from 'react'
import classNames from 'classnames'
import { faExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export interface StatusDotProps {
  status: 'modified' | 'add' | 'removed' | 'parse error' | undefined
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
      statusTooltip = ''
  }

  return <div
    className={classNames('status-dot', {
      'status-dot-modified': statusTooltip === 'modified',
      'status-dot-removed': statusTooltip === 'removed',
      'status-dot-added': statusTooltip === 'added',
      'status-dot-transparent': statusTooltip === '' })}
    data-tip={statusTooltip} />
}

export default StatusDot
