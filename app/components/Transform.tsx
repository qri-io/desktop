import * as React from 'react'

import { WorkingDataset } from '../models/store'
import { ApiActionThunk } from '../store/api'

import Code from './Code'

export interface TransformProps {
  peername: string
  name: string
  value: string
  preview: string
  history: boolean
  workingDataset: WorkingDataset
  write: (peername: string, name: string, dataset: any) => ApiActionThunk
}

// TODO (b5) - setting a default value here b/c we're getting null value from
// somewhere when we click workbench/transform component. need to investigate
// and not pass a nonexistent value, ever.
const Transform: React.FunctionComponent<TransformProps> = ({ value = '' }) => {
  return <Code data={value} />
}

export default Transform
