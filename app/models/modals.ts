export enum ModalType {
  NoModal,
  CreateDataset,
  AddDataset,
  LinkDataset,
  RemoveDataset,
  PublishDataset,
  UnpublishDataset
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

interface PublishDataset {
  type: ModalType.PublishDataset
}

interface UnpublishDataset {
  type: ModalType.UnpublishDataset
}

export interface RemoveDatasetModal {
  type: ModalType.RemoveDataset
  peername: string
  name: string
  fsiPath: string
}

export interface HideModal {
  type: ModalType.NoModal
}

export type Modal = CreateDatasetModal
| AddDatasetModal
| LinkDatasetModal
| RemoveDatasetModal
| PublishDataset
| UnpublishDataset
| HideModal
