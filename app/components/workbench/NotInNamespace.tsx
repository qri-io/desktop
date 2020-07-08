import * as React from 'react'

import ExternalLink from '../ExternalLink'
import WorkbenchLayout from './layouts/WorkbenchLayout'
import DisabledComponentList from './DisabledComponentList'

const NotInNamespace: React.FunctionComponent = () => {
  return (
    <WorkbenchLayout
      id='dataset-not-in-namespace'
      activeTab='status'
      mainContent={
        <div className={'dataset-not-in-namespace'}>
          <div className={'message-container'}>
            <div>
              <h4>You are viewing another user&apos;s dataset!</h4>
              <p>
              To edit this dataset, you need to import the data as your own. Head over to the &apos;History&apos; tab and right-click on whichever version you want to work with. Export it, unzip the contents, and import the body file by dragging-and-dropping it over the app. The dataset is now yours!
              </p>
              <p>
            We are working on streamlining this process! If you have thoughts or suggestions, please reach out to us on <ExternalLink href='https://github.com/qri-io/desktop/issues'>Github</ExternalLink> or <ExternalLink href='https://discordapp.com/invite/thkJHKj'>Discord</ExternalLink>.
              </p>
            </div>
          </div>
        </div>
      }
      sidebarContent={<DisabledComponentList />}
    />
  )
}

export default NotInNamespace
