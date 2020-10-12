import React from 'react'
import Switch from '../app/components/chrome/Switch'
import Segment from '../app/components/chrome/Segment'
import ActionButton, { ActionButtonProps } from '../app/components/chrome/ActionButton'
import ActionButtonBar from '../app/components/chrome/ActionButtonBar'
import Hamburger from '../app/components/chrome/Hamburger'

import { CopyCloudLinkButtonComponent } from '../app/components/collection/headerButtons/CopyCloudLinkButton'
import { ExportButtonComponent } from '../app/components/collection/headerButtons/ExportButton' 
import { CheckoutButtonComponent } from '../app/components/collection/headerButtons/CheckoutButton' 
import { PublishButtonComponent } from '../app/components/collection/headerButtons/PublishButton' 
import { RemoveButtonComponent } from '../app/components/collection/headerButtons/RemoveButton' 
import { RenameButtonComponent } from '../app/components/collection/headerButtons/RenameButton' 
import { ShowFilesButtonComponent } from '../app/components/collection/headerButtons/ShowFilesButton' 
import { UnpublishButtonComponent } from '../app/components/collection/headerButtons/UnpublishButton' 
import { ViewInCloudButtonComponent } from '../app/components/collection/headerButtons/ViewInCloudButton' 

export default {
  title: 'Chrome',
  parameters: {
    notes: `list of chrome components`
  }
}

export const switches = () => {
  const [lightSmall, setLightSmall] = React.useState(true)
  const [lightLarge, setLightLarge] = React.useState(false)
  const [darkSmall, setDarkSmall] = React.useState(true)
  const [darkLarge, setDarkLarge] = React.useState(false)
  return (
    <div style={{ background: 'grey', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 30 }}>{lightSmall ? 'on' : 'off'}</span>
        <Switch name='lightSmall' checked={lightSmall} onClick={() => setLightSmall(!lightSmall)} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 30 }}>{lightLarge ? 'on' : 'off'}</span>
        <Switch name='lightLarge' checked={lightLarge} onClick={() => setLightLarge(!lightLarge)} size='lg'/>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 30 }}>{darkSmall ? 'on' : 'off'}</span>
        <Switch name='darkSmall' checked={darkSmall} onClick={() => setDarkSmall(!darkSmall)} color='dark' />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 30 }}>{darkLarge ? 'on' : 'off'}</span>
        <Switch name='darkLarge' checked={darkLarge} onClick={() => setDarkLarge(!darkLarge)} color='dark' size='lg' />
      </div>
    </div>
  )
}

switches.story = {
  name: 'Switch',
  parameters: { note: 'on off switch' }
}

export const segments = () => {
  const content = <div style={{ padding: 15 }}><h4>Some content here</h4><div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div></div>
  return (
    <div style={{ background: 'grey', height: '100%' }}>
      <div style={{ height: 80 }}></div>
      <Segment
        content={content}
        name='Structure'
        icon='structure'
        subhead='this is a subheading'
        collapsable={true}
        expandable={true}
        contentHeight={200}
      />
    </div>
  )
}

segments.story = {
  name: 'Segments',
  paramaters: { note: 'collapse, untwirl, expand and contract' }
}

