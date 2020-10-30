import React from 'react'
import classNames from 'classnames'

interface ErrorProps {
  text: string
  id: string
  size: 'sm' | 'md'
}
const Error: React.FunctionComponent<ErrorProps> = ({ text, id, size = 'md' }) =>
  <div id={id} className={classNames('error', size)}>{text}</div>

export default Error
