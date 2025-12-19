import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { Alert, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'

export const metadata: Metadata = { title: 'Alerts | Taplox - Responsive Admin Dashboard Template' }

const BasicAlerts = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle>Basic Example</CardTitle>
            <p className="card-subtitle">
              Provide contextual feedback messages for typical user actions with the handful of available and flexible alert messages. Alerts are
              available for any length of text, as well as an optional dismiss button.
            </p>
          </CardHeader>
          <CardBody>
            <div className="alert alert-primary" role="alert">
              A simple primary alert—check it out!
            </div>
            <div className="alert alert-secondary" role="alert">
              A simple secondary alert—check it out!
            </div>
            <div className="alert alert-success" role="alert">
              A simple success alert—check it out!
            </div>
            <div className="alert alert-danger" role="alert">
              A simple danger alert—check it out!
            </div>
            <div className="alert alert-warning" role="alert">
              A simple warning alert—check it out!
            </div>
            <div className="alert alert-info" role="alert">
              A simple info alert—check it out!
            </div>
            <div className="alert alert-light" role="alert">
              A simple light alert—check it out!
            </div>
            <div className="alert alert-dark mb-0" role="alert">
              A simple dark alert—check it out!
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const DismissibleAlerts = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Dismissible Alerts Example</CardTitle>
            <p className="card-subtitle">
              Add a dismiss button and the <code>.alert-dismissible</code> class, which adds extra padding to the right of the alert and positions the{' '}
              <code>.btn-close</code> button.
            </p>
          </CardHeader>
          <CardBody>
            <Alert variant="primary" dismissible className="fade show" role="alert">
              A simple primary alert—check it out!
            </Alert>
            <Alert variant="secondary" dismissible className="fade show" role="alert">
              A simple secondary alert—check it out!
            </Alert>
            <Alert variant="success" dismissible className="fade show" role="alert">
              A simple success alert—check it out!
            </Alert>
            <Alert variant="danger" dismissible className="fade show" role="alert">
              A simple danger alert—check it out!
            </Alert>
            <Alert variant="warning" dismissible className="fade show" role="alert">
              A simple warning alert—check it out!
            </Alert>
            <Alert variant="info" dismissible className="fade show" role="alert">
              A simple info alert—check it out!
            </Alert>
            <Alert variant="light" dismissible className="fade show" role="alert">
              A simple light alert—check it out!
            </Alert>
            <Alert variant="dark" dismissible className="fade show mb-0" role="alert">
              A simple dark alert—check it out!
            </Alert>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const LinkAlerts = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Alert Link Example</CardTitle>
            <p className="card-subtitle">
              Use the <code>.alert-link</code> utility class to quickly provide matching colored links within any alert.
            </p>
          </CardHeader>
          <CardBody>
            <div className="alert alert-primary" role="alert">
              A simple primary alert with{' '}
              <Link href="" className="alert-link">
                an example link
              </Link>
              . Give it a click if you like.
            </div>
            <div className="alert alert-secondary" role="alert">
              A simple secondary alert with{' '}
              <Link href="" className="alert-link">
                an example link
              </Link>
              . Give it a click if you like.
            </div>
            <div className="alert alert-success" role="alert">
              A simple success alert with{' '}
              <Link href="" className="alert-link">
                an example link
              </Link>
              . Give it a click if you like.
            </div>
            <div className="alert alert-danger mb-0" role="alert">
              A simple danger alert with{' '}
              <Link href="" className="alert-link">
                an example link
              </Link>
              . Give it a click if you like.
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const IconAlerts = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Icons Alert Example</CardTitle>
            <p className="card-subtitle">You can also include additional elements like icons, heading, etc along side the actual message.</p>
          </CardHeader>
          <CardBody>
            <div className="alert alert-primary alert-icon" role="alert">
              <div className="d-flex align-items-center">
                <div className="avatar-sm rounded bg-primary d-flex justify-content-center align-items-center fs-18 me-2 flex-shrink-0">
                  <IconifyIcon icon="bx:info-circle" className="text-white bx" />
                </div>
                <div className="flex-grow-1">A simple primary alert—check it out!</div>
              </div>
            </div>
            <div className="alert alert-secondary alert-icon" role="alert">
              <div className="d-flex align-items-center">
                <div className="avatar-sm rounded bg-secondary d-flex justify-content-center align-items-center fs-18 me-2 flex-shrink-0">
                  <IconifyIcon icon="bx:x-circle" className="bx bx-x-circle text-white" />
                </div>
                <div className="flex-grow-1">A simple secondary alert—check it out!</div>
              </div>
            </div>
            <div className="alert alert-success alert-icon" role="alert">
              <div className="d-flex align-items-center">
                <div className="avatar-sm rounded bg-success d-flex justify-content-center align-items-center fs-18 me-2 flex-shrink-0">
                  <IconifyIcon icon="bx-check-shield" className="bx bx-check-shield text-white" />
                </div>
                <div className="flex-grow-1">A simple success alert—check it out!</div>
              </div>
            </div>
            <div className="alert alert-danger alert-icon mb-0" role="alert">
              <div className="d-flex align-items-center">
                <div className="avatar-sm rounded bg-danger d-flex justify-content-center align-items-center fs-18 me-2 flex-shrink-0">
                  <IconifyIcon icon="bx:info-circle" className="text-white bx" />
                </div>
                <div className="flex-grow-1">A simple danger alert—check it out!</div>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const AdditionalContentAlerts = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Additional Content Alert Example</CardTitle>
            <p className="card-subtitle">Alerts can also contain additional HTML elements like headings, paragraphs and dividers.</p>
          </CardHeader>
          <CardBody>
            <Row>
              <Col xl={6}>
                <div className="alert alert-primary mb-3 p-3 mb-xl-0" role="alert">
                  <h4 className="alert-heading">Well done!</h4>
                  <p className="mb-0">
                    Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see
                    how spacing within an alert works with this kind of content.
                  </p>
                  <hr />
                  <p className="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>
                </div>
              </Col>
              <Col xl={6}>
                <div className="alert alert-secondary p-3 mb-0" role="alert">
                  <h4 className="alert-heading">Well done!</h4>
                  <p className="mb-0">
                    Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see
                    how spacing within an alert works with this kind of content.
                  </p>
                  <hr />
                  <p className="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const page = () => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-0">Alerts</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="">Base UI</Link>
              </li>
              <div className="mx-1" style={{ height: 24 }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Alerts</li>
            </ol>
          </div>
        </Col>
      </Row>

      <Row>
        <BasicAlerts />
        <DismissibleAlerts />
        <LinkAlerts />
        <IconAlerts />
        <AdditionalContentAlerts />
      </Row>
    </>
  )
}

export default page
