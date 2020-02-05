import * as React from 'react'

import { Modal, ModalType } from '../../models/modals'
import ExternalLink from '../ExternalLink'

interface UnlinkedDatasetProps {
  setModal: (modal: Modal) => void
  inNamespace: boolean
}

const UnlinkedDataset: React.FunctionComponent<UnlinkedDatasetProps> = ({ setModal, inNamespace = true }) => (
  <div className={'unlinked-dataset'}>
    <div className={'message-container'}>
      {
        inNamespace
          ? <div>
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
          : <div>
            <h4>You are viewing another user&apos;s dataset!</h4>
            <p>
            If you want to make edits to this dataset, you will need to import the data as your own. Head over to the &apos;History&apos; tab and right-click on whichever version you want to work with. Export it, unzip the contents, and import the body file by dragging and dropping it over the app. The dataset is now yours!
            </p>
            <p>
            We are working on streamlining this process! If you have any thoughts or suggestions please reach out to us on <ExternalLink href='https://github.com/qri-io/desktop/issues'>Github</ExternalLink> or <ExternalLink href='https://discordapp.com/invite/thkJHKj'>Discord</ExternalLink>.
            </p>
          </div>
      }
    </div>
  </div>
)

export default UnlinkedDataset
