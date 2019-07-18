import * as React from 'react'
import { Action } from 'redux'
import { CSSTransition } from 'react-transition-group'

import AppLoading from './AppLoading'
import Welcome from './Welcome'
import ChoosePeername from './ChoosePeername'

import { UI } from '../models/store'

const peernameError: string = 'peername_error'
const SET_PEERNAME_FAILURE = 'SET_PEERNAME_FAILURE'
const SET_PEERNAME_SUCCESS = 'SET_PEERNAME_SUCCESS'

export interface OnboardProps {
  ui: UI
  acceptTOS: () => Action
  setPeername: () => Action
  fetchMyDatasets: () => Promise<void>
  fetchWorkingDataset: () => Promise<void>
}

// Onboard is a series of flows for onboarding a new user
const Onboard: React.FunctionComponent<OnboardProps> = (props: OnboardProps) => {
  const [loading, setLoading] = React.useState(true)
  const [peername] = React.useState('forest_green_doberman_pinscher')
  const { acceptTOS, setPeername } = props

  setTimeout(() => { setLoading(false) }, 1200)

  async function onSave (peername: string): Promise<any> {
    return new Promise((resolve) => {
      let error: string = ''
      let type: string = SET_PEERNAME_SUCCESS
      if (peername === peernameError) {
        error = 'this peername is already taken'
        type = SET_PEERNAME_FAILURE
      } else {
        setPeername()
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
        in={true}
        classNames="fade"
        component="div"
        timeout={1000}
        unmountOnExit
      >
        <Welcome onAccept={acceptTOS} />
      </CSSTransition>
    )
  }

  const renderChoosePeerName = () => {
    return (
      <CSSTransition
        in={true}
        classNames="fade"
        component="div"
        timeout={1000}
        unmountOnExit
      >
        < ChoosePeername onSave={onSave} peername={peername}/>
      </CSSTransition>
    )
  }
  const { hasAcceptedTOS, hasSetPeername } = props.ui

  return (
    <div style={{ height: '100%' }}>
      {renderAppLoading()}
      {!hasAcceptedTOS && renderWelcome()}
      {!hasSetPeername && renderChoosePeerName()}
    </div>
  )
}

export default Onboard
