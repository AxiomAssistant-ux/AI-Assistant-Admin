import { Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'react-bootstrap'
import Link from 'next/link'
import { tableData } from './data'
import avatar2 from '@/assets/images/users/avatar-2.jpg'
import avatar1 from '@/assets/images/users/avatar-1.jpg'
import avatar4 from '@/assets/images/users/avatar-4.jpg'
import avatar6 from '@/assets/images/users/avatar-6.jpg'
import avatar7 from '@/assets/images/users/avatar-7.jpg'
import avatar8 from '@/assets/images/users/avatar-8.jpg'
import type { Metadata } from 'next'
import Image from 'next/image'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { currency } from '@/context/constants'

export const metadata: Metadata = { title: 'Basic Tables' }

const BasicExample = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Basic Example</CardTitle>
        <p className="card-subtitle">
          For basic styling—light padding and only horizontal dividers—add the base class <code>.table</code> to any
          <code>&lt;table&gt;</code>.
        </p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <Table>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.firstName}</td>
                  <td>{item.lastName}</td>
                  <td>{item.handle}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  )
}

const TableVariants = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Variants</CardTitle>
        <p className="card-subtitle">Use contextual classes to color tables, table rows or individual cells.</p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <Table>
            <thead>
              <tr>
                <th scope="col">Class</th>
                <th scope="col">Heading</th>
                <th scope="col">Heading</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Default</td>
                <td>Cell</td>
                <td>Cell</td>
              </tr>
              <tr className="table-primary">
                <td>Primary</td>
                <td>Cell</td>
                <td>Cell</td>
              </tr>
              <tr className="table-secondary">
                <td>Secondary</td>
                <td>Cell</td>
                <td>Cell</td>
              </tr>
              <tr className="table-success">
                <td>Success</td>
                <td>Cell</td>
                <td>Cell</td>
              </tr>
              <tr className="table-danger">
                <td>Danger</td>
                <td>Cell</td>
                <td>Cell</td>
              </tr>
              <tr className="table-warning">
                <td>Warning</td>
                <td>Cell</td>
                <td>Cell</td>
              </tr>
              <tr className="table-info">
                <td>Info</td>
                <td>Cell</td>
                <td>Cell</td>
              </tr>
              <tr className="table-light">
                <td>Light</td>
                <td>Cell</td>
                <td>Cell</td>
              </tr>
              <tr className="table-dark">
                <td>Dark</td>
                <td>Cell</td>
                <td>Cell</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  )
}

const StripedRowsTable = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Striped Rows Table</CardTitle>
          <p className="card-subtitle">
            Use <code>.table-striped</code> to add zebra-striping to any table row within the <code>&lt;tbody&gt;</code>.
          </p>
        </CardHeader>
        <CardBody>
          <div className="table-responsive">
            <Table className=" table-striped table-centered">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">First</th>
                  <th scope="col">Last</th>
                  <th scope="col">Handle</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td>{item.handle}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

const StripedRowsTableDark = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Striped Rows Table Dark</CardTitle>
        <p className="card-subtitle">
          Use <code>.table-dark .table-striped</code> to add zebra-striping to any table row within the <code>&lt;tbody&gt;</code>.
        </p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <Table className=" table-dark table-striped table-centered">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Larry the Bird</td>
                <td> Simsons</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  )
}

const StripedRowsTableSuccess = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Striped Rows Table Success</CardTitle>
        <p className="card-subtitle">
          Use <code>.table-success .table-striped</code> to add zebra-striping to any table row within the <code>&lt;tbody&gt;</code>.
        </p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <Table className="table-success table-striped table-centered">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.firstName}</td>
                  <td>{item.lastName}</td>
                  <td>{item.handle}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  )
}

const StripedColumnsTable = () => {
  return (
    <Card>
      <CardBody>
        <CardHeader>
          <CardTitle as={'h5'}>Striped columns</CardTitle>
          <p className="card-subtitle">
            Use <code>.table-striped-columns </code>to add zebra-striping to any table column.
          </p>
        </CardHeader>
        <div className="table-responsive-sm">
          <table className="table table-striped-columns table-centered">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.firstName}</td>
                  <td>{item.lastName}</td>
                  <td>{item.handle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}

const StripedColumnsDarkTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Striped columns Dar</CardTitle>
        <p className="card-subtitle">
          Use <code>.table-dark .table-striped-columns </code>to add zebra-striping to any table column.
        </p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive-sm">
          <table className="table table-dark table-striped-columns table-centered">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.firstName}</td>
                  <td>{item.lastName}</td>
                  <td>{item.handle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}

const StripedColumnsSuccessTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Striped columns Dar</CardTitle>
        <p className="card-subtitle">
          Use <code>.table-success .table-striped-columns </code>to add zebra-striping to any table column.
        </p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive-sm">
          <table className="table table-success table-striped-columns table-centered">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.firstName}</td>
                  <td>{item.lastName}</td>
                  <td>{item.handle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}

const HoverableRowsTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Hoverable rows</CardTitle>
        <p className="card-subtitle">
          Add <code>.table-hover</code> to enable a hover state on table rows within a <code>&lt;tbody&gt;</code>.
        </p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <table className="table table-hover table-centered">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.firstName}</td>
                  <td>{item.lastName}</td>
                  <td>{item.handle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}

const HoverableRowsDarkTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Hoverable rows Dark</CardTitle>
        <p className="card-subtitle">
          Add <code>.table-dark .table-hover</code> to enable a hover state on table rows within a <code>&lt;tbody&gt;</code>.
        </p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <table className="table table-dark table-hover table-centered">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.firstName}</td>
                  <td>{item.lastName}</td>
                  <td>{item.handle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}

const ActiveTables = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Active Tables</CardTitle>
        <p className="card-subtitle">
          Highlight a table row or cell by adding a <code>.table-active</code> class.
        </p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <Table>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-active">
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td>3</td>
                <td className="table-active">Larry the Bird</td>
                <td>Simsons</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  )
}

const ActiveTablesDark = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Active Tables Dark</CardTitle>
        <p className="card-subtitle">
          Highlight a table row or cell by adding a<code>.table-dark .table-active</code> class.
        </p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <table className="table table-dark table-centered">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-active">
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td>3</td>
                <td className="table-active">Larry the Bird</td>
                <td>Simsons</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}

const BorderedTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Bordered Table</CardTitle>
        <p className="card-subtitle">
          Add <code>.table-bordered</code> for borders on all sides of the table and cells.
        </p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Larry the Bird</td>
                <td>Simsons</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}

const BorderedColorTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Bordered color Table</CardTitle>
        <p className="card-subtitle">
          Add <code>.table-bordered</code> &amp; <code>.border-primary</code> can be added to change colors.
        </p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <table className="table table-bordered border-primary table-centered">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Larry the Bird</td>
                <td>Simsons</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}

const TableWithoutBorders = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Tables without borders</CardTitle>
        <p className="card-subtitle">
          Add <code>.table-borderless</code> for a table without borders..
        </p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <table className="table table-borderless table-centered">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Larry the Bird</td>
                <td>Simsons</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}

const TableWithoutBordersDark = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Tables without borders Dar</CardTitle>
        <p className="card-subtitle">
          Add <code>.table-borderless</code> <code>.table-dark</code> for a table without borders and dark table.
        </p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <table className="table table-borderless table-dark table-centered">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Larry the Bird</td>
                <td>Simsons</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}

const SmallTables = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Small tables</CardTitle>
        <p className="card-subtitle">
          Add <code>.table-sm </code>to make any .table more compact by cutting all cell padding in half.
        </p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <table className="table table-sm">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Larry the Bird</td>
                <td>Simsons</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}

const SmallTableDark = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Small Tables Dar</CardTitle>
        <p className="card-subtitle">
          Add <code>.table-sm </code> <code>.table-dark </code>to make any .table more compact by cutting all cell padding in half.
        </p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <table className="table table-dark table-sm">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Larry the Bird</td>
                <td>Simsons</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}

const TableGroupDividers = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Table group dividers</CardTitle>
        <p className="card-subtitle">
          {' '}
          Add a thicker border, darker between table groups—
          <code>&lt;thead&gt;</code>, <code>&lt;tbody&gt;</code>, and
          <code>&lt;tfoot&gt;</code>—with <code>.table-group-divider</code>. Customize the color by changing the <code>border-top-color</code> (which
          we don’t currently provide a utility class for at this time).
        </p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Larry the Bird</td>
                <td>Simsons</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}

const VerticalAlignmentTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Vertical alignment</CardTitle>
        <p className="card-subtitle">
          Table cells of <code>&lt;thead&gt;</code> are always vertical aligned to the bottom. Table cells in <code>&lt;tbody&gt;</code> inherit their
          alignment from <code>&lt;table&gt;</code> and are aligned to the top by default. Use the{' '}
          <Link href="/docs/5.3/utilities/vertical-align/">vertical align</Link>
          classes to re-align where needed.
        </p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <table className="table align-middle table-centered">
            <thead>
              <tr>
                <th scope="col" className="w-25">
                  Heading 1
                </th>
                <th scope="col" className="w-25">
                  Heading 2
                </th>
                <th scope="col" className="w-25">
                  Heading 3
                </th>
                <th scope="col" className="w-25">
                  Heading 4
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  This cell inherits
                  <code>vertical-align: middle;</code> from the table
                </td>
                <td>
                  This cell inherits
                  <code>vertical-align: middle;</code> from the table
                </td>
                <td>
                  This cell inherits
                  <code>vertical-align: middle;</code> from the table
                </td>
                <td>
                  This here is some placeholder text, intended to take up quite a bit of vertical space, to demonstrate how the vertical alignment
                  works in the preceding cells.
                </td>
              </tr>
              <tr className="align-bottom">
                <td>
                  This cell inherits
                  <code>vertical-align: bottom;</code> from the table row
                </td>
                <td>
                  This cell inherits
                  <code>vertical-align: bottom;</code> from the table row
                </td>
                <td>
                  This cell inherits
                  <code>vertical-align: bottom;</code> from the table row
                </td>
                <td>
                  This here is some placeholder text, intended to take up quite a bit of vertical space, to demonstrate how the vertical alignment
                  works in the preceding cells.
                </td>
              </tr>
              <tr>
                <td>
                  This cell inherits
                  <code>vertical-align: middle;</code> from the table
                </td>
                <td>
                  This cell inherits
                  <code>vertical-align: middle;</code> from the table
                </td>
                <td className="align-top">This cell is aligned to the top.</td>
                <td>
                  This here is some placeholder text, intended to take up quite a bit of vertical space, to demonstrate how the vertical alignment
                  works in the preceding cells.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}

const NestingTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Nesting Table</CardTitle>
        <p className="card-subtitle">Border styles, active styles, and table variants are not inherited by nested tables.</p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-centered">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td colSpan={4}>
                  <table className="table mb-0">
                    <thead>
                      <tr>
                        <th scope="col">Header</th>
                        <th scope="col">Header</th>
                        <th scope="col">Header</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>A</td>
                        <td>First</td>
                        <td>Last</td>
                      </tr>
                      <tr>
                        <td>B</td>
                        <td>First</td>
                        <td>Last</td>
                      </tr>
                      <tr>
                        <td>C</td>
                        <td>First</td>
                        <td>Last</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td>Larry</td>
                <td>the Bird</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}

const TableHead = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Table head</CardTitle>
        <p className="card-subtitle">
          Similar to tables and dark tables, use the modifier classes
          <code>.table-light</code>to make <code>&lt;thead&gt;</code>s appear light or dark gray.
        </p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <Table>
            <thead className="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Larry</td>
                <td>the Bird</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  )
}

const TableHeadDark = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Table head Dark</CardTitle>
        <p className="card-subtitle">
          Similar to tables and dark tables, use the modifier classes
          <code>.table-dark</code> to make <code>&lt;thead&gt;</code>s appear light or dark gray.
        </p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <Table>
            <thead className="table-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Larry</td>
                <td>the Bird</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  )
}

const TableWithFooter = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Table head Dar</CardTitle>
        <p className="card-subtitle">
          Similar to tables and dark tables, use the modifier classes
          <code>.table-dark</code> to make <code>&lt;thead&gt;</code>s appear light or dark gray.
        </p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <Table>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Larry</td>
                <td>the Bird</td>
                <td>@twitter</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>Footer</td>
                <td>Footer</td>
                <td>Footer</td>
                <td>Footer</td>
              </tr>
            </tfoot>
          </Table>
        </div>
      </CardBody>
    </Card>
  )
}

const TableWithCaption = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Caption</CardTitle>
        <p className="card-subtitle">
          A <code>&lt;caption&gt;</code> functions like a heading for a table. It helps users with screen readers to find a table and understand what
          it’s about and decide if they want to read it.
        </p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <Table>
            <caption>List of users</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Larry the Bird</td>
                <td>Simsons</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  )
}

