import React, { useState } from 'react'

interface TableDiffProps {
  data: any
}

const initialState: Record<string, any> = {}

const TableDiff: React.FunctionComponent<TableDiffProps> = (props: TableDiffProps) => {
  const { data } = props
  const [opened, setOpened] = useState(initialState)

  let count: number
  return (
    <div className='table_diff'>
      <div className='header'>
        <b>{data.meta['---']}</b>
        <div style={{ 'float': 'right' }}>
          <a onClick={() => setOpened({ 'all': !(opened['all']) })}>{ opened['all'] ? 'collapse all changes' : 'expand all changes'}</a>
          <ChangeStat added={data.meta.added} removed={data.meta.removed} />
        </div>
      </div>
      <table className='content'>
        <thead>
          <tr>
            <th className="line_count">#</th>
            <th className="data">1</th>
            <th className="data">2</th>
            <th className="data">3</th>
          </tr>
        </thead>
        <tbody>
          {data.patch.map((p, i) => {
            if (Array.isArray(p[0])) {
              count = 1
              // leftCount = p[0][0][0]
              // rightCount = p[0][1][0]
              return (
                <tr key={i}>
                  <td colSpan={4} className='truncated'>
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
                    {p[1].map((el, i) => (<td key={i} className="rem">{el}</td>))}
                  </tr>
                )
              }

              return (
                <tr key={i} className={'collapsed_row'} onClick={() => {
                  const key = `${i}`
                  const open = (opened[key])
                  setOpened({ [key]: !open })
                }}><td colSpan={4} className="rem"></td>
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
              {p.length === 2 && p[1].map((el, i) => {
                return <td key={i}>{el}</td>
              })}
              {p.length === 3 && foldRowChanges(p[2]).map((change, i) => {
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

    const change = { type, value: a[1] }
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

interface ChangeStatProps {
  added: number
  removed: number
}

const ChangeStat: React.FunctionComponent<ChangeStatProps> = (props: ChangeStatProps) => {
  const { added, removed } = props
  return (
    <span className="change_stat">
      <b className="add">+{added}</b>
      <b className="rem">-{removed}</b>
    </span>
  )
}

export default TableDiff
