import * as React from 'react'
import { Switch, Route } from 'react-router'
import AppContainer from './containers/AppContainer'
import DatasetContainer from './containers/DatasetContainer'
import OnboardContainer from './containers/OnboardContainer'

export default function Routes () {
  return (
    <AppContainer>
      <Switch>
        <Route exact path="/" component={DatasetContainer}/>
        <Route path="/onboard" component={OnboardContainer} />
      </Switch>
    </AppContainer>
  )
}
