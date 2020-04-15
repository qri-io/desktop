import * as React from 'react'
import { faCloudUploadAlt, faCloud } from '@fortawesome/free-solid-svg-icons'
import { shell, clipboard } from 'electron'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { QRI_CLOUD_URL } from '../../../constants'
import { Modal, ModalType } from '../../../models/modals'
import { QriRef, qriRefFromRoute } from '../../../models/qriRef'

import { setModal } from '../../../actions/ui'

import { selectIsPublished, selectInNamespace, selectLatestPath } from '../../../selections'

import HeaderColumnButton from '../../chrome/HeaderColumnButton'
import Hamburger from '../../chrome/Hamburger'

interface PublishButtonProps extends RouteComponentProps<QriRef> {
  qriRef: QriRef
  inNamespace: boolean
  isPublished: boolean
  latestPath: string
  setModal: (modal: Modal) => void
}

const PublishButtonComponent: React.FunctionComponent<PublishButtonProps> = (props) => {
  const {
    qriRef,
    inNamespace,
    isPublished,
    latestPath,
    setModal
  } = props

  const { username, name, path = '' } = qriRef
  const datasetSelected = username !== '' && name !== ''
  const atHead = path !== '' && path === latestPath

  if (!inNamespace || !datasetSelected) {
    return null
  }

  if (isPublished) {
    const extraActions = [{
      icon: 'clone',
      text: 'Copy Cloud Link',
      onClick: () => clipboard.writeText
    }]

    if (atHead) {
      extraActions.push({
        icon: 'close',
        text: 'Unpublish',
        onClick: () => setModal({
          type: ModalType.UnpublishDataset,
          username,
          name
        })
      })
    }
    return (
      <><HeaderColumnButton
        id='view-in-cloud'
        onClick={() => { shell.openExternal(`${QRI_CLOUD_URL}/${username}/${name}`) }}
        icon={faCloud}
        label='View in Cloud'
      />
      <Hamburger id='workbench-hamburger' data={extraActions} />
      </>
    )
  }

  return (
    <span data-tip={
      !atHead
        ? 'You must be at the latest version of the dataset to publish'
        : latestPath === ''
          ? 'The dataset must have at least one commit before you can publish'
          : 'Publish this dataset to Qri Cloud'
    }>
      <HeaderColumnButton
        id='publish-button'
        label='Publish'
        icon={faCloudUploadAlt}
        disabled={!atHead || latestPath === ''}
        onClick={() => {
          setModal({
            type: ModalType.PublishDataset,
            username: username || '',
            name: name || ''
          })
        }}
      />
    </span>
  )
}

const mapStateToProps = (state: any, ownProps: PublishButtonProps) => {
  const qriRef = qriRefFromRoute(ownProps)
  return {
    qriRef,
    inNamespace: selectInNamespace(state, qriRef),
    isPublished: selectIsPublished(state),
    latestPath: selectLatestPath(state),
    ...ownProps
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    setModal
  }, dispatch)
}

const mergeProps = (props: any, actions: any): PublishButtonProps => {
  return { ...props, ...actions }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(PublishButtonComponent))
