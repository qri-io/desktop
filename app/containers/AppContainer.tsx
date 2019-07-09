import * as React from 'react'

export default class AppComponent extends React.Component {
  render () {
    return (
      <div id="app-container">{this.props.children}</div>
    )
  }
}
