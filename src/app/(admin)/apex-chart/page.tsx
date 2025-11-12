import React from 'react'
import AllApexChart from './component/AllApexChart'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Link from 'next/link'
import { Col, Row } from 'react-bootstrap'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ApexChart ',
}

const page = () => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-0">Chart</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="">Taplox</Link>
              </li>
              <div className="mx-1" style={{ height: 24 }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Chart</li>
            </ol>
          </div>
        </Col>
      </Row>

      <AllApexChart />
    </>
  )
}

export default page
