import * as React from 'react'
import { faFolderOpen, faFile, faLink } from '@fortawesome/free-solid-svg-icons'
import { shell } from 'electron'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { Modal, ModalType } from '../../../models/modals'
import { QriRef, qriRefFromRoute } from '../../../models/qriRef'

import { setModal } from '../../../actions/ui'

import { selectInNamespace, selectFsiPath, selectMutationsIsDirty } from '../../../selections'

import HeaderColumnButton from '../../chrome/HeaderColumnButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface LinkButtonProps extends RouteComponentProps<QriRef> {
  qriRef: QriRef
  inNamespace: boolean
  fsiPath: string
  modified: boolean
  setModal: (modal: Modal) => void
}

const LinkButtonComponent: React.FunctionComponent<LinkButtonProps> = (props) => {
  const {
    qriRef,
    inNamespace,
    fsiPath,
    modified,
    setModal
  } = props

  const { username, name } = qriRef
  const datasetSelected = username !== '' && name !== ''

  if (!inNamespace || !datasetSelected) {
    return null
  }

  if (fsiPath !== '') {
    return (<HeaderColumnButton
      id='show-files'
      icon={faFolderOpen}
      label='Show Files'
      onClick={() => shell.openItem(fsiPath)}
    />)
  }

  return (<HeaderColumnButton
    id='checkout'
    label='checkout'
    tooltip='Checkout this dataset to a folder on your computer'
    icon={(
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

const mapStateToProps = (state: any, ownProps: LinkButtonProps) => {
  const qriRef = qriRefFromRoute(ownProps)
  return {
    qriRef,
    inNamespace: selectInNamespace(state, qriRef),
    fsiPath: selectFsiPath(state),
    modified: selectMutationsIsDirty(state),
    ...ownProps
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    setModal
  }, dispatch)
}

const mergeProps = (props: any, actions: any): LinkButtonProps => {
  return { ...props, ...actions }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(LinkButtonComponent))
