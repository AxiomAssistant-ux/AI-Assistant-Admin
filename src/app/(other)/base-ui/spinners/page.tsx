import Spinner from '@/components/Spinner'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { colorVariants } from '@/context/constants'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'

export const metadata: Metadata = { title: 'Spinners ' }

const BorderedSpinners = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Border Spinners</CardTitle>
            <p className="card-subtitle">Use the border spinners for a lightweight loading indicator.</p>
          </CardHeader>
          <CardBody>
            <Spinner />
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const ColorSpinners = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Color Spinners</CardTitle>
            <p className="card-subtitle">You can use any of our text color utilities on the standard spinner.</p>
          </CardHeader>
          <CardBody>
            {colorVariants.slice(0, 6).map((color, idx) => (
              <Spinner key={idx} className="me-3" color={color} />
            ))}
          </CardBody>
        </Card>
      </Col>
    </>
  )
}
const GrowingSpinners = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Growing Spinners</CardTitle>
            <p className="card-subtitle">
              If you don’t fancy a border spinner, switch to the grow spinner. While it doesn’t technically spin, it does repeatedly grow!
            </p>
          </CardHeader>
          <CardBody>
            <Spinner type="grow" />
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const ColorGrowingSpinners = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Color Growing Spinners</CardTitle>
            <p className="card-subtitle">You can use any of our text color utilities on the standard spinner.</p>
          </CardHeader>
          <CardBody>
            {colorVariants.slice(0, 6).map((color, idx) => (
              <Spinner key={idx} className="m-2" type="grow" color={color} />
            ))}
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const AlignmentSpinner = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Alignment</CardTitle>
            <p className="card-subtitle">
              Use flexbox utilities, float utilities, or text alignment utilities to place spinners exactly where you need them in any situation.
            </p>
          </CardHeader>
          <CardBody>
            <div className="d-flex justify-content-center border p-2">
              <Spinner />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const SpinnersSize = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Size</CardTitle>
            <p className="card-subtitle">
              Add <code>.spinner-border-sm</code> and <code>.spinner-border.sm-**</code> to make a smaller spinner that can quickly be used within
              other components.
            </p>
          </CardHeader>
          <CardBody>
            <Spinner className="spinner-border-sm me-3"></Spinner>
            <Spinner type="grow" className="spinner-grow-sm me-3" />
            <Spinner className="text-primary me-3" color="primary" size="sm" />
            <Spinner className="me-3" type="grow" size="sm" color="primary" />
          </CardBody>
        </Card>
      </Col>
    </>
  )
}
const SpinnersPlacement = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Placement</CardTitle>
            <p className="card-subtitle">
              Use <code>flexbox utilities</code>, <code>float utilities</code>, or <code>text alignment</code> utilities to place spinners exactly
              where you need them in any situation.
            </p>
          </CardHeader>
          <CardBody>
            <div className="d-flex align-items-center border p-2">
              <strong>Loading...</strong>
              <Spinner className="ms-auto" />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const ButtonSpinners = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Buttons Spinner</CardTitle>
            <p className="card-subtitle">
              Use spinners within buttons to indicate an action is currently processing or taking place. You may also swap the text out of the spinner
              element and utilize button text as needed.
            </p>
          </CardHeader>
          <CardBody>
            <button className="btn btn-primary me-1" type="button" disabled>
              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
              Loading...
            </button>
            <button className="btn btn-primary" type="button" disabled>
              <Spinner className="spinner-grow-sm me-1" tag="span" color="white" type="grow" />
              Loading...
            </button>
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
            <h4 className="mb-0">Spinners</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="">Base UI</Link>
              </li>
              <div className="mx-1" style={{ height: 24 }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Spinners</li>
            </ol>
          </div>
        </Col>
      </Row>

      <Row>
        <BorderedSpinners />
        <ColorSpinners />
        <GrowingSpinners />
        <ColorGrowingSpinners />
        <AlignmentSpinner />
        <SpinnersSize />
        <SpinnersPlacement />
        <ButtonSpinners />
      </Row>
    </>
  )
}

export default page
