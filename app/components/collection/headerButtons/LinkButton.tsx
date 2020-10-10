import * as React from 'react'
import { faFile, faLink } from '@fortawesome/free-solid-svg-icons'

import { RouteProps } from '../../../models/store'
import { Modal, ModalType } from '../../../models/modals'
import { QriRef, qriRefFromRoute } from '../../../models/qriRef'

import { connectComponentToPropsWithRouter } from '../../../utils/connectComponentToProps'

import { setModal } from '../../../actions/ui'

import { selectInNamespace, selectFsiPath, selectMutationsIsDirty } from '../../../selections'

import HeaderColumnButton from '../../chrome/HeaderColumnButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface LinkButtonProps extends RouteProps {
  qriRef: QriRef
  inNamespace: boolean
  fsiPath: string
  modified: boolean
  setModal: (modal: Modal) => void
  showIcon: boolean
}

// show if fsiPath == ''
export const LinkButtonComponent: React.FunctionComponent<LinkButtonProps> = (props) => {
  const {
    qriRef,
    inNamespace,
    modified,
    showIcon
  } = props

  const { username, name } = qriRef
  const datasetSelected = username !== '' && name !== ''

  if (!inNamespace || !datasetSelected) {
    return null
  }

  return (<HeaderColumnButton
    id='checkout'
    label='checkout'
    tooltip='Checkout this dataset to a folder on your computer'
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
  LinkButtonComponent,
  (state: any, ownProps: LinkButtonProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      qriRef,
      inNamespace: selectInNamespace(state, qriRef),
      fsiPath: selectFsiPath(state),
      modified: selectMutationsIsDirty(state),
      ...ownProps
    }
  },
  {
    setModal
  }
)
