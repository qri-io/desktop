import * as React from 'react'
import { Dispatch, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { ApiAction } from '../../store/api'
import { UnpublishDatasetModal } from '../../models/modals'

import { unpublishDataset } from '../../actions/api'
import { dismissModal } from '../../actions/ui'

import { selectModal } from '../../selections'

import Modal from './Modal'
import Buttons from './Buttons'

interface UnpublishDatasetProps {
  modal: UnpublishDatasetModal
  onDismissed: () => void
  onSubmit: () => Promise<ApiAction>
}

const UnpublishDatasetComponent: React.FunctionComponent<UnpublishDatasetProps> = (props) => {
  const { modal, onDismissed, onSubmit } = props
  const { username, name } = modal
  const [dismissable, setDismissable] = React.useState(true)

  // should come from props
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = () => {
    setDismissable(false)
    setLoading(true)
    error && setError('')
    if (!onSubmit) return
    onSubmit()
      .then(() => onDismissed())
      .catch((action: any) => {
        setLoading(false)
        setDismissable(true)
        setError(action.payload.err.message)
      })
  }

  return (
    <Modal
      id='UnpublishDataset'
      title={'Unpublish Dataset'}
      onDismissed={onDismissed}
      onSubmit={() => {}}
      dismissable={dismissable}
      setDismissable={setDismissable}
    >
      <div className='content-wrap' >
        <div className='content'>
          <p>Unpublish <span className='code-highlight'>{username}/{name}</span></p>
          <p>Unpublishing will remove your dataset from the Qri network</p>
        </div>
      </div>

      <Buttons
        cancelText='cancel'
        onCancel={onDismissed}
        submitText='Unpublish'
        onSubmit={handleSubmit}
        disabled={false}
        loading={loading}
      />
    </Modal>
  )
}

const mapStateToProps = (state: any, ownProps: UnpublishDatasetProps) => {
  return {
    modal: selectModal(state),
    ...ownProps
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    onDismissed: dismissModal,
    onSubmit: unpublishDataset
  }, dispatch)
}

const mergeProps = (props: any, actions: any): UnpublishDatasetProps => {
  return { ...props, ...actions }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(UnpublishDatasetComponent)
