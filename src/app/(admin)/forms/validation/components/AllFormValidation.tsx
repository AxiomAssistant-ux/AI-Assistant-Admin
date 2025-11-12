'use client'
import { serverSideFormValidate } from '@/helpers/data'
import clsx from 'clsx'
import React, { ChangeEvent, useState, type FormEvent } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  FormCheck,
  FormControl,
  FormGroup,
  FormLabel,
  FormSelect,
  InputGroup,
} from 'react-bootstrap'
import Feedback from 'react-bootstrap/esm/Feedback'
import InputGroupText from 'react-bootstrap/esm/InputGroupText'
import { ValidationError } from 'yup'

type ValidationErrorType = {
  name?: string
  message: string
}

const BrowserDefault = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'}>Browser Default</CardTitle>
        <p className="card-subtitle">Depending on your browser and OS, you’ll see a slightly different style of feedback.</p>
      </CardHeader>
      <CardBody>
        <div className="mb-3">
          <form className="row g-3">
            <Col md={4}>
              <FormLabel htmlFor="validationDefault01" className="form-label">
                First name
              </FormLabel>
              <FormControl type="text" className="form-control" id="validationDefault01" defaultValue="Mark" required />
            </Col>
            <Col md={4}>
              <FormLabel htmlFor="validationDefault02" className="form-label">
                Last name
              </FormLabel>
              <FormControl type="text" className="form-control" id="validationDefault02" defaultValue="Otto" required />
            </Col>
            <Col md={4}>
              <FormLabel htmlFor="validationDefaultUsername" className="form-label">
                Username
              </FormLabel>
              <div className="input-group">
                <span className="input-group-text" id="inputGroupPrepend2">
                  @
                </span>
                <FormControl type="text" className="form-control" id="validationDefaultUsername" aria-describedby="inputGroupPrepend2" required />
              </div>
            </Col>
            <Col md={6}>
              <FormLabel htmlFor="validationDefault03" className="form-label">
                City
              </FormLabel>
              <FormControl type="text" className="form-control" id="validationDefault03" required />
            </Col>
            <Col md={3}>
              <FormLabel htmlFor="validationDefault04" className="form-label">
                State
              </FormLabel>
              <select className="form-select" id="validationDefault04" required>
                <option selected disabled>
                  Choose...
                </option>
                <option>...</option>
              </select>
            </Col>
            <Col md={3}>
              <FormLabel htmlFor="validationDefault05" className="form-label">
                Zip
              </FormLabel>
              <FormControl type="text" className="form-control" id="validationDefault05" required />
            </Col>
            <Col xs={12}>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="invalidCheck2" required />
                <label className="form-check-label" htmlFor="invalidCheck2">
                  Agree to terms and conditions
                </label>
              </div>
            </Col>
            <Col xs={12}>
              <button className="btn btn-primary" type="submit">
                Submit form
              </button>
            </Col>
          </form>
        </div>
      </CardBody>
    </Card>
  )
}

const CustomStyles = () => {
  const [validated, setValidated] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
  }
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Custom styles</CardTitle>
          <p className="card-subtitle">
            For custom Bootstrap form validation messages, you’ll need to add the
            <code>novalidate</code> boolean attribute to your <code>&lt;form&gt;</code>. This disables the browser default feedback tooltips, but
            still provides access to the form validation APIs in JavaScript. When attempting to submit, you’ll see the <code>:invalid</code> and
            <code>:valid</code> styles applied to your form controls.
          </p>
        </CardHeader>
        <CardBody>
          <div className="mb-3">
            <Form className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>
              <FormGroup className="col-md-4">
                <FormLabel>First name</FormLabel>
                <FormControl type="text" id="validationCustom01" placeholder="First name" defaultValue="Mark" required />
                <Feedback>Looks good!</Feedback>
              </FormGroup>
              <FormGroup className="col-md-4">
                <FormLabel>Last name</FormLabel>
                <FormControl type="text" id="validationCustom02" placeholder="Last name" defaultValue="Otto" required />
                <Feedback>Looks good!</Feedback>
              </FormGroup>
              <FormGroup className="col-md-4">
                <FormLabel>Username</FormLabel>
                <InputGroup>
                  <InputGroupText id="inputGroupPrepend">@</InputGroupText>
                  <FormControl type="text" id="validationCustomUsername" placeholder="" required />
                  <Feedback type="invalid">Please choose a username.</Feedback>
                </InputGroup>
              </FormGroup>
              <FormGroup className="col-md-6">
                <FormLabel>City</FormLabel>
                <FormControl type="text" id="validationCustom03" placeholder="" required />
                <Feedback type="invalid">Please provide a valid city.</Feedback>
              </FormGroup>
              <FormGroup className="col-md-3">
                <FormLabel>State</FormLabel>
                <FormControl type="text" id="validationCustom04" placeholder="State" required />
                <Feedback type="invalid">Please provide a valid state.</Feedback>
              </FormGroup>
              <FormGroup className="col-md-3">
                <FormLabel>Zip</FormLabel>
                <FormControl type="text" id="validationCustom05" placeholder="" required />
                <Feedback type="invalid">Please provide a valid zip.</Feedback>
              </FormGroup>
              <FormGroup className="col-12">
                <FormCheck
                  id="invalidCheck"
                  required
                  label="Agree to terms and conditions"
                  feedback="You must agree before submitting."
                  feedbackType="invalid"
                />
              </FormGroup>
              <Col xs={12}>
                <Button variant="primary" type="submit">
                  Submit form
                </Button>
              </Col>
            </Form>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

