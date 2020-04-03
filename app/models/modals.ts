export enum ModalType {
  NoModal,
  CreateDataset,
  AddDataset,
  LinkDataset,
  RemoveDataset,
  PublishDataset,
  UnpublishDataset,
  ExportVersion,
  Search
}

export interface AddDatasetModal {
  type: ModalType.AddDataset
}

export interface CreateDatasetModal {
  type: ModalType.CreateDataset
}

export interface ExportVersionModal {
  type: ModalType.ExportVersion
  peername: string
  name: string
  path: string
  timestamp: Date
  title: string
}

export interface HideModal {
  type: ModalType.NoModal
}

export interface LinkDatasetModal {
  type: ModalType.LinkDataset
  username: string
  name: string
  modified?: boolean
}

export interface PublishDatasetModal {
  type: ModalType.PublishDataset
  username: string
  name: string
}

export interface RemoveDatasetModal {
  type: ModalType.RemoveDataset
  peername: string
  name: string
  fsiPath: string
}

export interface SearchModal {
  type: ModalType.Search
  q: string
}

export interface UnpublishDatasetModal {
  type: ModalType.UnpublishDataset
  username: string
  name: string
}

export type Modal = AddDatasetModal
| CreateDatasetModal
| ExportVersionModal
| LinkDatasetModal
| HideModal
| PublishDataset
| RemoveDatasetModal
| SearchModal
| UnpublishDataset
