import * as React from 'react'
import { faFile, faLink } from '@fortawesome/free-solid-svg-icons'

import { RouteProps } from '../../../models/store'
import { Modal, ModalType } from '../../../models/modals'
import { isDatasetSelected, QriRef, qriRefFromRoute } from '../../../models/qriRef'

import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'

import { setModal } from '../../../actions/ui'

import { selectFsiPath, selectMutationsIsDirty } from '../../../selections'

import HeaderColumnButton from '../../chrome/HeaderColumnButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface CheckoutButtonProps extends RouteProps {
  qriRef: QriRef
  fsiPath: string
  modified: boolean
  setModal: (modal: Modal) => void
  showIcon: boolean
  size: 'sm' | 'md'
}

/**
 * If there is a dataset selected & there is no fsiPath, show the `CheckoutButton`
 *  NOTE: before adjusting any logic in this component, check out the
 * `DatasetActionButtons` story in storybook to double check that it still works
 * as expected
 */
export const CheckoutButtonComponent: React.FunctionComponent<CheckoutButtonProps> = (props) => {
  const {
    qriRef,
    fsiPath,
    modified,
    size = 'md',
    setModal,
    showIcon = true
  } = props

  const { username, name } = qriRef
  const datasetSelected = isDatasetSelected(qriRef)

  if (!(datasetSelected && !fsiPath)) {
    return null
  }

  return (<HeaderColumnButton
    id='checkout'
    label='Checkout'
    tooltip='Checkout this dataset to a folder on your computer'
    size={size}
    icon={(showIcon &&
      <span className='fa-layers fa-fw'>
        <FontAwesomeIcon icon={faFile} size='lg'/>
        <FontAwesomeIcon icon={faLink} transform='shrink-8' />
      </span>
    )}
    onClick={() => {
      setModal({ type: ModalType.LinkDataset, username, name, modified })
    }}
  />)
}

export default connectComponentToPropsWithRouter(
  CheckoutButtonComponent,
  (state: any, ownProps: CheckoutButtonProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      ...ownProps,
      qriRef,
      fsiPath: selectFsiPath(state),
      modified: selectMutationsIsDirty(state)
    }
  },
  {
    setModal
  }
)
