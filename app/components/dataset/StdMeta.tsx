import React from 'react'

import Icon from '../chrome/Icon'
import Meta from '../../models/dataset'

export interface StdMetaProps {
  data: Meta
}

const StdMeta: React.FunctionComponent<StdMetaProps> = ({ data }) => {
  if (!data) { return null }
  // TODO (b5) - this component was factored out of qri cloud & could use some refactoring.
  // We don't use bootstrap on desktop

  // default placeholders for meta elements
  let themeElements: string | JSX.Element[] = 'none'
  let keywordElements: string | JSX.Element[] = 'none'
  let descriptionString = 'no description'
  const { description, keywords, theme } = data

  if (description) descriptionString = description

  if (theme) {
    themeElements = theme.map((themeItem: string) => (
      <div key={themeItem} className='theme badge badge-info mr-1'>{themeItem}</div>
    ))
  }

  if (keywords && keywords.length) {
    keywordElements = keywords.map((keyword: string) => (
      <div key={keyword} className='keyword badge badge-secondary mr-1'>{keyword}</div>
    ))
  }

  return (<div className='row ml-0 mr-0 mb-3'>
    <div className='col-12 border rounded-top p-3'>
      <Icon icon='meta' />
    </div>
    <div className='col-12 border-left border-right border-bottom p-3 d-flex flex-column'>
      <div className='d-flex flex-row justify-content-between'>
        <div className='mb-3'>
          <h4>Theme</h4>
          {themeElements}
        </div>
        <div className='mb-3 text-md-right'>
          <h4>Keywords</h4>
          {keywordElements}
        </div>
      </div>
      <div>
        <h4>Description</h4>
        <p>{descriptionString}</p>
      </div>
    </div>
  </div>)
}

export default StdMeta
