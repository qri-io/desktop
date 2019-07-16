import * as React from 'react'
import Dialog, { IDialogProps } from './Dialog'

const AddDataset: React.FunctionComponent<IDialogProps> = ({ onDismissed, onSubmit }) =>
  <div><Dialog
    id="addDataset"
    title={'AddDataset'}
    onDismissed={onDismissed}
    onSubmit={onSubmit}
  >
    <div>HI! Add Dataset Here!</div>
  </Dialog></div>

export default AddDataset
