import * as React from 'react'
import { ApiAction } from '../store/api'
import HandsonTable from './HandsonTable'

interface BodyProps {
  body: any
  peername: string
  name: string
  path: string
  fetchBody: () => Promise<ApiAction>
}

interface BodyState {
  peername: string
  name: string
  path: string
}

export default class Body extends React.Component<BodyProps> {
  state = {
    peername: null,
    name: null,
    path: null
  }

  static getDerivedStateFromProps (nextProps: BodyProps, prevState: BodyState) {
    const { peername: newPeername, name: newName, path: newPath } = nextProps
    const { peername, name, path } = prevState
    console.log('OLD', peername, name)
    console.log('NEW', newPeername, newName)
    // when new props arrive, compare selections.peername and selections.name to
    // previous.  If either is different, fetch data
    if ((newPeername !== peername) || (newName !== name) || (newPath !== path)) {
      console.log('TRIGGERING FETCH BODY')
      nextProps.fetchBody()
      return {
        peername: newPeername,
        name: newName,
        path: newPath
      }
    }

    return null
  }
  render () {
    return (
      <div>
        {
          this.props.body && (
            <HandsonTable body={this.props.body.data} />
          )
        }
      </div>
    )
  }
}
