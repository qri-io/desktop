import * as React from 'react'
import ReactJson from 'react-json-view'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

import { PageInfo } from '../models/store'

interface BodyJsonProps {
  body: any[]
  pageInfo: PageInfo
}

const BodyJson: React.FunctionComponent<BodyJsonProps> = (props) => {
  const { body, pageInfo } = props
  const { fetchedAll, isFetching } = pageInfo

  return (
    <div
      id='body-json-container'
      style={{ height: '100%', overflowY: 'scroll' }}
    >
      {!fetchedAll && !isFetching && <div className='preview-warning'><FontAwesomeIcon icon={faExclamationTriangle} size='xs' /> This is a preview of the first 50 items in this json array</div>}
      <div id='body-json-array'>
        <ReactJson
          name={null}
          src={body}
          displayDataTypes={false}
          enableClipboard={false}
          collapsed={2}
        />
      </div>
    </div>
  )
}

export default BodyJson
