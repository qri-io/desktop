export enum ModalType {
  CreateDataset,
  AddDataset,
}

export type Modal =
| { type: ModalType.CreateDataset, dirPath?: string, bodyPath?: string }
| {
  type: ModalType.AddDataset
  initialURL?: string | null
}
