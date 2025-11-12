'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import DarkLogo from '@/assets/images/logo-dark.png'
import LightLogo from '@/assets/images/logo-light.png'
import TextFormInput from '@/components/from/TextFormInput'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { Card, CardBody, Col, Row } from 'react-bootstrap'

const SignUp = () => {
  useEffect(() => {
    document.body.classList.add('authentication-bg')
    return () => {
      document.body.classList.remove('authentication-bg')
    }
  }, [])

  const messageSchema = yup.object({
    name: yup.string().required('Please enter Name'),
    email: yup.string().email().required('Please enter Email'),
    password: yup.string().required('Please enter password'),
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
                        <Link href="/" className="logo-light">
                          <Image src={LightLogo} height={28} alt="logo light" />
                        </Link>
                      </div>
                      <h4 className="fw-bold text-dark mb-2">Sign Up</h4>
                      <p className="text-muted">New to our platform? Sign up now! It only takes a minute.</p>
                    </div>
                    <form onSubmit={handleSubmit(() => {})} className="mt-4">
                      <div className="mb-3">
                        <TextFormInput control={control} name="name" placeholder="Enter your Name" className="form-control" label="Name" />
                      </div>
                      <div className="mb-3">
                        <TextFormInput control={control} name="email" placeholder="Enter your email" className="form-control" label="Email" />
                      </div>
                      <div className="mb-3">
                        <TextFormInput
                          control={control}
                          name="password"
                          placeholder="Enter your password"
                          className="form-control"
                          label="Password"
                        />
                      </div>
                      <div className="mb-3">
                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" id="checkbox-signin" />
                          <label className="form-check-label" htmlFor="checkbox-signin">
                            I accept Terms and Condition
                          </label>
                        </div>
                      </div>
                      <div className="mb-1 text-center d-grid">
                        <button className="btn btn-dark btn-lg fw-medium" type="submit">
                          Sign Up
                        </button>
                      </div>
                    </form>
                  </CardBody>
                </Card>
                <p className="text-center mt-4 text-white text-opacity-50">
                  I already have an account&nbsp;
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

export default SignUp
