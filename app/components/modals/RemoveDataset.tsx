import * as React from 'react'

import CheckboxInput from '../form/CheckboxInput'
import Modal from './Modal'
import { ApiAction } from '../../store/api'
import Error from './Error'
import Buttons from './Buttons'

interface RemoveDatasetProps {
  peername: string
  name: string
  linkpath: string
  onDismissed: () => void
  onSubmit: (peername: string, name: string, dir: string) => Promise<ApiAction>
}

const RemoveDataset: React.FunctionComponent<RemoveDatasetProps> = ({ peername, name, onDismissed, onSubmit, linkpath }) => {
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
    onSubmit(peername, name, linkpath)
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
          <p>Are you sure you want to remove the dataset &quot;{peername}/{name}&quot;?</p>
          { linkpath.length > 0 &&
            <CheckboxInput
              name='shouldRemoveFiles'
              checked={shouldRemoveFiles}
              onChange={handleChanges}
              label={'Also remove the dataset\'s files'}
            />
          }
        </div>
      </div>
      <p className='submit-message'>
        { linkpath.length > 0 && shouldRemoveFiles && `Qri will delete dataset files in "${linkpath}"`}
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
