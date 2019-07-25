import * as React from 'react'
import { UI } from '../models/store'
import { CSSTransition } from 'react-transition-group'
import CreateDataset from './modals/CreateDataset'
import AddDataset from './modals/AddDataset'
import NoDatasets from './NoDatasets'
import { Modal, ModalType } from '../models/modals'
import AppLoading from './AppLoading'

export interface AppProps {
  ui: UI
  children: any
}

const App: React.FunctionComponent<AppProps> = (props: AppProps) => {
  const [currentModal, setCurrentModal] = React.useState<Modal | null>(null)
  const [hasDatasets, setHasDatasets] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  setTimeout(() => { setLoading(false) }, 1200)

  function renderModal (): JSX.Element | null {
    // Hide any dialogs while we're displaying an error
    // if (errors) {
    //   return null
    // }
    const Modal = currentModal

    if (!Modal) {
      return null
    }

    switch (Modal.type) {
      case ModalType.CreateDataset:
        return (
          <CreateDataset onSubmit={() => setHasDatasets(true)} onDismissed={() => setCurrentModal(null)}/>
        )
      case ModalType.AddDataset:
        return (
          <AddDataset onSubmit={() => setHasDatasets(true)} onDismissed={() => setCurrentModal(null)}/>
        )
      default:
        return null
    }
  }

  const renderNoDatasets = () => {
    return (
      <CSSTransition
        in={!hasDatasets}
        classNames="fade"
        component="div"
        timeout={1000}
        unmountOnExit
      >
        < NoDatasets setModal={setCurrentModal}/>
      </CSSTransition>
    )
  }

  const renderAppLoading = () => {
    return (
      <CSSTransition
        in={loading}
        classNames="fade"
        component="div"
        timeout={1000}
        unmountOnExit
      >
        <AppLoading />
      </CSSTransition>
    )
  }

  return (
    <div style={{ height: '100%' }}>
      {renderAppLoading()}
      {renderModal()}
      {renderNoDatasets()}
      {props.children}
    </div>
  )
}

export default App
