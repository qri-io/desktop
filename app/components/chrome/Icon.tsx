import React from 'react'
import classNames from 'classnames'

import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import {
  faQuestionCircle,
  faFont,
  faHashtag,
  faArrowDown,
  faArrowUp,
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
  faMinus,
  faSync,
  faBars,
  faPencilAlt,
  faToggleOn
} from '@fortawesome/free-solid-svg-icons'

import {
  faClock,
  faStickyNote,
  faHdd,
  faFile,
  faTrashAlt
} from '@fortawesome/free-regular-svg-icons'

interface IconProps {
  // name of the icon
  icon: string
  // size sm: .875em
  // md: 1.33em
  // lg: 2em
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: 'light' | 'medium' | 'dark' | 'red' | 'green'
  className?: string
  rotation?: 90 | 180 | 270
}

const icons: Record<string, any> = {
  'down-arrow': faArrowDown,
  'up-arrow': faArrowUp,
  'search': faSearch,
  'any': faQuestion,
  'string': faFont,
  'integer': faHashtag,
  'number': faHashtag,
  'numeric': faHashtag,
  'boolean': faToggleOn,
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
  'commit-message': faFile,
  'download': faDownload,
  'file': faFileAlt,
  'sort': faSort,
  'dataset': faFileAlt,
  'datasets': faCopy,
  'readme': faGlasses,
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
  'plus': faPlus,
  'sync': faSync,
  'clock': faClock,
  'bars': faBars,
  'hdd': faHdd,
  'stickyNote': faStickyNote,
  'pencil': faPencilAlt,
  'trash': faTrashAlt
}

const sizes: {[key: string]: FontAwesomeIconProps['size']} = {
  'xs': 'xs',
  'sm': 'sm',
  'md': 'lg',
  'lg': '2x'
}

export const iconsList = Object.keys(icons)

const Icon: React.FunctionComponent<IconProps> = ({
  icon = 'unknown',
  size = 'md',
  color = 'dark',
  className,
  rotation
}) => {
  if (icon === 'commit') {
    return (
      <svg aria-hidden='true' focusable='false' className={classNames('icon', `icon-${color}`, className, 'svg-inline--fa', `fa-${sizes[size]}`)} role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 52 91'>
        <circle id='Oval' stroke='currentColor' strokeWidth='10' cx='26' cy='45' r='21' fill='none'></circle>
        <line x1='26.5' y1='4.5' x2='26.5' y2='22.5' id='Line' stroke='currentColor' strokeWidth='10' strokeLinecap='square'></line>
        <line x1='26.5' y1='66.5' x2='26.5' y2='86.5' id='Line' stroke='currentColor' strokeWidth='10' strokeLinecap='square'></line>
      </svg>
    )
  }

  return <FontAwesomeIcon rotation={rotation} size={sizes[size]} icon={icons[icon]} className={classNames('icon', `icon-${color}`, className)}/>
}

export default Icon
