import React from 'react'
import Icon from '../chrome/Icon'

export type DataTypes = 'string' | 'integer' | 'number' | 'boolean' | 'null' | 'any' | 'array' | 'object' | 'numeric'

interface DataTypeProps {
  type: DataTypes
  description: string
  width?: number
}

const DataType: React.FunctionComponent<DataTypeProps> = ({
  type = 'unknown',
  description = 'unknown',
  width = 200
}) => {
  return (<div className='data-type' style={{ width }}>
    <div className='type-wrap'>
      <div className='label large'>{type}</div>
      <Icon icon={type} size='sm' color='medium' />
    </div>
    <div className='description small'>
      {description}
    </div>
  </div>)
}

export default DataType
