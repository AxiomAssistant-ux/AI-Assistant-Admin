'use client'
import PasswordFormInput from '@/components/from/PasswordFormInput'
import TextAreaFormInput from '@/components/from/TextAreaFormInput'
import TextFormInput from '@/components/from/TextFormInput'
import { Card, CardBody, CardHeader, CardTitle, Col, FormControl, FormLabel, FormSelect } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

const Basic = () => {
  const { control } = useForm()
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'} className=" mb-0">
            Basic Example
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div>
            <div>
              <TextFormInput name="text" label="Text" control={control} containerClassName="mb-3" />
              <TextFormInput name="email" type="email" label="Email" control={control} placeholder="Email" containerClassName="mb-3" />
              <PasswordFormInput name="password" label="Password" control={control} placeholder="password" containerClassName="mb-3" />
              <div className="mb-3">
                <label htmlFor="example-palaceholder" className="form-label">
                  Placeholder
                </label>
                <input type="text" id="example-palaceholder" className="form-control" placeholder="placeholder" />
              </div>
              <TextAreaFormInput name="textarea" label="Text area" control={control} rows={5} />
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

const InputSizing = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'} className=" mb-0">
            Input Sizing
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div>
            <div className="d-flex flex-column gap-2 mb-3">
              <FormControl size="lg" type="text" placeholder=".form-control-lg" aria-label=".form-control-lg example" />
              <FormControl type="text" placeholder="Default input" aria-label="default input example" />
              <FormControl size="sm" type="text" placeholder=".form-control-sm" aria-label=".form-control-sm example" />
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  )
}
const DisabledInput = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'} className=" mb-0">
            Disabled Input
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div>
            <div className="d-flex flex-column gap-2 mb-3">
              <FormControl type="text" placeholder="Disabled input" aria-label="Disabled input example" />
              <FormControl type="text" defaultValue="Disabled readonly input" aria-label="Disabled input example" />
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

const ReadonlyInput = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'} className=" mb-0">
            Readonly Input
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div>
            <div className="d-flex flex-column gap-2 mb-3">
              <input className="form-control" type="text" defaultValue="Readonly input here..." aria-label="readonly input example" />
              <input type="text" readOnly className="form-control-plaintext" id="staticEmail" defaultValue="email@example.com" />
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

const DatalistsInput = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'} className=" mb-0">
            Datalists input
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div>
            <div className="mb-3">
              <label htmlFor="exampleDataList" className="form-label">
                Datalist example
              </label>
              <input className="form-control" list="datalistOptions" id="exampleDataList" placeholder="Type to search..." />
              <datalist id="datalistOptions">
                <option value="San Francisco"></option>
                <option value="New York"></option>
                <option value="Seattle"></option>
                <option value="Los Angeles"></option>
                <option value="Chicago"></option>
              </datalist>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

const SelectInputs = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'} className=" mb-0">
            Select
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="mb-3">
            <div className="mb-3">
              <FormLabel htmlFor="example-select">Default Input Select</FormLabel>
              <FormSelect id="example-select">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </FormSelect>
            </div>
            <p className="text-muted">
              The <code>multiple</code> attribute is also supported:
            </p>
            <div className="mb-3">
              <FormLabel htmlFor="example-multiselect">Multiple Select</FormLabel>
              <select id="example-multiselect" className="form-control">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>
            <p className="text-muted">
              As is the <code>size</code> attribute:
            </p>
            <label htmlFor="example-multiselectsize" className="form-label">
              Multiple Select Size
            </label>
            <select id="example-multiselectsize" className="form-select" size={3} aria-label="size 3 select example">
              <option selected={true}>Open this select menu</option>
              <option value={1}>One</option>
              <option value={2}>Two</option>
              <option value={3}>Three</option>
            </select>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

const CheckboxInputs = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'} className=" mb-0">
            Checkbox
          </CardTitle>
        </CardHeader>
        <CardBody>
          <h5>Default</h5>
          <div className="mb-3">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="customCheck1" />
              <label className="form-check-label" htmlFor="customCheck1">
                Check this custom checkbox
              </label>
            </div>
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="customCheck2" />
              <label className="form-check-label" htmlFor="customCheck2">
                Check this custom checkbox
              </label>
            </div>
          </div>
          <h5>Inline</h5>
          <div className="mb-3">
            <div className="form-check form-check-inline">
              <input type="checkbox" className="form-check-input" id="customCheck3" />
              <label className="form-check-label" htmlFor="customCheck3">
                Check this custom checkbox
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input type="checkbox" className="form-check-input" id="customCheck4" />
              <label className="form-check-label" htmlFor="customCheck4">
                Check this custom checkbox
              </label>
            </div>
          </div>
          <h5>Colors</h5>
          <div className="form-check mb-2">
            <input type="checkbox" className="form-check-input" id="customCheckcolor1" defaultChecked={true} />
            <label className="form-check-label" htmlFor="customCheckcolor1">
              Default Checkbox
            </label>
          </div>
          <div className="form-check form-checkbox-success mb-2">
            <input type="checkbox" className="form-check-input" id="customCheckcolor2" defaultChecked={true} />
            <label className="form-check-label" htmlFor="customCheckcolor2">
              Success Checkbox
            </label>
          </div>
          <div className="form-check form-checkbox-info mb-2">
            <input type="checkbox" className="form-check-input" id="customCheckcolor3" defaultChecked={true} />
            <label className="form-check-label" htmlFor="customCheckcolor3">
              Info Checkbox
            </label>
          </div>
          <div className="form-check form-checkbox-secondary mb-2">
            <input type="checkbox" className="form-check-input" id="customCheckcolor6" defaultChecked={true} />
            <label className="form-check-label" htmlFor="customCheckcolor6">
              Secondary Checkbox
            </label>
          </div>
          <div className="form-check form-checkbox-warning mb-2">
            <input type="checkbox" className="form-check-input" id="customCheckcolor4" defaultChecked={true} />
            <label className="form-check-label" htmlFor="customCheckcolor4">
              Warning Checkbox
            </label>
          </div>
          <div className="form-check form-checkbox-danger mb-2">
            <input type="checkbox" className="form-check-input" id="customCheckcolor5" defaultChecked={true} />
            <label className="form-check-label" htmlFor="customCheckcolor5">
              Danger Checkbox
            </label>
          </div>
          <div className="form-check form-checkbox-dark">
            <input type="checkbox" className="form-check-input" id="customCheckcolor7" defaultChecked={true} />
            <label className="form-check-label" htmlFor="customCheckcolor7">
              Dark Checkbox
            </label>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

