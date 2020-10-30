import React from 'react'
import path from 'path'
import classNames from 'classnames'

import { showItemInFolder, copyToClipboard } from './platformSpecific/WorkingComponentList.TARGET_PLATFORM'

import { checkClearToCommit } from '../../utils/formValidation'
import { QriRef, qriRefFromRoute } from '../../models/qriRef'
import { Status, SelectedComponent, RouteProps } from '../../models/store'

import { discardChangesAndFetch } from '../../actions/api'
import { discardMutationsChanges } from '../../actions/mutations'

import { selectStatusFromMutations, selectFsiPath, selectHasHistory } from '../../selections'
import { pathToEdit } from '../../paths'

import { ContextMenuArea, MenuItems } from '../ContextMenuArea'

import ComponentItem from '../item/ComponentItem'
import { connectComponentToPropsWithRouter } from '../../utils/connectComponentToProps'
import { Action } from 'redux'

interface WorkingComponentListProps extends RouteProps {
  qriRef: QriRef
  status: Status
  selectedComponent: string
  discardChangesAndFetch?: (username: string, name: string, component: SelectedComponent) => void
  discardMutationsChanges?: (component: string) => Action
  fsiPath?: string
  hasHistory: boolean
}

export const components = [
  {
    name: 'commit',
    displayName: 'Commit',
    tooltip: 'info about the latest changes to the dataset',
    icon: 'commit'
  },
  {
    name: 'readme',
    displayName: 'Readme',
    tooltip: 'a markdown file to familiarize people with the dataset',
    icon: 'readme'
  },
  {
    name: 'meta',
    displayName: 'Meta',
    tooltip: 'the dataset\'s title, description, tags, etc',
    icon: 'meta'
  },
  {
    name: 'body',
    displayName: 'Body',
    tooltip: 'the structured content of the dataset',
    icon: 'body'
  },
  {
    name: 'structure',
    displayName: 'Structure',
    tooltip: 'the structure of the dataset',
    icon: 'structure'
  },
  {
    name: 'transform',
    displayName: 'Transform',
    tooltip: 'commit automation',
    icon: 'transform'
  }
]

export const hiddenComponents = ['transform']
// removes components that don't have content on this dataset
function hiddenComponentFilter (status: Status) {
  return (component): boolean => {
    // filtering all componennt, if the component name is NOT in the hidden list, we good, if it is, then it must be in the status
    return !hiddenComponents.includes(component.name) || Object.keys(status).some((statusComponentName: string) => statusComponentName === component.name)
  }
}

// returns the component display details of the given named component
export const getComponentDisplayProps = (name: string) => {
  return components.filter(d => d.name === name)[0]
}

export const WorkingComponentListComponent: React.FunctionComponent<WorkingComponentListProps> = (props: WorkingComponentListProps) => {
  const {
    qriRef,
    status,
    history,
    selectedComponent,
    discardChangesAndFetch,
    discardMutationsChanges,
    fsiPath,
    hasHistory
  } = props

  const { username, name: datasetName } = qriRef

  const visibleComponents = components.filter(hiddenComponentFilter(status))

  // reduce visible component statuses into boolean indicating that there are changes ready to be committed

  const clearToCommit = checkClearToCommit(status)

  return (
    <div className={classNames({ 'clear-to-commit': clearToCommit })}>
      {
        visibleComponents.map(({ name, displayName, tooltip, icon }) => {
          let filename = ''
          let fileStatus
          let filepath
          if (status[name]) {
            fileStatus = status[name].status
            filepath = status[name].filepath
            if (filepath !== name) {
              filename = path.basename(filepath)
            }
          }

          let menuItems: MenuItems[] = []
          if (status[name]) {
            const { filepath, status: fileStatus } = status[name]
            let filename = ''
            if (filepath !== name) {
              filename = path.basename(filepath)
            }
            if (fsiPath) {
              menuItems = [
                {
                  label: 'Open in Finder',
                  click: () => { showItemInFolder(`${fsiPath}/${filename}`) }
                },
                {
                  label: 'Copy File Path',
                  click: () => { copyToClipboard(`${fsiPath}/${filename}`) }
                }
              ]

              if (discardChangesAndFetch && fileStatus !== 'unmodified' && hasHistory) {
                menuItems.unshift({
                  label: 'Discard Changes...',
                  click: () => {
                    console.log("component is", name)
                    discardChangesAndFetch(username, datasetName, name as SelectedComponent)
                  }
                })
                if (menuItems.length > 1) {
                  menuItems.unshift({ type: 'separator' })
                }
              }
            } else {
              if (discardMutationsChanges && fileStatus !== 'unmodified') {
                menuItems.unshift({
                  label: 'Discard Changes...',
                  click: () => {
                    discardMutationsChanges(name)
                  }
                })
              }
            }
          }

          return (
            <ContextMenuArea
              data={menuItems}
              menuItemsFactory={(data) => data}
              key={name}
            >
              <ComponentItem
                key={name}
                displayName={displayName}
                icon={icon}
                filename={filename}
                status={fileStatus}
                selected={selectedComponent === name}
                tooltip={tooltip}
                onClick={(component: SelectedComponent) => {
                  history.push(pathToEdit(username, datasetName, component))
                }}
              />
            </ContextMenuArea>
          )
        })
      }
    </div>
  )
}

export default connectComponentToPropsWithRouter(
  WorkingComponentListComponent,
  (state: any, ownProps: WorkingComponentListProps) => {
    const qriRef = qriRefFromRoute(ownProps)
    return {
      status: selectStatusFromMutations(state),
      selectedComponent: qriRef.component,
      fsiPath: selectFsiPath(state),
      hasHistory: selectHasHistory(state),
      qriRef,
      ...ownProps
    }
  },
  {
    discardChangesAndFetch,
    discardMutationsChanges
  }
)
