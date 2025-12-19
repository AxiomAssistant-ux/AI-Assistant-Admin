import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'

export const metadata: Metadata = { title: 'Badge | Taplox - Responsive Admin Dashboard Template' }

const HeadingBadge = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Heading</CardTitle>
            <p className="card-subtitle">
              Provide contextual feedback messages for typical user actions with the handful of available and flexible alert messages. Alerts are
              available for any length of text, as well as an optional dismiss button.
            </p>
          </CardHeader>
          <CardBody>
            <h1>
              h1.Example heading <span className="badge bg-primary">New</span>
            </h1>
            <h2>
              h2.Example heading <span className="badge bg-secondary">New</span>
            </h2>
            <h3>
              h3.Example heading <span className="badge bg-success">New</span>
            </h3>
            <h4>
              h4.Example heading <span className="badge bg-info">New</span>
            </h4>
            <h5>
              h5.Example heading <span className="badge bg-warning">New</span>
            </h5>
            <h6 className="mb-0">
              h6.Example heading <span className="badge bg-danger">New</span>
            </h6>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const OutlineBadges = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Outline &amp; Outline Pill Badges</CardTitle>
          <p className="card-subtitle">
            Using the <code>.badge-outline-**</code> to quickly create a bordered badges.
          </p>
        </CardHeader>
        <CardBody>
          <div className="mb-2">
            <span className="badge badge-outline-primary me-1">Primary</span>
            <span className="badge badge-outline-secondary me-1">Secondary</span>
            <span className="badge badge-outline-success me-1">Success</span>
            <span className="badge badge-outline-info me-1">Info</span>
            <span className="badge badge-outline-warning me-1">Warning</span>
            <span className="badge badge-outline-danger me-1">Danger</span>
            <span className="badge badge-outline-dark me-1">Dark</span>
            <span className="badge badge-outline-purple me-1">Purple</span>
            <span className="badge badge-outline-pink me-1">Pink</span>
            <span className="badge badge-outline-orange me-1">Orange</span>
          </div>
          <div>
            <span className="badge badge-outline-primary rounded-pill me-1">Primary</span>
            <span className="badge badge-outline-secondary rounded-pill me-1">Secondary</span>
            <span className="badge badge-outline-success rounded-pill me-1">Success</span>
            <span className="badge badge-outline-info rounded-pill me-1">Info</span>
            <span className="badge badge-outline-warning rounded-pill me-1">Warning</span>
            <span className="badge badge-outline-danger rounded-pill me-1">Danger</span>
            <span className="badge badge-outline-dark rounded-pill me-1">Dark</span>
            <span className="badge badge-outline-purple rounded-pill me-1">Purple</span>
            <span className="badge badge-outline-pink rounded-pill me-1">Pink</span>
            <span className="badge badge-outline-orange rounded-pill me-1">Orange</span>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

const SoftBadges = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Soft &amp; Soft Pill Badges</CardTitle>
          <p className="card-subtitle">
            Using the <code>.badge-soft-**</code> modifier class, you can have more soften variation.
          </p>
        </CardHeader>
        <CardBody>
          <div className="mb-2">
            <span className="badge badge-soft-primary me-1">Primary</span>
            <span className="badge badge-soft-secondary me-1">Secondary</span>
            <span className="badge badge-soft-success me-1">Success</span>
            <span className="badge badge-soft-info me-1">Info</span>
            <span className="badge badge-soft-warning me-1">Warning</span>
            <span className="badge badge-soft-danger me-1">Danger</span>
            <span className="badge badge-soft-dark me-1">Dark</span>
            <span className="badge badge-soft-purple me-1">Purple</span>
            <span className="badge badge-soft-pink me-1">Pink</span>
            <span className="badge badge-soft-orange me-1">Orange</span>
          </div>
          <div>
            <span className="badge badge-soft-primary rounded-pill me-1">Primary</span>
            <span className="badge badge-soft-secondary rounded-pill me-1">Secondary</span>
            <span className="badge badge-soft-success rounded-pill me-1">Success</span>
            <span className="badge badge-soft-info rounded-pill me-1">Info</span>
            <span className="badge badge-soft-warning rounded-pill me-1">Warning</span>
            <span className="badge badge-soft-danger rounded-pill me-1">Danger</span>
            <span className="badge badge-soft-dark rounded-pill me-1">Dark</span>
            <span className="badge badge-soft-purple rounded-pill me-1">Purple</span>
            <span className="badge badge-soft-pink rounded-pill me-1">Pink</span>
            <span className="badge badge-soft-orange rounded-pill me-1">Orange</span>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

