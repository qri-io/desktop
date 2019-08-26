import * as React from 'react'
import { Action } from 'redux'
import { ApiAction } from '../store/api'
import { CSSTransition } from 'react-transition-group'

import Welcome from './Welcome'
import Signup from './Signup'
import Signin from './Signin'

export interface OnboardProps {
  hasAcceptedTOS: boolean
  hasSignedUp: boolean
  hasSignedIn: boolean
  acceptTOS: () => Action
  setHasSignedUp: () => Action
  setHasSignedIn: () => Action
  signup: (username: string, email: string, password: string) => Promise<ApiAction>
  signin: (username: string, password: string) => Promise<ApiAction>
}

// Onboard is a series of flows for onboarding a new user
const Onboard: React.FunctionComponent<OnboardProps> = (
  {
    hasAcceptedTOS,
    hasSignedUp,
    hasSignedIn,
    acceptTOS,
    signup,
    setHasSignedUp,
    signin,
    setHasSignedIn
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

  const renderSignup = () => {
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

  const renderSignin = () => {
    return (
      <CSSTransition
        in={!hasSignedIn}
        classNames="fade"
        component="div"
        timeout={1000}
        unmountOnExit
      >
        <Signin
          signin={signin}
          setHasSignedIn={setHasSignedIn}
        />
      </CSSTransition>
    )
  }

  return (
    <div>
      {renderWelcome()}
      {renderSignup()}
      {renderSignin()}
    </div>
  )
}

export default Onboard