const TableWithCaptionTop = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Caption</CardTitle>
        <p className="card-subtitle">
          You can also put the <code>&lt;caption&gt;</code> on the top of the table with <code>.caption-top</code>
        </p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <table className="table caption-top table-centered">
            <caption>List of users</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Larry</td>
                <td>the Bird</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}

const AlwaysResponsiveTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Always responsive</CardTitle>
        <p className="card-subtitle">
          Across every breakpoint, use <code>.table-responsive</code> for horizontally scrolling tables.
        </p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Heading</th>
                <th scope="col">Heading</th>
                <th scope="col">Heading</th>
                <th scope="col">Heading</th>
                <th scope="col">Heading</th>
                <th scope="col">Heading</th>
                <th scope="col">Heading</th>
                <th scope="col">Heading</th>
                <th scope="col">Heading</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}

const TableWithAvatars = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>With avatars</CardTitle>
        <p className="card-subtitle">A list of all the users in your account including their name, title, email and role.</p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <table className="table table-hover table-centered">
            <thead className="table-light">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Title</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="d-flex align-items-center gap-1">
                    <Image src={avatar2} alt="" className="avatar-sm rounded-circle" />
                    <div className="d-block">
                      <h5 className="mb-0"> Tony M. Carter</h5>
                    </div>
                  </div>
                </td>
                <td>Designer</td>
                <td>tonymcarter@jourrapide.com</td>
                <td>Member</td>
                <td>
                  <Link href="" className="btn btn-primary btn-sm w-100">
                    Edit
                  </Link>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="d-flex align-items-center gap-1">
                    <Image src={avatar1} alt="" className="avatar-sm rounded-circle" />
                    <div className="d-block">
                      <h5 className="mb-0">James E. Chamb</h5>
                    </div>
                  </div>
                </td>
                <td>UI/UX Designer</td>
                <td>jamesechambliss@teleworm.us</td>
                <td>Admin</td>
                <td>
                  <Link href="" className="btn btn-primary btn-sm w-100">
                    Edit
                  </Link>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="d-flex align-items-center gap-1">
                    <Image src={avatar4} alt="" className="avatar-sm rounded-circle" />
                    <div className="d-block">
                      <h5 className="mb-0">Charlotte J. Torres</h5>
                    </div>
                  </div>
                </td>
                <td>Copywriter</td>
                <td>charlotte@jourrapide.com</td>
                <td>Member</td>
                <td>
                  <Link href="" className="btn btn-primary btn-sm w-100">
                    Edit
                  </Link>
                </td>
              </tr>
              <tr className="table-active">
                <td>
                  <div className="d-flex align-items-center gap-1">
                    <Image src={avatar6} alt="" className="avatar-sm rounded-circle" />
                    <div className="d-block">
                      <h5 className="mb-0 d-flex align-items-center gap-1">
                        Mary J. Germain
                        <IconifyIcon icon="bxs-badge-check" className="bx  text-success" />
                      </h5>
                    </div>
                  </div>
                </td>
                <td>Full Stack</td>
                <td>maryjgermain@jourrapide.com</td>
                <td>CEO</td>
                <td>
                  <Link href="" className="btn btn-primary btn-sm w-100">
                    Edit
                  </Link>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="d-flex align-items-center gap-1">
                    <Image src={avatar7} alt="" className="avatar-sm rounded-circle" />
                    <div className="d-block">
                      <h5 className="mb-0">Kevin C. Reyes</h5>
                    </div>
                  </div>
                </td>
                <td>Director of Product</td>
                <td>kevincreyes@jourrapide.com</td>
                <td>Member</td>
                <td>
                  <Link href="" className="btn btn-primary btn-sm w-100">
                    Edit
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}

