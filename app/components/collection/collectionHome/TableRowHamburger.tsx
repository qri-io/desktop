import React from 'react'
import Hamburger from '../../chrome/Hamburger'

import { VersionInfo } from '../../../models/store'
import { Modal } from '../../../models/modals'
import { setModal } from '../../../actions/ui'
import { connectComponentToProps } from '../../../utils/connectComponentToProps'
import { ExportButtonComponent } from '../headerButtons/ExportButton'
import { RemoveButtonComponent } from '../headerButtons/RemoveButton'

interface TableRowHamburgerProps {
  data: VersionInfo
  setModal: (modal: Modal) => void
}

const TableRowHamburger: React.FC<TableRowHamburgerProps> = ({ data, setModal }) => {
  const actions = [
    <ExportButtonComponent
      size='sm'
      key={1}
      qriRef={data}
      setModal={setModal}
      showIcon={false}
    />,
    <RemoveButtonComponent
      size='sm'
      key={2}
      qriRef={data}
      fsiPath={data.fsiPath}
      setModal={setModal}
      showIcon={false}
    />
  ]

  return (
    <Hamburger id={`${data.username}/${data.name}`} items={actions} />
  )
}

export default connectComponentToProps(
  TableRowHamburger,
  {},
  {
    setModal
  }
)
