import * as React from 'react'
import { ipcRenderer } from 'electron'

import Layout from '../Layout'
import CollectionHome from './CollectionHome'

export const Collection: React.FunctionComponent<any> = () => {
  React.useEffect(() => {
    ipcRenderer.send('show-dataset-menu', false)
  }, [])

  return (
    <Layout
      id='collection-container'
      title='Collection'
      mainContent={<CollectionHome />}
    />
  )
}

export default Collection
