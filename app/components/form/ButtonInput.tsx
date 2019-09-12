import * as React from 'react'

const ButtonInput: React.FunctionComponent<any> = ({ id = '', onClick, children }) =>
  <button id={id} onClick={onClick} className='input button'>{children}</button>

export default ButtonInput
