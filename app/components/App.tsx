import * as React from 'react'
import Dataset from '../components/Dataset'
import AppLoading from './AppLoading'
import Welcome from './Welcome'
import { CSSTransition } from 'react-transition-group'

// App is the main component and currently the only view
// Everything must flow through here
const App: React.FunctionComponent<any> = () => {
  const [loading, setLoading] = React.useState(true)
  const [acceptedTOS, setAcceptedTOS] = React.useState(false)
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
    )
  }

  return (
    <div>
      {renderAppLoading()}
      {!acceptedTOS && <Welcome onAccept={() => setAcceptedTOS(true)} />}
      <Dataset />
    </div>
  )
}

export default App
