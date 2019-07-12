import * as React from 'react'
import Dataset from '../containers/Dataset'
import AppLoading from './AppLoading'
import Welcome from './Welcome'
import ChoosePeername from './ChoosePeername'
import { CSSTransition } from 'react-transition-group'

const peernameError: string = 'peername_error'
const SET_PEERNAME_FAILURE = 'SET_PEERNAME_FAILURE'
const SET_PEERNAME_SUCCESS = 'SET_PEERNAME_SUCCESS'

export interface AppProps {
  children: React.ReactNode
}

// App is the main component and currently the only view
// Everything must flow through here
const App: React.FunctionComponent<AppProps> = () => {
  const [loading, setLoading] = React.useState(true)
  const [acceptedTOS, setAcceptedTOS] = React.useState(false)
  const [peername, setPeername] = React.useState('forest_green_doberman_pinscher')
  const [hasSetPeername, setHasSetPeername] = React.useState(false)
  setTimeout(() => { setLoading(false) }, 3000)

  async function onSave (peername: string): Promise<any> {
    return new Promise((resolve) => {
      let error: string = ''
      let type: string = SET_PEERNAME_SUCCESS
      if (peername === peernameError) {
        error = 'this peername is already taken'
        type = SET_PEERNAME_FAILURE
      } else {
        setPeername(peername)
        setHasSetPeername(true)
      }
      resolve({ type, error })
    })
  }

  const renderAppLoading = () => {
    return (
      <CSSTransition
        in={loading}
        classNames="fade-shrink"
        component="div"
        timeout={1000}
        unmountOnExit
      >
        <AppLoading />
      </CSSTransition>
    )
  }

  const renderWelcome = () => {
    return (
      <CSSTransition
        in={!acceptedTOS}
        classNames="fade"
        component="div"
        timeout={1000}
        unmountOnExit
      >
        <Welcome onAccept={() => setAcceptedTOS(true)} />
      </CSSTransition>
    )
  }

  const renderChoosePeerName = () => {
    return (
      <CSSTransition
        in={!hasSetPeername}
        classNames="fade"
        component="div"
        timeout={1000}
        unmountOnExit
      >
        < ChoosePeername onSave={onSave} peername={peername}/>
      </CSSTransition>
    )
  }

  return (
    <div style={{ height: '100%' }}>
      {renderAppLoading()}
      {renderWelcome()}
      {renderChoosePeerName()}
      <Dataset />
    </div>
  )
}

export default App
