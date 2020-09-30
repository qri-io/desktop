export enum ModalType {
  NoModal,
  NewDataset,
  PullDataset,
  LinkDataset,
  RemoveDataset,
  PublishDataset,
  UnpublishDataset,
  Search
}

export interface PullDatasetModal {
  type: ModalType.PullDataset
}

export interface NewDatasetModal {
  type: ModalType.NewDataset
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
  username: string
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

export type Modal = PullDatasetModal
| NewDatasetModal
| LinkDatasetModal
| HideModal
| PublishDatasetModal
| RemoveDatasetModal
| SearchModal
| UnpublishDatasetModal
