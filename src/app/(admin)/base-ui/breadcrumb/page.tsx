import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'

export const metadata: Metadata = { title: 'Breadcrumb | Taplox - Responsive Admin Dashboard Template' }

const DefaultBreadcrumb = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Default Example</CardTitle>
            <p className="card-subtitle">
              Use an ordered or unordered list with linked list items to create a minimally styled breadcrumb. Use our utilities to add additional
              styles as desired.
            </p>
          </CardHeader>
          <CardBody>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb py-0">
                <li className="breadcrumb-item active" aria-current="page">
                  Home
                </li>
              </ol>
            </nav>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb py-0">
                <li className="breadcrumb-item">
                  <Link href="">Home</Link>
                </li>
                <div className="mx-1" style={{ height: 24 }}>
                  <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
                </div>
                <li className="breadcrumb-item active" aria-current="page">
                  Library
                </li>
              </ol>
            </nav>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 py-0">
                <li className="breadcrumb-item">
                  <Link href="">Home</Link>
                </li>
                <div className="mx-1" style={{ height: 24 }}>
                  <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
                </div>
                <li className="breadcrumb-item">
                  <Link href="">Library</Link>
                </li>
                <div className="mx-1" style={{ height: 24 }}>
                  <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
                </div>
                <li className="breadcrumb-item active" aria-current="page">
                  Data
                </li>
              </ol>
            </nav>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const DividersBreadcrumb = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Dividers Breadcrumb</CardTitle>
            <p className="card-subtitle">Optionally, you can also specify the icon with your breadcrumb item.</p>
          </CardHeader>
          <CardBody>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb py-0">
                <li className="breadcrumb-item active" aria-current="page">
                  Home
                </li>
              </ol>
            </nav>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb py-0">
                <li className="breadcrumb-item">
                  <Link href="">Home</Link>
                </li>
                <div className="mx-1" style={{ height: 24 }}>
                  <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
                </div>

                <li className="breadcrumb-item active" aria-current="page">
                  Library
                </li>
              </ol>
            </nav>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 py-0">
                <li className="breadcrumb-item">
                  <Link href="">Home</Link>
                </li>
                <div className="mx-1" style={{ height: 24 }}>
                  <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
                </div>
                <li className="breadcrumb-item">
                  <Link href="">Library</Link>
                </li>
                <div className="mx-1" style={{ height: 24 }}>
                  <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
                </div>
                <li className="breadcrumb-item active" aria-current="page">
                  Data
                </li>
              </ol>
            </nav>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const Page = () => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-0">Breadcrumb</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="">Base UI</Link>
              </li>
              <div className="mx-1" style={{ height: 24 }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Breadcrumb</li>
            </ol>
          </div>
        </Col>
      </Row>

      <Row>
        <DefaultBreadcrumb />
        <DividersBreadcrumb />
      </Row>
    </>
  )
}

export default Page
