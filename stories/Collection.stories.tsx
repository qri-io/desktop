import React, { ReactElement } from 'react'
import ReactTooltip from 'react-tooltip'
import { AnyAction } from 'redux'

import DatasetStatus, { DatasetStatusProps } from '../app/components/collection-v2/DatasetStatus'

export default {
  title: 'Collection View',
  parameters: {
    notes: 'Revised Collection View components'
  }
}

const tooltipWrapper = (component: ReactElement, storyTitle: string) => (
  <>
    <ReactTooltip 
      place='bottom'
      type='dark'
      effect='solid'
      delayShow={200}
      multiline 
    />
    <p>{storyTitle}</p>
    <div style={{ height: '50px', width: '110px', padding: 15 }}>
      {component}
    </div>
  </>
)

const qriRef = {
  location: 'foo/bar/at/ipfs/QmFme0d/body',
  username: 'honeyBadger',
  name: 'achievements-of-neville-longbottom',
  path: '/ipfs/QmaanFJb4CxktD1spk57oCr4fUSmL8AASpNHnzeUyrRub3'
}

const datasetStatusBaseProps = {
  qriRef,
  fsiPath: '/downloads/herbology-greats/neville',
  updateDataset: () => () => new Promise<AnyAction>((resolve) => resolve({ type: 'Collection view update action'}))
}

const datasetPublishedProps: DatasetStatusProps = {
  ...datasetStatusBaseProps,  
  published: true,
  linkedToFilesystem: false,
  updatesAvailable: false,
}

export const datasetPublished = () => tooltipWrapper(<DatasetStatus {...datasetPublishedProps} />, 'Dataset Published')

datasetPublished.story = {
    name: 'Published',
    parameters: {
      notes: 'Dataset has been published to qri Cloud'
    }
}

const datasetLinkedToFilesystemProps: DatasetStatusProps = {
  ...datasetStatusBaseProps,
  published: false,
  linkedToFilesystem: true,
  updatesAvailable: false,
}

export const datasetLinkedToFilesystem = () => tooltipWrapper(<DatasetStatus {...datasetLinkedToFilesystemProps} />, 'Dataset Linked to Filesystem')

datasetLinkedToFilesystem.story = {
  name: 'Linked to filesystem',
  parameters: {
    notes: 'Dataset has been linked to file system'
  }
}

const datasetUpdatesAvailableProps: DatasetStatusProps = {
  ...datasetStatusBaseProps,
  published: false,
  linkedToFilesystem: false,
  updatesAvailable: true,
}

export const datasetUpdatesAvailable = () => tooltipWrapper(<DatasetStatus {...datasetUpdatesAvailableProps} />, 'Dataset Updates Available')

datasetUpdatesAvailable.story = {
  name: 'Updates Available',
  parameters: {
    notes: 'Dataset has updates available'
  }
}

const datasetLinkedToFSAndUpdatesAvailableProps: DatasetStatusProps = {
  ...datasetStatusBaseProps,
  published: false,
  linkedToFilesystem: true,
  updatesAvailable: true,
}

export const datasetLinkedToFSAndUpdatesAvailable = () => tooltipWrapper(<DatasetStatus {...datasetLinkedToFSAndUpdatesAvailableProps} />, 'Dataset Linked to Filesystem and Updates Available')

datasetLinkedToFSAndUpdatesAvailable.story = {
  name: 'Linked to Filesystem and Updates Available',
  parameters: {
    notes: 'Dataset is linked to filesystem and has updates available'
  }
}