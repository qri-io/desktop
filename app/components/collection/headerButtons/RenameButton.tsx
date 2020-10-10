import * as React from 'react'
import { faPen } from '@fortawesome/free-solid-svg-icons'

import { RouteProps } from '../../../models/store'
import { Modal, ModalType } from '../../../models/modals'
import { QriRef, qriRefFromRoute } from '../../../models/qriRef'

import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'

import { setModal } from '../../../actions/ui'

import HeaderColumnButton from '../../chrome/HeaderColumnButton'

interface RenameButtonProps extends RouteProps {
  qriRef: QriRef
  setModal: (modal: Modal) => void
  showIcon: boolean
}

// show if in your namespace
export const RenameButtonComponent: React.FunctionComponent<RenameButtonProps> = (props) => {
  const {
    qriRef,
    setModal,
    showIcon
  } = props

  const { username, name } = qriRef

  return (<HeaderColumnButton
    id='rename'
    label='Rename'
    tooltip='Rename this dataset'
    icon={showIcon && faPen}
    onClick={() => {
      setModal({ type: ModalType.RenameDataset, username, name })
    }}
  />)
}

export default connectComponentToPropsWithRouter(
  RenameButtonComponent,
  (state: any, ownProps: RenameButtonProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      ...ownProps,
      qriRef
    }
  },
  {
    setModal
  }
)
