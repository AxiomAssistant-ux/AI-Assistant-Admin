import React from 'react'
import AllEditors from './components/AllEditors'
import Link from 'next/link'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { Col, Row } from 'react-bootstrap'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Editors' }

const page = () => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-0">Editors</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="">Forms</Link>
              </li>
              <div className="mx-1" style={{ height: 24 }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Editors</li>
            </ol>
          </div>
        </Col>
      </Row>

      <AllEditors />
    </>
  )
}

export default page
