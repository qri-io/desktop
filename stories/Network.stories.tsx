import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

// import { Dataset as IDataset } from '../app/models/dataset'
// import Navbar from '../app/components/nav/Navbar'
import { NetworkHome } from '../app/components/network/NetworkHome'
// import Dataset from '../app/components/dataset/Dataset'
// import { ActionButtonProps } from '../app/components/chrome/ActionButton'

// const cities = require('./data/cities.dataset.json')

export default {
  title: 'Network',
  parameters: {
    notes: ''
  }
}

export const Home = () =>
  <Router>
    <Route render={(props) => <NetworkHome {...props} />} />
  </Router>
  


Home.story = {
  name: 'Home',
  parameters: { note: 'caution: uses live data' }
}

// export const StdDatasetOverview = () => {
//   const handle = (label: string) => {
//     return (d: IDataset, e: React.SyntheticEvent) => {
//       alert(`${label}: ${d.peername}/${d.name}`)
//     }
//   }

//   const actions: ActionButtonProps[] = [
//     { icon: 'clone', text: 'Clone', onClick: handle('clone') },
//     { icon: 'edit', text: 'Edit', onClick: handle('edit') },
//     { icon: 'export', text: 'Export', onClick: handle('export') }
//   ]

//   return (
//     <div style={{ margin: 0, padding: 30, minHeight: '100%', background: '#F5F7FA' }}>
//       <div style={{ width: 800, margin: '2em auto' }}>
//         <Router>
//           <Navbar location='foo/bar' />
//           <Dataset data={cities} onClone={handle('clone')} onEdit={handle('edit')} onExport={handle('export')} />
//         </Router>
//       </div>
//     </div>
//   )
// }

// StdDatasetOverview.story = {
//   name: 'Dataset Overview: Standard',
//   parameters: { note: 'basic, ideal-input dataset overview' }
// }
