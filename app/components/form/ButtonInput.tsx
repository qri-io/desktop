import React from 'react'
import classNames from 'classnames'

export interface ButtonInputProps {
  id?: string
  disabled?: boolean
  onClick: (e: React.SyntheticEvent) => void
  children: React.ReactElement
}

const ButtonInput: React.FunctionComponent<any> = ({ id = '', disabled = false, onClick, children }) => (
  <button
    id={id}
    onClick={onClick}
    disabled={disabled}
    className={classNames('input button', { disabled })}
  >{children}</button>
)

export default ButtonInput
