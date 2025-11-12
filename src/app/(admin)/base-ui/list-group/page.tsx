import IconifyIcon from '@/components/wrapper/IconifyIcon'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ListGroup as BSListGroup, Card, CardBody, CardHeader, CardTitle, Col, ListGroupItem, Row } from 'react-bootstrap'

export const metadata: Metadata = { title: 'List Group ' }

const Basic = () => {
  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Basic</CardTitle>
          <p className="card-subtitle">
            The most basic list group is an unordered list with list items and the proper classes. Build upon it with the options that follow, or with
            your own CSS as needed.
          </p>
        </CardHeader>
        <CardBody>
          <div className="w-50">
            <BSListGroup>
              <ListGroupItem>An item</ListGroupItem>
              <ListGroupItem>A second item</ListGroupItem>
              <ListGroupItem>A third item</ListGroupItem>
              <ListGroupItem>A fourth item</ListGroupItem>
              <ListGroupItem>And a fifth one</ListGroupItem>
            </BSListGroup>
          </div>
        </CardBody>
      </Card>
    </Col>
  )
}

const ActiveItems = () => {
  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Active items</CardTitle>
          <p className="card-subtitle">
            Add <code>.active</code> to a <code>.list-group-item</code> to indicate the current active selection.
          </p>
        </CardHeader>
        <CardBody>
          <div className="w-50">
            <BSListGroup>
              <ListGroupItem active>An active item</ListGroupItem>
              <ListGroupItem>A second item</ListGroupItem>
              <ListGroupItem>A third item</ListGroupItem>
              <ListGroupItem>A fourth item</ListGroupItem>
              <ListGroupItem>And a fifth one</ListGroupItem>
            </BSListGroup>
          </div>
        </CardBody>
      </Card>
    </Col>
  )
}

const DisabledItems = () => {
  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Disabled items</CardTitle>
          <p className="card-subtitle">
            Add <code>.disabled</code> to a <code>.list-group-item</code>
            to make it <em>appear</em> disabled. Note that some elements with
            <code>.disabled</code> will also require custom JavaScript to fully disable their click events (e.g., links).
          </p>
        </CardHeader>
        <CardBody>
          <div className="w-50">
            <BSListGroup>
              <ListGroupItem disabled>A disabled item</ListGroupItem>
              <ListGroupItem>A second item</ListGroupItem>
              <ListGroupItem>A third item</ListGroupItem>
              <ListGroupItem>A fourth item</ListGroupItem>
              <ListGroupItem>And a fifth one</ListGroupItem>
            </BSListGroup>
          </div>
        </CardBody>
      </Card>
    </Col>
  )
}

const LinksButtons = () => {
  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Links and buttons</CardTitle>
          <p className="card-subtitle">
            Use <code>&lt;a&gt;</code>s or <code>&lt;button&gt;</code>s to create <em>actionable</em> list group items with hover, disabled, and
            active states by adding <code>.list-group-item-action</code>. We separate these pseudo-classes to ensure list groups made of
            non-interactive elements (like <code>&lt;li&gt;</code>s or
            <code>&lt;div&gt;</code>s) don’t provide a click or tap affordance.
          </p>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md={6}>
              <div className="list-group">
                <Link href="" className="list-group-item list-group-item-action active" aria-current="true">
                  The current link item
                </Link>
                <Link href="" className="list-group-item list-group-item-action">
                  A second link item
                </Link>
                <Link href="" className="list-group-item list-group-item-action">
                  A third link item
                </Link>
                <Link href="" className="list-group-item list-group-item-action">
                  A fourth link item
                </Link>
                <Link href="" className="list-group-item list-group-item-action disabled">
                  A disabled link item
                </Link>
              </div>
            </Col>
            <Col md={6}>
              <div className="list-group">
                <button type="button" className="list-group-item list-group-item-action active" aria-current="true">
                  The current button
                </button>
                <button type="button" className="list-group-item list-group-item-action">
                  A second button item
                </button>
                <button type="button" className="list-group-item list-group-item-action">
                  A third button item
                </button>
                <button type="button" className="list-group-item list-group-item-action">
                  A fourth button item
                </button>
                <button type="button" className="list-group-item list-group-item-action" disabled>
                  A disabled button item
                </button>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  )
}

