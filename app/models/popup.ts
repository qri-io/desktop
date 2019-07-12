export enum PopupType {
  InitializeDataset,
  AddDataset,
}

export type Popup =
| { type: PopupType.InitializeDataset, dirPath: string, bodyPath?: string }
| {
  type: PopupType.AddDataset
  initialURL: string | null
}
