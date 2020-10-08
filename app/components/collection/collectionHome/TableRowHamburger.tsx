import React from 'react'
import Hamburger from '../../chrome/Hamburger'

import { VersionInfo } from '../../../models/store'
import { Modal, ModalType } from '../../../models/modals'
import { setModal } from '../../../actions/ui'
import { connectComponentToProps } from '../../../utils/connectComponentToProps'

interface TableRowHamburgerProps {
  data: VersionInfo
  setModal: (modal: Modal) => void
}

const TableRowHamburger: React.FC<TableRowHamburgerProps> = ({ data, setModal }) => {
  const { username, name, fsiPath } = data
  const actions = [
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
          username,
          name,
          fsiPath
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
    setModal
  }
)
