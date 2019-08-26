import * as React from 'react'
import { Action } from 'redux'
import { ApiAction } from '../store/api'
import { CSSTransition } from 'react-transition-group'

import Welcome from './Welcome'
import Signup from './Signup'

export interface OnboardProps {
  peername: string
  hasAcceptedTOS: boolean
  hasSignedUp: boolean

  acceptTOS: () => Action
  setHasSignedUp: () => Action
  signup: (username: string, email: string, password: string) => Promise<ApiAction>
}

// Onboard is a series of flows for onboarding a new user
const Onboard: React.FunctionComponent<OnboardProps> = (
  {
    peername,
    hasAcceptedTOS,
    hasSignedUp,
    acceptTOS,
    signup,
    setHasSignedUp
  }) => {
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
        in={!hasSignedUp}
        classNames="fade"
        component="div"
        timeout={1000}
        unmountOnExit
      >
        <Signup
          signup={signup}
          setHasSignedUp={setHasSignedUp}
        />
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
