import * as React from 'react'

import CheckboxInput from '../form/CheckboxInput'
import Modal from './Modal'
import { RemoveDatasetModal } from '../../../app/models/modals'
import { ApiAction } from '../../store/api'
import Error from './Error'
import Buttons from './Buttons'

interface RemoveDatasetProps {
  modal: RemoveDatasetModal
  onDismissed: () => void
  onSubmit: (peername: string, name: string, removeFiles: boolean) => Promise<ApiAction>
}

const RemoveDataset: React.FunctionComponent<RemoveDatasetProps> = (props: RemoveDatasetProps) => {
  const { modal, onDismissed, onSubmit } = props
  const { peername, name, fsiPath } = modal

  const [shouldRemoveFiles, setShouldRemoveFiles] = React.useState(false)

  const [dismissable, setDismissable] = React.useState(true)

  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleChanges = (name: string, value: any) => {
    setShouldRemoveFiles(value)
  }

  const handleSubmit = () => {
    setDismissable(false)
    setLoading(true)
    error && setError('')
    if (!onSubmit) return
    onSubmit(peername, name, shouldRemoveFiles)
      .then(onDismissed)
      .catch((action) => {
        setLoading(false)
        setDismissable(true)
        setError(action.payload.err.message)
      })
  }

  return (
    <Modal
      id='RemoveDataset'
      title={`Remove Dataset`}
      onDismissed={onDismissed}
      onSubmit={() => {}}
      dismissable={dismissable}
      setDismissable={setDismissable}
    >
      <div className='content-wrap'>
        <div className='content'>
          <div className='content-main'>Are you sure you want to remove <br/> <div className='code-highlight'>{peername}/{name}</div>&nbsp;?</div>
          { fsiPath &&
            <CheckboxInput
              name='shouldRemoveFiles'
              checked={shouldRemoveFiles}
              onChange={handleChanges}
              label={'Also remove the dataset\'s files'}
            />
          }
        </div>
      </div>
      <p className='content-bottom submit-message'>
        { fsiPath && shouldRemoveFiles && <span>Qri will delete dataset files in <strong>{fsiPath}</strong></span>}
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

export default RemoveDataset