export const datasetActionButtons = () => {
  const fsiPathVal = '/path/to/dataset'
  const latestPath = '/ipfs/Qmfoo'

  const [isPublished, setIsPublished] = React.useState(false)
  const [fsiPath, setFsiPath] = React.useState('')
  const [inNamespace, setInNamespace] = React.useState(true)
  const [path, setPath] = React.useState(latestPath)
  const qriRef = { username: 'qri_user', name: 'my_dataset', path }

  const toggleIsPublished = () => {
    setIsPublished(!isPublished)
  }

  const toggleFsiPath = () => {
    if (fsiPath) {
      setFsiPath('')
      return
    }
    console.log('setting fsi path', fsiPathVal)
    setFsiPath(fsiPathVal)
  }

  const toggleInNamespace = () => {
    setInNamespace(!inNamespace)
  }

  const togglePath = () => {
    if (path) {
      setPath('')
      return
    }
    setPath(latestPath)
  }

  return (
    <div style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', height: '100%'}} >
      <div style={{ paddingTop: 20, display: 'flex', flexDirection:'column', justifyContent: 'space-between', alignItems: 'center', height: 400}} >
        <ExportButtonComponent qriRef={qriRef} />
        <CheckoutButtonComponent qriRef={qriRef} fsiPath={fsiPath} />
        <ShowFilesButtonComponent qriRef={qriRef} fsiPath={fsiPath} />
        <PublishButtonComponent qriRef={qriRef} inNamespace={inNamespace} isPublished={isPublished} latestPath={latestPath} />
        <UnpublishButtonComponent qriRef={qriRef} inNamespace={inNamespace} latestPath={latestPath} isPublished={isPublished} />
        <ViewInCloudButtonComponent qriRef={qriRef} isPublished={isPublished} />
        <CopyCloudLinkButtonComponent qriRef={qriRef} isPublished={isPublished} />
        <RemoveButtonComponent qriRef={qriRef} inNamespace={inNamespace} />
        <RenameButtonComponent qriRef={qriRef} inNamespace={inNamespace} />
      </div>
        <div style={{ paddingTop: 40, display: 'flex', justifyContent:'space-around', alignItems: 'center', width: '100%'}}>
          <div>
            <label>
            <input type='checkbox' checked={isPublished} id='is-published' onClick={toggleIsPublished}/>
              is published?
            </label>
          </div>
          <div>
            <label>
            <input type='checkbox' checked={!!fsiPath} id='fsi-path' onClick={toggleFsiPath}/>
              is checked out?
            </label>
          </div>
          <div>
            <label>
            <input type='checkbox' checked={inNamespace} id='in-namespace' onClick={toggleInNamespace}/>
              is in namespace?
            </label>
          </div>
          <div>
            <label>
            <input type='checkbox' checked={!!path} id='at-latest' onClick={togglePath}/>
              has path & at latest?
            </label>
          </div>
        </div>
    </div>
  )
}

export const hamburger = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      
    </div>
  )
}

export const hamburgerWithButtons = () => {
  const qriRef={ username: 'qri_user', name:'my_dataset'}
  const buttons = [<CheckoutButtonComponent fsiPath='test' qriRef={qriRef}/>, <RenameButtonComponent qriRef={qriRef} />]
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Hamburger items={buttons} />
    </div>
  )
}

export const actionButtons = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <ActionButton icon='unknown' text='this is a test' onClick={(e: React.MouseEvent<Element, MouseEvent>) => console.log(e, 'yay! click worked')} />
    </div>
  )
}

const titleBarActions: ActionButtonProps[] = [
  { icon: 'publish', text: 'Publish', onClick: (e: MouseEvent<Element, MouseEvent>) => { console.log('Publish!', e) } },
  { icon: 'close', text: 'Unpublish', onClick: (e: MouseEvent<Element, MouseEvent>) => { console.log('UnPublish!', e) } },
  { icon: 'openInFinder', text: 'Open in finder', onClick: (e: MouseEvent<Element, MouseEvent>) => { console.log('Open in Finder!', e) } },
  { icon: 'clone', text: 'Clone', onClick: (e: MouseEvent<Element, MouseEvent>) => { console.log('Clone!', e) } }
]

actionButtons.story = {
  name: 'Action Buttons',
  parameters: { note: 'text, icon, onClick functions only params' }
}

export const actionButtonBar = () => {
  const [size, setSize] = React.useState(80)
  return <div style={{ height: '100%', margin: 20, position: 'relative' }}>
    <div style={{ minWidth: 40, width: `calc(100% * ${size / 100}`, top: 0, right: 0, marginLeft: 'auto' }}>
      <ActionButtonBar data={titleBarActions} />
    </div>
    <input
      style={{ width: 300, marginTop: 30 }}
      name='size'
      type='range'
      min='0'
      max='100'
      step='1'
      value={size}
      onChange={(e: React.ChangeEvent) => { setSize(e.currentTarget.value) }}
    />
  </div>
}

actionButtonBar.story = {
  name: 'Action Button Bar',
  parameters: {
    note: 'as we change width, the buttons in the action bar will change'
  }
}