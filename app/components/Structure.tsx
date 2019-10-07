import * as React from 'react'
import Schema from './Schema'

interface StructureProps {
  schema: any
  structure: any
}

const Structure: React.FunctionComponent<StructureProps> = ({ schema, structure }) => {
  const details = structure ? Object.keys(structure).map((key: string, i: number) => {
    if (key === 'schema') return
    return <p key={i} className='structure-indent' ><strong>{key}</strong>: {structure[key]}</p>
  }) : undefined
  return (
    <div className='content'>
      <div>
        <h3>Configuration</h3>
        <div>
          {details}
        </div>
      </div>
      <div>
        <h3>Schema</h3>
        <Schema schema={schema} />
      </div>
    </div>
  )
}

export default Structure
