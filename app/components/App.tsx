import * as React from 'react'
import Dataset from '../components/Dataset'
import AppLoading from './AppLoading'
import { CSSTransition } from 'react-transition-group'

// App is the main component and currently the only view
// Everything must flow through here
const App: React.FunctionComponent<any> = () => {
  const [loading, setLoading] = React.useState(true)
  setTimeout(() => { setLoading(false) }, 3000)

  const renderAppLoading = () => {
    return (
      <CSSTransition
        in={loading}
        classNames="fade"
        component="div"
        timeout={1000}
        unmountOnExit
      >
        <AppLoading />
      </CSSTransition>
  }
  return (
    <div>
      {renderAppLoading()}
      <Dataset />
    </div>
  )
}

export default App
