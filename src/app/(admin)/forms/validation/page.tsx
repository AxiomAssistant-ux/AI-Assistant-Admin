import AllFormValidation from './components/AllFormValidation'
import type { Metadata } from 'next'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Link from 'next/link'
import { Col, Row } from 'react-bootstrap'

export const metadata: Metadata = { title: 'Validation' }

const Validation = () => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-0">Dashboards</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="">Form</Link>
              </li>
              <div className="mx-1" style={{ height: 24 }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Dashboards</li>
            </ol>
          </div>
        </Col>
      </Row>
      <AllFormValidation />
    </>
  )
}

export default Validation