const RadioInputs = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'} className=" mb-0">
            Radio
          </CardTitle>
        </CardHeader>
        <CardBody>
          <h5>Default</h5>
          <div className="mb-3">
            <div className="form-check">
              <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
              <label className="form-check-label" htmlFor="flexRadioDefault1">
                Default radio
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" defaultChecked={true} />
              <label className="form-check-label" htmlFor="flexRadioDefault2">
                Default checked radio
              </label>
            </div>
          </div>
          <h5>Inline</h5>
          <div className="mb-3">
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" defaultValue="option1" />
              <label className="form-check-label" htmlFor="inlineRadio1">
                Check this custom checkbox
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" defaultValue="option2" />
              <label className="form-check-label" htmlFor="inlineRadio2">
                Check this custom checkbox
              </label>
            </div>
          </div>
          <div>
            <h5>Colors</h5>
            <div className="form-check mb-2">
              <input type="radio" id="customRadiocolor1" name="customRadiocolor1" className="form-check-input" defaultChecked={true} />
              <label className="form-check-label" htmlFor="customRadiocolor1">
                Default Radio
              </label>
            </div>
            <div className="form-check form-radio-success mb-2">
              <input type="radio" id="customRadiocolor2" name="customRadiocolor2" className="form-check-input" defaultChecked={true} />
              <label className="form-check-label" htmlFor="customRadiocolor2">
                Success Radio
              </label>
            </div>
            <div className="form-check form-radio-info mb-2">
              <input type="radio" id="customRadiocolor3" name="customRadiocolor3" className="form-check-input" defaultChecked={true} />
              <label className="form-check-label" htmlFor="customRadiocolor3">
                Info Radio
              </label>
            </div>
            <div className="form-check form-radio-secondary mb-2">
              <input type="radio" id="customRadiocolor6" name="customRadiocolor6" className="form-check-input" defaultChecked={true} />
              <label className="form-check-label" htmlFor="customRadiocolor6">
                Secondary Radio
              </label>
            </div>
            <div className="form-check form-radio-warning mb-2">
              <input type="radio" id="customRadiocolor4" name="customRadiocolor4" className="form-check-input" defaultChecked={true} />
              <label className="form-check-label" htmlFor="customRadiocolor4">
                Warning Radio
              </label>
            </div>
            <div className="form-check form-radio-danger mb-2">
              <input type="radio" id="customRadiocolor5" name="customRadiocolor5" className="form-check-input" defaultChecked={true} />
              <label className="form-check-label" htmlFor="customRadiocolor5">
                Danger Radio
              </label>
            </div>
            <div className="form-check form-radio-dark">
              <input type="radio" id="customRadiocolor7" name="customRadiocolor7" className="form-check-input" defaultChecked={true} />
              <label className="form-check-label" htmlFor="customRadiocolor7">
                Dark Radio
              </label>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

const SwitchInputs = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'} className=" mb-0">
            Switch
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
              <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                Default switch checkbox input
              </label>
            </div>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" defaultChecked={true} />
              <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                Checked switch checkbox input
              </label>
            </div>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDisabled" disabled />
              <label className="form-check-label" htmlFor="flexSwitchCheckDisabled">
                Disabled switch checkbox input
              </label>
            </div>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckCheckedDisabled" defaultChecked={true} disabled />
              <label className="form-check-label" htmlFor="flexSwitchCheckCheckedDisabled">
                Disabled checked switch checkbox input
              </label>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

const BasicExamples = () => {
  return (
    <>
      <Col>
        <Basic />
        <InputSizing />
        <DisabledInput />
        <CheckboxInputs />
      </Col>

      <Col>
        <ReadonlyInput />
        <DatalistsInput />
        <SelectInputs />
        <RadioInputs />
        <SwitchInputs />
      </Col>
    </>
  )
}

export default BasicExamples
