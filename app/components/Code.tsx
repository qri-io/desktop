import React from 'react'

interface CodeProps {
  data: string
}

const Code: React.FunctionComponent<CodeProps> = (props: CodeProps) => {
  const { data = '' } = props
  const lines = data.split('\n')

  return (
    <div style={{ overflowX: 'auto' }} className="code">
      <pre style={{ float: 'left', margin: '0 20px', color: '#bbb' }}>{lines.map((_, i) => (`${i}\n`))}</pre>
      <pre>{data}</pre>
    </div>
  )
}

export default Code
