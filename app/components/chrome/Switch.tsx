import React from 'react'
import classNames from 'classnames'

interface SwitchProps {
  checked: boolean
  name: string
  onClick: (e: React.SyntheticEvent) => void
  large?: boolean
  dark?: boolean
}

const Switch: React.FunctionComponent<SwitchProps> = (props) => {
  const { checked, name, onClick, large = false, dark = false } = props

  return (
    <div className='switch'>
      <input type='checkbox' id={`switch-${name}`} checked={checked}/>
      <label
        onClick={onClick}
        className={classNames({ 'switch-large': large, 'switch-dark': dark })}
        htmlFor={`switch-${name}`}></label>
    </div>)
}

export default Switch
