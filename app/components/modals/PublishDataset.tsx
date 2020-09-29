import * as React from 'react'

import { ApiAction } from '../../store/api'
import { PublishDatasetModal } from '../../models/modals'

import { connectComponentToProps } from '../../utils/connectComponentToProps'

import { dismissModal } from '../../actions/ui'
import { publishDataset } from '../../actions/api'

import { selectModal } from '../../selections'

import Modal from './Modal'
import Error from './Error'
import Buttons from './Buttons'

interface PublishDatasetProps {
  modal: PublishDatasetModal
  onDismissed: () => void
  onSubmit: (username: string, name: string) => Promise<ApiAction>
}

export const PublishDatasetComponent: React.FunctionComponent<PublishDatasetProps> = (props) => {
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
    onSubmit(username, name)
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
          <div className='dialog-text-small'>
            <p>Push <code>{username}/{name}</code></p>
            <p><i>Pushing to qri.cloud will make your dataset visible to anyone on the internet</i></p>
          </div>
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

export default connectComponentToProps(
  PublishDatasetComponent,
  (state: any, ownProps: PublishDatasetProps) => {
    return {
      ...ownProps,
      modal: selectModal(state)
    }
  },
  {
    onDismissed: dismissModal,
    onSubmit: publishDataset
  }
)
