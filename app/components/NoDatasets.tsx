import * as React from 'react'
import { Modal, ModalType } from '../models/modals'
import WelcomeTemplate from './WelcomeTemplate'

interface NoDatasetsProps {
  setModal: (modal: Modal) => void
}

const NoDatasets: React.FunctionComponent<NoDatasetsProps> = ({ setModal }) =>
  <WelcomeTemplate
    title='Let&apos;s get some datasets'
    subtitle='Create a dataset in Qri or add a dataset that is already on the Qri network'
    id='no-datasets-page'
    showLogo={false}
  >
    <div id='create_dataset' className='no-datasets-options' onClick={() => setModal({ type: ModalType.CreateDataset })}>
      <h5>Create a Dataset</h5>
      <h6>Want to create a dataset from scratch, or already have a data file you want to start versioning?<br/>Start here!</h6>
    </div>
    <div id='add_dataset' className='no-datasets-options' onClick={() => setModal({ type: ModalType.AddDataset })}>
      <h5>Add a Dataset</h5>
      <h6>Have the link to a dataset that is already on Qri and want to add it to your Qri repository?<br/>Start here!</h6>
    </div>
  </WelcomeTemplate>

export default NoDatasets
