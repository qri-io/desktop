import React from 'react'
import numeral from 'numeral'

import Icon from '../chrome/Icon'
import ListItem from '../chrome/ListItem'
import RelativeTimestamp from '../RelativeTimestamp'
import DatasetStat from './DatasetStat'

interface DatasetSummaryProps {
  dataset: any
  onClick: (username: string, name: string) => void
}

const DatasetSummary: React.FunctionComponent<DatasetSummaryProps> = ({ dataset, onClick }) => {
  const {
    path,
    peername,
    name,
    meta,
    structure,
    commit,
    stats,
    issue_stats: { open_issues: openIssues },
    follow_stats: { follow_count: followCount }
  } = dataset

  const title = meta && meta.title ? meta.title : `No Title - ${name}`
  const description = meta && meta.description ? meta.description : `No Description`

  const { entries, format, length } = structure
  const { timestamp } = commit
  const { download_count: downloadCount, pull_count: pullCount } = stats
  const displayDownloads = downloadCount + pullCount // eslint-disable-line

  let keywordElements

  if (meta && meta.keywords) {
    keywordElements = meta.keywords.map((keyword: string) => (
      <div key={keyword} className='keyword badge badge-secondary'>{keyword}</div>
    ))
  }

  return (
    <ListItem key={path} onClick={() => { onClick(peername, name) }}>

      <div className='row dataset-summary'>
        <div className='col-12 pb-1'>
          <div className='row'>
            <div className='dataset-summary-reference col-6'>
              {peername}/{name}
            </div>
            <div className='metrics text-right col-6'>
              {(followCount > 0) && (
                <DatasetStat title='followers' icon='eye' value={followCount} />
              )}
              {(openIssues > 0) && (
                <DatasetStat title='open issues' icon='circle' value={openIssues} />

              )}
              <DatasetStat title='downloads' icon='download' value={displayDownloads} />
            </div>
          </div>
        </div>
        <div className='title col col-12'>
          { title }
        </div>
        <div className='description col-12 mb-2'>
          {description}
        </div>
        <div className='col-12 col-md-6 mb-2 mb-md-0'>
          <span className='dataset-details'><Icon icon='clock' size='sm'/><RelativeTimestamp timestamp={timestamp}/></span>
          <span className='dataset-details'><Icon icon='hdd' size='sm'/>{numeral(length).format('0.0b')}</span>
          <span className='dataset-details'><Icon icon='bars' size='sm'/>{numeral(entries).format('0,0')} rows</span>
          <span className='dataset-details'><Icon icon='file' size='sm'/>{format}</span>
        </div>
        <div className='keyword-container col-12 col-md-6 text-md-right'>
          {keywordElements}
        </div>
      </div>
    </ListItem>
  )
}

export default DatasetSummary
