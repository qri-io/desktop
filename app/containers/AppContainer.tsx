import * as React from 'react'

export default class AppComponent extends React.Component {
  render () {
    return (
<<<<<<< HEAD
      <div id="app-container">{this.props.children}</div>
=======
      <div style={{height:'100%', width: '100%'}}>{this.props.children}</div>
>>>>>>> style(window): add min width and height to electron window
    )
  }
}
