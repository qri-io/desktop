import * as React from 'react'
import DatasetContainer from '../containers/DatasetContainer'

// App is the main component and currently the only view
// Everything must flow through here
export default class App extends React.Component {
  render () {
    return (
      <div id='app'>
        <DatasetContainer />
      </div>
    )
  }
}
