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
  "stat": {
    "leftNodes": 21,
    "rightNodes": 11,
    "leftWeight": 309,
    "rightWeight": 149,
    "inserts": 2,
    "deletes": 4
  },
  "schemaStat": {
    "leftNodes": 5,
    "rightNodes": 5,
    "leftWeight": 73,
    "rightWeight": 73
  },
  "schema": [
    [
      " ",
      0,
      "location_name"
    ],
    [
      " ",
      1,
      "city"
    ],
    [
      " ",
      2,
      "state"
    ],
    [
      " ",
      3,
      "duration_weeks"
    ]
  ],
  "diff": [
    [
      "-",
      0,
      [
        "Home",
        "McLean",
        "Virginia",
        8
      ]
    ],
    [
      "-",
      0,
      [
        "Huntley",
        "Huntley",
        "Illinois",
        3
      ]
    ],
    [
      " ",
      0,
      null,
      [
        [
          " ",
          0,
          "Casita"
        ],
        [
          " ",
          1,
          "Santa Fe"
        ],
        [
          "-",
          2,
          "New Mexico"
        ],
        [
          "+",
          2,
          "NM"
        ],
        [
          " ",
          3,
          5
        ]
      ]
    ],
    [
      "+",
      1,
      [
        "Dani's",
        "San Franscisco",
        "California",
        1
      ]
    ],
    [
      "-",
      3,
      [
        "Amma's",
        "Manitowish Waters",
        "Wisconsin",
        6
      ]
    ]
  ]
}

export const threeRemoveOneAdd = () => wrap(<TableDiff data={patchStructuredData} />)

threeRemoveOneAdd.story = {
  name: 'basic mixed edits',
  parameters: {
    notes: `remove + add rows, change one cell`
  }
}

const patchColSwap = {
  "stat": {
    "leftNodes": 21,
    "rightNodes": 21,
    "leftWeight": 309,
    "rightWeight": 309,
    "inserts": 8,
    "deletes": 8
  },
  "schemaStat": {
    "leftNodes": 5,
    "rightNodes": 5,
    "leftWeight": 73,
    "rightWeight": 73,
    "inserts": 2,
    "deletes": 2
  },
  "schema": [
    [
      " ",
      0,
      "location_name"
    ],
    [
      "-",
      1,
      "city"
    ],
    [
      "+",
      1,
      "state"
    ],
    [
      "-",
      2,
      "state"
    ],
    [
      "+",
      2,
      "city"
    ],
    [
      " ",
      3,
      "duration_weeks"
    ]
  ],
  "diff": [
    [
      " ",
      0,
      null,
      [
        [
          " ",
          0,
          "Home"
        ],
        [
          "-",
          1,
          "McLean"
        ],
        [
          "+",
          1,
          "Virginia"
        ],
        [
          "-",
          2,
          "Virginia"
        ],
        [
          "+",
          2,
          "McLean"
        ],
        [
          " ",
          3,
          8
        ]
      ]
    ],
    [
      " ",
      1,
      null,
      [
        [
          " ",
          0,
          "Huntley"
        ],
        [
          "-",
          1,
          "Huntley"
        ],
        [
          "+",
          1,
          "Illinois"
        ],
        [
          "-",
          2,
          "Illinois"
        ],
        [
          "+",
          2,
          "Huntley"
        ],
        [
          " ",
          3,
          3
        ]
      ]
    ],
    [
      " ",
      2,
      null,
      [
        [
          " ",
          0,
          "Amma's"
        ],
        [
          "-",
          1,
          "Manitowish Waters"
        ],
        [
          "+",
          1,
          "Wisconsin"
        ],
        [
          "-",
          2,
          "Wisconsin"
        ],
        [
          "+",
          2,
          "Manitowish Waters"
        ],
        [
          " ",
          3,
          6
        ]
      ]
    ],
    [
      " ",
      3,
      null,
      [
        [
          " ",
          0,
          "Casita"
        ],
        [
          "-",
          1,
          "Santa Fe"
        ],
        [
          "+",
          1,
          "New Mexico"
        ],
        [
          "-",
          2,
          "New Mexico"
        ],
        [
          "+",
          2,
          "Santa Fe"
        ],
        [
          " ",
          3,
          5
        ]
      ]
    ]
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
  "stat": {
    "leftNodes": 21,
    "rightNodes": 16,
    "leftWeight": 309,
    "rightWeight": 217,
    "inserts": 5,
    "deletes": 6
  },
  "schemaStat": {
    "leftNodes": 5,
    "rightNodes": 5,
    "leftWeight": 73,
    "rightWeight": 73,
    "inserts": 2,
    "deletes": 2
  },
  "schema": [
    [
      " ",
      0,
      "location_name"
    ],
    [
      "-",
      1,
      "city"
    ],
    [
      "+",
      1,
      "state"
    ],
    [
      "-",
      2,
      "state"
    ],
    [
      "+",
      2,
      "city"
    ],
    [
      " ",
      3,
      "duration_weeks"
    ]
  ],
  "diff": [
    [
      "-",
      0,
      [
        "Home",
        "McLean",
        "Virginia",
        8
      ]
    ],
    [
      " ",
      0,
      null,
      [
        [
          " ",
          0,
          "Huntley"
        ],
        [
          "-",
          1,
          "Huntley"
        ],
        [
          "+",
          1,
          "Illinois"
        ],
        [
          "-",
          2,
          "Illinois"
        ],
        [
          "+",
          2,
          "Huntley"
        ],
        [
          " ",
          3,
          3
        ]
      ]
    ],
    [
      "-",
      1,
      [
        "Amma's",
        "Manitowish Waters",
        "Wisconsin",
        6
      ]
    ],
    [
      " ",
      1,
      null,
      [
        [
          " ",
          0,
          "Casita"
        ],
        [
          "-",
          1,
          "Santa Fe"
        ],
        [
          "+",
          1,
          "NM"
        ],
        [
          "-",
          2,
          "New Mexico"
        ],
        [
          "+",
          2,
          "Santa Fe"
        ],
        [
          " ",
          3,
          5
        ]
      ]
    ],
    [
      "+",
      2,
      [
        "Dani's",
        "California",
        "San Francisco",
        1
      ]
    ]
  ]
}

export const colSwapAndEdits = () => wrap(<TableDiff data={patchColSwapAndEdits} />)

colSwapAndEdits.story = {
  name: 'column swap & edits',
  parameters: {
    notes: `combining both column swap and edits`
  }
}