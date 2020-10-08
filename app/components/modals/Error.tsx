import * as React from 'react'

interface ErrorProps {
  text: string
  id: string
}
const Error: React.FunctionComponent<ErrorProps> = ({ text, id }) =>
  <div id={id} className='error'>{text}</div>

export default Error
