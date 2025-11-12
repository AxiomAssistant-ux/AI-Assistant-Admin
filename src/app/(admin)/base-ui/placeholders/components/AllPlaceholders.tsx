import Link from 'next/link'
import React from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'

const DefaultPlaceholders = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Default</CardTitle>
            <p className="card-subtitle">A progress bar can be used to show a user how far along he/she is in a process.</p>
          </CardHeader>
          <CardBody>
            <Row className=" g-4">
              <Col md={4}>
                <Card>
                  <svg
                    className="bd-placeholder-img card-img-top"
                    width="100%"
                    height={180}
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label="Placeholder"
                    preserveAspectRatio="xMidYMid slice"
                    focusable="false">
                    <title>Placeholder</title>
                    <rect width="100%" height="100%" fill="#20c997" />
                  </svg>
                  <CardBody>
                    <CardTitle as={'h5'} className=" mb-2">
                      Card title
                    </CardTitle>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card&apos;s content.</p>
                    <Link href="" className="btn btn-primary">
                      Go somewhere
                    </Link>
                  </CardBody>
                </Card>
              </Col>
              <Col md={4}>
                <Card aria-hidden="true">
                  <svg
                    className="bd-placeholder-img card-img-top"
                    width="100%"
                    height={180}
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label="Placeholder"
                    preserveAspectRatio="xMidYMid slice"
                    focusable="false">
                    <title>Placeholder</title>
                    <rect width="100%" height="100%" fill="#868e96" />
                  </svg>
                  <CardBody>
                    <div className="h5 card-title placeholder-glow">
                      <span className="placeholder col-6" />
                    </div>
                    <p className="card-text placeholder-glow">
                      <span className="placeholder col-7" />
                      &nbsp;
                      <span className="placeholder col-4" />
                      <span className="placeholder col-4" />
                      &nbsp;
                      <span className="placeholder col-6" />
                      <span className="placeholder col-8" />
                    </p>
                    <Link href="" tabIndex={-1} className="btn btn-primary disabled placeholder col-6" />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const PlaceholdersConcept = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>How it works</CardTitle>
            <p className="card-subtitle">
              Create placeholders with the <code>.placeholder</code> class and a grid column class (e.g., <code>.col-6</code>) to set the
              <code>width</code>. They can <br /> replace the text inside an element or be added as a modifier class to an existing component.
            </p>
          </CardHeader>
          <CardBody>
            <p aria-hidden="true">
              <span className="placeholder col-6" />
            </p>
            <Link href="" tabIndex={-1} className="btn btn-primary disabled placeholder col-4" aria-hidden="true" />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Color</CardTitle>
            <p className="card-subtitle">
              By default, the <code>placeholder</code> uses
              <code>currentColor</code>. This can be overridden with a custom color or utility class.
            </p>
          </CardHeader>
          <CardBody>
            <span className="placeholder col-12" />
            <span className="placeholder col-12 bg-primary" />
            <span className="placeholder col-12 bg-secondary" />
            <span className="placeholder col-12 bg-success" />
            <span className="placeholder col-12 bg-danger" />
            <span className="placeholder col-12 bg-warning" />
            <span className="placeholder col-12 bg-info" />
            <span className="placeholder col-12 bg-light" />
            <span className="placeholder col-12 bg-dark" />
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const PlaceholdersWidth = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Width</CardTitle>
            <p className="card-subtitle">
              You can change the <code>width</code> through grid column classes, width utilities, or inline styles.
            </p>
          </CardHeader>
          <CardBody>
            <span className="placeholder col-6" />
            <span className="placeholder w-75" />
            <br />
            <span className="placeholder" style={{ width: '25%' }} />
          </CardBody>
        </Card>
      </Col>
    </>
  )
}
const AllPlaceholders = () => {
  return (
    <>
      <DefaultPlaceholders />
      <PlaceholdersConcept />
      <PlaceholdersWidth />
    </>
  )
}

export default AllPlaceholders
