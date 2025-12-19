import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { colorVariants } from '@/context/constants'
import { toSentenceCase } from '@/utils/change-casing'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormCheck,
  FormControl,
  FormLabel,
  Row,
} from 'react-bootstrap'

export const metadata: Metadata = { title: 'Dropdown' }

const SingleButtonDropdowns = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Single Button Dropdowns</CardTitle>
            <p className="card-subtitle">
              Any single <code>.btn</code> can be turned into a dropdown toggle with some markup changes. Here&apos;s how you can put them to work
              with either <code>&lt;button&gt;</code> elements.
            </p>
          </CardHeader>
          <CardBody>
            <div className="d-flex flex-wrap gap-3">
              <Dropdown>
                <DropdownToggle variant="secondary" className="arrow-none icons-center gap-1">
                  Dropdown button <IconifyIcon icon="bx:bx-chevron-down" />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem href="">Action</DropdownItem>
                  <DropdownItem href="">Another action</DropdownItem>
                  <DropdownItem href="">Something else here</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown>
                <DropdownToggle variant="secondary" className="arrow-none icons-center gap-1">
                  Dropdown link <IconifyIcon icon="bx:bx-chevron-down" />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem href="">Action</DropdownItem>
                  <DropdownItem href="">Another action</DropdownItem>
                  <DropdownItem href="">Something else here</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const SingleButtonVariantDropdowns = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Single Button Variant Dropdowns</CardTitle>
            <p className="card-subtitle">
              Any single <code>.btn</code> can be turned into a dropdown toggle with some markup changes. Here&apos;s how you can put them to work
              with either <code>&lt;button&gt;</code> elements.
            </p>
          </CardHeader>
          <CardBody>
            <div className="d-flex flex-wrap gap-2">
              {colorVariants.slice(0, 4).map((color, idx) => (
                <Dropdown key={idx} as={ButtonGroup} className="mb-2 me-1">
                  <DropdownToggle variant={color} className="arrow-none icons-center gap-1">
                    {toSentenceCase(color)}
                    <IconifyIcon icon="bx:bx-chevron-down" />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem href="">Action</DropdownItem>
                    <DropdownItem href="">Another action</DropdownItem>
                    <DropdownItem href="">Something else here</DropdownItem>
                    <DropdownDivider />
                    <DropdownItem href="">Separated link</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              ))}
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const SplitButtonDropdowns = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Split Button Dropdowns</CardTitle>
            <p className="card-subtitle">
              Similarly, create split button dropdowns with virtually the same markup as single button dropdowns, but with the addition of{' '}
              <code>.dropdown-toggle-split</code> for proper spacing around the dropdown caret.
            </p>
          </CardHeader>
          <CardBody>
            <div className="d-flex flex-wrap gap-2">
              {colorVariants.slice(0, 4).map((color, idx) => (
                <Dropdown key={idx} as={ButtonGroup} className="mb-2 me-1">
                  <Button variant={color}>{toSentenceCase(color)}</Button>
                  <DropdownToggle variant={color} className="dropdown-toggle-split arrow-none">
                    <IconifyIcon icon="bx:bx-chevron-down" />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem href="">Action</DropdownItem>
                    <DropdownItem href="">Another action</DropdownItem>
                    <DropdownItem href="">Something else here</DropdownItem>
                    <DropdownDivider></DropdownDivider>
                    <DropdownItem href="">Separated link</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              ))}
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const DarkDropdowns = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Dark Dropdowns</CardTitle>
            <p className="card-subtitle">
              Opt into darker dropdowns to match a dark navbar or custom style by adding <code>.dropdown-menu-dark</code> onto an existing{' '}
              <code>.dropdown-menu</code>. No changes are required to the dropdown items.
            </p>
          </CardHeader>
          <CardBody>
            <Dropdown>
              <DropdownToggle variant="primary" className="arrow-none icons-center gap-1">
                Drak DropDown <IconifyIcon icon="bx:bx-chevron-down" />
              </DropdownToggle>
              <DropdownMenu as="ul" variant="dark">
                <li>
                  <DropdownItem href="">Action</DropdownItem>
                </li>
                <li>
                  <DropdownItem href="">Another action</DropdownItem>
                </li>
                <li>
                  <DropdownItem href="">Something else here</DropdownItem>
                </li>
                <li>
                  <DropdownDivider />
                </li>
                <li>
                  <DropdownItem href="">Separated link</DropdownItem>
                </li>
              </DropdownMenu>
            </Dropdown>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const DropdownDirection = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Dropdown Direction</CardTitle>
            <p className="card-subtitle">
              Trigger dropdown menus above elements by adding <code>.dropup</code>, dropdown menus at the left of the elements by adding{' '}
              <code>.dropstart</code> or dropdown menus at the right of the elements by adding
              <code>.dropend</code>.
            </p>
          </CardHeader>
          <CardBody>
            <div className="d-flex flex-wrap gap-2">
              <Dropdown as={ButtonGroup}>
                <DropdownToggle variant="primary" className="arrow-none icons-center gap-1">
                  Drop Down <IconifyIcon icon="bx:bx-chevron-down" />
                </DropdownToggle>

                <DropdownMenu>
                  <DropdownItem href="">Action</DropdownItem>
                  <DropdownItem href="">Another action</DropdownItem>
                  <DropdownItem href="">Something else here</DropdownItem>
                  <DropdownDivider></DropdownDivider>
                  <DropdownItem href="">Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown as={ButtonGroup} drop="up">
                <DropdownToggle variant="secondary" className="arrow-none icons-center gap-1">
                  Drop Up <IconifyIcon icon="bx:bx-chevron-up" />
                </DropdownToggle>

                <DropdownMenu>
                  <DropdownItem href="">Action</DropdownItem>
                  <DropdownItem href="">Another action</DropdownItem>
                  <DropdownItem href="">Something else here</DropdownItem>
                  <DropdownDivider></DropdownDivider>
                  <DropdownItem href="">Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown as={ButtonGroup} drop="end">
                <DropdownToggle variant="success" className="arrow-none icons-center gap-1">
                  Drop Right <IconifyIcon icon="bx:bx-chevron-right" />
                </DropdownToggle>

                <DropdownMenu>
                  <DropdownItem href="">Action</DropdownItem>
                  <DropdownItem href="">Another action</DropdownItem>
                  <DropdownItem href="">Something else here</DropdownItem>
                  <DropdownDivider></DropdownDivider>
                  <DropdownItem href="">Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown as={ButtonGroup} drop="start">
                <DropdownToggle variant="info" className="content-none icons-center gap-1">
                  <IconifyIcon icon="bx:bx-chevron-left" /> Drop Left
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem href="">Action</DropdownItem>
                  <DropdownItem href="">Another action</DropdownItem>
                  <DropdownItem href="">Something else here</DropdownItem>
                  <DropdownDivider></DropdownDivider>
                  <DropdownItem href="">Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const DropdownOptions = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Dropdown options</CardTitle>
            <p className="card-subtitle">
              Use <code>data-bs-offset</code> or <code>data-bs-reference</code> to change the location of the dropdown.
            </p>
          </CardHeader>
          <CardBody>
            <div className="d-flex flex-wrap gap-2">
              <Dropdown>
                <DropdownToggle variant="secondary" className="arrow-none icons-center gap-1">
                  Offset <IconifyIcon icon="bx:bx-chevron-down" />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem href="">Action</DropdownItem>
                  <DropdownItem href="">Another action</DropdownItem>
                  <DropdownItem href="">Something else here</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown className="btn-group">
                <button type="button" className="btn btn-secondary">
                  Reference
                </button>
                <DropdownToggle
                  type="button"
                  className="btn btn-secondary dropdown-toggle dropdown-toggle-split"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  data-bs-reference="parent">
                  <span className="visually-hidden">Toggle Dropdown</span>
                  <IconifyIcon icon="bx:bx-chevron-down" />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem href="">Action</DropdownItem>
                  <DropdownItem href="">Another action</DropdownItem>
                  <DropdownItem href="">Something else here</DropdownItem>
                  <DropdownDivider></DropdownDivider>
                  <DropdownItem href="">Separated link</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const AutoCloseBehaviorDropdown = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Auto close behavior</CardTitle>
            <p className="card-subtitle">
              By default, the dropdown menu is closed when clicking inside or outside the dropdown menu. You can use the <code>autoClose</code> option
              to change this behavior of the dropdown.
            </p>
          </CardHeader>
          <CardBody>
            <div className="d-flex flex-wrap gap-2">
              <Dropdown autoClose as={ButtonGroup}>
                <DropdownToggle variant="secondary" className="arrow-none icons-center gap-1">
                  Default dropdown <IconifyIcon icon="bx:bx-chevron-down" />
                </DropdownToggle>
                <DropdownMenu as="ul">
                  <li>
                    <DropdownItem href="">Menu item</DropdownItem>
                  </li>
                  <li>
                    <DropdownItem href="">Menu item</DropdownItem>
                  </li>
                  <li>
                    <DropdownItem href="">Menu item</DropdownItem>
                  </li>
                </DropdownMenu>
              </Dropdown>
              <Dropdown autoClose="outside" as={ButtonGroup}>
                <DropdownToggle variant="secondary" className="arrow-none icons-center gap-1">
                  Clickable outside <IconifyIcon icon="bx:bx-chevron-down" />
                </DropdownToggle>
                <DropdownMenu as="ul">
                  <li>
                    <DropdownItem href="">Menu item</DropdownItem>
                  </li>
                  <li>
                    <DropdownItem href="">Menu item</DropdownItem>
                  </li>
                  <li>
                    <DropdownItem href="">Menu item</DropdownItem>
                  </li>
                </DropdownMenu>
              </Dropdown>

              <Dropdown autoClose="inside" as={ButtonGroup}>
                <DropdownToggle variant="secondary" className="arrow-none icons-center gap-1">
                  Clickable inside <IconifyIcon icon="bx:bx-chevron-down" />
                </DropdownToggle>
                <DropdownMenu as="ul">
                  <li>
                    <DropdownItem href="">Menu item</DropdownItem>
                  </li>
                  <li>
                    <DropdownItem href="">Menu item</DropdownItem>
                  </li>
                  <li>
                    <DropdownItem href="">Menu item</DropdownItem>
                  </li>
                </DropdownMenu>
              </Dropdown>

              <Dropdown autoClose="inside" as={ButtonGroup}>
                <DropdownToggle variant="secondary" className="arrow-none icons-center gap-1" type="button">
                  Manual close <IconifyIcon icon="bx:bx-chevron-down" />
                </DropdownToggle>
                <DropdownMenu as="ul">
                  <li>
                    <DropdownItem href="">Menu item</DropdownItem>
                  </li>
                  <li>
                    <DropdownItem href="">Menu item</DropdownItem>
                  </li>
                  <li>
                    <DropdownItem href="">Menu item</DropdownItem>
                  </li>
                </DropdownMenu>
              </Dropdown>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const DropdownMenuContent = () => {
  return (
    <>
      <Col lg={6}>
        <Card className="">
          <CardHeader>
            <CardTitle as={'h5'}>Menu Content</CardTitle>
          </CardHeader>
          <CardBody>
            <p>Add a header to label sections of actions in any dropdown menu.</p>
            <p>Separate groups of related menu items with a divider.</p>
            <p>
              Place any freeform text within a dropdown menu with text and use spacing utilities. Note that you’ll likely need additional sizing
              styles to constrain the menu width.
            </p>
            <p>
              Put a form within a dropdown menu, or make it into a dropdown menu, and use margin or padding utilities to give it the negative space
              you require.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Dropdown>
                <DropdownToggle variant="primary" type="button" className="arrow-none icons-center gap-1 content-none ">
                  Dropdown Header <IconifyIcon icon="bx:bx-chevron-down" />
                </DropdownToggle>
                <DropdownMenu>
                  <li>
                    <DropdownHeader>Dropdown header</DropdownHeader>
                  </li>
                  <li>
                    <DropdownItem href="">Action</DropdownItem>
                  </li>
                  <li>
                    <DropdownItem href="">Another action</DropdownItem>
                  </li>
                </DropdownMenu>
              </Dropdown>
              <Dropdown>
                <DropdownToggle variant="info" className="arrow-none icons-center gap-1 ">
                  Dropdown Divider <IconifyIcon icon="bx:bx-chevron-down" />
                </DropdownToggle>
                <DropdownMenu>
                  <li>
                    <DropdownItem href="">Action</DropdownItem>
                  </li>
                  <li>
                    <DropdownItem href="">Another action</DropdownItem>
                  </li>
                  <li>
                    <DropdownItem href="">Something else here</DropdownItem>
                  </li>
                  <li>
                    <DropdownDivider />
                  </li>
                  <li>
                    <DropdownItem href="">Separated link</DropdownItem>
                  </li>
                </DropdownMenu>
              </Dropdown>
              <Dropdown>
                <DropdownToggle variant="secondary" className="arrow-none icons-center gap-1 ">
                  Dropdown Text <IconifyIcon icon="bx:bx-chevron-down" />
                </DropdownToggle>
                <DropdownMenu className="dropdown-lg p-3">
                  <p>Some example text that&apos;s free-flowing within the dropdown menu.</p>
                  <p className="mb-0">And this is more example text.</p>
                </DropdownMenu>
              </Dropdown>
              <Dropdown>
                <DropdownToggle variant="success" className="arrow-none icons-center gap-1">
                  Dropdown Menu Forms <IconifyIcon icon="bx:bx-chevron-down" />
                </DropdownToggle>
                <DropdownMenu as={'form'} className="dropdown-lg p-3">
                  <div className="mb-3">
                    <FormLabel htmlFor="exampleDropdownFormEmail">Email address</FormLabel>
                    <FormControl type="email" id="exampleDropdownFormEmail" placeholder="email@example.com" />
                  </div>
                  <div className="mb-3">
                    <FormLabel htmlFor="exampleDropdownFormPassword">Password</FormLabel>
                    <FormControl type="password" id="exampleDropdownFormPassword" placeholder="Password" />
                  </div>
                  <div className="mb-3">
                    <FormCheck label="Remember me" id="remember1" />
                  </div>
                  <Button variant="primary" type="submit">
                    Sign in
                  </Button>
                </DropdownMenu>
              </Dropdown>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const DropdownMenuItems = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Dropdown Menu Items</CardTitle>
            <p className="card-subtitle">
              Add <code>.active</code> to items in the dropdown to <strong>style them as active</strong>. To convey the active state to assistive
              technologies, use the <code>aria-current</code> attribute — using the <code>page</code> value for the current page, or <code>true</code>{' '}
              for the current item in a set.
            </p>
            <p className="card-subtitle">
              Add <code>.disabled</code> to items in the dropdown to <strong>style them as disabled</strong>.
            </p>
          </CardHeader>
          <CardBody>
            <div className="d-flex flex-wrap gap-2">
              <ul className="dropdown-menu show block position-static">
                <li>
                  <Link className="dropdown-item" href="">
                    Regular link
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item active" href="" aria-current="true">
                    Active link
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="">
                    Another link
                  </Link>
                </li>
              </ul>
              <ul className="dropdown-menu show block position-static">
                <li>
                  <Link className="dropdown-item" href="">
                    Regular link
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item disabled" href="" aria-current="true">
                    Active link
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="">
                    Another link
                  </Link>
                </li>
              </ul>
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
            <h4 className="mb-0">Dropdown</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="">Base UI</Link>
              </li>
              <div className="mx-1" style={{ height: 24 }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Dropdown</li>
            </ol>
          </div>
        </Col>
      </Row>

      <Row>
        <SingleButtonDropdowns />
        <SingleButtonVariantDropdowns />
        <SplitButtonDropdowns />
        <DarkDropdowns />
        <DropdownDirection />
        <DropdownMenuItems />
        <DropdownOptions />
        <AutoCloseBehaviorDropdown />
        <DropdownMenuContent />
      </Row>
    </>
  )
}

export default page
