import * as React from 'react'
import Icon from '../chrome/Icon'
import DynamicEditField from '../form/DynamicEditField'
import { DataTypes } from './DataType'
import TypePicker from '../structure/TypePicker'
import classNames from 'classnames'

interface SchemaItemProps {
  onAccept: (field: string) => (value: string) => void
  title: string
  type: DataTypes | DataTypes[]
  description: string
  validation: string
  row: number
}

const SchemaItemProps: React.FunctionComponent<SchemaItemProps> = ({
  onAccept,
  row,
  title,
  type,
  description,
  validation
}) => {
  const [expanded, setExpanded] = React.useState(false)

  // TODO (ramfox): do we have max lengths for title, description?

  return (
    <div className={classNames('schema-item', { 'expanded': expanded })}>
      <div className='schema-item-icon' onClick={() => setExpanded((prev) => !prev)} >
        <Icon icon={expanded ? 'down' : 'right'} size='md' color='medium'/>
      </div>
      <div>
        <DynamicEditField placeholder='title' value={title} onAccept={onAccept('title')} allowEmpty={false} />
      </div>
      <div>
        <TypePicker name={row} onPickType={onAccept('type')} type={type} expanded={expanded} />
      </div>
      <div>
        <DynamicEditField name='description' placeholder='description' value={description} onAccept={onAccept('description')} allowEmpty expanded={expanded}/>
      </div>
      <div>
        <DynamicEditField placeholder='validation' value={validation} onAccept={onAccept('validation')} allowEmpty expanded={expanded}/>
      </div>
    </div>
  )
}

export default SchemaItemProps
