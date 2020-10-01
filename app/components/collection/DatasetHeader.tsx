import React from 'react'

import { Structure, Commit } from '../../models/dataset'

import CommitDetails from '../CommitDetails'

interface DatasetHeaderProps {
  path: string
  structure: Structure
  commit: Commit
}

const DatasetHeader: React.FunctionComponent<DatasetHeaderProps> = ({ path, structure, commit }) => {
  return (
    <div className='commit-details-header'>
      {
        structure && commit && (
          <CommitDetails structure={structure} commit={commit} path={path} />
        )
      }
    </div>
  )
}

export default DatasetHeader
