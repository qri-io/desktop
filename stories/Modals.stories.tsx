import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { ModalType } from '../app/models/modals'
import { SearchComponent } from '../app/components/modals/SearchModal'
// import { NewDatasetComponent } from '../app/components/modals/NewDataset'
import { ExportDatasetComponent } from '../app/components/modals/ExportDataset'

export default {
  title: 'Modals',
  parameters: {
    notes: ''
  }
}

export const std = () => {
  return (
    <div style={{ margin: 0, padding: 30, height: '100%', background: '#F5F7FA' }}>
      <div style={{ width: 800, margin: '2em auto' }}>
        <Router>
          <Route render={(props) =>
            <SearchComponent
              {...props}
              modal={{ type: ModalType.Search, q: '' }}
              onDismissed={() => console.log('Search modal is dismissed.')}
              setWorkingDataset={() => console.log('Working dataset has been set.')}
              />}
            />
        </Router>
      </div>
    </div>
  )
}

std.story = {
  name: 'Search',
  parameters: { note: 'search results modal' }
}

// export const newDataset = () => (
//   <div style={{ margin: 0, padding: 30, height: '100%', background: '#F5F7FA' }}>
//     <div style={{ width: 800, margin: '2em auto' }}>
//       <Router>
//         <Route render={(props) =>
//           <NewDatasetComponent
//             {...props}
//             username='qri_user'
//             modal={{ type: ModalType.NewDataset }}
//             onDismissed={() => console.log('New dataset modal is dismissed.')}
//           />}
//         />
//       </Router>
//     </div>
//   </div>
// )

// newDataset.story = {
//   name: 'New Dataset',
//   parameters: { note: 'new dataset modal' }
// }

const dataset = {
  structure: {
    checksum: 'QmVThG96SVXCcah2fye4ZrDpyBzeVVgCVx9r5UHjn7YFt7',
    depth: 2,
    errCount: 242,
    entries: 116142,
    format: 'csv',
    formatConfig: {
      headerRow: true,
      lazyQuotes: true
    },
    length: 10133894
  },
  commit: {
    author: {
      id: 'Qmb4nkmYiRsWcYxQhSHkZbMzpQ8VCcBPjz5n9L5Uo9nYsX'
    },
    message: 'structure:\n\tupdated errCount\nreadme:\n\tremoved scriptBytes\nbody:\n\tchanged by 3%',
    path: '/ipfs/QmNWXrZF9jXmLjqexNXYw1PfkbnFUjcSkW5pAmLyqnbFjk',
    qri: 'cm:0',
    signature: 'Hl4mgLrYwQo9rgxZDjlDZgG872Kcu6t7mYrCU8jfqY5UnY1co67bU+bwBEFJ5LnseUR9VImZlPc0zZC/ARQ4NaLQ6Y7vEPctMmiy6ASUdVRK5vyxiNik+7BWBSc0FdYh78GQzTBWrDLyIMccGof8rYHyM2vWZUMB2lrxu2YGyRlqiwstxb7nA6noakYh4S/DFGB0JzrWCrO94jvWbEMEyR0+AIsK2mGPIEm++sUaCk9iRUiDMoKeYRvFS4MdE6mJ08qU2w7s/MFadAMq26IrWQDHGTCOLj5IvIJmIvvzh4NqBRTyZOrEn0z5dfh95xY88H5N7XP7tg8dod4kNqUkkg==',
    timestamp: '2020-09-21T20:23:39.902007Z',
    title: 'update data for week ending September 19, 2020'
  },
  readme: {
    scriptBytes: '12345'
  }
}

export const exportDataset = () => (
  <div style={{ margin: 0, padding: 30, height: '100%', background: '#F5F7FA' }}>
    <div style={{ width: 800, margin: '2em auto' }}>
      <Router>
        <Route render={(props) =>
          <ExportDatasetComponent
            {...props}
            username='qri_user'
            name='my_cool_dataset'
            path='/ipfs/QmUmfPswPF6Q3aoYrqJejSvnuLMuFtCzpiJ58wudKJyTJ3'
            dataset={dataset}
            modal={{ type: ModalType.ExportDataset }}
            onDismissed={() => console.log('New dataset modal is dismissed.')}
          />}
        />
      </Router>
    </div>
  </div>
)

exportDataset.story = {
  name: 'Export Dataset',
  parameters: { note: 'export dataset modal' }
}
