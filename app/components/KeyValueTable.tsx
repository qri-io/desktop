import * as React from 'react'

interface KeyValueTableProps {
  data: any
  filterKeys?: string[]
}

const KeyValueTable: React.FunctionComponent<KeyValueTableProps> = ({ data, filterKeys }) => (
  <div className='keyvalue-table-wrap'>
    <table className='keyvalue-table'>
      <tbody>
        {Object.keys(data).map((key) => {
          if (filterKeys && filterKeys.includes(key)) return null
          const value = data[key]

          return (
            <tr key={key} className='keyvalue-table-row'>
              <td className='keyvalue-table-key'>{key}</td>
              <td>{value}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
)

export default KeyValueTable
