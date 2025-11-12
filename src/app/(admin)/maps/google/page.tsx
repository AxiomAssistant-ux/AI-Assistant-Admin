import React from 'react'
import AllGoogleMaps from './component/AllGoogleMaps'
import { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Google Maps' }

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

      <AllGoogleMaps />
    </>
  )
}

export default page
