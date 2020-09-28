import * as React from 'react'
import { ipcRenderer } from 'electron'

import Layout from '../../Layout'
import DatasetCollection from './DatasetCollection'

export const CollectionHome: React.FunctionComponent<any> = () => {
  React.useEffect(() => {
    ipcRenderer.send('show-dataset-menu', false)
  }, [])

  return (
    <Layout
      id='collection-container'
      title='Collection'
      mainContent={<DatasetCollection />}
    />
  )
}

export default CollectionHome
