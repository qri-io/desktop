import * as React from 'react'
import { Action } from 'redux'
import { CSSTransition } from 'react-transition-group'

import Welcome from './Welcome'
import ChoosePeername from './ChoosePeername'

const peernameError: string = 'peername_error'
const SET_PEERNAME_FAILURE = 'SET_PEERNAME_FAILURE'
const SET_PEERNAME_SUCCESS = 'SET_PEERNAME_SUCCESS'

export interface OnboardProps {
  peername: string
  hasAcceptedTOS: boolean
  hasSetPeername: boolean

  acceptTOS: () => Action
  setPeername: () => Action
}

// Onboard is a series of flows for onboarding a new user
const Onboard: React.FunctionComponent<OnboardProps> = (
  {
    peername,
    hasAcceptedTOS,
    hasSetPeername,
    acceptTOS,
    setPeername
  }) => {
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

  const renderWelcome = () => {
    return (
      <CSSTransition
        in={!hasAcceptedTOS}
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
    <div>
      {renderWelcome()}
      {renderChoosePeerName()}
    </div>
  )
}

export default Onboard
