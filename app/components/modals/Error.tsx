import * as React from 'react'

interface ErrorProps {
  text: string
}
const Error: React.FunctionComponent<ErrorProps> = ({ text }) =>
  <div className='error'>{text}</div>

export default Error
