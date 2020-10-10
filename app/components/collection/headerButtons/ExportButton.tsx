import * as React from 'react'
import { RouteProps } from 'react-router-dom'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

import { isDatasetSelected, QriRef, qriRefFromRoute } from '../../../models/qriRef'

import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'
import { Modal, ModalType } from '../../../models/modals'

import { setModal } from '../../../actions/ui'
import HeaderColumnButton from '../../chrome/HeaderColumnButton'

interface ExportButtonProps extends RouteProps {
  qriRef: QriRef
  showIcon: boolean
  setModal: (modal: Modal) => void
}

/**
 *  If there is a dataset selected & we are at a particular verison, show the
 *  `ExportButton`
 *  NOTE: before adjusting any logic in this component, check out the
 * `DatasetActionButtons` story in storybook to double check that it still works
 * as expected
 */
export const ExportButtonComponent: React.FunctionComponent<ExportButtonProps> = (props) => {
  const {
    qriRef,
    showIcon = true,
    setModal
  } = props

  const datasetSelected = isDatasetSelected(qriRef)

  if (!(datasetSelected && qriRef.path)) {
    return null
  }
  return (<HeaderColumnButton
    id='export-button'
    label='Export'
    tooltip='Export this verison of the dataset to your filesystem'
    icon={showIcon && faDownload}
    onClick={() => {
      setModal({ type: ModalType.ExportDataset, version: qriRef })
    }}
  />)
}

export default connectComponentToPropsWithRouter(
  ExportButtonComponent,
  (state: any, ownProps: ExportButtonProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      ...ownProps,
      qriRef
    }
  }, {
    setModal
  }
)
