import React from 'react'

interface ICommitish {
  /**
   * hash is the string hash pointing to the specific version of the
   * dataset we expect the hash to either be only the hash portion of the id or
   * start with `/SOME_NETWORK/` and end with the hash string
   * eg: `/ipfs/QmQXQNHQ7wJvHMkd2BQtuxfarYfQzR9XNmNH1bnF3Dr8Qa`
   * or just `QmQXQNHQ7wJvHMkd2BQtuxfarYfQzR9XNmNH1bnF3Dr8Qa`
   * The ONLY exception is if the text is "HEAD", which we allow without
   * manipulation
   */
  text: string
}

const Commitish: React.FC<ICommitish> = ({ text }) => {
  let commitish = text
  if (text !== 'HEAD') {
    commitish = text.split('/')[text.split('/').length - 1].substr(2, 7)
  }
  return <div style={{
    background: '#D3D3D3',
    color: '#747474',
    borderRadius: 5,
    padding: '3px 8px',
    fontSize: 16,
    fontWeight: 400,
    margin: 5,
    display: 'inline-block'
  }}>{commitish}</div>
}

export default Commitish
