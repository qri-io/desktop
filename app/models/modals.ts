export enum ModalType {
  NoModal,
  CreateDataset,
  AddDataset,
  LinkDataset,
  RemoveDataset
}

interface CreateDatasetModal {
  type: ModalType.CreateDataset
  dirPath?: string
  bodyPath?: string
}

interface AddDatasetModal {
  type: ModalType.AddDataset
  initialURL?: string | null
}

interface LinkDatasetModal {
  type: ModalType.LinkDataset
  dirPath?: string
}

export interface RemoveDatasetModal {
  type: ModalType.RemoveDataset
  peername: string
  name: string
  fsipath: string
}

export interface HideModal {
  type: ModalType.NoModal
}

export type Modal = CreateDatasetModal | AddDatasetModal | LinkDatasetModal | RemoveDatasetModal | HideModal
