import * as React from 'react'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { RouteProps } from 'react-router-dom'

import { setModal } from '../../../actions/ui'
import { Modal, ModalType } from '../../../models/modals'
import { QriRef, qriRefFromRoute, isDatasetSelected } from '../../../models/qriRef'
import { selectFsiPath } from '../../../selections'
import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'

import HeaderColumnButton from '../../chrome/HeaderColumnButton'

interface RemoveButtonProps extends RouteProps {
  qriRef: QriRef
  fsiPath: string
  showIcon: boolean
  setModal: (modal: Modal) => void
  size: 'sm' | 'md'
}

/**
 * If there is a dataset selected, show the `RemoveButton`
 *  NOTE: before adjusting any logic in this component, check out the
 * `DatasetActionButtons` story in storybook to double check that it still works
 * as expected
 */
export const RemoveButtonComponent: React.FunctionComponent<RemoveButtonProps> = (props) => {
  const {
    qriRef,
    fsiPath,
    size = 'md',
    showIcon = true,
    setModal
  } = props

  const datasetSelected = isDatasetSelected(qriRef)

  if (!(datasetSelected)) {
    return null
  }
  return (<HeaderColumnButton
    id='remove-button'
    label='Remove'
    tooltip='Copy the url of this dataset on the cloud to your clipboard'
    icon={showIcon && faTrash }
    size={size}
    onClick={() => {
      setModal({
        type: ModalType.RemoveDataset,
        datasets: [{ ...qriRef, fsiPath }]
      })
    }}
  />)
}

export default connectComponentToPropsWithRouter(
  RemoveButtonComponent,
  (state: any, ownProps: RemoveButtonProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      ...ownProps,
      qriRef,
      fsiPath: selectFsiPath(state)
    }
  }, {
    setModal
  }
)
