import React, { useState } from 'react'
import path from 'path'

import { newDataset } from '../../actions/api'
import { dismissModal } from '../../actions/ui'
import { Dataset } from '../../models/dataset'
import { NewDatasetModal } from '../../models/modals'
import { connectComponentToProps } from '../../utils/connectComponentToProps'
import { nameFromTitle, titleFromBodyFile } from '../../utils/naming'
import { selectModal, selectSessionUsername } from '../../selections'
import { ApiAction } from '../../store/api'

import Buttons from './Buttons'
import DropFileInput from '../form/DropFileInput'
import Error from './Error'
import TextInput from '../form/TextInput'
import Modal from './Modal'

interface NewDatasetProps {
  modal: NewDatasetModal
  username: string
  onDismissed: () => void
  newDataset: (ds: Dataset) => Promise<ApiAction>
}

// 136 because dataset names cannot be longer than 144 characters,
// and we might have to prepend `dataset_` if the title begins with a number
const TITLE_CHARACTER_LIMIT = 136
const nullFile = new File([], '')

function validState (title: string, bodyFile: File): boolean {
  return (title.trim() !== '') && (bodyFile.size > 0)
}

export const NewDatasetComponent: React.FC<NewDatasetProps> = (props) => {
  const { username, onDismissed, newDataset } = props
  const { bodyFile = nullFile } = props.modal

  const [formValues, setFormValues] = useState({
    title: titleFromBodyFile(bodyFile),
    datasetName: nameFromTitle(titleFromBodyFile(bodyFile)),
    bodyFile: bodyFile,
    valid: validState(titleFromBodyFile(bodyFile), bodyFile)
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTitleChange = (e: React.ChangeEvent) => {
    const { value } = e.target
    setFormValues({
      title: value,
      datasetName: nameFromTitle(value),
      bodyFile: formValues.bodyFile,
      valid: validState(value, formValues.bodyFile)
    })
  }

  const handleBodyFileChange = (f: File) => {
    let { title, datasetName, bodyFile } = formValues
    const ext = path.extname(f.name)
    if (!(ext === '.csv' || ext === '.json')) {
      setError(`unsupported file format: ${ext} only json and csv supported`)
      return
    }

    setError('')
    if (title === '' || title === titleFromBodyFile(bodyFile)) {
      title = titleFromBodyFile(f)
    }
    if (datasetName === '' || datasetName === nameFromTitle(titleFromBodyFile(bodyFile))) {
      // if dataset name is empty, set title from filename without extension
      datasetName = nameFromTitle(titleFromBodyFile(f))
    }

    setFormValues({
      title,
      datasetName,
      bodyFile: f,
      valid: validState(title, f)
    })
  }

  const handleSubmit = () => {
    setLoading(true)
    error && setError('')

    newDataset({
      peername: username,
      name: formValues.datasetName,
      meta: {
        title: formValues.title.trim()
      },
      bodyPath: formValues.bodyFile.path
    })
      .then(onDismissed)
      .catch((reason) => {
        setError(reason)
        setLoading(false)
      })
  }

  return (
    <Modal
      id='new-dataset-modal'
      title='New Dataset'
      onDismissed={onDismissed}
      onSubmit={() => {}}
      dismissable={true}
    >
      <div className='content-wrap' >
        <div className='content'>
          <div className='flex-space-between'>
            <TextInput
              name='title'
              label='Title'
              labelTooltip='Give your dataset a human-friendly title.'
              type=''
              value={formValues.title}
              onChange={handleTitleChange}
              maxLength={TITLE_CHARACTER_LIMIT}
              tooltipFor='modal-tooltip'
            />
          </div>
          {
            formValues.datasetName !== '' && (
              <div className='dialog-text-small'>
                <p>
                  Your new dataset will be known on Qri as<br/>
                  <code>{username}/{formValues.datasetName}</code>
                </p>
              </div>
            )
          }
          <div className='file-picker flex-space-between'>
            <DropFileInput
              id='chooseBodyFile'
              label='Body File'
              labelTooltip='File to build your dataset on'
              tooltipFor='modal-tooltip'
              placeholder='drop a csv or json file'
              value={formValues.bodyFile}
              onChange={handleBodyFileChange}
            />
          </div>
        </div>
      </div>
      <Error id={'new-dataset-modal-error'} text={error} />
      <Buttons
        cancelText='cancel'
        onCancel={onDismissed}
        submitText='Create'
        onSubmit={handleSubmit}
        disabled={!formValues.valid}
        loading={loading}
      />
    </Modal>
  )
}

export default connectComponentToProps(
  NewDatasetComponent,
  (state: any, ownProps: NewDatasetProps) => {
    return {
      ...ownProps,
      modal: selectModal(state),
      username: selectSessionUsername(state)
    }
  },
  {
    onDismissed: dismissModal,
    newDataset
  }
)
