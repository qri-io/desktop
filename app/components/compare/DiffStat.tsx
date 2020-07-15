import React from 'react'

export interface DiffStatProps {
  data: {
    // inserts may be undefined if the datasets are identical
    inserts?: number
    // deletes may be undefined if the datasets are identical
    deletes?: number
  }
}

const DiffStat: React.FunctionComponent<DiffStatProps> = ({ data }) => {
  const { inserts, deletes } = data
  return (
    <span className="change_stat">
      <b className="add">+{inserts}</b>
      <b className="rem">-{deletes}</b>
    </span>
  )
}

export default DiffStat
