'use client'
import Link from 'next/link'
import React, { useEffect } from 'react'
import DarkLogo from '@/assets/images/logo-dark.png'
import LightLogo from '@/assets/images/logo-light.png'
import Image from 'next/image'
import * as yup from 'yup'
import TextFormInput from '@/components/from/TextFormInput'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Card, CardBody, Col, Row } from 'react-bootstrap'

const ResetPassword = () => {
  useEffect(() => {
    document.body.classList.add('authentication-bg')
    return () => {
      document.body.classList.remove('authentication-bg')
    }
  }, [])

  const messageSchema = yup.object({
    email: yup.string().email().required('Please enter Email'),
  })

  const { handleSubmit, control } = useForm({
    resolver: yupResolver(messageSchema),
  })
  return (
    <>
      <div className="">
        <div className="account-pages py-5">
          <div className="container">
            <Row className=" justify-content-center">
              <Col md={6} lg={5}>
                <Card className=" border-0 shadow-lg">
                  <CardBody className=" p-5">
                    <div className="text-center">
                      <div className="mx-auto mb-4 text-center auth-logo">
                        <Link href="/dashboards" className="logo-dark">
                          <Image src={DarkLogo} height={32} alt="logo dark" />
                        </Link>
                        <Link href="/dashboards" className="logo-light">
                          <Image src={LightLogo} height={28} alt="logo light" />
                        </Link>
                      </div>
                      <h4 className="fw-bold text-dark mb-2">Reset Password</h4>
                      <p className="text-muted">
                        Enter your email address and we&apos;ll send you an email with instructions to reset your password.
                      </p>
                    </div>
                    <form onSubmit={handleSubmit(() => {})} className="mt-4">
                      <div className="mb-3">
                        <TextFormInput
                          control={control}
                          name="email"
                          placeholder="Enter your email"
                          className="bg-light bg-opacity-50 border-light py-2"
                          label="Email"
                        />
                      </div>
                      <div className="d-grid">
                        <button className="btn btn-dark btn-lg fw-medium" type="submit">
                          Reset Password
                        </button>
                      </div>
                    </form>
                  </CardBody>
                </Card>
                <p className="text-center mt-4 text-white text-opacity-50">
                  Back to&nbsp;
                  <Link href="/auth/sign-in" className="text-decoration-none text-white fw-bold">
                    Sign In
                  </Link>
                </p>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  )
}

export default ResetPassword
