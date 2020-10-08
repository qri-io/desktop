import React from 'react'

import { Structure, Commit } from '../../models/dataset'

import CommitDetails from '../CommitDetails'

interface DatasetHeaderProps {
  path: string
  structure: Structure
  commit: Commit
}

const DatasetHeader: React.FC<DatasetHeaderProps> = ({
  path,
  structure,
  commit
}) => (
  <div className='commit-details-header'>
    {structure && commit && (
      <CommitDetails
        bodyRows={structure.entries}
        bodySize={structure.length}
        commitTime={commit.timestamp}
        commitTitle={commit.title}
        path={path}
      />
    )}
  </div>
)

export default DatasetHeader
