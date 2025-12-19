'use client'
import React from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, OverlayTrigger, Popover, PopoverBody, PopoverHeader } from 'react-bootstrap'
import { Placement } from 'react-bootstrap/esm/types'

const LiveDemo = () => {
  const basicPopover = (
    <Popover id="popover-basic">
      <PopoverHeader as="h3">Popover title</PopoverHeader>
      <PopoverBody>And here&apos;s some amazing content. It&apos;s very engaging. Right?</PopoverBody>
    </Popover>
  )
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Live demo</CardTitle>
            <p className="card-subtitle">
              We use JavaScript similar to the snippet above to render the following live popover. Titles are set via
              <code>data-bs-title</code> and body content is set via
              <code>data-bs-content</code>.
            </p>
          </CardHeader>
          <CardBody>
            <OverlayTrigger trigger={'click'} placement="right" overlay={basicPopover}>
              <Button type="button" variant="danger">
                Click to toggle popover
              </Button>
            </OverlayTrigger>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const PopoverDirection = () => {
  const directions: Placement[] = ['top', 'bottom', 'left', 'right']

  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Popover Directions</CardTitle>
            <p className="card-subtitle">Four options are available: top, right, bottom, and left aligned.</p>
          </CardHeader>
          <CardBody>
            <div className="d-flex flex-wrap gap-2">
              {directions.map((direction, idx) => (
                <OverlayTrigger
                  trigger="click"
                  key={idx}
                  placement={direction}
                  overlay={
                    <Popover id={`popover-positioned-${direction}`}>
                      <PopoverBody>Vivamus sagittis lacus vel augue laoreet rutrum faucibus.</PopoverBody>
                    </Popover>
                  }>
                  <Button variant="primary">Popover on {direction}</Button>
                </OverlayTrigger>
              ))}
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const DismissOnNextClick = () => {
  const dismissiblePopover = (
    <Popover>
      <PopoverHeader as="h3">Dismissible popover</PopoverHeader>
      <PopoverBody>And here&apos;s some amazing content. It&apos;s very engaging. Right?</PopoverBody>
    </Popover>
  )
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Dismiss on Next Click</CardTitle>
            <p className="card-subtitle">
              Use the <code>focus</code> trigger to dismiss popovers on the user’s next click of a different element than the toggle element.
            </p>
          </CardHeader>
          <CardBody>
            <OverlayTrigger trigger="focus" placement="right" overlay={dismissiblePopover}>
              <Button variant="success" tabIndex={0}>
                Dismissible popover
              </Button>
            </OverlayTrigger>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const HoverPopover = () => {
  const hoverPopover = (
    <Popover>
      <PopoverHeader as="h3">Ohh Wow !</PopoverHeader>
      <PopoverBody>And here&apos;s some amazing content. It&apos;s very engaging. Right?</PopoverBody>
    </Popover>
  )
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Hover</CardTitle>
            <p className="card-subtitle">
              Use the <code>data-bs-trigger=&quot;hover&quot;</code> trigger Hover to show popover.
            </p>
          </CardHeader>
          <CardBody>
            <OverlayTrigger trigger={['hover', 'focus']} placement="right" overlay={hoverPopover}>
              <Button variant="dark"> Please Hover Me</Button>
            </OverlayTrigger>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const CustomPopovers = () => {
  const customPopover = (variant: string) => (
    <Popover className={`${variant}-popover`}>
      <PopoverHeader as="h3">{variant.charAt(0).toUpperCase() + variant.slice(1)} popover</PopoverHeader>
      <PopoverBody>This popover is themed via CSS variables.</PopoverBody>
    </Popover>
  )
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Custom Popovers</CardTitle>
            <p className="card-subtitle">
              ou can customize the appearance of popovers using CSS variables. We set a custom class with
              <code>data-bs-custom-class=&quot;primary-popover&quot;</code> to scope our custom appearance and use it to override some of the local
              CSS variables.
            </p>
          </CardHeader>
          <CardBody>
            <div className="button-list">
              <OverlayTrigger trigger="click" placement="top" overlay={customPopover('primary')}>
                <Button variant="primary">Primary popover</Button>
              </OverlayTrigger>
              <OverlayTrigger trigger="click" placement="top" overlay={customPopover('success')}>
                <Button variant="success">Success popover</Button>
              </OverlayTrigger>
              <OverlayTrigger trigger="click" placement="top" overlay={customPopover('danger')}>
                <Button variant="danger">Danger popover</Button>
              </OverlayTrigger>
              <OverlayTrigger trigger="click" placement="top" overlay={customPopover('info')}>
                <Button variant="info">Info popover</Button>
              </OverlayTrigger>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const DisabledPopover = () => {
  const disabledPopover = (
    <Popover>
      <PopoverBody>Disabled popover</PopoverBody>
    </Popover>
  )
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Disabled Elements</CardTitle>
            <p className="card-subtitle">
              Elements with the <code>disabled</code> attribute aren’t interactive, meaning users cannot hover or click them to trigger a popover (or
              tooltip). As a workaround, you’ll want to trigger the popover from a wrapper <code>&lt;div&gt;</code> or <code>&lt;span&gt;</code> and
              override the
              <code>pointer-events</code> on the disabled element.
            </p>
          </CardHeader>
          <CardBody>
            <OverlayTrigger placement="right" overlay={disabledPopover}>
              <span className="d-inline-block">
                <Button disabled style={{ pointerEvents: 'none' }}>
                  Disabled button
                </Button>
              </span>
            </OverlayTrigger>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}
const AllPopovers = () => {
  return (
    <>
      <LiveDemo />
      <PopoverDirection />
      <DismissOnNextClick />
      <HoverPopover />
      <CustomPopovers />
      <DisabledPopover />
    </>
  )
}

export default AllPopovers
