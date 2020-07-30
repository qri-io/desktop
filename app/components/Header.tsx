import React from 'react'
import { faPlus, faDownload } from '@fortawesome/free-solid-svg-icons'

import { Modal, ModalType } from '../models/modals'
import { connectComponentToProps } from '../utils/connectComponentToProps'
import { setModal } from '../actions/ui'

import HeaderColumnButton from './chrome/HeaderColumnButton'

interface HeaderProps {
  title: string

  // setting action
  setModal: (modal: Modal) => void
}

export const Header: React.FC<HeaderProps> = ({ title, setModal }) => (
  <header className="collection-header">
    <h3 className="header-title">{title}</h3>
    <div className="header-column">
      <HeaderColumnButton
        id="create-dataset"
        icon={faPlus}
        label="Create new Dataset"
        onClick={() => setModal({ type: ModalType.CreateDataset })}
      />
      <HeaderColumnButton
        id="add-dataset"
        icon={faDownload}
        label="Add existing Dataset"
        onClick={() => setModal({ type: ModalType.AddDataset })}
      />
    </div>
  </header>
)

export default connectComponentToProps(
  Header,
  {},
  { setModal }
)
