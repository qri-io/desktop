import * as React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faFolderOpen, IconDefinition } from '@fortawesome/free-regular-svg-icons'
import { faLink, faCloudUploadAlt, faCloud } from '@fortawesome/free-solid-svg-icons'

export interface HeaderColumnButtonProps {
  tooltip?: string
  label: string
  icon: string | React.ReactElement
  onClick?: (event: React.MouseEvent) => void
}

export const icons: Record<string, IconDefinition> = {
  faFile,
  faFolderOpen,
  faLink,
  faCloudUploadAlt,
  faCloud
}

const HeaderColumnButton: React.FunctionComponent<HeaderColumnButtonProps> = (props) => {
  const { icon = '', label = '', tooltip, onClick } = props
  return (
    <div
      className='header-column'
      data-tip={tooltip}
      onClick={onClick}
    >
      {(icon !== '') && (typeof icon === 'string')
        ? <div className='header-column-icon'><FontAwesomeIcon icon={icons[icon]} size='lg'/></div>
        : (<div className='header-column-icon'>{icon}</div>)
      }
      {(label !== '') &&
        <div className='header-column-text'>
          <div className='label'>{label}</div>
        </div>
      }
    </div>
  )
}

export default HeaderColumnButton
