import * as React from 'react'

const ButtonInput: React.FunctionComponent<any> = ({ onClick, children }) =>
  <button onClick={onClick} className='input button'>{children}</button>

export default ButtonInput
