import Footer from '@/components/layout/Footer'
import React from 'react'
import Chart from './components/Chart'
import User from './components/User'
import Link from 'next/link'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { Col, Row } from 'react-bootstrap'
import Cards from './components/Cards'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Analytics' }

const page = () => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-0">Dashboard</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Taplox</Link>
              </li>
              <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Dashboard</li>
            </ol>
          </div>
        </Col>
      </Row>
      <Cards />
      <Chart />
      <User />
      <Footer />
    </>
  )
}

export default page
