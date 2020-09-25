// globals __BUILD__
import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { ipcRenderer } from 'electron'

import Store from '../models/store'
import {
  acceptTOS,
  setQriCloudAuthenticated,
  setModal
} from './actions/ui'
import { signup, signin } from './actions/session'

import Welcome from './components/onboard/Welcome'
import Signup from './components/onboard/Signup'
import Signin from './components/Signin'
// import Collection from './components/collection/Collection'
import Network from './components/network/Network'
import Compare from './components/compare/Compare'
import { Action } from 'redux'
import { ApiAction } from './store/api'
import { connectComponentToProps } from './utils/connectComponentToProps'
import Workbench from './components/workbench/Workbench'

interface RoutesProps {
  hasAcceptedTOS: boolean
  qriCloudAuthenticated: boolean
  setQriCloudAuthenticated: () => Action
  acceptTOS: () => Action
  signup: (username: string, email: string, password: string) => Promise<ApiAction>
  signin: (username: string, password: string) => Promise<ApiAction>
}

export const RoutesComponent: React.FunctionComponent<RoutesProps> = (props) => {
  const {
    hasAcceptedTOS,
    qriCloudAuthenticated,
    setQriCloudAuthenticated,
    acceptTOS,
    signup,
    signin
  } = props

  const requireSignin = (dest: React.ReactElement): React.ReactElement => {
    // require onboarding is complete & valid login before viewing any section
    if (!hasAcceptedTOS) return <Redirect to='/onboard' />
    if (!qriCloudAuthenticated) return <Redirect to='/onboard/signup' />
    return dest
  }

  const sectionElement = (section: string, dest: React.ReactElement): React.ReactElement => {
    ipcRenderer.send('show-dataset-menu', (section === 'workbench'))
    return requireSignin(dest)
  }

  return (
    <div className='route-content'>
      <Switch>
        {/* Onboarding */}
        <Route exact path='/onboard' render={() => {
          if (hasAcceptedTOS) return <Redirect to='/onboard/signup' />
          return <Welcome onAccept={acceptTOS} />
        }} />
        <Route exact path='/onboard/signup' render={() => {
          if (!hasAcceptedTOS) return <Redirect to='/onboard' />
          if (qriCloudAuthenticated) return <Redirect to='/collection' />
          return <Signup signup={signup} onSuccess={setQriCloudAuthenticated} />
        }} />

        {/* Sign in */}
        <Route exact path='/signin' render={() => {
          if (!hasAcceptedTOS) return <Redirect to='/onboard' />
          if (qriCloudAuthenticated) return <Redirect to='/collection' />
          return <Signin signin={signin} onSuccess={setQriCloudAuthenticated} />
        }} />

        {/* App Sections */}
        <Route path='/network/:username/:name/at/ipfs/:path' render={(props) => {
          return sectionElement('network', <Network {...props} />)
        }} />
        <Route path='/network/:username/:name' render={(props) => {
          return sectionElement('network', <Network {...props} />)
        }} />
        <Route exact path='/network' render={(props) => {
          return sectionElement('network', <Network {...props} />)
        }} />

        <Route path='/collection' render={(props) => {
          return sectionElement('collection', <Workbench {...props} />)
        }} />

        { __BUILD__.ENABLE_SQL_WORKBENCH &&
          <Route exact path='/sql' render={(props) => sectionElement('compare', <Compare {...props} />)} />
        }

        <Route path='/' render={() => {
          ipcRenderer.send('show-dataset-menu', false)
          return requireSignin(<Redirect to='/collection' />)
        }} />
      </Switch>
    </div>
  )
}

export default connectComponentToProps(
  RoutesComponent,
  (state: Store) => {
    const { ui, myDatasets } = state
    const hasDatasets = myDatasets.value.length !== 0
    // if we clear the selection, we still need a default dataset to display.
    // let's always use the first dataset in the list, for now
    const { qriCloudAuthenticated, hasAcceptedTOS } = ui
    return {
      qriCloudAuthenticated,
      hasAcceptedTOS,
      hasDatasets
    }
  },
  {
    signup,
    signin,
    acceptTOS,
    setQriCloudAuthenticated,
    setModal
  }
)
