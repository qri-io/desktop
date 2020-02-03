import * as React from 'react'

import Close from '../chrome/Close'
import SearchBox from '../chrome/SearchBox'
import SearchResult from '../item/SearchResult'

interface SearchModalProps {
  q: string
  onSearch: (q: string) => any
  results: Array<Record<string, any>>
}

const SearchModal: React.FunctionComponent<SearchModalProps> = ({ q, results, onSearch }) => {
  return (
    <div className='search_modal'>
      <header>
        <Close right />
        <label className='window_name'>Search Qri</label>
        <SearchBox onChange={(e) => { onSearch(e.target.value) }} />
        {q && <p className='response_description'>{results.length} {results.length === 1 ? 'result' : 'results'} for <i>{q}</i></p>}
      </header>
      <div className='results'>
        {q && (results.length !== 0) && results.map((result, i) => <SearchResult key={i} data={result} />)}
        {q && !results.length && <h4 className='no_results'>No Results</h4>}
      </div>
    </div>
  )
}

export default SearchModal