const DefaultBadges = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Default &amp; Pill Badges</CardTitle>
            <p className="card-subtitle">
              Use our background utility classes to quickly change the appearance of a badge. And use the <code>.rounded-pill</code>
              class to make badges more rounded.
            </p>
          </CardHeader>
          <CardBody>
            <div className="mb-2">
              <span className="badge bg-primary me-1">Primary</span>
              <span className="badge bg-secondary me-1">Secondary</span>
              <span className="badge bg-success me-1">Success</span>
              <span className="badge bg-info me-1">Info</span>
              <span className="badge bg-warning me-1">Warning</span>
              <span className="badge bg-danger me-1">Danger</span>
              <span className="badge bg-dark me-1">Dark</span>
              <span className="badge bg-purple me-1">Purple</span>
              <span className="badge bg-pink me-1">Pink</span>
              <span className="badge bg-orange me-1">Orange</span>
            </div>
            <div>
              <span className="badge bg-primary rounded-pill me-1">Primary</span>
              <span className="badge bg-secondary rounded-pill me-1">Secondary</span>
              <span className="badge bg-success rounded-pill me-1">Success</span>
              <span className="badge bg-info rounded-pill me-1">Info</span>
              <span className="badge bg-warning rounded-pill me-1">Warning</span>
              <span className="badge bg-danger rounded-pill me-1">Danger</span>
              <span className="badge bg-dark rounded-pill me-1">Dark</span>
              <span className="badge bg-purple rounded-pill me-1">Purple</span>
              <span className="badge bg-pink rounded-pill me-1">Pink</span>
              <span className="badge bg-orange rounded-pill me-1">Orange</span>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const ButtonAndPosition = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Buttons &amp; Position</CardTitle>
            <p className="card-subtitle">Alerts can also contain additional HTML elements like headings, paragraphs and dividers.</p>
          </CardHeader>
          <CardBody>
            <div className="mb-2">
              <button type="button" className="btn btn-primary me-1 mb-1">
                Notifications <span className="badge bg-danger ms-1">4</span>
              </button>
              <button type="button" className="btn btn-outline-primary me-1 mb-1">
                Notifications
                <span className="badge bg-primary ms-1">new</span>
              </button>
              <button type="button" className="btn btn-soft-primary me-1 mb-1">
                Notifications
                <span className="badge bg-primary ms-1">11</span>
              </button>
              <Link href="" className="btn me-1 mb-1">
                Notifications
                <span className="badge bg-primary ms-1">90+</span>
              </Link>
            </div>
            <div>
              <button type="button" className="btn btn-primary position-relative me-3">
                Inbox
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light">99+</span>
              </button>
              <button type="button" className="btn btn-primary position-relative">
                Profile
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" />
              </button>
            </div>
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
            <h4 className="mb-0">Badge</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="">Base UI</Link>
              </li>
              <div className="mx-1" style={{ height: 24 }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Badge</li>
            </ol>
          </div>
        </Col>
      </Row>

      <Row>
        <HeadingBadge />
        <Col lg={6}>
          <OutlineBadges />
          <SoftBadges />
        </Col>
        <DefaultBadges />
        <ButtonAndPosition />
      </Row>
    </>
  )
}

export default page
