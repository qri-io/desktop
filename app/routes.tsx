import * as React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Welcome from './components/Welcome'
import Signup from './components/Signup'
import Signin from './components/Signin'
import NoDatasets from './components/NoDatasets'
import DatasetContainer from './containers/DatasetContainer'

export default function Routes (props: any) {
  const {
    firstDataset,
    hasAcceptedTOS,
    qriCloudAuthenticated,
    hasDatasets,
    setQriCloudAuthenticated,
    acceptTOS,
    signup,
    signin,
    setWorkingDataset,
    clearSelection,
    setModal
  } = props

  // TODO (ramfox): create a new action that does all this
  // also, we should wait until a user has been authorized before
  // fetching any datasets
  const onSuccess = () => {
    new Promise(resolve => {
      clearSelection()
      resolve()
    })
      .then(async () => {
        if (firstDataset) setWorkingDataset(firstDataset.peername, firstDataset.name, firstDataset.isLinked, firstDataset.published)
      })
      .then(async () => setQriCloudAuthenticated())
  }

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
          return <Signup signup={signup} onSuccess={onSuccess} />
        }} />

        {/* Sign In */}
        <Route exact path='/signin' render={() => {
          if (!hasAcceptedTOS) return <Redirect to='/' />
          if (qriCloudAuthenticated) return <Redirect to='/dataset' />
          return <Signin signin={signin} onSuccess={onSuccess} />
        }} />

        {/* Dataset */}
        <Route exact path='/dataset' render={() => {
          if (!hasAcceptedTOS) return <Redirect to='/' />
          if (!qriCloudAuthenticated) return <Redirect to='/signup' />
          if (!hasDatasets) return <Redirect to='/nodatasets' />
          return <DatasetContainer setModal={setModal} />
        }}/>

        {/* No Datasets */}
        <Route exact path='/nodatasets' render={() => {
          if (!hasAcceptedTOS) return <Redirect to='/' />
          if (!qriCloudAuthenticated) return <Redirect to='/signup' />

          if (hasDatasets) return <Redirect to='/dataset' />
          return <NoDatasets setModal={setModal}/>
        }}/>
      </Route>
    </Switch>
  )
}
