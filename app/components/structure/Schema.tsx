import * as React from 'react'
import { Schema as ISchema } from '../../models/dataset'
import SchemaItem from '../item/SchemaItem'

interface SchemaProps {
  schema: ISchema
  onAccept: (row: number) => (field: string) => any
}

const Schema: React.FunctionComponent<SchemaProps> = ({
  schema,
  onAccept
}) => {
  if (!schema || !schema.items || !schema.items.items) {s
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
              onAccept={onAccept(i)}
              title={item.title || ''}
              type={item.type || 'any'}
              description={item.description || ''}
              validation={item.validation || ''}
            />
          </div>
        )
      })}
    </div>
  )
}

export default Schema
