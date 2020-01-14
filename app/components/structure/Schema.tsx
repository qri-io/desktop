import * as React from 'react'
import { Schema as ISchema } from '../../models/dataset'
import SchemaItem from '../item/SchemaItem'

interface SchemaProps {
  schema: ISchema | undefined
  onAccept?: (row: number) => (field: string) => any
  // defaults to true
  editable: boolean
}

const Schema: React.FunctionComponent<SchemaProps> = ({
  schema,
  onAccept,
  editable = true
}) => {
  if (!schema) {
    return <div className='margin'>No schema specified</div>
  }
  if (!schema.items || !schema.items.items) {
    return <div>Invalid schema</div>
  }

  const items = schema.items.items

  return (
    <div className='schema-wrap'>
      <div className='schema-header'>
        <div>title</div>
        <div>type</div>
        <div>description</div>
        <div>validation</div>
      </div>
      {items.map((item, i: number) => {
        return (
          <div key={i}>
            <SchemaItem
              row={i}
              onAccept={onAccept ? onAccept(i) : undefined}
              title={item.title || ''}
              type={item.type || 'any'}
              description={item.description || ''}
              validation={item.validation || ''}
              editable={editable}
            />
          </div>
        )
      })}
    </div>
  )
}

export default Schema
