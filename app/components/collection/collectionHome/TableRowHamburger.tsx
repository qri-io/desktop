import React from 'react'
import { AnyAction } from 'redux'
import Hamburger from '../../chrome/Hamburger'

import { VersionInfo } from '../../../models/store'
import { Modal, ModalType } from '../../../models/modals'
import { removeDatasetAndFetch, pullDataset } from '../../../actions/api'
import { setModal } from '../../../actions/ui'
import { connectComponentToProps } from '../../../utils/connectComponentToProps'

interface TableRowHamburgerProps {
  data: VersionInfo
  setModal: (modal: Modal) => void
  removeDatasetAndFetch: (...args: Parameters<typeof removeDatasetAndFetch>) => Promise<AnyAction>
  pullDataset: (username: string, name: string) => Promise<AnyAction>
}

const TableRowHamburger: React.FC<TableRowHamburgerProps> = ({ data, setModal, removeDatasetAndFetch, pullDataset }) => {
  const { username, name, fsiPath } = data
  const onRemoveHandler = async (keepFiles: boolean) => removeDatasetAndFetch(username, name, !!fsiPath, keepFiles)

  const actions = [
    {
      icon: 'download',
      text: 'Pull',
      onClick: () => {
        pullDataset(username, name)
      }
    },
    {
      icon: 'download',
      text: 'Export',
      onClick: () => {
        setModal({
          type: ModalType.ExportDataset,
          version: data
        })
      }
    },
    {
      icon: 'trash',
      text: 'Remove',
      onClick: () => {
        setModal({
          type: ModalType.RemoveDataset,
          datasets: [{ username, name, fsiPath }],
          onSubmit: onRemoveHandler
        })
      }
    }
  ]

  return (
    <Hamburger id={`${data.username}/${data.name}`} data={actions} />
  )
}

export default connectComponentToProps(
  TableRowHamburger,
  {},
  {
    setModal,
    removeDatasetAndFetch,
    pullDataset
  }
)
