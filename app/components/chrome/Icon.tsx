import * as React from 'react'

import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import {
  faQuestionCircle,
  faFont,
  faHashtag,
  faCode,
  faGlasses,
  faLock,
  faTh,
  faSearch,
  faQuestion,
  faComment,
  faCloudUploadAlt,
  faFolderOpen,
  faArchive,
  faTags,
  faPlus,
  faDownload,
  faFileAlt,
  faCopy
} from '@fortawesome/free-solid-svg-icons'

interface IconProps {
  // name of the icon
  icon: string
  // size sm: .875em
  // md: 1.33em
  // lg: 2em
  size: 'sm' | 'md' | 'lg'
  color: 'light' | 'medium' | 'dark'
}

const icons: {[key: string]: any} = {
  'search': faSearch,
  'any': faQuestion,
  'string': faFont,
  'integer': faHashtag,
  'number': faHashtag,
  'boolean': faQuestionCircle,
  'null': faQuestionCircle,
  'object': faQuestionCircle,
  'array': faQuestionCircle,
  'chat': faComment,
  'publish': faCloudUploadAlt,
  'openInFinder': faFolderOpen,
  'structure': faTh,
  'unknown': faQuestionCircle,
  'moreInfo': faQuestionCircle,
  'body': faArchive,
  'meta': faTags,
  'create': faPlus,
  'clone': faDownload,
  'download': faDownload,
  'dataset': faFileAlt,
  'datasets': faCopy,
  'readme': faGlasses,
  'commit': faQuestionCircle,
  'lock': faLock,
  'transform': faCode
}

export const iconsList = Object.keys(icons)

const Icon: React.FunctionComponent<IconProps> = ({
  icon = 'any',
  size = 'md',
  color = 'light'
}) => {
  const sizes: {[key: string]: FontAwesomeIconProps['size']} = {
    'sm': 'sm',
    'md': 'lg',
    'lg': '2x'
  }

  return <FontAwesomeIcon size={sizes[size]} icon={icons[icon]} className={`icon-${color}`}/>
}

export default Icon
