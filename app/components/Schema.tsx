import * as React from 'react'
import Schema as EditableSchema from './structure/schema'
import ReactJson from 'react-json-view'

interface SchemaProps {
  schema: any | undefined
}

const Schema: React.FunctionComponent<SchemaProps> = ({ schema }) => {
  if (!schema) {
    return <div className='margin'>No schema specified</div>
  }

  // render TwoDSchemaLayout only if schema meets specific criteria
  const is2D = schema && schema.items && schema.items.items

  const schemaContent = is2D
    ? <EditableSchema schema={schema} />
    : <ReactJson
      name={null}
      src={schema}
      enableClipboard={false}
      displayDataTypes={false}
    />

  return (
    <div className='content'>
      {schemaContent}
    </div>
  )
}

export default Schema
