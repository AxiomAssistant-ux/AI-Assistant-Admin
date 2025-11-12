import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { colorVariants } from '@/context/constants'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, OverlayProps, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'

export const metadata: Metadata = { title: 'Tooltips' }

const TooltipDirection = () => {
  const directions: OverlayProps['placement'][] = ['top', 'right', 'bottom', 'left']

  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Tooltip Direction</CardTitle>
            <p className="card-subtitle">Four options are available: top, right, bottom, and left aligned.</p>
          </CardHeader>
          <CardBody>
            <div className="d-flex flex-wrap gap-3">
              {directions.map((direction, idx) => (
                <OverlayTrigger placement={direction} overlay={<Tooltip>Tooltip on {direction}</Tooltip>} key={idx}>
                  <Button
                    variant="primary"
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-title="Tooltip on top">
                    Tooltip on {direction}
                  </Button>
                </OverlayTrigger>
              ))}
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const ColorTooltip = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Color Tooltip</CardTitle>
            <p className="card-subtitle">
              We set a custom class with ex.
              <code>data-bs-custom-class=&quot;primary-tooltip&quot;</code> to scope our background-color <br />
              primary appearance and use it to override a local CSS variable.
            </p>
          </CardHeader>
          <CardBody>
            <div className="d-flex flex-wrap gap-3">
              {/* <div>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-custom-class="primary-tooltip"
                  data-bs-title="This top tooltip is themed via CSS variables."
                >
                  Primary tooltip
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-custom-class="danger-tooltip"
                  data-bs-title="This top tooltip is themed via CSS variables."
                >
                  Danger tooltip
                </button>
                <button
                  type="button"
                  className="btn btn-info"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-custom-class="info-tooltip"
                  data-bs-title="This top tooltip is themed via CSS variables."
                >
                  Info tooltip
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-custom-class="success-tooltip"
                  data-bs-title="This top tooltip is themed via CSS variables."
                >
                  Success tooltip
                </button>
              </div> */}

              {colorVariants.slice(0, 4).map((color, idx) => (
                <OverlayTrigger key={idx} overlay={<Tooltip className={`${color}-tooltip`}>This top tooltip is themed via CSS variables.</Tooltip>}>
                  <Button variant={color}>{color.charAt(0).toUpperCase() + color.slice(1)} tooltip</Button>
                </OverlayTrigger>
              ))}
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const TooltipsonLinks = () => {
  const directions: OverlayProps['placement'][] = ['top']
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Tooltips on links</CardTitle>
            <p className="card-subtitle">Hover over the links below to see tooltips:</p>
          </CardHeader>
          <CardBody>
            <p className="muted">
              Placeholder text to demonstrate some
              {directions.map((direction, idx) => (
                <OverlayTrigger placement={direction} overlay={<Tooltip>Default tooltip</Tooltip>} key={idx}>
                  <Link href="" className="link-danger" data-bs-toggle="tooltip" data-bs-title="Default tooltip">
                    inline links &nbsp;
                  </Link>
                </OverlayTrigger>
              ))}
              with tooltips. This is now just filler, no killer. Content placed here just to mimic the presence of
              {directions.map((direction, idx) => (
                <OverlayTrigger placement={direction} overlay={<Tooltip>Another tooltip </Tooltip>} key={idx}>
                  <Link href="" className="link-danger" data-bs-toggle="tooltip" data-bs-title="Another tooltip">
                    real text
                  </Link>
                </OverlayTrigger>
              ))}
              . And all that just to give you an idea of how tooltips would look when used in real-world situations. So hopefully you&apos;ve now seen
              how
              {directions.map((direction, idx) => (
                <OverlayTrigger placement={direction} overlay={<Tooltip>Another one here too</Tooltip>} key={idx}>
                  <Link href="" className="link-danger" data-bs-toggle="tooltip" data-bs-title="Another one here too">
                    these tooltips on links &nbsp;
                  </Link>
                </OverlayTrigger>
              ))}
              can work in practice, once you use them on
              {directions.map((direction, idx) => (
                <OverlayTrigger placement={direction} overlay={<Tooltip>The last tip!</Tooltip>} key={idx}>
                  <Link href="" className="link-danger" data-bs-toggle="tooltip" data-bs-title="The last tip!">
                    your own &nbsp;
                  </Link>
                </OverlayTrigger>
              ))}
              site or project.
            </p>
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
            <h4 className="mb-0">Tooltips</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="">Base UI</Link>
              </li>
              <div className="mx-1" style={{ height: 24 }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Tooltips</li>
            </ol>
          </div>
        </Col>
      </Row>

      <Row>
        <TooltipDirection />
        <ColorTooltip />
        <TooltipsonLinks />
      </Row>
    </>
  )
}

export default page
