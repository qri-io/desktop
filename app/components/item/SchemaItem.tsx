import * as React from 'react'
import Icon from '../chrome/Icon'
import DynamicEditField from '../form/DynamicEditField'
import { DataTypes } from './DataType'
import TypePicker from '../structure/TypePicker'
import classNames from 'classnames'

interface SchemaItemProps {
  onAccept?: (field: string) => (value: string) => void
  title: string
  type: DataTypes | DataTypes[]
  description: string
  validation: string
  row: number
  // editable defaults to true
  editable?: boolean
}

const SchemaItemProps: React.FunctionComponent<SchemaItemProps> = ({
  onAccept,
  row,
  title,
  type,
  description,
  validation,
  editable = true
}) => {
  const [expanded, setExpanded] = React.useState(false)

  // TODO (ramfox): do we have max lengths for title, description?
  return (
    <div className={classNames('schema-item', { 'expanded': expanded, 'top': row === 0 })} row={row}>
      <div className='schema-item-icon' onClick={() => setExpanded((prev) => !prev)} >
        <Icon icon={expanded ? 'down' : 'right'} size='md' color='medium'/>
      </div>
      <div>
        <DynamicEditField
          row={row}
          name='title'
          placeholder='title'
          value={title}
          onAccept={onAccept && editable ? onAccept('title') : undefined}
          allowEmpty={false}
          large
          width={150}
          expanded={expanded}
          editable={editable}
        />
      </div>
      <div>
        <TypePicker
          name={row}
          onPickType={onAccept && editable ? onAccept('type') : undefined}
          type={type}
          expanded={expanded}
          editable={editable}
        />
      </div>
      <div>
        <DynamicEditField
          row={row}
          name='description'
          placeholder='description'
          value={description}
          onAccept={onAccept && editable ? onAccept('description') : undefined}
          allowEmpty expanded={expanded}
          width={200}
          editable={editable}
        />
      </div>
      <div>
        <DynamicEditField
          row={row}
          name='validation'
          placeholder='validation'
          value={validation}
          onAccept={onAccept && editable ? onAccept('validation') : undefined}
          allowEmpty expanded={expanded}
          width={100}
          editable={editable}
        />
      </div>
    </div>
  )
}

export default SchemaItemProps
