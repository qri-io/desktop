import * as React from 'react'
import ReactJson from 'react-json-view'

import { Dataset } from '../models/dataset'
import SpinnerWithIcon from './chrome/SpinnerWithIcon'

interface SchemaProps {
  schema: Dataset['schema']
}

const Schema: React.FunctionComponent<SchemaProps> = ({ schema }) => {
  if (!schema) {
    return <SpinnerWithIcon loading={true} />
  }

  return (
    <div className='content'>
      <ReactJson
        name={null}
        src={schema}
        enableClipboard={false}
        displayDataTypes={false}
      />
    </div>
  )
}

export default Schema
