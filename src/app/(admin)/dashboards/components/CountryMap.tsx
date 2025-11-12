'use client'
import WorldVectorMap from '@/components/VectorMap/WorldMap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import React from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap'

const CountryMap = () => {
  const salesLocationOptions = {
    map: 'world',
    zoomOnScroll: true,
    zoomButtons: false,
    markersSelectable: true,
    markers: [
      { name: 'Canada', coords: [56.1304, -106.3468] },
      { name: 'Brazil', coords: [-14.235, -51.9253] },
      { name: 'Russia', coords: [61, 105] },
      { name: 'China', coords: [35.8617, 104.1954] },
      { name: 'United States', coords: [37.0902, -95.7129] },
    ],
    markerStyle: {
      initial: { fill: '#7f56da' },
      selected: { fill: '#1bb394' },
    },
    labels: {
      markers: {},
    },
    regionStyle: {
      initial: {
        fill: 'rgba(169,183,197, 0.3)',
        fillOpacity: 1,
      },
    },
  }

  return (
    <>
      <Col lg={6}>
        <Card className=" card-height-100">
          <CardHeader className="d-flex  justify-content-between align-items-center border-bottom border-dashed">
            <CardTitle as={'h4'}>Sessions by Country</CardTitle>
            <Dropdown>
              <DropdownToggle variant="secondary" className=" btn btn-sm btn-outline-light content-none">
                View Data <IconifyIcon icon="bx:bx-chevron-down" style={{ marginLeft: '5px', fontSize: '16px' }} />
              </DropdownToggle>
              <DropdownMenu className=" dropdown-menu-end">
                <DropdownItem href="">Download</DropdownItem>
                <DropdownItem href="">Export</DropdownItem>
                <DropdownItem href="">Import</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </CardHeader>
          <CardBody className="pt-0">
            <Row className=" align-items-center">
              <Col lg={7}>
                <div id="world-map-markers" className="mt-3" style={{ height: '300px' }}>
                  <WorldVectorMap height="300px" width="100%" options={salesLocationOptions} />
                </div>
              </Col>
              <Col lg={5} dir="ltr">
                <div className="p-3 pb-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="mb-1">
                      <IconifyIcon icon="circle-flags:us" className="fs-16 align-middle me-1" />
                      <span className="align-middle">United States</span>
                    </p>
                  </div>
                  <Row className=" align-items-center mb-3">
                    <Col>
                      <div className="progress progress-soft progress-sm">
                        <div
                          className="progress-bar bg-secondary"
                          role="progressbar"
                          style={{ width: '82.05%' }}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                    </Col>
                    <Col xs={'auto'}>
                      <p className="mb-0 fs-13 fw-semibold">659k</p>
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="mb-1">
                      <IconifyIcon icon="circle-flags:ru" className="fs-16 align-middle me-1" />
                      <span className="align-middle">Russia</span>
                    </p>
                  </div>
                  <Row className=" align-items-center mb-3">
                    <Col>
                      <div className="progress progress-soft progress-sm">
                        <div className="progress-bar bg-info" role="progressbar" style={{ width: '70.5%' }} aria-valuemin={0} aria-valuemax={100} />
                      </div>
                    </Col>
                    <Col xs={'auto'}>
                      <p className="mb-0 fs-13 fw-semibold">485k</p>
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="mb-1">
                      <IconifyIcon icon="circle-flags:cn" className="fs-16 align-middle me-1" />
                      <span className="align-middle">China</span>
                    </p>
                  </div>
                  <Row className=" align-items-center mb-3">
                    <Col>
                      <div className="progress progress-soft progress-sm">
                        <div
                          className="progress-bar bg-warning"
                          role="progressbar"
                          style={{ width: '65.8%' }}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                    </Col>
                    <Col xs={'auto'}>
                      <p className="mb-0 fs-13 fw-semibold">355k</p>
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="mb-1">
                      <IconifyIcon icon="circle-flags:ca" className="fs-16 align-middle me-1" />
                      <span className="align-middle">Canada</span>
                    </p>
                  </div>
                  <Row className=" align-items-center">
                    <Col>
                      <div className="progress progress-soft progress-sm">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: '55.8%' }}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                    </Col>
                    <Col xs={'auto'}>
                      <p className="mb-0 fs-13 fw-semibold">204k</p>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

export default CountryMap
