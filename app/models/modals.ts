import { AnyAction } from 'redux'

import { VersionInfo } from './store'

export enum ModalType {
  NoModal,
  NewDataset,
  PullDataset,
  LinkDataset,
  RemoveDataset,
  ExportDataset,
  RenameDataset,
  PublishDataset,
  UnpublishDataset,
  Search
}

export interface PullDatasetModal {
  type: ModalType.PullDataset
}

export interface NewDatasetModal {
  type: ModalType.NewDataset
  bodyFile?: File
}

export interface ExportDatasetModal {
  type: ModalType.ExportDataset
  version: VersionInfo
}

export interface RenameDatasetModal {
  type: ModalType.RenameDataset
  username: string
  name: string
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
  datasets: VersionInfo[]
  onSubmit: (keepFiles: boolean) => Promise<AnyAction>
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
| ExportDatasetModal
| RenameDatasetModal
| SearchModal
| UnpublishDatasetModal
