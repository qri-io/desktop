import React from 'react'

import DatasetSummary from './DatasetSummary'

interface FeaturedDatasets {
  datasets: any[]
  onClick: () => void
}

const FeaturedDatasets: React.FunctionComponent<FeaturedDatasets> = ({ datasets = [], onClick }) => {
  if (!datasets) {
    datasets = []
  }

  const listItems = datasets.map((dataset) => (
    <div key={dataset.path} className='card-col col-12 col-md-6'>
      <DatasetSummary dataset={dataset} onClick={onClick}/>
    </div>
  ))

  return (
    <div className='featured-datasets list row d-flex align-items-stretch'>
      {(listItems.length !== 0) ? listItems : <NoDatasets />}
    </div>
  )
}

const NoDatasets: React.FunctionComponent = () => (
  <h4>No Datasets!</h4>
)

export default FeaturedDatasets
