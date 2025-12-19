'use client'
import useToggle from '@/hooks/useToggle'
import {
  Offcanvas as BSOffcanvas,
  OffcanvasHeader,
  OffcanvasTitle,
  OffcanvasBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  CardHeader,
  Card,
  CardBody,
  CardTitle,
  Col,
} from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Link from 'next/link'
import { BackdropOption, backdropOptions, PlacementOption, placementOptions } from '../data'

const OffcanvasDropdown = () => {
  return (
    <Dropdown className="mt-3">
      <DropdownToggle variant="primary" type="button" className="arrow-none icons-center gap-1">
        Dropdown button <IconifyIcon icon="bx:bx-chevron-down" />
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
      </DropdownMenu>
    </Dropdown>
  )
}
const DefaultOffcanvas = () => {
  const { isTrue, toggle } = useToggle()

  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Default Buttons</CardTitle>
          <p className="card-subtitle">
            You can use a link with the href attribute, or a button with the
            <code>data-bs-target</code> attribute. In both cases, the
            <code>data-bs-toggle=&quot;offcanvas&quot;</code> is required.
          </p>
        </CardHeader>
        <CardBody>
          <div className="button-list">
            <Link
              onClick={toggle}
              className="btn btn-primary"
              data-bs-toggle="offcanvas"
              href="#offcanvasExample"
              role="button"
              aria-controls="offcanvasExample">
              Link with href
            </Link>
            <BSOffcanvas show={isTrue} onHide={toggle} placement="start" tabIndex={-1}>
              <OffcanvasHeader closeButton>
                <OffcanvasTitle as="h5" className="mt-0">
                  Offcanvas
                </OffcanvasTitle>
              </OffcanvasHeader>
              <OffcanvasBody>
                <p>Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists, etc.</p>
                <OffcanvasDropdown />
              </OffcanvasBody>
            </BSOffcanvas>
            <button
              onClick={toggle}
              className="btn btn-secondary"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasExample"
              aria-controls="offcanvasExample">
              Button with data-bs-target
            </button>
            <BSOffcanvas show={isTrue} onHide={toggle} placement="start" tabIndex={-1}>
              <OffcanvasHeader closeButton>
                <OffcanvasTitle as="h5" className="mt-0">
                  Offcanvas
                </OffcanvasTitle>
              </OffcanvasHeader>
              <OffcanvasBody>
                <p>Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists, etc.</p>
                <OffcanvasDropdown />
              </OffcanvasBody>
            </BSOffcanvas>
          </div>
        </CardBody>
      </Card>
    </Col>
  )
}

const OffcanvasPositions = () => {
  const OffcanvasPlacement = ({ name, variant, ...props }: PlacementOption) => {
    const { isTrue, toggle } = useToggle()

    return (
      <>
        <Button variant={variant} onClick={toggle} className="mt-2 me-1 mt-md-0">
          {name} Offcanvas
        </Button>
        <BSOffcanvas show={isTrue} onHide={toggle} {...props}>
          <OffcanvasHeader closeButton>
            <OffcanvasTitle as={'h5'} className="mt-0">
              Offcanvas {name}
            </OffcanvasTitle>
          </OffcanvasHeader>

          <OffcanvasBody>
            <p>Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists, etc.</p>
            <OffcanvasDropdown />
          </OffcanvasBody>
        </BSOffcanvas>
      </>
    )
  }
  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Offcanvas Position</CardTitle>
          <p className="card-subtitle">Try the top, right, bottom and left examples out below.</p>
        </CardHeader>
        <CardBody>
          <ul>
            <li>
              <code>.offcanvas-top</code> places offcanvas on the top of the viewport
            </li>
            <li>
              <code>.offcanvas-end</code> places offcanvas on the right of the viewport
            </li>
            <li>
              <code>.offcanvas-bottom</code> places offcanvas on the bottom of the viewport
            </li>
            <li>
              <code>.offcanvas-start</code> places offcanvas on the left of the viewport
            </li>
          </ul>
          <div className="button-list">
            {placementOptions.map((props, idx) => (
              <OffcanvasPlacement {...props} key={idx} />
            ))}
          </div>
        </CardBody>
      </Card>
    </Col>
  )
}

const OffCanvasWithBackdropOptions = () => {
  const OffCanvasWithBackdrop = ({ name, variant, ...props }: BackdropOption) => {
    const { isTrue, toggle } = useToggle()
    return (
      <>
        <Button onClick={toggle} variant={variant} type="button">
          {name}
        </Button>

        <BSOffcanvas placement="start" show={isTrue} onHide={toggle} {...props}>
          <OffcanvasHeader closeButton>
            <OffcanvasTitle as="h5" className="mt-0" id="offcanvasScrollingLabel">
              {name}
            </OffcanvasTitle>
          </OffcanvasHeader>
          <OffcanvasBody>
            <p>Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists, etc.</p>
            <OffcanvasDropdown />
          </OffcanvasBody>
        </BSOffcanvas>
      </>
    )
  }
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Static Backdrop</CardTitle>
            <p className="card-subtitle">
              Scrolling the <code>&lt;body&gt;</code> element is disabled when an offcanvas and its backdrop are visible. Use the
              <code>data-bs-scroll</code> attribute to toggle
              <code>&lt;body&gt;</code> scrolling and&nbsp;
              <code>data-bs-backdrop</code> to toggle the backdrop.
            </p>
          </CardHeader>
          <CardBody>
            <div className="button-list">
              {backdropOptions.map((offcanvas, idx) => (
                <OffCanvasWithBackdrop {...offcanvas} key={idx} />
              ))}
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const AllOffcanvas = () => {
  return (
    <>
      <DefaultOffcanvas />
      <OffCanvasWithBackdropOptions />
      <OffcanvasPositions />
    </>
  )
}

export default AllOffcanvas
