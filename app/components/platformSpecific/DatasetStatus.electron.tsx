import { shell } from 'electron'

export const onClickOpenInFinder = (fsiPath: string) => shell.openItem(fsiPath)
