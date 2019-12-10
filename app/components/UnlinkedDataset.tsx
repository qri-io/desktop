import * as React from 'react'

import { Modal, ModalType } from '../models/modals'

interface UnlinkedDatasetProps {
  setModal: (modal: Modal) => void
}

const UnlinkedDataset: React.FunctionComponent<UnlinkedDatasetProps> = ({ setModal }) => (
  <div className={'unlinked-dataset'}>
    <div className={'message-container'}>
      <div>
        <h4>&apos;Checkout&apos; your dataset!</h4>
        <p>You can edit and update your dataset in Qri Desktop!</p> <p>First, <a href='#' onClick={(e) => {
          e.preventDefault()
          setModal({ type: ModalType.LinkDataset })
        }}>checkout</a> the dataset to a folder on your computer. This just means Qri will add the dataset files to a folder on your computer in a place where Qri or you can edit them.</p>
        <p>In Qri, you can edit your dataset, add metadata, add a readme, go crazy!</p>
        <p>When you are happy with your progress, &apos;commit&apos; a version, creating a snapshot that you can always return to!</p>
        <p>Think of your &apos;checked out&apos; dataset as a scratch pad: a place you can experiment, but don&apos;t have to worry, because you can easily return to the previous version using Qri.</p>
        <a href='#' onClick={(e) => {
          e.preventDefault()
          setModal({ type: ModalType.LinkDataset })
        }}>Checkout this Dataset</a>
      </div>
    </div>
  </div>
)

export default UnlinkedDataset
