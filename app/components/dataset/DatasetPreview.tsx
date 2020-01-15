import React from 'react'
import numeral from 'numeral'
import { formatDistance } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faExternalLinkAlt, faGlasses, faTh, faTags } from '@fortawesome/free-solid-svg-icons'
import { faClipboard } from '@fortawesome/free-regular-svg-icons'

import Dataset from '../models/dataset'
import BodySegment from './BodySegment'
import ReadmeSegment from './ReadmeSegment'
// import DatasetHeader from '../ui/DatasetHeader'
// import { fileSize } from '../util/humanize'

interface DatasetPreviewProps {
  dataset: Dataset
  peername?: string
  name?: string
  hash?: string
  readme?: HTMLElement
}

const DatasetPreview: React.FunctionComponent<DatasetPreviewProps> = (props) => {
  const { peername, name, dataset, readme } = props
  const { meta, structure, commit } = dataset

  // default placeholders for meta elements
  let themeElements: string | JSX.Element[] = 'none'
  let keywordElements: string | JSX.Element[] = 'none'
  let titleString = `No title - ${name}`
  let descriptionString = 'no description'

  if (meta) {
    const { title, description, keywords, theme } = meta

    if (title) titleString = title
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
  }

  return (
    <div className='container flex-grow-1 flex-shrink-0'>
      {/* <DatasetHeader peername={peername} name={name} hash={hash} active={'overview'} /> */}
      <div id='dataset' className='tab-pane active'><br />
        <div className='row dataset-overview-header'>
          <div className='col-12 col-md-8 mb-3'>
            <h3>{titleString}</h3>
          </div>
          <div className='col col-md-4 mb-3 text-md-right'>
            <button
              type='button'
              className='btn btn-download'
              role='button'
              data-toggle='popover'
            >
              Clone Dataset
            </button>
          </div>
        </div>

        <div className='card mb-3'>
          <div className='card-body p-2 d-flex flex-wrap'>
            <div className='dataset-details mr-3 mt-1 mb-1'>{numeral(structure.entries).format('0,0')} entries</div>
            {/* <div className='dataset-details mr-3 mt-1 mb-1'>{fileSize(structure.length)} size</div> */}
            <div className='dataset-details mr-3 mt-1 mb-1'>{structure.format.toUpperCase()} format</div>
            <div className='dataset-details mt-1 mb-1 flex-fill text-md-right'>latest commit: {formatDistance(new Date(commit.timestamp), new Date())} ago</div>
          </div>
        </div>

        {readme && <div className='row ml-0 mr-0 mb-3'>
          <div className='col-12 border rounded-top p-3'>
            <FontAwesomeIcon icon={faGlasses} />   <strong className='ml-2'>Readme</strong>
          </div>
          <div className='col-12 border-left border-right border-bottom p-5'>
            {readme}
          </div>
        </div>}

        <div className='row ml-0 mr-0 mb-3'>
          <div className='col-12 border rounded-top p-3'>
            <FontAwesomeIcon icon={faTags} /><strong className='ml-2'>Meta</strong>
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
        </div>

        <BodySegment data={dataset} />
        <ReadmeSegment data={dataset} />

        <div id='popover-content' style={{ display: 'none' }}>
          <div className='popover-section popover-section-top'>
            <form>
              <div className='d-flex align-items-center'>
                <label className='col-form-label'>Dataset Reference</label>
                <span className='tiny-link text-right flex-grow-1'><a href='https://qri.io/docs/concepts/names/'><FontAwesomeIcon icon={faInfoCircle} /> What should I do with this?</a></span>
              </div>
              <div className='input-group mb-3'>
                <input type='text' className='form-control input dataset-reference' readOnly value={`${peername}/${name}`} aria-describedby='dataset-reference-copy'/>
                <div className='input-group-append'>
                  <button className='btn btn-muted dataset-reference-copy' type='button'><FontAwesomeIcon icon={faClipboard} /></button>
                </div>
              </div>
            </form>
            <p className='mb-0'>Use the dataset reference to create a copy of this Qri Dataset on your computer</p>
          </div>
          <div className='popover-section d-flex align-items-center'>
            <a href={`x-qri-client://add/${peername}/${name}`}><button className='btn btn-primary btn-sm' disabled>Open in Qri Desktop</button></a>
            <span className='tiny-link text-right flex-grow-1'><a href='https://qri.io/desktop' target='_blank' rel='noopener noreferrer'>Get Qri Desktop <FontAwesomeIcon icon={faExternalLinkAlt} /></a></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatasetPreview
