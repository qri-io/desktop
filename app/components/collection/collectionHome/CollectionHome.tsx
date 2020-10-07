import React from 'react'
import { ipcRenderer } from 'electron'
import { faDownload, faPlus } from '@fortawesome/free-solid-svg-icons'

import { setModal } from '../../../actions/ui'
import { connectComponentToProps } from '../../../utils/connectComponentToProps'
import { Modal, ModalType } from '../../../models/modals'

import Layout from '../../Layout'
import DatasetCollection from './DatasetCollection'
import UncommittedChangesPrompt from '../UncommittedChangesPrompt'

interface CollectionHomeProps {
  setModal: (modal: Modal) => void
}

export const CollectionHome: React.FC<CollectionHomeProps> = ({ setModal }) => {
  React.useEffect(() => {
    ipcRenderer.send('show-dataset-menu', false)
  }, [])

  return (
    <>
      <UncommittedChangesPrompt />
      <Layout
        id='collection-container'
        title='Collection'
        topbarButtons={
          [
            {
              type: 'button',
              id: 'new-dataset',
              icon: faPlus,
              label: 'New Dataset',
              onClick: () => { setModal({ type: ModalType.NewDataset }) }
            },
            {
              type: 'button',
              id: 'pull-dataset',
              icon: faDownload,
              label: 'Pull Dataset',
              onClick: () => { setModal({ type: ModalType.PullDataset }) }
            }
          ]
        }
        mainContent={<DatasetCollection />}
      />
    </>
  )
}

export default connectComponentToProps(
  CollectionHome,
  {},
  {
    setModal
  }
)
