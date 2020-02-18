import React from 'react'
import classNames from 'classnames'

interface SwitchProps {
  checked: boolean
  name: string
  onClick: (e: React.SyntheticEvent) => void
  size?: 'sm' | 'lg'
  color?: 'light' | 'dark'
}

const Switch: React.FunctionComponent<SwitchProps> = (props) => {
  const { checked, name, onClick, size = 'sm', color = 'light' } = props

  return (
    <div
      className='switch'
      id={`switch-${name}`}
      onClick={onClick}
    >
      <input type='checkbox' checked={checked}/>
      <label
        className={classNames({ 'switch-large': size === 'lg', 'switch-dark': color === 'dark' })}
        htmlFor={`switch-${name}`}></label>
    </div>)
}

export default Switch
