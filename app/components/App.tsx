import * as React from 'react'
import Dataset from '../components/Dataset'
import AppLoading from './AppLoading'

// App is the main component and currently the only view
// Everything must flow through here
export default class App extends React.Component {
  render() {
    return (

      <div id='app'>
        <AppLoading />
        <Dataset />
      </div>
)
  }
}