const ServerSideValidation = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Server side</CardTitle>
          <p className="card-subtitle">
            We recommend using client-side validation, but in case you require server-side validation, you can indicate invalid and valid form fields
            with
            <code>.is-invalid</code> and <code>.is-valid</code>. Note that
            <code>.invalid-feedback</code> is also supported with these classes.
          </p>
        </CardHeader>
        <CardBody>
          <div className="mb-3">
            <form className="row g-3">
              <Col md={4}>
                <label htmlFor="validationServer01" className="form-label">
                  First name
                </label>
                <input type="text" className="form-control is-valid" id="validationServer01" defaultValue="Mark" required />
                <div className="valid-feedback">Looks good!</div>
              </Col>
              <Col md={4}>
                <label htmlFor="validationServer02" className="form-label">
                  Last name
                </label>
                <input type="text" className="form-control is-valid" id="validationServer02" defaultValue="Otto" required />
                <div className="valid-feedback">Looks good!</div>
              </Col>
              <Col md={4}>
                <label htmlFor="validationServerUsername" className="form-label">
                  Username
                </label>
                <div className="input-group has-validation">
                  <span className="input-group-text" id="inputGroupPrepend3">
                    @
                  </span>
                  <input
                    type="text"
                    className="form-control is-invalid"
                    id="validationServerUsername"
                    aria-describedby="inputGroupPrepend3 validationServerUsernameFeedback"
                    required
                  />
                  <div id="validationServerUsernameFeedback" className="invalid-feedback">
                    Please choose a username.
                  </div>
                </div>
              </Col>
              <div className="col-md-6">
                <label htmlFor="validationServer03" className="form-label">
                  City
                </label>
                <input
                  type="text"
                  className="form-control is-invalid"
                  id="validationServer03"
                  aria-describedby="validationServer03Feedback"
                  required
                />
                <div id="validationServer03Feedback" className="invalid-feedback">
                  Please provide a valid city.
                </div>
              </div>
              <div className="col-md-3">
                <label htmlFor="validationServer04" className="form-label">
                  State
                </label>
                <select className="form-select is-invalid" id="validationServer04" aria-describedby="validationServer04Feedback" required>
                  <option selected disabled>
                    Choose...
                  </option>
                  <option>...</option>
                </select>
                <div id="validationServer04Feedback" className="invalid-feedback">
                  Please select a valid state.
                </div>
              </div>
              <div className="col-md-3">
                <label htmlFor="validationServer05" className="form-label">
                  Zip
                </label>
                <input
                  type="text"
                  className="form-control is-invalid"
                  id="validationServer05"
                  aria-describedby="validationServer05Feedback"
                  required
                />
                <div id="validationServer05Feedback" className="invalid-feedback">
                  Please provide a valid zip.
                </div>
              </div>
              <div className="col-12">
                <div className="form-check">
                  <input
                    className="form-check-input is-invalid"
                    type="checkbox"
                    id="invalidCheck3"
                    aria-describedby="invalidCheck3Feedback"
                    required
                  />
                  <label className="form-check-label" htmlFor="invalidCheck3">
                    Agree to terms and conditions
                  </label>
                  <div id="invalidCheck3Feedback" className="invalid-feedback">
                    You must agree before submitting.
                  </div>
                </div>
              </div>
              <div className="col-12">
                <button className="btn btn-primary" type="submit">
                  Submit form
                </button>
              </div>
            </form>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

