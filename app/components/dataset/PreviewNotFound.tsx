import React from 'react'
export const lostBlob = require('../../assets/lost_blob.png') // eslint-disable-line

const PreviewNotFound: React.FC = () => {
  return (
    <div className="preview-not-found">
      <div className="container">
        <img className='graphic' src={lostBlob} />
        <h3>We can&apos;t get you this version... because we don&apos;t have it!</h3>
        <p>This isn&apos;t a problem or error with Qri. It just means that, although we know this version exists, the author of this dataset hasn&apos;t published it :)</p>
      </div>
    </div>
  )
}

export default PreviewNotFound
