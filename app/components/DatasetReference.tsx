// a component that displays the dataset reference including edit-in-place UI
// for dataset rename
import * as React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { Dispatch, bindActionCreators } from 'redux'

import { ApiActionThunk } from '../store/api'
import { QriRef } from '../models/qriRef'

import { renameDataset } from '../actions/api'
import { validateDatasetName } from '../utils/formValidation'

interface DatasetReferenceProps {
  qriRef: QriRef
  renameDataset: (username: string, name: string, newName: string) => ApiActionThunk
}

const DatasetReferenceComponent: React.FunctionComponent<DatasetReferenceProps> = (props) => {
  const { qriRef, renameDataset } = props
  const { username = '', name = '' } = qriRef
  const [ nameEditing, setNameEditing ] = React.useState(false)
  const [ newName, setNewName ] = React.useState(name)
  const [ inValid, setInvalid ] = React.useState(null)

  const confirmRename = (username: string, name: string, newName: string) => {
    // cancel if no change, change invalid, or empty
    if ((name === newName) || inValid || newName === '') {
      cancelRename()
    } else {
      renameDataset(username, name, newName)
        .then(() => {
          setNameEditing(false)
        })
    }
  }

  const cancelRename = () => {
    setNewName(name)
    setInvalid(null)
    setNameEditing(false)
  }

  const handleKeyDown = (e: any) => {
    // cancel on esc
    if (e.keyCode === 27) {
      cancelRename()
    }

    // submit on enter or tab
    if ((e.keyCode === 13) || (e.keyCode === 9)) {
      confirmRename(username, name, newName)
    }
  }

  // use a ref so we can set up a click handler
  const nameRef: any = React.useRef(null)

  const handleMousedown = (e: MouseEvent) => {
    const { target } = e
    // allows the user to resize the sidebar when editing the dataset name
    if (target.classList.contains('resize-handle')) return

    if (nameRef.current.isSameNode(target)) {
      setNameEditing(true)
      return
    }

    if (!nameRef.current.contains(target)) {
      confirmRename(username, name, newName)
    }
  }

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, false)
    document.addEventListener('mousedown', handleMousedown, false)

    return () => {
      document.removeEventListener('keydown', handleKeyDown, false)
      document.removeEventListener('mousedown', handleMousedown, false)
    }
  }, [ name, newName ])

  const handleInputChange = (e: any) => {
    let { value } = e.target
    setInvalid(validateDatasetName(value))
    setNewName(value)
  }

  // when the input is focused, set the cursor to the left, and scroll all the way to the left
  const onFocus = () => {
    const el = document.getElementById('dataset-name') as HTMLInputElement
    el.scrollLeft = 0
  }

  return (
    <div id='dataset-reference' className='dataset-reference'>
      <div className='dataset-username'>{username || ''}/</div>
      <div className='dataset-name' id='dataset-name' ref={nameRef}>
        { nameEditing && <input
          id='dataset-name-input'
          className={classNames({ invalid: inValid })}
          type='text'
          value={newName}
          maxLength={150}
          onChange={handleInputChange}
          autoFocus
          onFocus={onFocus}
          pattern='^(?![0_9])[a-z0-9_]{1,144}$'
        /> }
        { !nameEditing && (<>{name || ''}</>)}
      </div>
    </div>
  )
}

const mapStateToProps = (state: any, ownProps: DatasetReferenceProps) => {
  return ownProps
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    renameDataset
  }, dispatch)
}

const mergeProps = (props: any, actions: any): DatasetReferenceProps => {
  return { ...props, ...actions }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(DatasetReferenceComponent)
