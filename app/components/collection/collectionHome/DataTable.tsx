import React, { useEffect } from 'react'
import numeral from 'numeral'
import orderBy from 'lodash/orderBy'
import ReactDataTable from 'react-data-table-component'
import ReactTooltip from 'react-tooltip'

import { VersionInfo } from '../../../models/store'

import RelativeTimestamp from '../../RelativeTimestamp'
import StatusIcons from './StatusIcons'

interface DataTableProps {
  filteredDatasets: VersionInfo[]
  onRowClicked: (row: VersionInfo) => void
  onSelectedRowsChange: ({ selectedRows }: { selectedRows: VersionInfo[] }) => void
  onOpenInFinder: (data: VersionInfo) => void
}

// column sort function for react-data-table
// defines the actual string to sort on when a sortable column is clicked
const customSort = (rows: VersionInfo[], field: string, direction: 'asc' | 'desc') => {
  const handleField = (row: VersionInfo) => {
    if (field === 'name') {
      return `${row['username']}/${row['name']}`
    }

    if (field === 'updated') {
      return row['commitTime']
    }

    if (field === 'size') {
      return row['bodySize']
    }

    if (field === 'rows') {
      return row['bodyRows']
    }

    return row[field]
  }

  return orderBy(rows, handleField, direction)
}

const zeroTimeString = '0001-01-01T00:00:00Z'

const DataTable: React.FC<DataTableProps> = (props) => {
  const {
    filteredDatasets,
    onRowClicked,
    onSelectedRowsChange,
    onOpenInFinder
  } = props

  // rebuild tooltips on mount and update
  useEffect(() => {
    ReactTooltip.rebuild()
  })

  // react-data-table custom styles
  const customStyles = {
    headRow: {
      style: {
        minHeight: '38px'
      }
    },
    rows: {
      style: {
        minHeight: '38px'
      }
    }
  }

  // react-data-table column definitions
  const columns = [
    {
      name: 'name',
      selector: 'name',
      sortable: true,
      grow: 2,
      cell: (row: VersionInfo) => `${row.username}/${row.name}`
    },
    {
      name: 'updated',
      selector: 'updated',
      sortable: true,
      width: '120px',
      cell: (row: VersionInfo) => {
        if (row.commitTime !== zeroTimeString) {
          return <RelativeTimestamp timestamp={row.commitTime}/>
        } else {
          return '--'
        }
      }
    },
    {
      name: 'size',
      selector: 'size',
      sortable: true,
      width: '100px',
      cell: (row: VersionInfo) => row.bodySize ? numeral(row.bodySize).format('0.00 b') : '--'
    },
    {
      name: 'rows',
      selector: 'rows',
      sortable: true,
      width: '60px',
      cell: (row: VersionInfo) => row.bodyRows ? numeral(row.bodyRows).format('0a') : '--'
    },
    {
      name: 'status',
      selector: 'status',
      width: '100px',
      cell: (row: VersionInfo) => <StatusIcons row={row} onClickFolder={onOpenInFinder} /> // eslint-disable-line
    }
  ]

  return (
    <ReactDataTable
      columns={columns}
      data={filteredDatasets}
      customStyles={customStyles}
      sortFunction={customSort}
      selectableRows
      fixedHeader
      overflowY
      overflowYOffset='250px'
      highlightOnHover
      pointerOnHover
      onRowClicked={onRowClicked}
      onSelectedRowsChange={onSelectedRowsChange}
    />
  )
}

export default DataTable
