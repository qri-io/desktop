import * as React from 'react'
import { Action } from 'redux'
import { ApiAction } from '../store/api'
import { CSSTransition } from 'react-transition-group'

import Welcome from './Welcome'
import ChoosePeername from './ChoosePeername'

export interface OnboardProps {
  peername: string
  hasAcceptedTOS: boolean
  hasSetPeername: boolean

  acceptTOS: () => Action
  setHasSetPeername: () => Action
  setPeername: (newPeername: string) => Promise<ApiAction>
}

// Onboard is a series of flows for onboarding a new user
const Onboard: React.FunctionComponent<OnboardProps> = (
  {
    peername,
    hasAcceptedTOS,
    hasSetPeername,
    acceptTOS,
    setPeername,
    setHasSetPeername
  }) => {
  async function onSave (peername: string): Promise<any> {
    return setPeername(peername)
      .then(() => setHasSetPeername())
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
