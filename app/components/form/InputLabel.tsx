import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'

interface InputLabelProps {
  label: string
  tooltip?: string
  tooltipFor?: string
  size?: string
}

const InputLabel: React.FunctionComponent<InputLabelProps> = ({ label, tooltip, tooltipFor, size = 'sm' }) => {
  return (
    <div className={classNames('input-label', { 'input-label-md': size === 'md' })}>
      {label}
      {tooltip && (
        <>
            &nbsp;
          <span
            data-tip={tooltip}
            data-for={tooltipFor || null}
            className={'text-input-tooltip'}
          >
            <FontAwesomeIcon icon={faInfoCircle} size={'sm'}/>
          </span>
        </>
      )}
    </div>)
}

export default InputLabel