const FlushListGroup = () => {
  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Flush</CardTitle>
          <p className="card-subtitle">
            Add <code>.list-group-flush</code> to remove some borders and rounded corners to render list group items edge-to-edge in a parent
            container (e.g., cards).
          </p>
        </CardHeader>
        <CardBody>
          <div className="w-50">
            <BSListGroup variant="flush">
              <ListGroupItem>An item</ListGroupItem>
              <ListGroupItem>A second item</ListGroupItem>
              <ListGroupItem>A third item</ListGroupItem>
              <ListGroupItem>A fourth item</ListGroupItem>
              <ListGroupItem>And a fifth one</ListGroupItem>
            </BSListGroup>
          </div>
        </CardBody>
      </Card>
    </Col>
  )
}

const NumberedListGroup = () => {
  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Numbered</CardTitle>
          <p className="card-subtitle">
            Add the <code>.list-group-numbered</code> modifier class (and optionally use an <code>&lt;ol&gt;</code> element) to opt into numbered list
            group items. Numbers are generated via CSS (as opposed to a <code>&lt;ol&gt;</code>s default browser styling) for better placement inside
            list group items and to allow for better customization.
          </p>
          <p className="card-subtitle">
            Numbers are generated by <code>counter-reset</code> on the
            <code>&lt;ol&gt;</code>, and then styled and placed with a <code>::before</code>
            pseudo-element on the <code>&lt;li&gt;</code> with <code>counter-increment</code>
            and <code>content</code>.
          </p>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md={6}>
              <BSListGroup as="ol" numbered>
                <ListGroupItem as="li">A list item</ListGroupItem>
                <ListGroupItem as="li">A list item</ListGroupItem>
                <ListGroupItem as="li">A list item</ListGroupItem>
              </BSListGroup>
            </Col>
            <Col md={6}>
              <ol className="list-group list-group-numbered">
                <li className="list-group-item d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">Subheading</div>
                    Content for list item
                  </div>
                  <span className="badge bg-primary rounded-pill">14</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">Subheading</div>
                    Content for list item
                  </div>
                  <span className="badge bg-primary rounded-pill">14</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">Subheading</div>
                    Content for list item
                  </div>
                  <span className="badge bg-primary rounded-pill">14</span>
                </li>
              </ol>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  )
}

const HorizontalListGroup = () => {
  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Horizontal</CardTitle>
          <p className="card-subtitle">
            Add <code>.list-group-horizontal</code> to change the layout of list group items from vertical to horizontal across all breakpoints.
            Alternatively, choose a responsive variant{' '}
            <code>
              .list-group-horizontal-{'{'}sm|md|lg|xl|xxl{'}'}
            </code>{' '}
            to make a list group horizontal starting at that breakpoint’s <code>min-width</code>. Currently{' '}
            <strong>horizontal list groups cannot be combined with flush list groups.</strong>
          </p>
          <p className="card-subtitle mt-1">
            <strong>ProTip:</strong> Want equal-width list group items when horizontal? Add <code>.flex-fill</code> to each list group item.
          </p>
        </CardHeader>
        <CardBody>
          <div className="w-50 mb-3 d-flex flex-column gap-2">
            <BSListGroup horizontal>
              <ListGroupItem>An item</ListGroupItem>
              <ListGroupItem>A second item</ListGroupItem>
              <ListGroupItem>A third item</ListGroupItem>
            </BSListGroup>

            <BSListGroup horizontal="sm">
              <ListGroupItem>An item</ListGroupItem>
              <ListGroupItem>A second item</ListGroupItem>
              <ListGroupItem>A third item</ListGroupItem>
            </BSListGroup>

            <BSListGroup horizontal="md">
              <ListGroupItem>An item</ListGroupItem>
              <ListGroupItem>A second item</ListGroupItem>
              <ListGroupItem>A third item</ListGroupItem>
            </BSListGroup>

            <BSListGroup horizontal="md">
              <ListGroupItem>An item</ListGroupItem>
              <ListGroupItem>A second item</ListGroupItem>
              <ListGroupItem>A third item</ListGroupItem>
            </BSListGroup>

            <BSListGroup horizontal="xl">
              <ListGroupItem>An item</ListGroupItem>
              <ListGroupItem>A second item</ListGroupItem>
              <ListGroupItem>A third item</ListGroupItem>
            </BSListGroup>

            <BSListGroup horizontal="xxl">
              <ListGroupItem>An item</ListGroupItem>
              <ListGroupItem>A second item</ListGroupItem>
              <ListGroupItem>A third item</ListGroupItem>
            </BSListGroup>
          </div>
        </CardBody>
      </Card>
    </Col>
  )
}

