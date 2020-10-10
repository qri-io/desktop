import * as React from 'react'
import { faPen } from '@fortawesome/free-solid-svg-icons'

import { RouteProps } from '../../../models/store'
import { Modal, ModalType } from '../../../models/modals'
import { isDatasetSelected, QriRef, qriRefFromRoute } from '../../../models/qriRef'

import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'

import { setModal } from '../../../actions/ui'

import HeaderColumnButton from '../../chrome/HeaderColumnButton'
import { selectInNamespace } from '../../../selections'

interface RenameButtonProps extends RouteProps {
  qriRef: QriRef
  setModal: (modal: Modal) => void
  showIcon: boolean
  inNamespace: boolean
}

/**
 * If there is a dataset selected & it is in the user's namespace, show the `RenameButton`
 *  NOTE: before adjusting any logic in this component, check out the
 * `DatasetActionButtons` story in storybook to double check that it still works
 * as expected
 */
export const RenameButtonComponent: React.FunctionComponent<RenameButtonProps> = (props) => {
  const {
    qriRef,
    setModal,
    showIcon = true,
    inNamespace
  } = props

  const datasetSelected = isDatasetSelected(qriRef)

  if (!(inNamespace && datasetSelected)) {
    return null
  }

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
      qriRef,
      inNamespace: selectInNamespace(state, qriRef)
    }
  },
  {
    setModal
  }
)
