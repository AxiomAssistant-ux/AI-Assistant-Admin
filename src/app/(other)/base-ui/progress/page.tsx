import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'

export const metadata: Metadata = { title: 'Progress ' }

const ProgressBarWorks = () => {
  return (
    <>
      <Col lg={4}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>How it works</CardTitle>
            <p className="card-subtitle">A progress bar can be used to show a user how far along he/she is in a process.</p>
          </CardHeader>
          <CardBody>
            <div className="progress mb-2">
              <div className="progress-bar" role="progressbar" aria-valuenow={0} aria-valuemin={0} aria-valuemax={100} />
            </div>
            <div className="progress mb-2">
              <div className="progress-bar" role="progressbar" style={{ width: '35%' }} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100} />
            </div>
            <div className="progress mb-2">
              <div className="progress-bar" role="progressbar" style={{ width: '50%' }} aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} />
            </div>
            <div className="progress mb-2">
              <div className="progress-bar" role="progressbar" style={{ width: '75%' }} aria-valuenow={75} aria-valuemin={0} aria-valuemax={100} />
            </div>
            <div className="progress">
              <div className="progress-bar" role="progressbar" style={{ width: '25%' }} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>
                25%
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const BackgroundProgressBar = () => {
  return (
    <>
      <Col lg={4}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Backgrounds Color</CardTitle>
            <p className="card-subtitle">Use background utility classes to change the appearance of individual progress bars.</p>
          </CardHeader>
          <CardBody>
            <div className="progress mb-2">
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{ width: '25%' }}
                aria-valuenow={25}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className="progress mb-2">
              <div
                className="progress-bar bg-secondary"
                role="progressbar"
                style={{ width: '50%' }}
                aria-valuenow={50}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className="progress mb-2">
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: '75%' }}
                aria-valuenow={75}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className="progress mb-2">
              <div
                className="progress-bar bg-info"
                role="progressbar"
                style={{ width: '100%' }}
                aria-valuenow={100}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className="progress">
              <div className="progress-bar" role="progressbar" style={{ width: '15%' }} aria-valuenow={15} aria-valuemin={0} aria-valuemax={100} />
              <div
                className="progress-bar bg-secondary"
                role="progressbar"
                style={{ width: '30%' }}
                aria-valuenow={30}
                aria-valuemin={0}
                aria-valuemax={100}
              />
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: '20%' }}
                aria-valuenow={20}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const StripedProgressBar = () => {
  return (
    <>
      <Col lg={4}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Striped Progress Bar</CardTitle>
            <p className="card-subtitle">
              Add <code>.progress-bar-striped</code> to any
              <code>.progress-bar</code> to apply a stripe via CSS gradient over the progress bar’s background color.
            </p>
          </CardHeader>
          <CardBody>
            <div className="progress mb-2">
              <div
                className="progress-bar bg-primary progress-bar-striped"
                role="progressbar"
                style={{ width: '25%' }}
                aria-valuenow={25}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className="progress mb-2">
              <div
                className="progress-bar bg-secondary progress-bar-striped"
                role="progressbar"
                style={{ width: '50%' }}
                aria-valuenow={50}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className="progress mb-2">
              <div
                className="progress-bar bg-success progress-bar-striped"
                role="progressbar"
                style={{ width: '75%' }}
                aria-valuenow={75}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className="progress mb-2">
              <div
                className="progress-bar bg-info progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: '65%' }}
                aria-valuenow={65}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className="progress">
              <div
                className="progress-bar bg-warning progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: '100%' }}
                aria-valuenow={100}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const HeightProgressBar = () => {
  return (
    <>
      <Col lg={4}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Height</CardTitle>
            <p className="card-subtitle">
              {' '}
              We only set a height value on the <code>.progress</code>, so if you change that value the inner
              <code>.progress-bar</code> will automatically resize accordingly. Use <code>.progress-xs</code>, <code>.progress-sm</code>,
              <code>.progress-md</code>, <code>.progress-lg</code> or <code>.progress-xl</code> classes.
            </p>
          </CardHeader>
          <CardBody>
            <div className="progress mb-2 progress-xs">
              <div className="progress-bar" role="progressbar" style={{ width: '25%' }} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100} />
            </div>
            <div className="progress mb-2 progress-sm">
              <div
                className="progress-bar bg-secondary"
                role="progressbar"
                style={{ width: '50%' }}
                aria-valuenow={50}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className="progress mb-2 progress-md">
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: '75%' }}
                aria-valuenow={75}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className="progress mb-2 progress-lg">
              <div
                className="progress-bar bg-info"
                role="progressbar"
                style={{ width: '35%' }}
                aria-valuenow={35}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className="progress progress-xl">
              <div
                className="progress-bar bg-warning"
                role="progressbar"
                style={{ width: '60%' }}
                aria-valuenow={60}
                aria-valuemin={0}
                aria-valuemax={100}
              />
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
            <h4 className="mb-0">Progress</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="">Base UI</Link>
              </li>
              <div className="mx-1" style={{ height: 24 }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Progress</li>
            </ol>
          </div>
        </Col>
      </Row>

      <Row>
        <ProgressBarWorks />
        <BackgroundProgressBar />
        <StripedProgressBar />
        <HeightProgressBar />
      </Row>
    </>
  )
}

export default page
