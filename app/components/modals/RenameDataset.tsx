import React, { useState } from 'react'

import { dismissModal } from '../../actions/ui'
import { RenameDatasetModal } from '../../../app/models/modals'
import {
  selectModal,
  selectDatasetRef
} from '../../selections'
import { ApiAction } from '../../store/api'
import { connectComponentToProps } from '../../utils/connectComponentToProps'

import Modal from './Modal'
import Error from './Error'
import { DatasetReferenceComponent } from '../DatasetReference'
import Buttons from './Buttons'
import { renameDataset } from '../../actions/api'
import { ValidationError } from '../../utils/formValidation'

interface RenameDatasetProps {
  modal: RenameDatasetModal
  onDismissed: () => void
  onSubmit: (username: string, oldName: string, newName: string) => Promise<ApiAction>
}

export const RenameDatasetComponent: React.FC<RenameDatasetProps> = (props: RenameDatasetProps) => {
  const { onDismissed, onSubmit, modal } = props

  const [dismissable, setDismissable] = useState(true)
  const [error, setError] = useState<ValidationError>(null)
  const [loading, setLoading] = useState(false)
  const [newName, setNewName] = useState(modal.name)

  const handleSubmit = () => {
    setDismissable(false)
    setLoading(true)
    error && setError(null)
    onSubmit(modal.username, modal.name, newName).then(() => {
      onDismissed()
    })
  }

  const handleDatasetReferenceSubmit = (newName: string) => {
    setNewName(newName)
  }

  return (
    <Modal
      id='rename-dataset'
      title='Rename Dataset'
      onDismissed={onDismissed}
      onSubmit={() => {}}
      dismissable={dismissable}
      setDismissable={setDismissable}
    >
      <div className='content-wrap'>
        <div className='content'>
          <DatasetReferenceComponent
            qriRef={{ username: modal.username, name: newName || modal.name }}
            onChange={handleDatasetReferenceSubmit}
            isValid={setError}
            focusOnFirstRender
            inline={false}
          />
          <div className='margin-top'>
            <Error text={error} id='rename-dataset-error' />
          </div>
        </div>
      </div>
      <Buttons
        cancelText='cancel'
        onCancel={onDismissed}
        submitText='rename'
        onSubmit={handleSubmit}
        disabled={modal.name === newName || !!error}
        loading={loading}
      />
    </Modal>
  )
}

export default connectComponentToProps(
  RenameDatasetComponent,
  (state: any, ownProps: RenameDatasetProps) => {
    return {
      ...ownProps,
      modal: selectModal(state),
      qriRef: selectDatasetRef(state)
    }
  },
  {
    onDismissed: dismissModal,
    onSubmit: renameDataset
  }
)
