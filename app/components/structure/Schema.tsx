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
    <table id='schema-wrap' style={{ width: '100%' }}>
      <tr className='schema-header'>
        <th></th>
        <th>title</th>
        <th className='type-picker-header'>type</th>
        <th>description</th>
        <th>validation</th>
      </tr>
      {items.map((item: SchemaItemType, i: number) => {
        return (
          <SchemaItem
            onChange={onChange ? onChangeHandler : undefined}
            data={{ ...item, row: i }}
            editable={editable}
            key={i}
          />
        )
      })}
    </table>
  )
}

export default Schema
