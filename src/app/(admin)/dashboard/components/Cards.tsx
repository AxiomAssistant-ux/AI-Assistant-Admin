import IconifyIcon from '@/components/wrapper/IconifyIcon'
import React from 'react'
import { Card, CardBody, CardFooter, Col, Row } from 'react-bootstrap'

const Cards = () => {
  return (
    <>
      <Row>
        <Col md={6} xl={3}>
          <Card>
            <CardBody>
              <Row>
                <Col xs={6}>
                  <div className="avatar-md bg-primary bg-opacity-10 rounded-circle">
                    <IconifyIcon icon="solar:globus-outline" className=" text-primary avatar-title " style={{ padding: '12px' }} />
                  </div>
                </Col>
                <Col xs={6} className="text-end">
                  <p className="text-muted mb-0 text-truncate">Clicks</p>
                  <h3 className="text-dark mt-2 mb-0">15,352</h3>
                </Col>
              </Row>
            </CardBody>
            <CardFooter className=" border-0 py-2 bg-light bg-opacity-50 mx-2 mb-2">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-success">
                    <IconifyIcon icon="bxs:up-arrow" className="bx fs-12  " style={{ marginBottom: '3px' }} /> 3.02%
                  </span>
                  <span className="text-muted ms-1 fs-12"> &nbsp;From last month</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </Col>
        <Col md={6} xl={3}>
          <Card>
            <CardBody>
              <Row>
                <Col xs={6}>
                  <div className="avatar-md bg-primary bg-opacity-10 rounded-circle">
                    <IconifyIcon icon="solar:bag-check-outline" style={{ padding: '12px' }} className=" text-primary avatar-title" />
                  </div>
                </Col>
                <Col xs={6} className="text-end">
                  <p className="text-muted mb-0 text-truncate">Sales</p>
                  <h3 className="text-dark mt-2 mb-0">8,764</h3>
                </Col>
              </Row>
            </CardBody>
            <CardFooter className="border-0 py-2 bg-light bg-opacity-50 mx-2 mb-2">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-danger">
                    <IconifyIcon icon="bxs:down-arrow" className="bx fs-12  " style={{ marginBottom: '3px' }} /> 1.15%
                  </span>
                  <span className="text-muted ms-1 fs-12">&nbsp;From last month</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </Col>
        <Col md={6} xl={3}>
          <Card>
            <CardBody>
              <Row>
                <Col xs={6}>
                  <div className="avatar-md bg-primary bg-opacity-10 rounded-circle">
                    <IconifyIcon icon="solar:calendar-date-outline" className="text-primary avatar-title" style={{ padding: '12px' }} />
                  </div>
                </Col>
                <Col xs={6} className="text-end">
                  <p className="text-muted mb-0 text-truncate">Events</p>
                  <h3 className="text-dark mt-2 mb-0">5,123</h3>
                </Col>
              </Row>
            </CardBody>
            <CardFooter className="border-0 py-2 bg-light bg-opacity-50 mx-2 mb-2">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-success">
                    <IconifyIcon icon="bxs:up-arrow" className="bx fs-12  " style={{ marginBottom: '3px' }} /> 4.78%
                  </span>
                  <span className="text-muted ms-1 fs-12">&nbsp;From last month</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </Col>
        <Col md={6} xl={3}>
          <Card>
            <CardBody>
              <Row>
                <Col xs={6}>
                  <div className="avatar-md bg-primary bg-opacity-10 rounded-circle">
                    <IconifyIcon icon="solar:users-group-two-rounded-outline" className="text-primary avatar-title" style={{ padding: '12px' }} />
                  </div>
                </Col>
                <Col xs={6} className="text-end">
                  <p className="text-muted mb-0 text-truncate">Users</p>
                  <h3 className="text-dark mt-2 mb-0">12,945</h3>
                </Col>
              </Row>
            </CardBody>
            <CardFooter className="border-0 py-2 bg-light bg-opacity-50 mx-2 mb-2">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-success">
                    <IconifyIcon icon="bxs:up-arrow" className="bx fs-12  " style={{ marginBottom: '3px' }} /> 2.35%
                  </span>
                  <span className="text-muted ms-1 fs-12">&nbsp;From last month</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Cards
