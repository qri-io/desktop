import * as React from 'react'

interface ListItemProps {
  link?: string
  onClick: () => void
}

const ListItem: React.FunctionComponent<ListItemProps> = ({ link, children, onClick }) => {
  let content = (
    <div className='card-body'>
      {children}
    </div>
  )

  if (onClick) {
    content = (
      <a href={link} onClick={(e) => { e.preventDefault(); onClick() }}>{content}</a>
    )
  }

  return (
    <div className='list-item card'>
      {content}
    </div>
  )
}

export default ListItem
