import * as React from 'react'

import Modal from './Modal'
import Buttons from './Buttons'

import { ApiAction } from '../../store/api'

interface PublishDatasetProps {
  peername: string
  name: string
  onDismissed: () => void
  onSubmit: () => Promise<ApiAction>
}

const PublishDataset: React.FunctionComponent<PublishDatasetProps> = (props) => {
  const { peername, name, onDismissed, onSubmit } = props
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
          <p>Unpublish <span className='code-highlight'>{peername}/{name}</span></p>
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

export default PublishDataset
