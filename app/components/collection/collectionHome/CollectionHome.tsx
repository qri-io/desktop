import * as React from 'react'
import { ipcRenderer } from 'electron'

import Layout from '../../Layout'
import CollectionHomeMainContent from './CollectionHomeMainContent'

export const CollectionHome: React.FunctionComponent<any> = () => {
  React.useEffect(() => {
    ipcRenderer.send('show-dataset-menu', false)
  }, [])

  return (
    <Layout
      id='collection-container'
      title='Collection'
      mainContent={<CollectionHomeMainContent />}
    />
  )
}

export default CollectionHome
