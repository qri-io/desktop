import * as React from 'react'
import { Switch, Route } from 'react-router'
import AppContainer from './containers/AppContainer'
import App from './components/App'

export default function Routes () {
  return (
    <AppContainer>
      <Switch>
        <Route path="/" component={App} />
      </Switch>
    </AppContainer>
  )
}

Routes.displayName = 'Routes'
