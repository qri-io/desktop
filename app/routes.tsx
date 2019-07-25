import * as React from 'react'
import { Switch, Route } from 'react-router'
import AppContainer from './containers/AppContainer'
import DatasetContainer from './containers/DatasetContainer'

export default function Routes () {
  return (
    <AppContainer>
      <Switch>
        <Route exact path="/" component={DatasetContainer}/>
      </Switch>
    </AppContainer>
  )
}
