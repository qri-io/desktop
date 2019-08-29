export enum ModalType {
  NoModal,
  CreateDataset,
  AddDataset,
  LinkDataset
}

export const NoModal = { type: ModalType.NoModal }

export type Modal =
| {
  type: ModalType.CreateDataset
  dirPath?: string
  bodyPath?: string
}
| {
  type: ModalType.AddDataset
  initialURL?: string | null
}
| {
  type: ModalType.LinkDataset
  dirPath?: string
}
| { type: ModalType.NoModal }
