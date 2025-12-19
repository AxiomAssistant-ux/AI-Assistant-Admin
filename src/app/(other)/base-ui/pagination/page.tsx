import type { Metadata } from 'next'
import AllPagination from './components/AllPagination'
import Link from 'next/link'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { Col, Row } from 'react-bootstrap'

export const metadata: Metadata = { title: 'Pagination ' }

const Pagination = () => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-0">Pagination</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="">Base UI</Link>
              </li>
              <div className="mx-1" style={{ height: 24 }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Pagination</li>
            </ol>
          </div>
        </Col>
      </Row>

      <Row>
        <AllPagination />
      </Row>
    </>
  )
}

export default Pagination
