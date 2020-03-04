import React from 'react'

export interface TableDiffSchemaHeadProps {
  data: any[]
}

const TableDiffSchemaHead: React.FC<TableDiffSchemaHeadProps> = ({ data }) => {
  if (!data) {
    return null
  }

  return (
    <thead>
      <tr>
        <th className="line_count">#</th>
        {data.map((change, i) => {
          return <th key={i} className={change.type}>
            {change.prev && <span className='rem'>{change.prev.value}</span>}
            {change.value}
          </th>
        })}
      </tr>
    </thead>
  )
}

export default TableDiffSchemaHead
