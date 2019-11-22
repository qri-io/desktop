import React from 'react'
import TableDiff from '../app/components/compare/TableDiff'

export default {
  title: 'Table Diff'
}

const wrap = (component) => {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {component}
    </div>
  )
}


// const patchStructuredData = {
//   "meta": {
//     "---": "djs.csv",
//     "+++": "djs_edits.csv",
//     "add": 8, "rem": 4, "mod": 1
//   },
//   "patch": [
//     [ [ ["/1","/4"], ["/1","/5"] ], "/1", [ "dj dj booth", 1,"yes" ] ],
//     ["-", "/1", [ "dj dj booth", 1, "yes" ]],
//     ["+", "/1", [ "DJ dj booth", 2, "yes" ]],
//     [" ", "/2", [ "dj wipeout", 2, "yes" ], [
//       ["~", "/0", "DJ wipeout"]
//     ]],
//     [" ", "/3", [ "com truise", 4, "yes" ]],
//     [" ", "/4", [ "Ryan Hemsworth",4,"yes"]],
//     ["+", "/5", [ "Susan Collins", 3, "no"]]
//   ]
// }


const patchStructuredData = {
  "meta": {
    "---": "djs.csv",
    "+++": "djs_edits.csv",
    "add": 8, "rem": 4, "mod": 1
  },
  "patch": [
    [[ [1,3], [1,5] ], [ "dj dj booth", 1,"yes" ] ],
    [" ", [ "mafintosh", 3, "no" ]],
    [" ", [ "lindsey losam", 2, "yes" ]],
    ["-", [ "dj dj booth", 1, "yes" ]],
    ["+", [ "DJ dj booth", 2, "yes" ]],
    [" ", null, [
      ["-", "dj wipeout"],
      ["+", "DJ wipeout"],
      [" ", 2],
      [" ", "yes"]
    ]],
    [" ", [ "com truise", 4, "yes" ]],
    [" ", [ "Ryan Hemsworth",4,"yes"]],
    ["+", [ "Susan Collins", 3, "no"]]
  ]
}

export const threeRemoveOneAdd = () => wrap(<TableDiff data={patchStructuredData} />)

threeRemoveOneAdd.story = {
  name: 'DJ Edits',
  parameters: {
    notes: `short code viewer`
  }
}
