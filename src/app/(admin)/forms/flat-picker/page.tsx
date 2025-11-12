import ComponentContainerCard from '@/components/ComponentContainerCard'
import CustomFlatpickr from '@/components/CustomFlatpickr'
import Footer from '@/components/layout/Footer'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'

export const metadata: Metadata = { title: 'Flatpicker' }

const page = () => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-0">Flatpicker</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="">Form</Link>
              </li>
              <div className="mx-1" style={{ height: 24 }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Flatpicker</li>
            </ol>
          </div>
        </Col>
      </Row>

      <Row className=" row-cols-lg-2 gx-3">
        <Col>
          <Card>
            <CardHeader>
              <CardTitle as={'h5'} className="mb-0">
                Basic
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div>
                <CustomFlatpickr className="form-control" placeholder="Basic datepicker" options={{ enableTime: false }} />
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col>
          <Card>
            <CardHeader>
              <CardTitle as={'h5'} className="mb-0">
                DateTime
              </CardTitle>
            </CardHeader>
            <CardBody>
              <CustomFlatpickr
                className="form-control"
                placeholder="Date and Time"
                options={{
                  enableTime: true,
                  dateFormat: 'Y-m-d H:i',
                }}
              />
            </CardBody>
          </Card>
        </Col>

        <Col>
          <Card>
            <CardHeader>
              <CardTitle as={'h5'} className="mb-0">
                Human-friendly Dates
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div>
                <CustomFlatpickr
                  className="form-control"
                  placeholder="October 9,2018"
                  options={{
                    altInput: true,
                    enableTime: false,
                    altFormat: 'F j, Y',
                    dateFormat: 'Y-m-d',
                  }}
                />
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col>
          <Card>
            <CardHeader>
              <CardTitle as={'h5'} className="mb-0">
                MinDate and MaxDate
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div>
                <CustomFlatpickr
                  className="form-control"
                  placeholder="mindate - maxdate"
                  options={{
                    enableTime: false,
                    minDate: '2020-01-01',
                    maxDate: '2020-03-05',
                  }}
                />
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col>
          <Card>
            <CardHeader>
              <CardTitle as={'h5'} className="mb-0">
                Disabling dates
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div>
                <CustomFlatpickr
                  className="form-control"
                  placeholder="Disabling dates"
                  options={{
                    disable: ['2025-01-10', '2025-01-21', '2025-01-30'],
                    enableTime: false,
                    defaultDate: '2025-01',
                  }}
                />
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col>
          <Card>
            <CardHeader>
              <CardTitle as={'h5'} className="mb-0">
                Selecting multiple dates
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div>
                <CustomFlatpickr
                  className="form-control"
                  placeholder="Multiple dates"
                  options={{
                    enableTime: false,
                    mode: 'multiple',
                    dateFormat: 'Y-m-d',
                  }}
                />
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col>
          <Card>
            <CardHeader>
              <CardTitle as={'h5'} className="mb-0">
                Selecting multiple dates - Conjunction
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div>
                <CustomFlatpickr
                  className="form-control"
                  placeholder="2018-10-10 :: 2018-10-11"
                  options={{
                    mode: 'multiple',
                    dateFormat: 'Y-m-d',
                    conjunction: ' :: ',
                    enableTime: false,
                  }}
                />
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col>
          <Card>
            <CardHeader>
              <CardTitle as={'h5'} className="mb-0">
                Range Calendar
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div>
                <CustomFlatpickr
                  className="form-control"
                  placeholder="2018-10-03 to 2018-10-10"
                  options={{
                    mode: 'range',
                    enableTime: false,
                  }}
                />
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col>
          <Card>
            <CardHeader>
              <CardTitle as={'h5'} className="mb-0">
                Basic Timepicker
              </CardTitle>
            </CardHeader>
            <CardBody>
              <CustomFlatpickr
                className="form-control"
                placeholder="Basic timepicker"
                options={{
                  noCalendar: true,
                  dateFormat: 'H:i',
                }}
              />
            </CardBody>
          </Card>
        </Col>

        <Col>
          <Card>
            <CardHeader>
              <CardTitle as={'h5'} className="mb-0">
                24-hour Time Picker
              </CardTitle>
            </CardHeader>
            <CardBody>
              <CustomFlatpickr
                className="form-control"
                placeholder="16:21"
                options={{
                  noCalendar: true,
                  dateFormat: 'H:i',
                  time_24hr: true,
                }}
              />
            </CardBody>
          </Card>
        </Col>

        <Col>
          <Card>
            <CardHeader>
              <CardTitle as={'h5'} className="mb-0">
                Time Picker w/ Limits
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div>
                <CustomFlatpickr
                  className="form-control"
                  placeholder="Limits"
                  options={{
                    noCalendar: true,
                    dateFormat: 'H:i',
                    minTime: '16:00',
                    maxTime: '22:30',
                  }}
                />
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col>
          <Card>
            <CardHeader>
              <CardTitle as={'h5'} className="mb-0">
                Preloading Time
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div>
                <CustomFlatpickr
                  className="form-control"
                  placeholder="01:45"
                  options={{
                    noCalendar: true,
                    enableTime: true,
                    dateFormat: 'H:i',
                    defaultDate: '13:45',
                  }}
                />
              </div>
            </CardBody>
          </Card>
        </Col>

        <ComponentContainerCard id="inline-calendar" title="Inline Calendar" titleClass="mb-3">
          <Row>
            <Col lg={6}>
              <CustomFlatpickr
                className="form-control"
                placeholder="Inline Calender"
                options={{
                  inline: true,
                  enableTime: false,
                }}
              />
            </Col>
          </Row>
        </ComponentContainerCard>
      </Row>
      <Footer />
    </>
  )
}

export default page
