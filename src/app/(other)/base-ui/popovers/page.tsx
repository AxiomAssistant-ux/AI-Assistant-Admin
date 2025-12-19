import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { Col, Row } from 'react-bootstrap'
import AllPopovers from './components/AllPopovers'

export const metadata: Metadata = { title: 'Popovers ' }

const page = () => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-0">Popovers</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="">Base UI</Link>
              </li>
              <div className="mx-1" style={{ height: 24 }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Popovers</li>
            </ol>
          </div>
        </Col>
      </Row>

      <Row>
        <AllPopovers />
      </Row>
    </>
  )
}

export default page
