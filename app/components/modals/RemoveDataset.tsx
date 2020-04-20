import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch, bindActionCreators } from 'redux'

import { RemoveDatasetModal } from '../../../app/models/modals'
import { ApiAction } from '../../store/api'

import { dismissModal } from '../../actions/ui'
import { removeDatasetAndFetch } from '../../actions/api'

import { selectModal } from '../../selections'

import CheckboxInput from '../form/CheckboxInput'
import Modal from './Modal'
import Error from './Error'
import Buttons from './Buttons'

interface RemoveDatasetProps {
  modal: RemoveDatasetModal
  onDismissed: () => void
  onSubmit: (username: string, name: string, isLinked: boolean, keepFiles: boolean) => Promise<ApiAction>
}

export const RemoveDatasetComponent: React.FunctionComponent<RemoveDatasetProps> = (props: RemoveDatasetProps) => {
  const { modal, onDismissed, onSubmit } = props
  const { username, name, fsiPath } = modal

  const [keepFiles, setKeepFiles] = React.useState(true)

  const [dismissable, setDismissable] = React.useState(true)

  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleChanges = (name: string, value: any) => {
    setKeepFiles(!value)
  }

  const handleSubmit = () => {
    setDismissable(false)
    setLoading(true)
    error && setError('')
    if (!onSubmit) return

    const isLinked = !!fsiPath
    onSubmit(username, name, isLinked, keepFiles)
      .then(onDismissed)
      .catch((action) => {
        setLoading(false)
        setDismissable(true)
        setError(action.payload.err.message)
      })
  }

  return (
    <Modal
      id='remove-dataset'
      title={`Remove Dataset`}
      onDismissed={onDismissed}
      onSubmit={() => {}}
      dismissable={dismissable}
      setDismissable={setDismissable}
    >
      <div className='content-wrap'>
        <div className='content'>
          <div className='content-main'>Are you sure you want to remove <br/> <div className='code-highlight'>{username}/{name}</div>&nbsp;?</div>
          { fsiPath &&
            <CheckboxInput
              name='should-remove-files'
              checked={!keepFiles}
              onChange={handleChanges}
              label={'Also remove the dataset\'s files'}
            />
          }
        </div>
      </div>
      <p className='content-bottom submit-message'>
        { fsiPath && !keepFiles && <span>Qri will delete dataset files in <strong>{fsiPath}</strong></span>}
      </p>
      <Error text={error} />
      <Buttons
        cancelText='cancel'
        onCancel={onDismissed}
        submitText='Remove'
        onSubmit={handleSubmit}
        disabled={false}
        loading={loading}
      />
    </Modal>
  )
}

const mapStateToProps = (state: any, ownProps: RemoveDatasetProps) => {
  return {
    ...ownProps,
    modal: selectModal(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    onDismissed: dismissModal,
    onSubmit: removeDatasetAndFetch
  }, dispatch)
}

const mergeProps = (props: any, actions: any): RemoveDatasetProps => {
  return { ...props, ...actions }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(RemoveDatasetComponent)
