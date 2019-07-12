import { connect } from 'react-redux'
import DatasetSidebar from '../components/DatasetSidebar'
import { setSidebarTab } from '../actions/app'
import { IState } from '../reducers'

const DatasetSidebarContainer = connect(
  (state: IState, ownProps) => {
    return Object.assign({
      activeTab: state.app.dataset.sidebar.activeTab
    }, ownProps)
  },
  {
    setSidebarTab
  }
)(DatasetSidebar)

export default DatasetSidebarContainer
