'use client'
import useToggle from '@/hooks/useToggle'
import Link from 'next/link'
import React from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Collapse, Row } from 'react-bootstrap'

const DefaultExample = () => {
  const { isTrue, toggle } = useToggle()
  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Default Example</CardTitle>
          <p className="card-subtitle">Click the buttons below to show and hide another element via class changes:</p>
        </CardHeader>
        <CardBody>
          <ul>
            <li>
              <code>.collapse</code> hides content
            </li>
            <li>
              <code>.collapsing</code> is applied during transitions
            </li>
            <li>
              <code>.collapse.show</code> shows content
            </li>
          </ul>
          <p className="text-muted">
            Generally, we recommend using a button with the
            <code>data-bs-target</code> attribute. While not recommended from a semantic point of view, you can also use a link with the
            <code>href</code> attribute (and a <code>role=&quot;button&quot;</code>). In both cases, the{' '}
            <code>data-bs-toggle=&quot;collapse&quot;</code> is required.
          </p>
          <div className="hstack gap-2">
            <Link
              onClick={toggle}
              className="btn btn-primary mb-2"
              data-bs-toggle="collapse"
              href="#collapseExample"
              role="button"
              aria-expanded="false"
              aria-controls="collapseExample">
              Link with href
            </Link>
            <Button
              onClick={toggle}
              className="btn btn-primary mb-2"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseExample"
              aria-expanded="false"
              aria-controls="collapseExample">
              Button with data-bs-target
            </Button>
          </div>
          <Collapse in={isTrue}>
            <div>
              <Card className="mb-0">
                <CardBody>
                  Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user activates the
                  relevant trigger.
                </CardBody>
              </Card>
            </div>
          </Collapse>
        </CardBody>
      </Card>
    </Col>
  )
}

const MultipleTargetsCollapse = () => {
  const { isTrue: isOpenFirst, toggle: toggleFirst } = useToggle(false)
  const { isTrue: isOpenSecond, toggle: toggleSecond } = useToggle(false)
  const toggleBoth = () => {
    toggleFirst()
    toggleSecond()
  }
  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Multiple Targets</CardTitle>
          <p className="card-subtitle">
            A <code>&lt;button&gt;</code> or <code>&lt;a&gt;</code> can show and hide multiple elements by referencing them with a selector in its
            <code>href</code> or <code>data-bs-target</code> attribute. Multiple
            <code>&lt;button&gt;</code> or <code>&lt;a&gt;</code> can show and hide an element if they each reference it with their
            <code>href</code> or <code>data-bs-target</code> attribute
          </p>
        </CardHeader>
        <CardBody>
          <div className="hstack gap-2 mb-3">
            <Link
              onClick={toggleFirst}
              className="btn btn-primary"
              data-bs-toggle="collapse"
              href="#multiCollapseExample1"
              role="button"
              aria-expanded="false"
              aria-controls="multiCollapseExample1">
              Toggle first element
            </Link>
            <button
              onClick={toggleSecond}
              className="btn btn-primary"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#multiCollapseExample2"
              aria-expanded="false"
              aria-controls="multiCollapseExample2">
              Toggle second element
            </button>
            <button
              onClick={toggleBoth}
              className="btn btn-primary"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target=".multi-collapse"
              aria-expanded="false"
              aria-controls="multiCollapseExample1 multiCollapseExample2">
              Toggle both elements
            </button>
          </div>
          <Row>
            <Col>
              <Collapse className="multi-collapse " in={isOpenFirst}>
                <div>
                  <CardBody className="card card-body">
                    Some placeholder content for the first collapse component of this multi-collapse example. This panel is hidden by default but
                    revealed when the user activates the relevant trigger.
                  </CardBody>
                </div>
              </Collapse>
            </Col>
            <Col>
              <Collapse className="multi-collapse " in={isOpenSecond}>
                <div>
                  <CardBody className="card card-body">
                    Some placeholder content for the second collapse component of this multi-collapse example. This panel is hidden by default but
                    revealed when the user activates the relevant trigger.
                  </CardBody>
                </div>
              </Collapse>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  )
}

const HorizontalCollapse = () => {
  const { isTrue, toggle } = useToggle()
  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Horizontal</CardTitle>
          <p className="card-subtitle">
            The collapse plugin also supports horizontal collapsing. Add the
            <code>.collapse-horizontal</code> modifier class to transition the
            <code>width</code> instead of <code>height</code> and set a<code>width</code> on the immediate child element. Feel free to write your own
            custom Sass, use inline styles, or use our width utilities.
          </p>
        </CardHeader>
        <CardBody>
          <button
            onClick={toggle}
            className="btn btn-primary mb-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseWidthExample"
            aria-expanded="false"
            aria-controls="collapseWidthExample">
            Toggle width collapse
          </button>
          <div style={{ minHeight: 135 }}>
            <Collapse dimension="width" in={isTrue}>
              <div>
                <CardBody className="card card-body mb-0" style={{ width: 300 }}>
                  This is some placeholder content for a horizontal collapse. It&apos;s hidden by default and shown when triggered.
                </CardBody>
              </div>
            </Collapse>
          </div>
        </CardBody>
      </Card>
    </Col>
  )
}

const AllCollapse = () => {
  return (
    <>
      <DefaultExample />
      <HorizontalCollapse />
      <MultipleTargetsCollapse />
    </>
  )
}

export default AllCollapse
