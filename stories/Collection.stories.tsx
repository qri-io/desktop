import React from 'react'
import { AnyAction } from 'redux'

import DatasetStatus, { DatasetStatusProps } from '../app/components/collection-v2/DatasetStatus'

export default {
  title: 'Collection View',
  parameters: {
    notes: 'Revised Collection View components'
  }
}

const datasetStatusWrapperStyles = { height: '50px', width: '110px', padding: 15 }

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

export const datasetPublished = () => {
    return (
    <>
      <p>Dataset Published</p>  
      <div style={{...datasetStatusWrapperStyles}}>
        <DatasetStatus {...datasetPublishedProps} />
      </div>
    </>
  )
}

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

export const datasetLinkedToFilesystem = () => {
    return (
    <>
      <p>Dataset Linked to Filesystem</p>  
      <div style={{...datasetStatusWrapperStyles}}>
        <DatasetStatus {...datasetLinkedToFilesystemProps} />
      </div>
    </>
  )
}

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

export const datasetUpdatesAvailable = () => {
    return (
    <>
      <p>Dataset Updates Available</p>  
      <div style={{...datasetStatusWrapperStyles}}>
        <DatasetStatus {...datasetUpdatesAvailableProps} />
      </div>
    </>
  )
}

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

export const datasetLinkedToFSAndUpdatesAvailable = () => {
    return (
    <>
      <p>Dataset Linked to Filesystem and Updates Available</p>  
      <div style={{...datasetStatusWrapperStyles}}>
        <DatasetStatus {...datasetLinkedToFSAndUpdatesAvailableProps} />
      </div>
    </>
  )
}

datasetLinkedToFSAndUpdatesAvailable.story = {
  name: 'Linked to Filesystem and Updates Available',
  parameters: {
    notes: 'Dataset is linked to filesystem and has updates available'
  }
}