import React from 'react'
import Icon from '../chrome/Icon'
import TypePicker from '../structure/TypePicker'
import { StatDiffDetails } from '../changes/StatDiffDetails'
import { IColumnStatsChanges } from '../../models/changes'

interface ExpandableTableRowProps {
  row: number
  startExpanded?: boolean
  expandedContent?: JSX.Element
  status: 'added' | 'removed' | string
}

export const ExpandableTableRow: React.FC<ExpandableTableRowProps> = (props) => {
  const {
    row,
    status,
    startExpanded = false,
    expandedContent
  } = props

  const [expanded, setExpanded] = React.useState(startExpanded)

  let backgroundColor = 'transparent'
  if (status === 'added') {
    backgroundColor = '#C9E2C7'
  }
  if (status === 'removed') {
    backgroundColor = 'E2C7C7'
  }

  return <>
    <tr
      style={{
        borderBottom: expanded ? 'none' : '2px solid #E0E0E0',
        height: 50,
        background: backgroundColor
      }}
      key={row}
    >
      <td
        style={{ width: 20 }}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <Icon icon={expanded ? 'down' : 'right'} size='md' color='medium'/>
      </td>
      {props.children}
    </tr>
    {expandedContent && expanded && <tr style={{ borderBottom: '2px solid #E0E0E0' }}>
      <td colSpan={100}>
        {expandedContent}
      </td>
    </tr>}
  </>
}

export interface StatDiffRowProps {
  key: number
  last?: boolean
  startExpanded?: boolean
  data: IColumnStatsChanges
}

const StatDiffRow: React.FunctionComponent<StatDiffRowProps> = ({
  data,
  key,
  startExpanded = false
}) => {
  // TODO (ramfox): do we have max lengths for title, description?
  return (
    <ExpandableTableRow
      row={key}
      startExpanded={startExpanded}
      expandedContent={<StatDiffDetails data={data}/>}
    >
      <td style={{ paddingLeft: 30 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 16 }}>{data.title}</div>
      </td>
      <td className='type-picker-cell' style={{ width: 120 }}>
        <TypePicker
          name={key}
          editable={false}
          type={data.left.type || data.right.type}
        />
      </td>
      <td style={{ textAlign: 'right', paddingRight: 10 }}>
        <div>changes bar</div>
      </td>
    </ExpandableTableRow>
  )
}

export default StatDiffRow
