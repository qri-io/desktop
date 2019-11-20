import React from 'react'
import LineDiff from '../app/components/compare/LineDiff'

export default {
  title: 'Line Diff'
}

const wrap = (component) => {
  return (
    <div style={{ maxWidth: 650, margin: '0 auto' }}>
      {component}
    </div>
  )
}

const patchReadmeThreeRemoveOneAdd = {
  "meta" : {
    "---": "a/readme.md",
    "+++": "b/readme.md",
    "added": 1,
    "removed": 3
  },
  "patch": [
    [[ [1,5], [1,5] ], "# World Bank Population"],
    [" ", "### Only Existing Territorial Regions"],
    [" ", ""],
    ["-", "The world Bank dataset of population is just silly!"],
    ["-", "If you add up the “population” column, you don’t get the expected"],
    ["-", "7 billion number, because they include “significant regions”."],
    ["+", "This is a dataset of the World Bank Population without Significant Regions."],
    [" ", "The most important characteristic of this dataset is totalling the “popluation”"],
    [" ", "column will equal the total estimated population for a given year."],
    [" ", "Other than that, the datasets are exactly the same."],
  ]
}
export const threeRemoveOneAdd = () => wrap(<LineDiff data={patchReadmeThreeRemoveOneAdd} />)

threeRemoveOneAdd.story = {
  name: 'Transform: Basic Starlark',
  parameters: {
    notes: `short code viewer`
  }
}