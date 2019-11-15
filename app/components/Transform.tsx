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

const Transform: React.FunctionComponent<TransformProps> = (props) => {
  const { value } = props

  return (
    <Code data={value} />
  )
}

export default Transform
