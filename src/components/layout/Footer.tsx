import { currentYear } from '@/context/constants'
import React from 'react'
import { Col, Row } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer className=" footer card mb-0 rounded-0 justify-content-center align-items-center ">
      <div className="container-fluid">
        <Row>
          <Col xs={12} className=" text-center">
            <p className="mb-0">{currentYear} © Taplox.</p>
          </Col>
        </Row>
      </div>
    </footer>
  )
}

export default Footer
