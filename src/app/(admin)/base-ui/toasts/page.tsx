import type { Metadata } from 'next'
import AllToasts from './components/AllToasts'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { Col, Row } from 'react-bootstrap'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Toasts' }

const Toasts = () => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-0">Toasts</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="">Base UI</Link>
              </li>
              <div className="mx-1" style={{ height: 24 }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Toasts</li>
            </ol>
          </div>
        </Col>
      </Row>
      <Row>
        <AllToasts />
      </Row>
    </>
  )
}

export default Toasts
