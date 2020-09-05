import * as React from 'react'

interface WebappProps {
  name?: string
}

const WebappComponent: React.FunctionComponent<WebappProps> = (props: WebappProps) => {
  const { name } = props
  if (name === '') {
    return <div>Hello, World!</div>
  }
  return <div>Hello, {name}</div>
}

export default WebappComponent
