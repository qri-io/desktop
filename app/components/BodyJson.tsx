import * as React from 'react'
import ReactJson from 'react-json-view'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

interface BodyJsonProps {
  data: any[]

  previewWarning?: boolean
}

const BodyJson: React.FunctionComponent<BodyJsonProps> = (props) => {
  const { data, previewWarning = true } = props

  if (!data) return null

  return (
    <div
      id='body-json-container'
      style={{ height: '100%', overflowY: 'scroll' }}
    >
      {previewWarning && <div className='preview-warning'><FontAwesomeIcon icon={faExclamationTriangle} size='xs' /> This is a preview of the first 50 items in this json array</div>}
      <div id='body-json-array'>
        <ReactJson
          name={null}
          src={data}
          displayDataTypes={false}
          enableClipboard={false}
          collapsed={2}
        />
      </div>
    </div>
  )
}

export default BodyJson