const SupportedElements = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Supported elements</CardTitle>
          <p className="card-subtitle">Validation styles are available for the following form controls and components:</p>
        </CardHeader>
        <CardBody>
          <ul>
            <li>
              <code>&lt;input&gt;</code>s and <code>&lt;textarea&gt;</code>s with
              <code>.form-control</code> (including up to one
              <code>.form-control</code> in input groups)
            </li>
            <li>
              <code>&lt;select&gt;</code>s with <code>.form-select</code>
            </li>
            <li>
              <code>.form-check</code>s
            </li>
          </ul>
          <div className="mb-3">
            <form className="was-validated">
              <div className="mb-3">
                <FormLabel htmlFor="validationTextarea">Textarea</FormLabel>
                <textarea className="form-control" id="validationTextarea" placeholder="Required example textarea" required />
                <Feedback type="invalid">Please enter a message in the textarea.</Feedback>
              </div>
              <div className="form-check mb-3">
                <input type="checkbox" className="form-check-input" id="validationFormCheck1" required />
                <label className="form-check-label" htmlFor="validationFormCheck1">
                  Check this checkbox
                </label>
                <Feedback type="invalid">Example invalid feedback text</Feedback>
              </div>
              <div className="form-check">
                <input type="radio" className="form-check-input" id="validationFormCheck2" name="radio-stacked" required />
                <label className="form-check-label" htmlFor="validationFormCheck2">
                  Toggle this radio
                </label>
              </div>
              <div className="form-check mb-3">
                <input type="radio" className="form-check-input" id="validationFormCheck3" name="radio-stacked" required />
                <label className="form-check-label" htmlFor="validationFormCheck3">
                  Or toggle this other radio
                </label>
                <Feedback type="invalid">More example invalid feedback text</Feedback>
              </div>
              <div className="mb-3">
                <FormSelect className="form-select" required aria-label="select example">
                  <option>Open this select menu</option>
                  <option value={1}>One</option>
                  <option value={2}>Two</option>
                  <option value={3}>Three</option>
                </FormSelect>
                <Feedback type="invalid">Example invalid select feedback</Feedback>
              </div>
              <div className="mb-3">
                <FormControl type="file" aria-label="file example" required />
                <Feedback type="invalid">Example invalid form file feedback</Feedback>
              </div>
              <div className="mb-3">
                <Button variant="primary" type="submit">
                  Submit form
                </Button>
              </div>
            </form>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

const Tooltips = () => {
  const [validated, setValidated] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget
    if (!form.checkValidity()) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Tooltips</CardTitle>
          <p className="card-subtitle">
            If your form layout allows it, you can swap the
            <code>
              .{'{'}valid|invalid{'}'}-feedback
            </code>
            classes for
            <code>
              .{'{'}valid|invalid{'}'}-tooltip
            </code>
            classes to display validation feedback in a styled tooltip. Be sure to have a parent with
            <code>position: relative</code> on it for tooltip positioning. In the example below, our column classes have this already, but your
            project may require an alternative setup.
          </p>
        </CardHeader>
        <CardBody>
          <div className="mb-3">
            <Form className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>
              <FormGroup className="position-relative col-md-4">
                <FormLabel>First name</FormLabel>
                <FormControl type="text" placeholder="First name" defaultValue="Mark" required />
                <Feedback tooltip>Looks good!</Feedback>
                <Feedback type="invalid" tooltip>
                  Please enter first name.
                </Feedback>
              </FormGroup>
              <FormGroup className="position-relative col-md-4">
                <FormLabel>Last name</FormLabel>
                <FormControl type="text" placeholder="Last name" defaultValue="Otto" required />
                <Feedback tooltip>Looks good!</Feedback>
                <Feedback type="invalid" tooltip>
                  Please enter last name.
                </Feedback>
              </FormGroup>
              <FormGroup className="position-relative col-md-4">
                <FormLabel>Username</FormLabel>
                <InputGroup>
                  <InputGroupText>@</InputGroupText>
                  <FormControl type="text" placeholder="Username" required />
                  <Feedback type="invalid" tooltip>
                    Please choose a unique and valid username.
                  </Feedback>
                </InputGroup>
              </FormGroup>
              <FormGroup className="position-relative col-md-6">
                <FormLabel>City</FormLabel>
                <FormControl type="text" placeholder="City" required />
                <Feedback type="invalid" tooltip>
                  Please provide a valid city.
                </Feedback>
              </FormGroup>
              <FormGroup className="position-relative col-md-3">
                <FormLabel>State</FormLabel>
                <FormControl type="text" placeholder="State" required />
                <Feedback type="invalid" tooltip>
                  Please provide a valid state.
                </Feedback>
              </FormGroup>
              <FormGroup className="position-relative col-md-3">
                <FormLabel>Zip</FormLabel>
                <FormControl type="text" placeholder="Zip" required />
                <Feedback type="invalid" tooltip>
                  Please provide a valid zip.
                </Feedback>
              </FormGroup>
              <Col xs={12}>
                <Button variant="primary" type="submit">
                  Submit form
                </Button>
              </Col>
            </Form>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

const AllFormValidation = () => {
  return (
    <>
      <BrowserDefault />
      <CustomStyles />
      <ServerSideValidation />
      <SupportedElements />
      <Tooltips />
    </>
  )
}

export default AllFormValidation
