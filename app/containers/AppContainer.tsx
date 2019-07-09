import * as React from 'react'

export default class AppComponent extends React.Component {
  render () {
    return (
      <div style={{height:'100%'}}>{this.props.children}</div>
    )
  }
}
