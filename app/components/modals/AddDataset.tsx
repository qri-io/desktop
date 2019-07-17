import * as React from 'react'
import Modal, { ModalProps } from './Modal'

const AddDataset: React.FunctionComponent<ModalProps> = ({ onDismissed, onSubmit }) =>
  <Modal
    id="addDataset"
    title={'AddDataset'}
    onDismissed={onDismissed}
    onSubmit={onSubmit}
  >
    <div>HI! Add Dataset Here!</div>
  </Modal>

export default AddDataset
