import * as React from 'react'
import Modal, { ModalProps } from './Modal'

const CreateDataset: React.FunctionComponent<ModalProps> = ({ onDismissed, onSubmit }) =>
  <Modal
    id="createDataset"
    title={'Create Dataset'}
    onDismissed={onDismissed}
    onSubmit={onSubmit}
  >
    <div>HI! Create Dataset Here!</div>
  </Modal>

export default CreateDataset
