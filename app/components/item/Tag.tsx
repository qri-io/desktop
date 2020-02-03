import React from 'react'
import classNames from 'classnames'

interface TagProps {
  type: 'category' | 'keyword'
  tag: string
}

const Tag: React.FunctionComponent<TagProps> = (props) => {
  const { type = 'category', tag } = props
  return (
    <div className={classNames('tag', { 'category': type === 'category' })}>
      {tag}
    </div>
  )
}

export default Tag
