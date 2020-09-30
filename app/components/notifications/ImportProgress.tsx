import React from 'react'

import ProgressBar from '../chrome/ProgressBar'

// for displaying a progress bar based on import file size
// assumes an import rate of 4828 bytes per millisecond
const IMPORT_BYTES_PER_MS = 4828

interface ImportProgressProps {
  importFileName: string
  importFileSize: number
}

const ImportProgress: React.FC<any> = ({ importFileName, importFileSize }) => {
  // calculate the duration estimate based on the importFileSize
  const importTimeEstimate = importFileSize / IMPORT_BYTES_PER_MS

  {(importFileSize > 0)
    ? <ProgressBar duration={importTimeEstimate} fileName={importFileName} />
    : <div className='strong-message'>{countMessage}</div>
  }
  return null
}

export default ImportProgress
