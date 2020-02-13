import * as React from 'react'

import DiffStat from './DiffStat'

interface LineDiffProps {
  data: any
}

const LineDiff: React.FunctionComponent<LineDiffProps> = (props: LineDiffProps) => {
  const { data } = props

  let leftCount: number, rightCount: number
  return (
    <div className='line_diff'>
      <div className='header'>
        <b>{data.meta['---']}</b>
        <div style={{ 'float': 'right' }}>
          <DiffStat added={data.meta.added} removed={data.meta.removed} />
        </div>
      </div>
      <table className='content'>
        {data.patch.map((p, i) => {
          if (Array.isArray(p[0])) {
            leftCount = p[0][0][0]
            rightCount = p[0][1][0]
            return (
              <tr key={i}>
                <td colSpan="3" className='truncated'>
                  <span>Additional Content Hidden</span>
                </td>
              </tr>
            )
          }

          let changeType
          if (p[0] === '-') {
            leftCount++
            changeType = 'rem'
          } else if (p[0] === '+') {
            rightCount++
            changeType = 'add'
          } else {
            leftCount++
            rightCount++
            changeType = 'ctx'
          }

          return (<tr key={i} className={changeType}>
            <td className="line_count">{ changeType !== 'add' && leftCount}</td>
            <td className="line_count">{ changeType !== 'rem' && rightCount}</td>
            <td className={changeType}>
              <span className="text">{p[1]}</span>
            </td>
          </tr>)
        })}
      </table>
    </div>
  )
}

export default LineDiff
