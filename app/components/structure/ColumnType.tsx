import * as React from 'react'
import classNames from 'classnames'
import { DataTypes } from '../item/DataType'

import Icon from '../chrome/Icon'

export interface ColumnTypeProps {
  type: DataTypes | DataTypes[]
  onClick: (e) => void
  active?: boolean
}

const ColumnType: React.FunctionComponent<ColumnTypeProps> = ({
  type = 'any',
  onClick,
  active = false
}) => {
  let shownType = ''
  if (Array.isArray(type)) {
    if (type.length > 1) {
      shownType = 'multi'
    } else if (type.length === 0) {
      shownType = 'any'
    } else {
      shownType = type[0]
    }
  } else shownType = type

  return <div
    className={classNames('column-type', { 'clickable': !!onClick, 'active': active })}
    onClick={onClick}
    tabIndex={0}
  >
    <span className='label large'>{shownType}</span> <Icon icon={shownType === 'multi' ? 'unknown' : shownType} size='sm' color='medium'/>
  </div>
}

export default ColumnType
