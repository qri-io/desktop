import React from 'react'
import moment from 'moment'
import numeral from 'numeral'
import { SearchResult } from '../../models/search'

interface SearchResultItemProps {
  data: SearchResult
}

const DatasetResult: React.FunctionComponent<SearchResultItemProps> = ({ data }) => {
  const { name, path, peername, meta, structure = {}, commit = {} } = data.Value
  const title = (meta && meta.title) ? meta.title : `No Title - ${name}`

  const { entries = 0, length = 0 } = structure
  const { timestamp = 0 } = commit

  return (
    <div className='dataset_item' key={path}>
      <a className='reference-link' href={`/${peername}/${name}`}>{peername}/{name}</a>
      {meta && meta.theme && <div className='themes'>
        {meta.theme.map((keyword: string) => (
          <div key='theme' className='theme badge badge-secondary ml-2'>{keyword}</div>
        ))}
      </div>}
      <div className='title'>{ title }</div>
      <div className='details'>
        <span className='detail'>{moment(timestamp).fromNow()}</span>
        <span className='detail'>{numeral(length).format('0.0b')}</span>
        <span className='detail'>{numeral(entries).format('0,0')} Entries</span>
      </div>
    </div>
  )
}

const SearchResultItem: React.FunctionComponent<SearchResultItemProps> = ({ data }) => {
  switch (data.Type) {
    case 'dataset':
      return <DatasetResult data={data} />
    default:
      return <div><i>unknown search result type</i></div>
  }
}

export default SearchResultItem
