import React from 'react'

import Dataset from '../../models/dataset'
import { DatasetHandler } from '../../models/handlers'

import BodySegment from './BodySegment'
import StdMeta from './StdMeta'
import ReadmeSegment from './ReadmeSegment'
import DatasetDetailsSubtext from './DatasetDetailsSubtext'
import CommitPreview from './CommitPreview'

interface DatasetOverviewProps {
  data: Dataset

  onClone?: DatasetHandler
  onExport?: DatasetHandler
  onEdit?: DatasetHandler
}

const DatasetOverview: React.FunctionComponent<DatasetOverviewProps> = ({ data, onClone, onExport, onEdit }) => {
  if (!data) { return null }

  const { meta, commit, readme, name } = data
  const title = (meta && meta.title) ? meta.title : name
  function handler (fn: DatasetHandler) {
    return (e: React.SyntheticEvent) => fn(data, e)
  }

  return (
    <div className='dataset_overview'>
      <header>
        <div className='text'>
          <h2 className='title'>{title}</h2>
          <DatasetDetailsSubtext data={data} noTimestamp />
        </div>
        <div className='right'>
          {onClone && <button type='button' onClick={handler(onClone)}>Clone</button>}
          {onExport && <button type='button' onClick={handler(onExport)}>Export</button>}
          {onEdit && <button type='button' onClick={handler(onEdit)}>Edit</button>}
        </div>
      </header>
      <div id='dataset' className='tab-pane active'><br />
        <StdMeta data={meta} />
        <CommitPreview data={commit} />
        <BodySegment data={data} />
        <ReadmeSegment data={readme} />
      </div>
    </div>
  )
}

export default DatasetOverview
