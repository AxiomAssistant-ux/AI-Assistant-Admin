import type { Metadata } from 'next'
import AllDataTables from './components/AllDataTables'
import { dataTableRecords } from '@/assets/data/other'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Link from 'next/link'
import { Col, Row } from 'react-bootstrap'

export const metadata: Metadata = { title: 'GridJs Tables' }

const GridJS = () => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-0">Grid JS</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="">Table</Link>
              </li>
              <div className="mx-1" style={{ height: 24 }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Grid JS</li>
            </ol>
          </div>
        </Col>
      </Row>
      <AllDataTables dataTableRecords={dataTableRecords} />
    </>
  )
}

export default GridJS
