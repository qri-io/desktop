import React from 'react'

interface KeyValueTableProps {
  data: any
  filterKeys?: string[]
  index: number
}

const KeyValueTable: React.FunctionComponent<KeyValueTableProps> = ({ data, filterKeys, index = 0 }) => (
  <div className='keyvalue-table-wrap'>
    <table className='keyvalue-table'>
      <tbody>
        {Object.keys(data).map((key) => {
          if (filterKeys && filterKeys.includes(key)) return null
          const value = data[key]

          return (
            <tr key={key} className={`keyvalue-table-row ${key}-${index}`}>
              <td className='keyvalue-table-key'>{key}</td>
              <td className='keyvalue-table-value'>{value}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
)

export default KeyValueTable
