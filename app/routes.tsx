import * as React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Welcome from './components/Welcome'
import Signup from './components/Signup'
import Signin from './components/Signin'
import DatasetContainer from './containers/DatasetContainer'

export default function Routes (props: any) {
  const {
    hasAcceptedTOS,
    qriCloudAuthenticated,
    setQriCloudAuthenticated,
    acceptTOS,
    signup,
    signin,
    setModal
  } = props

  return (
    <Switch>
      <Route path='/'>

        {/* Welcome page (Accept TOS) */}
        <Route exact path='/' render={() => {
          if (hasAcceptedTOS) return <Redirect to='/signup' />
          return <Welcome onAccept={acceptTOS} />
        }} />

        {/* Sign Up */}
        <Route exact path='/signup' render={() => {
          if (!hasAcceptedTOS) return <Redirect to='/' />
          if (qriCloudAuthenticated) return <Redirect to='/dataset' />
          return <Signup signup={signup} onSuccess={setQriCloudAuthenticated} />
        }} />

        {/* Sign In */}
        <Route exact path='/signin' render={() => {
          if (!hasAcceptedTOS) return <Redirect to='/' />
          if (qriCloudAuthenticated) return <Redirect to='/dataset' />
          return <Signin signin={signin} onSuccess={setQriCloudAuthenticated} />
        }} />

        {/* Dataset */}
        <Route exact path='/dataset' render={() => {
          if (!hasAcceptedTOS) return <Redirect to='/' />
          if (!qriCloudAuthenticated) return <Redirect to='/signup' />
          return <DatasetContainer setModal={setModal} />
        }}/>
      </Route>
    </Switch>
  )
}
