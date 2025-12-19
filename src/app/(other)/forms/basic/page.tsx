import React from 'react'
import BasicExamples from './components/BasicExamples'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Link from 'next/link'
import { Col, Row } from 'react-bootstrap'
import { Metadata } from 'next'

export const metadata: Metadata = { title: ' Form Basic ' }

const page = () => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-0">Form Basics</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="">Form</Link>
              </li>
              <div className="mx-1" style={{ height: 24 }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Form Basics</li>
            </ol>
          </div>
        </Col>
      </Row>

      <Row className=" row-cols-lg-2 gx-3">
        <BasicExamples />
      </Row>
    </>
  )
}

export default page
