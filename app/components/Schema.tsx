import * as React from 'react'
import { Dataset } from '../models/dataset'

interface SchemaProps {
  schema: Dataset['schema']
}

const Schema: React.FunctionComponent<SchemaProps> = (props: SchemaProps) => {
  console.log('SCHEMA RENDER')
  return (
    <div className='content'>
      <pre>{JSON.stringify(props.schema, null, 2)}</pre>
    </div>
  )
}

export default Schema
