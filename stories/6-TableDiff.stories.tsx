import React from 'react'
import TableDiff from '../app/components/compare/TableDiff'

export default {
  title: 'Diff|Table'
}

const wrap = (component) => {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {component}
    </div>
  )
}

const patchStructuredData = {
  "meta": {
    "---": "djs.csv",
    "+++": "djs_edits.csv",
    "add": 8, "rem": 4, "mod": 1
  },
  "schema": [
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
  ], 
  "diff": [],
  "stat": {
    data: {
      inserts: 1,
      deletes: 3
    }
  }
}

export const threeRemoveOneAdd = () => wrap(<TableDiff data={patchStructuredData} />)

threeRemoveOneAdd.story = {
  name: 'basic mixed edits',
  parameters: {
    notes: `remove + add rows, change one cell`
  }
}

const patchColSwap = {
  "meta": {
    "---": "djs.csv",
    "+++": "djs_column_swap.csv"
  },
  "schema": [
    [ [ [1,4], [1,4] ], null, [
      [" ", "dj dj booth"],
      ["-", 1],
      ["+", "yes"],
      ["-", "yes"],
      ["+", 1]
    ]],
    [" ", null, [
      [" ", "dj wipeout"],
      ["-", 2],
      ["+", "yes"],
      ["-", "yes"],
      ["+", 2]
    ]],
    [" ", null, [
      [" ", "com truise"],
      ["-", 4],
      ["+", "yes"],
      ["-", "yes"],
      ["+", 4]
    ]],
    [" ", null, [
      [" ", "Ryan Hemsworth"],
      ["-", 4],
      ["+", "yes"],
      ["-", "yes"],
      ["+", 4]
    ]]
  ],
  "diff": [],
  "stat": {
    data: {
      inserts: 8,
      deletes: 8
    }
  }
}

const patchColSwapIndexes = {
  "meta": {
    "---": "djs.csv",
    "+++": "djs_column_swap.csv"
  },
  "patch": [
    [ [ [1,4], [1,4] ], null, [
      [" ", "dj dj booth"],
      ["-", 1],
      ["+", "yes"],
      ["-", "yes"],
      ["+", 1]
    ]],
    [" ", null, [
      [" ", "dj wipeout"],
      ["-", 2],
      ["+", "yes"],
      ["-", "yes"],
      ["+", 2]
    ]],
    [" ", null, [
      [" ", "com truise"],
      ["-", 4],
      ["+", "yes"],
      ["-", "yes"],
      ["+", 4]
    ]],
    [" ", null, [
      [" ", "Ryan Hemsworth"],
      ["-", 4],
      ["+", "yes"],
      ["-", "yes"],
      ["+", 4]
    ]]
  ]
}

export const colSwap = () => wrap(<TableDiff data={patchColSwap} />)

colSwap.story = {
  name: 'column swap',
  parameters: {
    notes: `short code viewer`
  }
}

const patchColSwapAndEdits = {
  "meta" : {
    "---": "djs.csv",
    "+++": "djs_col_swap_and_edits.csv"
  },
  "schema": [
    [ [1,2345], [1,435], null ],
    ["-", ["dj dj booth",1,"yes"] ],
    ["+", ["DJ dj booth","yes",2] ],
    [" ", null, [
      ["-", "dj wipeout"],
      ["+", "DJ wipeout"],
      ["-", 2],
      ["+", "yes"],
      ["-", "yes"],
      ["+", 2]
    ]],
    [" ", null, [
      [" ", "com truise"],
      ["-", 4],
      ["+", "yes"],
      ["-", "yes"],
      ["+", 4]
    ]],
    [" ", null, [
      [" ", "Ryan Hemsworth"],
      ["-", 4],
      ["+", "yes"],
      ["-", "yes"],
      ["+", 4]
    ]],
    ["+", ["Susan Collins","no",3]]
  ],
  "diff": [],
  "stat": {
    data: {
      inserts: 1,
      deletes: 3
    }
  }
}

export const colSwapAndEdits = () => wrap(<TableDiff data={patchColSwapAndEdits} />)

colSwapAndEdits.story = {
  name: 'column swap & edits',
  parameters: {
    notes: `combining both column swap and edits`
  }
}