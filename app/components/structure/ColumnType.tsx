import * as React from 'react'
import classNames from 'classnames'
import { DataTypes } from '../item/DataType'

import Icon from '../chrome/Icon'

export interface ColumnTypeProps {
  type: DataTypes | DataTypes[]
  onClick: (e) => void
  active?: boolean
  expanded?: boolean
}

const ColumnType: React.FunctionComponent<ColumnTypeProps> = ({
  type = 'any',
  onClick,
  active = false,
  expanded = false
}) => {
  let shownType = ''
  if (Array.isArray(type)) {
    if (type.length > 1) {
      shownType = 'multi'
<<<<<<< HEAD
    } else if (type.length === 0) {
      shownType = 'any'
=======
>>>>>>> feat(components): add components that build to create TypePicker
    } else {
      shownType = type[0]
    }
  } else shownType = type

  const renderColumnType = (type: string, i: number, className: string) => {
    return (
      <div key={i} className={className}>
        <span className='label large'>{type}</span> <Icon icon={type === 'multi' ? 'unknown' : type} size='sm' color='medium'/>
      </div>
    )
  }

  return <div
    className={classNames('column-type', { 'clickable': !!onClick, 'active': active })}
    onClick={onClick}
    tabIndex={0}
  >
    { typeof type === 'string' || expanded === false
      ? renderColumnType(shownType, 0, '')
      : type.map((t: string, i: number) => {
        return renderColumnType(t, i, 'multi')
      })
    }
  </div>
}

export default ColumnType
