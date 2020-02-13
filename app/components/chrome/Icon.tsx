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
  faCopy,
  faTimes,
  faCheck,
  faAngleLeft,
  faAngleRight,
  faAngleUp,
  faAngleDown,
  faCaretLeft,
  faCaretRight,
  faCaretUp,
  faCaretDown,
  faExpandArrowsAlt,
  faEllipsisH,
  faSort,
  faMinus
} from '@fortawesome/free-solid-svg-icons'

interface IconProps {
  // name of the icon
  icon: string
  // size sm: .875em
  // md: 1.33em
  // lg: 2em
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: 'light' | 'medium' | 'dark' | 'red' | 'green'
}

const icons: Record<string, any> = {
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
  'file': faFileAlt,
  'sort': faSort,
  'dataset': faFileAlt,
  'datasets': faCopy,
  'readme': faGlasses,
  'commit': faQuestionCircle,
  'lock': faLock,
  'transform': faCode,
  'close': faTimes,
  'check': faCheck,
  'angle-left': faAngleLeft,
  'angle-right': faAngleRight,
  'angle-up': faAngleUp,
  'angle-down': faAngleDown,
  'left': faCaretLeft,
  'right': faCaretRight,
  'up': faCaretUp,
  'down': faCaretDown,
  'expand': faExpandArrowsAlt,
  'hamburger': faEllipsisH,
  'minus': faMinus,
  'plus': faPlus
}

export const iconsList = Object.keys(icons)

const Icon: React.FunctionComponent<IconProps> = ({
  icon = 'unknown',
  size = 'md',
  color = 'dark'
}) => {
  const sizes: {[key: string]: FontAwesomeIconProps['size']} = {
    'xs': 'xs',
    'sm': 'sm',
    'md': 'lg',
    'lg': '2x'
  }

  return <FontAwesomeIcon size={sizes[size]} icon={icons[icon]} className={`icon-${color}`}/>
}

export default Icon
