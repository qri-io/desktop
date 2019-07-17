import * as React from 'react'
import { Switch, Route } from 'react-router'
import AppContainer from './containers/AppContainer'
import OnboardContainer from './containers/OnboardContainer'

export default function Routes () {
  return (
    <AppContainer>
      <Switch>
        <Route path="/" component={OnboardContainer} />
      </Switch>
    </AppContainer>
  )
}

Routes.displayName = 'Routes'
