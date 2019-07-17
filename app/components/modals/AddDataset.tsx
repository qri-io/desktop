import * as React from 'react'
import Modal, { ModalProps } from './Modal'
import TextInput from '../form/TextInput'
import Error from './Error'
import Buttons from './Buttons'

const AddDataset: React.FunctionComponent<ModalProps> = ({ onDismissed, onSubmit }) => {
  const [peername, setPeername] = React.useState('')
  const [datasetName, setDatasetName] = React.useState('')
  const [error, setError] = React.useState('')
  const [disabled, setDisabled] = React.useState(false)
  const [buttonDisabled, setButtonDisabled] = React.useState(true)
  const [loading, setLoading] = React.useState(false)

  const handleChanges = (name: string, value: any) => {
    if (value[value.length - 1] === ' ') {
      return
    }
    if (name === 'peername') setPeername(value)
    if (name === 'datasetName') setDatasetName(value)
    if (peername && datasetName) {
      setButtonDisabled(false)
    } else {
      setButtonDisabled(true)
    }
  }

  const handleSubmit = () => {
    setDisabled(true)
    setLoading(true)
    const handleResponse = () => {
      if (peername === 'error') {
        setError('could not find dataset!')
        setDisabled(false)
        setLoading(false)
        return
      }
      if (onSubmit) {
        new Promise((resolve) => {
          onSubmit()
          resolve()
        }).then(() =>
          setTimeout(onDismissed, 200)
        )
      }
    }
    setTimeout(handleResponse, 1000)
  }

  return (
    <Modal
      id="addDataset"
      title={'Add Dataset'}
      onDismissed={onDismissed}
      onSubmit={handleSubmit}
      disabled={disabled}
    >
      <p>Add a dataset that already exists on Qri <br/>using the peername and dataset name.</p>
      <TextInput
        name='peername'
        label='Peername:'
        type=''
        value={peername}
        onChange={handleChanges}
        maxLength={300}
      />
      <TextInput
        name='datasetName'
        label='Dataset Name:'
        type=''
        value={datasetName}
        onChange={handleChanges}
        maxLength={300}
      />
      {error && <Error text={error} />}
      <Buttons
        cancelText='cancel'
        onCancel={onDismissed}
        submitText='Add Dataset'
        onSubmit={handleSubmit}
        disabled={buttonDisabled}
        loading={loading}
      />
    </Modal>
  )
}

export default AddDataset
