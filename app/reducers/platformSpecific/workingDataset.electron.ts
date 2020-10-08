import { ipcRenderer } from 'electron'

export const unblockDatasetMenus = (fsiPath: string, published: boolean) => {
  // set electron menus
  ipcRenderer.send('block-menus', false) // unblock menus once we have a working dataset
  // some menus are contextual based on linked and published status
  ipcRenderer.send('set-working-dataset', {
    fsiPath,
    published
  })
}
