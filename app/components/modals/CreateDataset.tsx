import * as React from 'react'
import Dialog, { IDialogProps } from './Dialog'

const CreateDataset: React.FunctionComponent<IDialogProps> = ({ onDismissed, onSubmit }) =>
  <div><Dialog
    id="createDataset"
    title={'Create Dataset'}
    onDismissed={onDismissed}
    onSubmit={onSubmit}
  >
    <div>HI! Create Dataset Here!</div>
  </Dialog>
  </div>

export default CreateDataset
