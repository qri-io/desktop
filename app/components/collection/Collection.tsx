import * as React from 'react'
import { Switch, Route, useLocation, useRouteMatch } from 'react-router-dom'
import { ipcRenderer } from 'electron'

import { QriRef, qriRefFromRoute } from '../../models/qriRef'

import Layout from '../Layout'
import CollectionHome from './CollectionHome'
import { connectComponentToProps } from '../../utils/connectComponentToProps'
import Workbench from '../workbench/Workbench'

interface CollectionProps {
  qriRef: QriRef
}

export const CollectionComponent: React.FunctionComponent<CollectionProps> = (collectionProps) => {
  const location = useLocation()
  const { path } = useRouteMatch()

  return (
    <Layout
      id='collection-container'
      title='Collection'
      mainContent={
        <Switch location={location}>
          <Route path={`${path}/:username/:name/at/:fs/:path`} render={(props) => {
            ipcRenderer.send('show-dataset-menu', true)
            return <Workbench {...props} />
          }} />
          <Route path={`${path}/:username/:name`} render={(props) => {
            ipcRenderer.send('show-dataset-menu', true)
            return <Workbench {...props} />
          }} />
          <Route exact path={path} render={() => {
            ipcRenderer.send('show-dataset-menu', false)
            return <CollectionHome />
          }} />
        </Switch>
      }
    />
  )
}

export default connectComponentToProps(
  CollectionComponent,
  (state: any, ownProps: CollectionProps) => {
    return {
      ...ownProps,
      qriRef: qriRefFromRoute(ownProps)
    }
  },
  {}
)
