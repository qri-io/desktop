import * as React from 'react'
import { UI } from '../models/store'

export interface AppProps {
  ui: UI
  children: any
}

const App: React.FunctionComponent<AppProps> = (props: AppProps) => {
  return (
    <div style={{ height: '100%' }}>
      {props.children}
    </div>
  )
}

export default App