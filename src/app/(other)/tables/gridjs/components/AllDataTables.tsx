'use client'
import React from 'react'
import { Grid } from 'gridjs-react'
import type { Employee, LoadingType, PaginationType, SearchType, SortingType } from '@/types/data'
import { dataTable, hiddenTableRecords, loadingTableRecords, searchTableRecords, sortingTableRecords } from '@/assets/data/other'
import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap'

const Hidden = ({ hiddenTableRecoard }: { hiddenTableRecoard: any[] }) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Hidden Columns</CardTitle>
          <p className="text-muted mb-0">
            Add <code>hidden: true</code> to the columns definition to hide them.
          </p>
        </CardHeader>
        <CardBody>
          <div className="py-3">
            <Grid data={hiddenTableRecoard} pagination={{ limit: 5 }} sort />
          </div>
        </CardBody>
      </Card>
    </>
  )
}

const Loading = ({ loadingTableRecords }: { loadingTableRecords: LoadingType[] }) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Loading State</CardTitle>
          <p className="text-muted mb-0">
            Grid.js renders a loading bar automatically while it waits for the data to be fetched. Here we are using an async function to demonstrate
            this behaviour (e.g. an async function can be a XHR call to a server backend)
          </p>
        </CardHeader>
        <CardBody>
          <Grid data={loadingTableRecords} pagination={{ limit: 5 }} sort />
        </CardBody>
      </Card>
    </>
  )
}

const Sorting = ({ sortingTableRecords }: { sortingTableRecords: SortingType[] }) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Sorting</CardTitle>
          <p className="text-muted mb-0">
            To enable sorting, simply add <code>sort: true</code> to your config:
          </p>
        </CardHeader>
        <CardBody>
          <Grid data={sortingTableRecords} pagination={{ limit: 5 }} sort />
        </CardBody>
      </Card>
    </>
  )
}

const Search = ({ searchTableRecords }: { searchTableRecords: SearchType[] }) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Search</CardTitle>
          <p className="text-muted mb-0">
            Grid.js supports global search on all rows and columns. Set
            <code>search: true</code> to enable the search plugin:
          </p>
        </CardHeader>
        <CardBody>
          <Grid data={searchTableRecords} pagination={{ limit: 5 }} search={true} />
        </CardBody>
      </Card>
    </>
  )
}

const Pagination = ({ dataTable }: { dataTable: PaginationType[] }) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Pagination</CardTitle>
          <p className="text-muted mb-0">
            Pagination can be enabled by setting <code>pagination: true</code>:
          </p>
        </CardHeader>
        <CardBody>
          <Grid data={dataTable} pagination={{ limit: 5 }} />
        </CardBody>
      </Card>
    </>
  )
}

const Basic = ({ dataTableRecords }: { dataTableRecords: Employee[] }) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Basic</CardTitle>
          <p className="card-subtitle">
            The most basic list group is an unordered list with list items and the proper classes. Build upon it with the options that follow, or with
            your own CSS as needed.
          </p>
        </CardHeader>
        <CardBody>
          <Grid data={dataTableRecords} pagination={{ limit: 5 }} search={true} sort />
        </CardBody>
      </Card>
    </>
  )
}

const Fixed = ({ dataTableRecords }: { dataTableRecords: Employee[] }) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Fixed Header</CardTitle>
          <p className="text-muted mb-0">
            The most basic list group is an unordered list with list items and the proper classes. Build upon it with the options that follow, or with
            your own CSS as needed.
          </p>
        </CardHeader>
        <CardBody>
          <Grid
            data={dataTableRecords}
            columns={['Id', 'Name', 'Email', 'Position', 'Company', 'Country']}
            height="320px"
            fixedHeader={true}
            pagination={{ limit: 10 }}
          />
        </CardBody>
      </Card>
    </>
  )
}

const AllDataTables = ({ dataTableRecords }: { dataTableRecords: Employee[] }) => {
  return (
    <>
      <Basic dataTableRecords={dataTableRecords} />
      <Pagination dataTable={dataTable} />
      <Search searchTableRecords={searchTableRecords} />
      <Sorting sortingTableRecords={sortingTableRecords} />
      <Loading loadingTableRecords={loadingTableRecords} />
      <Fixed dataTableRecords={dataTableRecords} />
      <Hidden hiddenTableRecoard={hiddenTableRecords} />
    </>
  )
}

export default AllDataTables
