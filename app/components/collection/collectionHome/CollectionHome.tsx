import * as React from 'react'
import { ipcRenderer } from 'electron'
import { faDownload, faPlus } from '@fortawesome/free-solid-svg-icons'

import { setModal } from '../../../actions/ui'
import { connectComponentToProps } from '../../../utils/connectComponentToProps'
import { Modal, ModalType } from '../../../models/modals'

import Layout from '../../Layout'
import DatasetCollection from './DatasetCollection'

interface CollectionHomeProps {
  setModal: (modal: Modal) => void
}

export const CollectionHome: React.FC<CollectionHomeProps> = ({ setModal }) => {
  React.useEffect(() => {
    ipcRenderer.send('show-dataset-menu', false)
  }, [])

  return (
    <Layout
      id='collection-container'
      title='Collection'
      topbarButtons={
        [
          {
            type: 'button',
            id: 'create-dataset',
            icon: faPlus,
            label: 'Create New Dataset',
            onClick: () => { setModal({ type: ModalType.CreateDataset }) }
          },
          {
            type: 'button',
            id: 'pull-dataset',
            icon: faDownload,
            label: 'Pull existing Dataset',
            onClick: () => { setModal({ type: ModalType.PullDataset }) }
          }
        ]
      }
      mainContent={<DatasetCollection />}
    />
  )
}

export default connectComponentToProps(
  CollectionHome,
  {},
  {
    setModal
  }
)
