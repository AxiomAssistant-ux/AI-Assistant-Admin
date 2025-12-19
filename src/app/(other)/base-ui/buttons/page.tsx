import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap'

export const metadata: Metadata = { title: 'Buttons | Taplox - Responsive Admin Dashboard Template' }

const DefaultButtons = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Default Buttons</CardTitle>
            <p className="card-subtitle">
              Use the button classes on an <code>&lt;a&gt;</code>,<code>&lt;button&gt;</code>
              or <code>&lt;input&gt;</code> element.
            </p>
          </CardHeader>
          <CardBody>
            <div className="button-list">
              <button type="button" className="btn btn-primary">
                Primary
              </button>
              <button type="button" className="btn btn-secondary">
                Secondary
              </button>
              <button type="button" className="btn btn-success">
                Success
              </button>
              <button type="button" className="btn btn-info">
                Info
              </button>
              <button type="button" className="btn btn-warning">
                Warning
              </button>
              <button type="button" className="btn btn-danger">
                Danger
              </button>
              <button type="button" className="btn btn-dark">
                Dark
              </button>
              <button type="button" className="btn btn-light">
                Light
              </button>
              <button type="button" className="btn btn-link">
                Link
              </button>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const RoundedButtons = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Rounded Buttons</CardTitle>
            <p className="card-subtitle">
              Add <code>.rounded-pill</code> to default button to get rounded corners.
            </p>
          </CardHeader>
          <CardBody>
            <div className="button-list">
              <button type="button" className="btn btn-primary rounded-pill">
                Primary
              </button>
              <button type="button" className="btn btn-secondary rounded-pill">
                Secondary
              </button>
              <button type="button" className="btn btn-success rounded-pill">
                Success
              </button>
              <button type="button" className="btn btn-info rounded-pill">
                Info
              </button>
              <button type="button" className="btn btn-warning rounded-pill">
                Warning
              </button>
              <button type="button" className="btn btn-danger rounded-pill">
                Danger
              </button>
              <button type="button" className="btn btn-dark rounded-pill">
                Dark
              </button>
              <button type="button" className="btn btn-light rounded-pill">
                Light
              </button>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const OutlineButtons = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Outline Buttons</CardTitle>
            <p className="card-subtitle">
              Use a classes <code>.btn-outline-**</code> to quickly create a bordered buttons.
            </p>
          </CardHeader>
          <CardBody>
            <div className="button-list">
              <button type="button" className="btn btn-outline-primary">
                Primary
              </button>
              <button type="button" className="btn btn-outline-secondary">
                Secondary
              </button>
              <button type="button" className="btn btn-outline-success">
                Success
              </button>
              <button type="button" className="btn btn-outline-info">
                Info
              </button>
              <button type="button" className="btn btn-outline-warning">
                Warning
              </button>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const OutlineRoundedButtons = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Outline Rounded Buttons </CardTitle>
            <p className="card-subtitle">
              Use a classes <code>.btn-outline-**</code> to quickly create a bordered buttons.
            </p>
          </CardHeader>
          <CardBody>
            <div className="mb-3">
              <div className="button-list">
                <button type="button" className="btn btn-outline-primary rounded-pill">
                  Primary
                </button>
                <button type="button" className="btn btn-outline-secondary rounded-pill">
                  Secondary
                </button>
                <button type="button" className="btn btn-outline-success rounded-pill">
                  Success
                </button>
                <button type="button" className="btn btn-outline-info rounded-pill">
                  Info
                </button>
                <button type="button" className="btn btn-outline-warning rounded-pill">
                  Warning
                </button>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const SoftButtons = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Soft Buttons</CardTitle>
            <p className="card-subtitle">
              Use a classes <code>.btn-soft-**</code> to quickly create buttons with soft background.
            </p>
          </CardHeader>
          <CardBody>
            <div className="button-list">
              <button type="button" className="btn btn-soft-primary">
                Primary
              </button>
              <button type="button" className="btn btn-soft-secondary">
                Secondary
              </button>
              <button type="button" className="btn btn-soft-success">
                Success
              </button>
              <button type="button" className="btn btn-soft-info">
                Info
              </button>
              <button type="button" className="btn btn-soft-warning">
                Warning
              </button>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const SoftRoundedButtons = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Soft Rounded Buttons</CardTitle>
            <p className="card-subtitle">
              Use a classes <code>.rounded-pill**</code> with <code>.btn-soft-**</code> to quickly create a Outline Soft buttons.
            </p>
          </CardHeader>
          <CardBody>
            <div className="button-list">
              <button type="button" className="btn btn-soft-primary rounded-pill">
                Primary
              </button>
              <button type="button" className="btn btn-soft-secondary rounded-pill">
                Secondary
              </button>
              <button type="button" className="btn btn-soft-success rounded-pill">
                Success
              </button>
              <button type="button" className="btn btn-soft-info rounded-pill">
                Info
              </button>
              <button type="button" className="btn btn-soft-warning rounded-pill">
                Warning
              </button>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const SizesButton = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Button Sizes</CardTitle>
            <p className="card-subtitle">
              Add <code>.btn-lg</code>, <code>.btn-sm</code> for additional sizes.
            </p>
          </CardHeader>
          <CardBody>
            <div className="button-list">
              <button type="button" className="btn btn-primary btn-lg">
                Large
              </button>
              <button type="button" className="btn btn-secondary">
                Normal
              </button>
              <button type="button" className="btn btn-success btn-sm">
                Small
              </button>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const WidthButton = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Button Width</CardTitle>
            <p className="card-subtitle">
              Create buttons with minimum width by adding add <code>.width-xs</code>,<code>.width-sm</code>,<code>.width-md</code>,{' '}
              <code>.width-lg</code> or <code>.width-xl</code>.
            </p>
          </CardHeader>
          <CardBody>
            <div className="button-list">
              <button type="button" className="btn btn-primary width-xl">
                Extra Large
              </button>
              <button type="button" className="btn btn-secondary width-lg">
                Large
              </button>
              <button type="button" className="btn btn-success width-md">
                Middle
              </button>
              <button type="button" className="btn btn-info width-sm">
                Small
              </button>
              <button type="button" className="btn btn-warning width-xs">
                Xs
              </button>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const DisabledButton = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Disabled Button</CardTitle>
            <p className="card-subtitle">
              Add <code>disabled</code> attribute to buttons.
            </p>
          </CardHeader>
          <CardBody>
            <div className="button-list">
              <button type="button" className="btn btn-primary" disabled>
                Primary
              </button>
              <button type="button" className="btn btn-secondary" disabled>
                Secondary
              </button>
              <button type="button" className="btn btn-success" disabled>
                Success
              </button>
              <button type="button" className="btn btn-info" disabled>
                Info
              </button>
              <button type="button" className="btn btn-warning" disabled>
                Warning
              </button>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const IconButton = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Icon Button</CardTitle>
            <p className="card-subtitle">Icon only Button.</p>
          </CardHeader>
          <CardBody>
            <div className="button-list">
              <button type="button" className="btn btn-primary">
                <IconifyIcon icon="bx:heart" className="bx" />
              </button>
              <button type="button" className="btn btn-secondary">
                <IconifyIcon icon="bx:user-voice" className="bx " />
              </button>
              <button type="button" className="btn btn-success">
                <IconifyIcon icon="bx:check-double" className="bx" />
              </button>
              <button type="button" className="btn btn-info">
                <IconifyIcon icon="bx:cloud" className="bx  me-1" />
                Cloude Hosting
              </button>
              <button type="button" className="btn btn-warning">
                <IconifyIcon icon="bx:info-circle" className="bx me-1" />
                Warning
              </button>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const GroupButton = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Button Group</CardTitle>
            <p className="card-subtitle">
              Wrap a series of buttons with <code>.btn</code> in <code>.btn-group</code>.
            </p>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={6}>
                <div className="btn-group mb-1 me-1">
                  <button type="button" className="btn btn-light">
                    Left
                  </button>
                  <button type="button" className="btn btn-light">
                    Middle
                  </button>
                  <button type="button" className="btn btn-light">
                    Right
                  </button>
                </div>
                <div className="btn-group mb-1 me-1">
                  <button type="button" className="btn btn-light">
                    1
                  </button>
                  <button type="button" className="btn btn-light">
                    2
                  </button>
                  <button type="button" className="btn btn-secondary">
                    3
                  </button>
                  <button type="button" className="btn btn-light">
                    4
                  </button>
                </div>
                <div className="btn-group mb-1 me-1">
                  <button type="button" className="btn btn-light">
                    5
                  </button>
                  <button type="button" className="btn btn-secondary">
                    6
                  </button>
                  <button type="button" className="btn btn-light">
                    7
                  </button>
                  <Dropdown>
                    <DropdownToggle id="dropdown" type="button" className="btn btn-light arrow-none">
                      Dropdown <IconifyIcon icon="bx:bx-chevron-down" />
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-end">
                      <li>
                        <DropdownItem>Dropdown link</DropdownItem>
                      </li>
                      <li>
                        <DropdownItem>Dropdown link</DropdownItem>
                      </li>
                    </DropdownMenu>
                  </Dropdown>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdown">
                    <li>
                      <Link className="dropdown-item" href="">
                        Dropdown link
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" href="">
                        Dropdown link
                      </Link>
                    </li>
                  </ul>
                </div>
              </Col>
              <Col md={6}>
                <div className="btn-group-vertical me-4">
                  <button type="button" className="btn btn-light">
                    Top
                  </button>
                  <button type="button" className="btn btn-light">
                    Middle
                  </button>
                  <button type="button" className="btn btn-light">
                    Bottom
                  </button>
                </div>
                <div className="btn-group-vertical">
                  <button type="button" className="btn btn-light">
                    Button 1
                  </button>
                  <button type="button" className="btn btn-light">
                    Button 2
                  </button>
                  <Dropdown>
                    <DropdownToggle id="dropdown" type="button" className="btn btn-light arrow-none">
                      Button 3 <IconifyIcon icon="bx:bx-chevron-down" />
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-end">
                      <li>
                        <DropdownItem>Dropdown link</DropdownItem>
                      </li>
                      <li>
                        <DropdownItem>Dropdown link</DropdownItem>
                      </li>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const BlockButton = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Block Button</CardTitle>
            <p className="card-subtitle">
              Create block level buttons by adding class <code>.d-grid</code> to parent div.
            </p>
          </CardHeader>
          <CardBody>
            <div className="d-grid gap-2">
              <button type="button" className="btn btn-primary btn-lg">
                Block Button
              </button>
              <button type="button" className="btn btn-secondary">
                Block Button
              </button>
              <button type="button" className="btn btn-light btn-sm">
                Block Button
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
            <h4 className="mb-0">Buttons</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="">Base UI</Link>
              </li>
              <div className="mx-1" style={{ height: 24 }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Buttons</li>
            </ol>
          </div>
        </Col>
      </Row>

      <Row>
        <DefaultButtons />
        <RoundedButtons />
        <OutlineButtons />
        <OutlineRoundedButtons />
        <SoftButtons />
        <SoftRoundedButtons />
        <WidthButton />
        <SizesButton />
        <DisabledButton />
        <IconButton />
        <GroupButton />
        <BlockButton />
      </Row>
    </>
  )
}

export default page
