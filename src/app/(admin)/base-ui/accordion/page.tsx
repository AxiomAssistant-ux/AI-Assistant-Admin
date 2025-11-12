import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'

export const metadata: Metadata = { title: 'Accodion | Taplox - Responsive Admin Dashboard Template' }

const accordionData = ['first', 'second', 'third']

const BasicAccordion = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Basic Example</CardTitle>
            <p className="card-subtitle">
              Using the card component, you can extend the default collapse behavior to create an accordion.To properly achieve the accordion style,
              be sure to use <code>.accordion</code> as a wrapper.
            </p>
          </CardHeader>
          <CardBody>
            <Accordion defaultActiveKey={'0'} id="accordionExample">
              {accordionData.map((item, idx) => (
                <AccordionItem eventKey={`${idx}`} key={idx}>
                  <AccordionHeader id="headingOne">
                    <div className="fw-medium">Accordion Item #{idx + 1}</div>
                  </AccordionHeader>
                  <AccordionBody>
                    <strong>This is the {item}&nbsp; item&apos;s accordion body.</strong>
                    It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes
                    control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS
                    or overriding our default variables. It&apos;s also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </AccordionBody>
                </AccordionItem>
              ))}
            </Accordion>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const FlushAccordion = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}> Flush Accordion </CardTitle>
            <p className="card-subtitle">
              Add <code>.accordion-flush</code> to remove the default
              <code>background-color</code>, some borders, and some rounded corners to render accordions edge-to-edge with their parent container.
            </p>
          </CardHeader>
          <CardBody>
            <Accordion flush id="accordionExample">
              {accordionData.map((item, idx) => (
                <AccordionItem eventKey={`${idx}`} key={idx}>
                  <AccordionHeader id="headingOne">
                    <div className="fw-medium ">Accordion Item #{idx + 1}</div>
                  </AccordionHeader>
                  <AccordionBody>
                    Placeholder content for this accordion, which is intended to demonstrate the
                    <code>.accordion-flush</code>&nbsp; class. This is the
                    {item}&nbsp; item&apos;s accordion body.
                  </AccordionBody>
                </AccordionItem>
              ))}
            </Accordion>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const AlwaysOpenAccordion = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Always Open Accordion</CardTitle>
            <p className="card-subtitle">
              Omit the <code>data-bs-parent</code> attribute on each
              <code>.accordion-collapse</code> to make accordion items stay open when another item is opened.
            </p>
          </CardHeader>
          <CardBody>
            <Accordion defaultActiveKey={'0'} alwaysOpen id="accordionExample">
              {accordionData.map((item, idx) => (
                <AccordionItem eventKey={`${idx}`} key={idx}>
                  <AccordionHeader id="headingOne">
                    <div className="fw-medium">Accordion Item #{idx + 1}</div>
                  </AccordionHeader>
                  <AccordionBody>
                    <strong>This is the {item}&nbsp; item&apos;s accordion body.</strong>
                    It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes
                    control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS
                    or overriding our default variables. It&apos;s also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </AccordionBody>
                </AccordionItem>
              ))}
            </Accordion>
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
            <h4 className="mb-0">Accordion</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="">Base UI</Link>
              </li>
              <div className="mx-1" style={{ height: 24 }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Accordion</li>
            </ol>
          </div>
        </Col>
      </Row>
      <Row>
        <BasicAccordion />
        <FlushAccordion />
        <AlwaysOpenAccordion />
      </Row>
    </>
  )
}

export default page
