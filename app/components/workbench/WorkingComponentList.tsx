import * as React from 'react'
import path from 'path'
import classNames from 'classnames'
import { clipboard, shell, MenuItemConstructorOptions } from 'electron'

import { checkClearToCommit } from '../../utils/formValidation'
import { QriRef, qriRefFromRoute } from '../../models/qriRef'
import { Status, SelectedComponent, RouteProps } from '../../models/store'

import { discardChangesAndFetch } from '../../actions/api'

import { selectStatusFromMutations, selectFsiPath } from '../../selections'
import { pathToEdit } from '../../paths'

import ContextMenuArea from '../ContextMenuArea'
import ComponentItem from '../item/ComponentItem'
import { connectComponentToPropsWithRouter } from '../../utils/connectComponentToProps'

interface WorkingComponentListProps extends RouteProps {
  qriRef: QriRef
  status: Status
  selectedComponent: string
  discardChangesAndFetch?: (username: string, name: string, component: SelectedComponent) => void
  fsiPath?: string
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
    fsiPath
  } = props

  const { username, name: datasetName } = qriRef

  const visibleComponents = components.filter(hiddenComponentFilter(status))

  // reduce visible component statuses into boolean indicating that there are changes ready to be committed

  const clearToCommit = checkClearToCommit(status)

  return (
    <div className={classNames({ 'clear-to-commit': clearToCommit })}>
      {
        visibleComponents.map(({ name, displayName, tooltip, icon }) => {
          if (status[name]) {
            const { filepath, status: fileStatus } = status[name]

            // if filepath is the same as the component name, we are looking at a
            // a commit's component, and should not render a filename
            let filename = ''
            if (filepath !== name) {
              filename = path.basename(filepath)
            }

            const fileRow = (
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
                color='light'
              />
            )

            if (discardChangesAndFetch || fsiPath) {
              let menuItems: MenuItemConstructorOptions[] = []
              if (fsiPath) {
                menuItems = [
                  {
                    label: 'Open in Finder',
                    click: () => { shell.showItemInFolder(`${fsiPath}/${filename}`) }
                  },
                  {
                    label: 'Copy File Path',
                    click: () => { clipboard.writeText(`${fsiPath}/${filename}`) }
                  }
                ]
              }

              // add discard changes option of file is modified
              if (discardChangesAndFetch && fileStatus !== 'unmodified') {
                menuItems.unshift({
                  label: 'Discard Changes...',
                  click: () => {
                    discardChangesAndFetch(username, datasetName, name as SelectedComponent)
                  }
                })
                if (menuItems.length > 1) {
                  menuItems.unshift({ type: 'separator' })
                }
              }

              return (
                <ContextMenuArea data={menuItems} menuItemsFactory={(data) => data} key={name}>
                  {fileRow}
                </ContextMenuArea>
              )
            } else {
              return fileRow
            }
          } else {
            return (
              <ComponentItem
                color='light'
                key={name}
                displayName={displayName}
                icon={icon}
                selected={selectedComponent === name}
                // TODO (ramfox): we should create a 'isDisabled' function and add these specifications & test
                tooltip={tooltip}
                onClick={(component: SelectedComponent) => {
                  history.push(pathToEdit(username, datasetName, component))
                }}
              />
            )
          }
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
      qriRef,
      ...ownProps
    }
  },
  {
    discardChangesAndFetch
  }
)
