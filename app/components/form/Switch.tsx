import React from 'react'

export interface SwitchProps {
  value: boolean
  onChange: (e: React.SyntheticEvent) => void
}

const Switch: React.FunctionComponent<SwitchProps> = ({ value, onChange }) => {
  return (
    <div className='switch'>
      <input type='checkbox' checked={value} onChange={onChange} />
    </div>
  )
}

export default Switch