const ContextualListGroup = () => {
  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Contextual classes</CardTitle>
          <p className="card-subtitle">Use contextual classes to style list items with a stateful background and color.</p>
        </CardHeader>
        <CardBody>
          <div className="w-50">
            <BSListGroup>
              <ListGroupItem>A simple default list group item</ListGroupItem>
              <ListGroupItem variant="primary">A simple primary list group item</ListGroupItem>
              <ListGroupItem variant="secondary">A simple secondary list group item</ListGroupItem>
              <ListGroupItem variant="success">A simple success list group item</ListGroupItem>
              <ListGroupItem variant="danger">A simple danger list group item</ListGroupItem>
              <ListGroupItem variant="warning">A simple warning list group item</ListGroupItem>
              <ListGroupItem variant="info">A simple info list group item</ListGroupItem>
              <ListGroupItem variant="light">A simple light list group item</ListGroupItem>
              <ListGroupItem variant="dark">A simple dark list group item</ListGroupItem>
            </BSListGroup>
          </div>
        </CardBody>
      </Card>
    </Col>
  )
}

const CustomContentListGroup = () => {
  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Custom content</CardTitle>
          <p className="card-subtitle">
            Add nearly any HTML within, even for linked list groups like the one below, with the help of <Link href="">flexbox utilities</Link>.
          </p>
        </CardHeader>
        <CardBody>
          <div className="w-50">
            <div className="list-group">
              <Link href="" className="list-group-item list-group-item-action active" aria-current="true">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1 text-reset">List group item heading</h5>
                  <small>3 days ago</small>
                </div>
                <p className="mb-1">Some placeholder content in a paragraph.</p>
                <small>And some small print.</small>
              </Link>
              <Link href="" className="list-group-item list-group-item-action">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">List group item heading</h5>
                  <small className="text-muted">3 days ago</small>
                </div>
                <p className="mb-1">Some placeholder content in a paragraph.</p>
                <small className="text-muted">And some muted small print.</small>
              </Link>
              <Link href="" className="list-group-item list-group-item-action">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">List group item heading</h5>
                  <small className="text-muted">3 days ago</small>
                </div>
                <p className="mb-1">Some placeholder content in a paragraph.</p>
                <small className="text-muted">And some muted small print.</small>
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  )
}

const CheckboxesAndRadiosListGroup = () => {
  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Checkboxes and radios</CardTitle>
          <p className="card-subtitle">
            Place Bootstrap’s checkboxes and radios within list group items and customize as needed. You can use them without{' '}
            <code>&lt;label&gt;</code>s, but please remember to include an <code>aria-label</code> attribute and value for accessibility.
          </p>
        </CardHeader>
        <CardBody>
          <div className="w-50 ">
            <ul className="list-group">
              <li className="list-group-item">
                <input className="form-check-input me-1" type="checkbox" id="firstCheckbox" />
                <label className="form-check-label" htmlFor="firstCheckbox">
                  First checkbox
                </label>
              </li>
              <li className="list-group-item">
                <input className="form-check-input me-1" type="checkbox" id="secondCheckbox" />
                <label className="form-check-label" htmlFor="secondCheckbox">
                  Second checkbox
                </label>
              </li>
              <li className="list-group-item">
                <input className="form-check-input me-1" type="checkbox" id="thirdCheckbox" />
                <label className="form-check-label" htmlFor="thirdCheckbox">
                  Third checkbox
                </label>
              </li>
            </ul>
          </div>
        </CardBody>
      </Card>
    </Col>
  )
}

const ListGroup = () => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-0">List Group</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="">Base UI</Link>
              </li>
              <div className="mx-1" style={{ height: 24 }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">List Group</li>
            </ol>
          </div>
        </Col>
      </Row>

      <Row>
        <Basic />
        <ActiveItems />
        <DisabledItems />
        <LinksButtons />
        <FlushListGroup />
        <NumberedListGroup />
        <HorizontalListGroup />
        <ContextualListGroup />
        <CustomContentListGroup />
        <CheckboxesAndRadiosListGroup />
      </Row>
    </>
  )
}

export default ListGroup
