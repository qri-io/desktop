import React from 'react'

import { ModalType } from '../../models/modals'

import AddDataset from './AddDataset'
import LinkDataset from './LinkDataset'
import RemoveDataset from './RemoveDataset'
import CreateDataset from './CreateDataset'
import PublishDataset from './PublishDataset'
import UnpublishDataset from './UnpublishDataset'
import SearchModal from './SearchModal'

export interface ModalsProps {
  type: ModalType
}

const Modals: React.FunctionComponent<ModalsProps> = ({ type }) => {
  switch (type) {
    case ModalType.AddDataset:
      return <AddDataset />
    case ModalType.CreateDataset:
      return <CreateDataset />
    case ModalType.LinkDataset:
      return <LinkDataset />
    case ModalType.PublishDataset:
      return <PublishDataset />
    case ModalType.RemoveDataset:
      return <RemoveDataset />
    case ModalType.Search:
      return <SearchModal />
    case ModalType.UnpublishDataset:
      return <UnpublishDataset />
    default:
      return null
  }
}

export default Modals
