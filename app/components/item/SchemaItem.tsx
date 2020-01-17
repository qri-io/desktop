import * as React from 'react'
import Icon from '../chrome/Icon'
import DynamicEditField from '../form/DynamicEditField'
import { DataTypes } from './DataType'
import TypePicker from '../structure/TypePicker'
import classNames from 'classnames'

interface SchemaItemProps {
  onChange?: (schemaItem: SchemaItemType, e: React.SyntheticEvent) => void
  // editable defaults to true
  editable?: boolean
  data: SchemaItemType
}

export interface SchemaItemType {
  row: number
  title: string
  type: DataTypes | DataTypes[]
  description: string
  validation: string
}

const SchemaItemProps: React.FunctionComponent<SchemaItemProps> = ({
  onChange,
  data,
  editable = true
}) => {
  const [expanded, setExpanded] = React.useState(false)

  const handleDynamicEditChange = (name: string, value: string, e: React.SyntheticEvent) => {
    const d = { ...data }
    switch (name) {
      case 'title':
        d.title = value
        break
      case 'description':
        d.description = value
        break
      case 'validation':
        d.validation = value
        break
    }

    if (onChange) onChange(d, e)
  }

  const handleTypePickerChange = (value: DataTypes, e: React.SyntheticEvent) => {
    const d = { ...data }
    d.type = value
    if (onChange) onChange(d, e)
  }

  // TODO (ramfox): do we have max lengths for title, description?
  return (
    <div className={classNames('schema-item', { 'expanded': expanded, 'top': data.row === 0 })} key={data.row}>
      <div className='schema-item-icon' onClick={() => setExpanded((prev) => !prev)} >
        <Icon icon={expanded ? 'down' : 'right'} size='md' color='medium'/>
      </div>
      <div>
        <DynamicEditField
          row={data.row}
          name='title'
          placeholder='title'
          value={data.title || ''}
          onChange={onChange && editable ? handleDynamicEditChange : undefined}
          allowEmpty={false}
          large
          width={150}
          expanded={expanded}
          editable={editable}
        />
      </div>
      <div>
        <TypePicker
          name={data.row}
          onPickType={onChange && editable ? handleTypePickerChange : undefined}
          type={data.type}
          expanded={expanded}
          editable={editable}
        />
      </div>
      <div>
        <DynamicEditField
          row={data.row}
          name='description'
          placeholder='description'
          value={data.description || ''}
          onChange={onChange && editable ? handleDynamicEditChange : undefined}
          allowEmpty expanded={expanded}
          width={200}
          editable={editable}
        />
      </div>
      <div>
        <DynamicEditField
          row={data.row}
          name='validation'
          placeholder='validation'
          value={data.validation || ''}
          onChange={onChange && editable ? handleDynamicEditChange : undefined}
          allowEmpty expanded={expanded}
          width={100}
          editable={editable}
        />
      </div>
    </div>
  )
}

export default SchemaItemProps
