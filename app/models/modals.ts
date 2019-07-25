export enum ModalType {
  NoModal,
  CreateDataset,
  AddDataset,
}

export const NoModal = { type: ModalType.NoModal }

export type Modal =
| { type: ModalType.CreateDataset, dirPath?: string, bodyPath?: string }
| {
  type: ModalType.AddDataset
  initialURL?: string | null
}
| { type: ModalType.NoModal }
