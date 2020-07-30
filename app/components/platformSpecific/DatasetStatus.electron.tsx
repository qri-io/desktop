import { shell } from 'electron'

export const onClickOpenInFinder = (_: React.MouseEvent, fsiPath: string) => shell.openItem(fsiPath)
