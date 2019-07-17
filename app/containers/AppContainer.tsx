import * as React from 'react'

export default class AppContainer extends React.Component {
  render () {
    return (
      <div style={{ height: '100%' }}>{this.props.children}</div>
    )
  }
}
