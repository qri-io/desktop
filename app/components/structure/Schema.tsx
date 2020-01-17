import * as React from 'react'
import { Schema as ISchema } from '../../models/dataset'
import SchemaItem, { SchemaItemType } from '../item/SchemaItem'

interface SchemaProps {
  data: ISchema | undefined
  onChange?: (schema: ISchema, e: React.ChangeEvent) => void
  // defaults to true
  editable: boolean
}

const Schema: React.FunctionComponent<SchemaProps> = ({
  data,
  onChange,
  editable = true
}) => {
  if (!data) {
    return <div className='margin'>No schema specified</div>
  }
  if (!data.items || !data.items.items) {
    return <div>Invalid schema</div>
  }

  const items = data.items.items

  const onChangeHandler = (schemaItem: SchemaItemType, e: React.ChangeEvent) => {
    const s = { ...data }
    // don't pass back 'row'
    s.items.items[schemaItem.row] = { ...schemaItem, row: undefined }
    if (onChange) onChange(s, e)
  }

  return (
    <div className='schema-wrap'>
      <div className='schema-header'>
        <div>title</div>
        <div>type</div>
        <div>description</div>
        <div>validation</div>
      </div>
      {items.map((item: SchemaItemType, i: number) => {
        return (
          <div key={i}>
            <SchemaItem
              onChange={onChange ? onChangeHandler : undefined}
              data={{ ...item, row: i }}
              editable={editable}
            />
          </div>
        )
      })}
    </div>
  )
}

export default Schema
