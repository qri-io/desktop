import * as React from 'react'
import { Dataset } from '../models/dataset'
import SpinnerWithIcon from './chrome/SpinnerWithIcon'

interface SchemaProps {
  schema: Dataset['schema']
}

const Schema: React.FunctionComponent<SchemaProps> = (props: SchemaProps) => {
  if (!props.schema) {
    return <SpinnerWithIcon loading={true} />
  }

  return (
    <div className='content'>
      <pre>{JSON.stringify(props.schema, null, 2)}</pre>
    </div>
  )
}

export default Schema
