import * as React from 'react'

import Modal from './Modal'
import Error from './Error'
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
      id='PublishDataset'
      title={'Publish Dataset'}
      onDismissed={onDismissed}
      onSubmit={() => {}}
      dismissable={dismissable}
      setDismissable={setDismissable}
    >
      <div className='content-wrap' >
        <div className='content'>
          <h4>Publish <span className='code-highlight'>{peername}/{name}</span></h4>
          <p><i>Publishing will make your dataset visible to anyone on the internet</i></p>
        </div>
      </div>
      <Error text={error} />
      <Buttons
        cancelText='cancel'
        onCancel={onDismissed}
        submitText='Publish'
        onSubmit={handleSubmit}
        disabled={false}
        loading={loading}
      />
    </Modal>
  )
}

export default PublishDataset
