import React from 'react'
import { AnyAction } from 'redux'
import Hamburger from '../../chrome/Hamburger'

import { VersionInfo } from '../../../models/store'
import { Modal, ModalType } from '../../../models/modals'
import { removeDatasetAndFetch } from '../../../actions/api'
import { setModal } from '../../../actions/ui'
import { connectComponentToProps } from '../../../utils/connectComponentToProps'

interface TableRowHamburgerProps {
  data: VersionInfo
  setModal: (modal: Modal) => void
  removeDatasetAndFetch: (...args: Parameters<typeof removeDatasetAndFetch>) => Promise<AnyAction>
}

const TableRowHamburger: React.FC<TableRowHamburgerProps> = ({ data, setModal, removeDatasetAndFetch }) => {
  const { username, name, fsiPath } = data
  const actions = [{
    icon: 'trash',
    text: 'Remove',
    onClick: () => {
      setModal({
        type: ModalType.RemoveDataset,
        datasets: [{ username, name, fsiPath }],
        onSubmit: removeDatasetAndFetch
      })
    }
  }]

  return (
    <Hamburger id={`${data.username}/${data.name}`} data={actions} />
  )
}

export default connectComponentToProps(
  TableRowHamburger,
  {},
  {
    setModal,
    removeDatasetAndFetch
  }
)
