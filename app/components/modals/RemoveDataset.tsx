import React, { useState } from 'react'

import { RemoveDatasetModal } from '../../../app/models/modals'
import { ApiAction } from '../../store/api'
import { connectComponentToProps } from '../../utils/connectComponentToProps'
import { dismissModal } from '../../actions/ui'
import { removeDatasetAndFetch } from '../../actions/api'
import { selectModal, selectSessionUsername } from '../../selections'

import CheckboxInput from '../form/CheckboxInput'
import Modal from './Modal'
import Error from './Error'
import Buttons from './Buttons'

interface RemoveDatasetProps {
  modal: RemoveDatasetModal
  sessionUsername: string
  onDismissed: () => void
  onSubmit: (username: string, name: string, isLinked: boolean, keepFiles: boolean) => Promise<ApiAction>
}

export const RemoveDatasetComponent: React.FC<RemoveDatasetProps> = (props: RemoveDatasetProps) => {
  const { modal, sessionUsername, onDismissed, onSubmit } = props
  const { username, name, fsiPath } = modal

  const [keepFiles, setKeepFiles] = useState(true)
  const [dismissable, setDismissable] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
          <div className='dialog-text-small'>
            <p>Are you sure you want to remove <br/> <code>{username}/{name}</code>&nbsp;?</p>
            <br/><br/>
            {sessionUsername === username && <div className='warning'>Warning: removing a dataset which belongs to you means you cannot return to that dataset&apos;s history.</div>}
          </div>
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

export default connectComponentToProps(
  RemoveDatasetComponent,
  (state: any, ownProps: RemoveDatasetProps) => {
    return {
      ...ownProps,
      modal: selectModal(state),
      sessionUsername: selectSessionUsername(state)
    }
  },
  {
    onDismissed: dismissModal,
    onSubmit: removeDatasetAndFetch
  }
)
