import DropzoneFormInput from '@/components/from/DropzoneFormInput'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
export const metadata: Metadata = { title: 'File Uploads' }

const DropzoneFileUpload = () => {
  return (
    <>
      <Col xl={12}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'}>Dropzone File Upload</CardTitle>
            <p className="card-subtitle">DropzoneJS is an open source library that provides drag’n’drop file uploads with image previews.</p>
          </CardHeader>
          <CardBody>
            <div className="mb-3">
              <DropzoneFormInput
                className="mb-10"
                iconProps={{ icon: 'bx:cloud-upload', height: 36, width: 36 }}
                text="Drop files here or click to upload. "
                helpText={
                  <span className="text-muted fs-13">
                    (This is just a demo dropzone. Selected files are
                    <strong>not</strong> actually uploaded.)
                  </span>
                }
                showPreview
              />
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
            <h4 className="mb-0">File Uploads</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="">Forms</Link>
              </li>
              <div className="mx-1" style={{ height: 24 }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">File Uploads</li>
            </ol>
          </div>
        </Col>
      </Row>

      <Row>
        <DropzoneFileUpload />
      </Row>
    </>
  )
}

export default page
