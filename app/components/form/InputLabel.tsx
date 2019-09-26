import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

interface InputLabelProps {
  label: string
  tooltip?: string
  tooltipFor?: string
}

const InputLabel: React.FunctionComponent<InputLabelProps> = (props) => {
  const {
    label,
    tooltip,
    tooltipFor
  } = props

  return label && (
    <div className='input-label'>
      {label}
      {tooltip && (
            <>
            &nbsp;
            <span
              data-tip={tooltip}
              data-for={tooltipFor || null}
              className='text-input-tooltip'
            >
              <FontAwesomeIcon icon={faInfoCircle} size='sm'/>
            </span>
            </>
      )}
    </div>
  )
}

export default InputLabel
