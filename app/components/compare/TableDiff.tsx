import React from 'react'

import TableDiffSchemaHead from './TableDiffSchemaHead'
import DiffStat from './DiffStat'

interface TableDiffProps {
  data: any
}

const initialState: Record<string, any> = { 'all': true }

const TableDiff: React.FunctionComponent<TableDiffProps> = ({ data }) => {
  if (!data) {
    return null
  }

  const [opened, setOpened] = React.useState(initialState)

  const schema = foldRowChanges(data.schema)
  const colCount = schema.length + 1

  let count = 0
  return (
    <div className='table_diff'>
      <div className='header'>
        {/* <b>{data.meta['---']}</b> */}
        <div style={{ 'float': 'right' }}>
          <a onClick={() => setOpened({ 'all': !(opened['all']) })}>{ opened['all'] ? 'collapse all changes' : 'expand all changes'}</a>
          <DiffStat data={data.stat} />
        </div>
      </div>
      <table className='content'>
        {data.schema && <TableDiffSchemaHead data={schema} />}
        <tbody>
          {data.diff.map((p, i) => {
            if (Array.isArray(p[0])) {
              count = 1
              // leftCount = p[0][0][0]
              // rightCount = p[0][1][0]
              return (
                <tr key={i}>
                  <td colSpan={colCount} className='truncated'>
                    <span>Additional Content Hidden</span>
                  </td>
                </tr>
              )
            }

            let changeType
            if (p[0] === '-') {
              changeType = 'rem'
              const open = (opened[`${i}`] || opened['all'])
              if (open) {
                return (
                  <tr key={i} className={'previous_row'} onClick={() => {
                    const key = `${i}`
                    const open = (opened[key])
                    setOpened({ [key]: !open })
                  }}>
                    <td className="line_count rem">
                      <div className="line_num">{count + 1}</div>
                    </td>
                    {p[2].map((el, i) => (<td key={i} className="rem">{el}</td>))}
                  </tr>
                )
              }

              return (
                <tr key={i} className={'collapsed_row'} onClick={() => {
                  const key = `${i}`
                  const open = (opened[key])
                  setOpened({ [key]: !open })
                }}><td colSpan={colCount} className="rem"></td>
                </tr>
              )
            } else if (p[0] === '+') {
              count++
              changeType = 'add'
            } else {
              count++
              changeType = 'ctx'
            }

            return (<tr key={i} className={changeType}>
              <td className="line_count">
                <div className="line_num">{count}</div>
              </td>
              {p.length === 3 && p[2].map((el, i) => {
                return <td key={i}>{el}</td>
              })}
              {p.length === 4 && foldRowChanges(p[3]).map((change, i) => {
                const row = count
                const col = i
                return <td key={i} className={change.type}>
                  {change.prev && <div className={`${(opened[`${row}.${col}`] || opened['all']) ? 'previous_cell' : 'collapsed_cell'} rem`} onClick={() => {
                    const key = `${row}.${col}`
                    const open = (opened[key])
                    setOpened({ [key]: !open })
                  }}>{change.prev.value}</div>}
                  {change.value}
                </td>
              })}
            </tr>)
          })}
        </tbody>
      </table>
    </div>
  )
}

const foldRowChanges = (patch: any[]): any[] => {
  let prev: any
  return patch.reduce((acc: any[], a) => {
    let type: string
    if (a[0] === '-') {
      type = 'rem'
    } else if (a[0] === '+') {
      type = 'add'
    } else {
      type = 'ctx'
    }

    const change = { type, value: a[2] }
    if (change.type === 'rem') {
      prev = change
      return acc
    }

    if (prev) {
      change.prev = prev
      prev = undefined
    }

    acc.push(change)
    return acc
  }, [])
}

export default TableDiff
