import * as React from 'react'
import { Meta } from '../models/dataset'

interface MetadataProps {
  meta: Meta
}

const Metadata: React.FunctionComponent<MetadataProps> = (props: MetadataProps) => {
  return (
    <div className='content'>
      <pre>{JSON.stringify(props.meta, null, 2)}</pre>
    </div>
  )
}

export default Metadata