const TableWithCheckboxes = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>With checkboxes</CardTitle>
        <p className="card-subtitle">A list of all the users in your account including their name, title, email and role.</p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <table className="table table-striped table-borderless table-centered">
            <thead className="table-light">
              <tr>
                <th scope="col">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="flexCheckDefault5" />
                  </div>
                </th>
                <th scope="col">Name</th>
                <th scope="col">Title</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
                  </div>
                </td>
                <td> Tony M. Carter </td>
                <td>Designer</td>
                <td>tonymcarter@jourrapide.com</td>
                <td>Member</td>
                <td>
                  <Link href="" className="btn btn-primary btn-sm w-100">
                    Edit
                  </Link>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="flexCheckDefault2" />
                  </div>
                </td>
                <td>James E. Chamb</td>
                <td>UI/UX Designer</td>
                <td>jamesechambliss@teleworm.us</td>
                <td>Admin</td>
                <td>
                  <Link href="" className="btn btn-primary btn-sm w-100">
                    Edit
                  </Link>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="flexCheckDefault3" />
                  </div>
                </td>
                <td> Charlotte J. Torres </td>
                <td>Copywriter</td>
                <td>charlotte@jourrapide.com</td>
                <td>Member</td>
                <td>
                  <Link href="" className="btn btn-primary btn-sm w-100">
                    Edit
                  </Link>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="flexCheckDefault4" />
                  </div>
                </td>
                <td>
                  Mary J. Germain <IconifyIcon icon="bxs-badge-check" className="bx  text-success" />
                </td>
                <td>Full Stack</td>
                <td>maryjgermain@jourrapide.com</td>
                <td>CEO</td>
                <td>
                  <Link href="" className="btn btn-primary btn-sm w-100">
                    Edit
                  </Link>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="flexCheckDefault5" />
                  </div>
                </td>
                <td>Kevin C. Reyes</td>
                <td>Director of Product</td>
                <td>kevincreyes@jourrapide.com</td>
                <td>Member</td>
                <td>
                  <Link href="" className="btn btn-primary btn-sm w-100">
                    Edit
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}

const NestingTable2 = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Nesting Table</CardTitle>
        <p className="card-subtitle">Border styles, active styles, and table variants are not inherited by nested tables.</p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-centered">
            <thead>
              <tr>
                <th scope="col">Invoice Number</th>
                <th scope="col">Invoice Amount</th>
                <th scope="col">Confirmation by the client</th>
                <th scope="col">Planned payment date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>F-011221/21</td>
                <td>{currency} 879.500</td>
                <td>11/05/2023</td>
                <td>12/05/2023</td>
              </tr>
              <tr>
                <td colSpan={4}>
                  <table className="table mb-0">
                    <thead>
                      <tr>
                        <th scope="col">ERP number</th>
                        <th scope="col">Carrier legal entity</th>
                        <th scope="col">Responsible logistician</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>3-128-3</td>
                        <td>ToBrookfield Asset Management</td>
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <Image src={avatar7} alt="" className="avatar-sm rounded-circle" />
                            <div className="d-block">
                              <h5 className="mb-0">Kevin C. Reyes</h5>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-success-subtle text-success py-1 px-2">Verified</span>
                        </td>
                      </tr>
                      <tr>
                        <td>3-128-2</td>
                        <td>Brookfield Asset Management</td>
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <Image src={avatar6} alt="" className="avatar-sm rounded-circle" />
                            <div className="d-block">
                              <h5 className="mb-0">Mary J. Germain</h5>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-warning-subtle text-warning py-1 px-2">Pending</span>
                        </td>
                      </tr>
                      <tr>
                        <td>3-128-1</td>
                        <td>Westfield Asset Management</td>
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <Image src={avatar8} alt="" className="avatar-sm rounded-circle" />
                            <div className="d-block">
                              <h5 className="mb-0">Charlotte J. Torres</h5>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-danger-subtle text-danger py-1 px-2">Rejected</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td>F-011221/19</td>
                <td>{currency} 93.250</td>
                <td>9/05/2023</td>
                <td>10/05/2023</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}

const BasicTables = () => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-0">Basic Tables</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="">Tables</Link>
              </li>
              <div className="mx-1" style={{ height: 24 }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Basic Tables</li>
            </ol>
          </div>
        </Col>
      </Row>

      <BasicExample />
      <TableVariants />
      <StripedRowsTable />
      <StripedRowsTableDark />
      <StripedRowsTableSuccess />
      <StripedColumnsTable />
      <StripedColumnsDarkTable />
      <StripedColumnsSuccessTable />
      <HoverableRowsTable />
      <HoverableRowsDarkTable />
      <ActiveTables />
      <ActiveTablesDark />
      <BorderedTable />
      <BorderedColorTable />
      <TableWithoutBorders />
      <TableWithoutBordersDark />
      <SmallTables />
      <SmallTableDark />
      <TableGroupDividers />
      <VerticalAlignmentTable />
      <NestingTable />
      <TableHead />
      <TableHeadDark />
      <TableWithFooter />
      <TableWithCaption />
      <TableWithCaptionTop />
      <AlwaysResponsiveTable />
      <TableWithAvatars />
      <TableWithCheckboxes />
      <NestingTable2 />
    </>
  )
}

export default BasicTables
