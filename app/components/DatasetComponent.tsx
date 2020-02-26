import * as React from 'react'

import MetadataContainer from '../containers/MetadataContainer'
import MetadataEditor from '../components/MetadataEditor'
import Structure from '../components/Structure'
import ParseError from './ParseError'
import Readme from '../components/Readme'
import TransformContainer from '../containers/TransformContainer'
import ReadmeHistoryContainer from '../containers/ReadmeHistoryContainer'
import { CSSTransition } from 'react-transition-group'
import SpinnerWithIcon from './chrome/SpinnerWithIcon'
import CommitHistoryContainer from '../containers/CommitHistoryContainer'
import CommitContainer from '../containers/CommitContainer'

import { getComponentDisplayProps } from './ComponentList'

import { StatusInfo, SelectedComponent, PageInfo } from '../models/store'
import Body from './Body'
import { Details } from '../models/details'
import { ApiActionThunk } from '../store/api'
import { Action } from 'redux'
import Dataset from '../models/dataset'
import Icon from './chrome/Icon'
import StatusDot from './chrome/StatusDot'

interface DatasetComponentProps {
  data: Dataset

  // display details
  details: Details
  stats?: Array<Record<string, any>>
  bodyPageInfo?: PageInfo
  peername: string
  name: string

  // seting actions
  setDetailsBar: (details: Record<string, any>) => Action

  // fetching api actions
  fetchBody: (page?: number, pageSize?: number) => ApiActionThunk
  write: (peername: string, name: string, dataset: Dataset) => ApiActionThunk | void

  isLoading: boolean
  component: SelectedComponent
  componentStatus: StatusInfo
  history?: boolean
  fsiPath?: string
}

const DatasetComponent: React.FunctionComponent<DatasetComponentProps> = (props: DatasetComponentProps) => {
  const { component: selectedComponent, componentStatus, isLoading, history = false, fsiPath, data, peername, name, stats, bodyPageInfo, details, setDetailsBar, fetchBody, write } = props

  const hasParseError = componentStatus.status === 'parse error'
  const component = selectedComponent || 'meta'
  const { displayName, icon, tooltip } = getComponentDisplayProps(component)

  const handleWrite = (data: Dataset): ApiActionThunk | void => {
    return write(peername, name, data)
  }

  return (
    <div className='component-container'>
      <div className='component-header'>
        <div className='component-display-name-container'>
          <div className='component-display-name' data-tip={tooltip}>
            <Icon icon={icon} size='sm'/> {displayName}
          </div>
        </div>
        <div className='status-dot-container'>
          {componentStatus && <StatusDot status={componentStatus.status} />}
        </div>
      </div>
      <div className='component-content transition-group'>
        <CSSTransition
          in={!!componentStatus && hasParseError}
          classNames='fade'
          component='div'
          timeout={300}
          mountOnEnter
          unmountOnExit
          appear={true}
        >
          <div className='transition-wrap'>
            <ParseError fsiPath={fsiPath || ''} filename={componentStatus && componentStatus.filepath} component={component} />
          </div>
        </CSSTransition>
        <CSSTransition
          in={(component === 'readme') && !isLoading && !hasParseError}
          classNames='fade'
          component='div'
          timeout={300}
          mountOnEnter
          unmountOnExit
          appear={true}
        >
          <div className='transition-wrap'>
            {history
              ? <ReadmeHistoryContainer />
              : <Readme
                data={data.readme}
                name={name}
                username={peername}
                write={handleWrite}
                isLinked={fsiPath !== ''}
                loading={isLoading}
              />}
          </div>
        </CSSTransition>
        <CSSTransition
          in={(component === 'meta') && !isLoading && !hasParseError}
          classNames='fade'
          component='div'
          timeout={300}
          mountOnEnter
          unmountOnExit
          appear={true}
        >
          <div className='transition-wrap'>
            {
              history
                ? <MetadataContainer />
                : <MetadataEditor
                  data={data.meta}
                  write={handleWrite}
                  loading={isLoading}
                />
            }
          </div>
        </CSSTransition>
        <CSSTransition
          in={component === 'body' && bodyPageInfo && !hasParseError}
          classNames='fade'
          component='div'
          timeout={300}
          mountOnEnter
          unmountOnExit
          appear={true}
        >
          <div className='transition-wrap'>
            <Body
              data={data}
              pageInfo={bodyPageInfo}
              stats={stats}
              fetchBody={fetchBody}
              setDetailsBar={setDetailsBar}
              details={details}
            />
          </div>
        </CSSTransition>
        <CSSTransition
          in={component === 'structure' && !isLoading && !hasParseError}
          classNames='fade'
          component='div'
          timeout={300}
          mountOnEnter
          unmountOnExit
          appear={true}
        >
          <div className='transition-wrap'>
            <Structure
              data={data.structure}
              history={history}
              write={handleWrite}
              loading={isLoading}
            />
          </div>
        </CSSTransition>
        <CSSTransition
          in={(component === 'transform') && !isLoading && !hasParseError}
          classNames='fade'
          component='div'
          timeout={300}
          mountOnEnter
          unmountOnExit
          appear={true}
        >
          <div className='transition-wrap'>
            <TransformContainer />
          </div>
        </CSSTransition>
        <CSSTransition
          in={(component === 'commit') && !isLoading && !hasParseError}
          classNames='fade'
          component='div'
          timeout={300}
          mountOnEnter
          unmountOnExit
          appear={true}
        >
          <div className='transition-wrap'>
            {
              history
                ? <CommitHistoryContainer />
                : <CommitContainer />
            }
          </div>
        </CSSTransition>
        <SpinnerWithIcon loading={isLoading}/>
      </div>
    </div>
  )
}
export default DatasetComponent
