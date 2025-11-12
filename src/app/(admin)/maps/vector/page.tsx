import React from 'react'
import AllVectorMaps from './component/AllVectorMaps'
import Link from 'next/link'
import { Col, Row } from 'react-bootstrap'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Vector Maps' }

const page = () => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-0">Dashboards</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="">Maps</Link>
              </li>
              <li className="breadcrumb-item active">Dashboards</li>
            </ol>
          </div>
        </Col>
      </Row>
      <Row className="row-cols-lg-2 gx-3">
        <AllVectorMaps />
      </Row>
    </>
  )
}

export default page
