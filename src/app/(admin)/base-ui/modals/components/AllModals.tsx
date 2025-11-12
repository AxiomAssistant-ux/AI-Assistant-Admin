'use client'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import useModal from '@/hooks/useModal'
import useToggle from '@/hooks/useToggle'
import { useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap'

const DefaultModal = () => {
  const { isTrue, toggle } = useToggle()
  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Default Modals</CardTitle>
          <p className="card-subtitle">
            Toggle a working modal demo by clicking the button below. It will slide down and fade in from the top of the page.
          </p>
        </CardHeader>
        <CardBody>
          <button onClick={toggle} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Launch demo modal
          </button>
          <Modal show={isTrue} onHide={toggle} className="fade" id="exampleModal" tabIndex={-1}>
            <ModalHeader>
              <h5 className="modal-title" id="exampleModalLabel">
                Modal title
              </h5>
              <button type="button" className="btn-close" onClick={toggle} />
            </ModalHeader>
            <ModalBody>
              <p>Woo-hoo, you&apos;re reading this text in a modal!</p>
            </ModalBody>
            <ModalFooter>
              <Button type="button" variant="secondary" onClick={toggle}>
                Close
              </Button>
              <Button type="button" variant="primary">
                Save changes
              </Button>
            </ModalFooter>
          </Modal>
        </CardBody>
      </Card>
    </Col>
  )
}

const StaticBackdropModal = () => {
  const { isTrue, toggle } = useToggle()

  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Static Backdrop</CardTitle>
          <p className="card-subtitle">
            When backdrop is set to static, the modal will not close when clicking outside of it. Click the button below to try it.
          </p>
        </CardHeader>
        <CardBody>
          <button onClick={toggle} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
            Launch static backdrop modal
          </button>
          <Modal show={isTrue} onHide={toggle} backdrop="static" keyboard={false} className="fade" id="exampleModal" tabIndex={-1}>
            <ModalHeader>
              <h5 className="modal-title" id="exampleModalLabel">
                Modal title
              </h5>
              <button type="button" className="btn-close" onClick={toggle} />
            </ModalHeader>
            <ModalBody>
              <p>I will not close if you click outside of me. Don&apos;t even try to press escape key.</p>
            </ModalBody>
            <ModalFooter>
              <Button type="button" variant="secondary" onClick={toggle}>
                Close
              </Button>
              <Button type="button" variant="primary">
                Understood
              </Button>
            </ModalFooter>
          </Modal>
        </CardBody>
      </Card>
    </Col>
  )
}

const ScrollingModals = () => {
  const { isTrue: isModelOpenOne, toggle: toggleModelOne } = useToggle()
  const { isTrue: isModelOpenTwo, toggle: toggleModelTwo } = useToggle()

  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <h5 className="card-title ">Scrolling Long Content</h5>
          <p className="card-subtitle">
            When modals become too long for the user’s viewport or device, they scroll independent of the page itself. Try the demo below to see what
            we mean.
          </p>
        </CardHeader>
        <CardBody>
          <button onClick={toggleModelOne} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModalLong">
            Launch demo modal
          </button>
          <div className="modal fade" id="exampleModalLong" tabIndex={-1} aria-labelledby="exampleModalLongTitle" aria-hidden="true">
            <Modal show={isModelOpenOne} className="fade" id="exampleModalLong" tabIndex={-1}>
              <ModalHeader>
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Modal title
                </h5>
                <button type="button" className="btn-close" onClick={toggleModelOne} />
              </ModalHeader>
              <ModalBody style={{ minHeight: 1500 }}>
                <p>
                  This is some placeholder content to show the scrolling behavior for modals. Instead of repeating the text the modal, we use an
                  inline style set a minimum height, thereby extending the length of the overall modal and demonstrating the overflow scrolling. When
                  content becomes longer than the height of the viewport, scrolling will move the modal as needed.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="secondary" type="button" onClick={toggleModelOne}>
                  Close
                </Button>
                <Button variant="primary" type="button">
                  Save changes
                </Button>
              </ModalFooter>
            </Modal>
          </div>
          <p className="text-muted mt-3">
            You can also create a scrollable modal that allows scroll the modal body by adding <code>.modal-dialog-scrollable</code> to
            <code>.modal-dialog</code>.
          </p>
          <button onClick={toggleModelTwo} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModalScrollable">
            Launch demo modal
          </button>
          <Modal show={isModelOpenTwo} className="fade" scrollable id="exampleModalScrollable" tabIndex={-1}>
            <ModalHeader>
              <h5 className="modal-title" id="exampleModalScrollableTitle">
                Modal title
              </h5>
              <button type="button" className="btn-close" onClick={toggleModelTwo} />
            </ModalHeader>
            <ModalBody>
              <p>
                This is some placeholder content to show the scrolling behavior for modals. We use repeated line breaks to demonstrate how content can
                exceed minimum inner height, thereby showing inner scrolling. When content becomes longer than the predefined max-height of modal,
                content will be cropped and scrollable within the Modal
              </p>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <p>This content should appear at the bottom after you scroll.</p>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" type="button" onClick={toggleModelTwo}>
                Close
              </Button>
              <Button variant="primary" type="button">
                Save changes
              </Button>
            </ModalFooter>
          </Modal>
        </CardBody>
      </Card>
    </Col>
  )
}

const ModalPositions = () => {
  const { isTrue, toggle } = useToggle()
  const { isTrue: isOpenScrollableModel, toggle: toggleScrollableModel } = useToggle()
  const { isOpen, className, toggleModal, openModalWithClass } = useModal()

  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Modal Position</CardTitle>
          <p className="card-subtitle">
            Add <code>.modal-dialog-centered</code> to
            <code>.modal-dialog</code> to vertically center the modal.
          </p>
        </CardHeader>
        <CardBody>
          <div className="d-flex flex-wrap gap-2">
            <button onClick={toggle} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModalCenter">
              Vertically centered modal
            </button>
            <Modal show={isTrue} onHide={toggle} className="fade" centered>
              <ModalHeader>
                <h5 className="modal-title" id="exampleModalCenterTitle">
                  Modal title
                </h5>
                <button type="button" className="btn-close" onClick={toggle} />
              </ModalHeader>
              <ModalBody>
                <p>This is a vertically centered Modal</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="secondary" type="button" onClick={toggle}>
                  Close
                </Button>
                <Button variant="primary" type="button">
                  Save changes
                </Button>
              </ModalFooter>
            </Modal>
            <button
              onClick={toggleScrollableModel}
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModalCenteredScrollable">
              Vertically centered scrollable modal
            </button>
            <Modal show={isOpenScrollableModel} onHide={toggleScrollableModel} className="fade" scrollable centered>
              <ModalHeader>
                <h5 className="modal-title" id="exampleModalCenteredScrollableTitle">
                  Modal title
                </h5>
                <button type="button" className="btn-close" onClick={toggleScrollableModel} />
              </ModalHeader>
              <ModalBody>
                <p>
                  This is some placeholder content to show a vertically centered Modal We&apos;ve added some extra copy here to show how vertically
                  centering the modal works when combined with scrollable modals. We also use some repeated line breaks to quickly extend the height
                  of the content, thereby triggering the scrolling. When content becomes longer than the predefined max-height of modal, content will
                  be cropped and scrollable within the Modal
                </p>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <p>Just like that.</p>
              </ModalBody>
              <ModalFooter>
                <Button type="button" variant="secondary" onClick={toggleScrollableModel}>
                  Close
                </Button>
                <Button type="button" variant="primary">
                  Save changes
                </Button>
              </ModalFooter>
            </Modal>
          </div>
          <p className="text-muted mt-3">
            Specify the position for the modal. You can display modal at top, bottom of page by specifying classes <code>modal-top</code> and{' '}
            <code>modal-bottom</code>
            respectively.
          </p>
          <div className="d-flex flex-wrap gap-2">
            <div className="hstack gap-2">
              <button
                onClick={() => openModalWithClass('modal-top')}
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#topModal">
                Top Modal
              </button>
              <button
                onClick={() => openModalWithClass('modal-bottom')}
                type="button"
                className="btn btn-success "
                data-bs-toggle="modal"
                data-bs-target="#bottomModal">
                Bottom Modal
              </button>
            </div>
            <Modal show={isOpen} onHide={toggleModal} className="fade" dialogClassName={className}>
              <ModalHeader onHide={toggleModal} closeButton>
                <h5 className="modal-title" id="exampleModalCenterTitle">
                  Modal title
                </h5>
              </ModalHeader>
              <ModalBody>
                <h6>Text in a modal</h6>
                <p className="mb-0">Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="secondary" type="button" onClick={toggleModal}>
                  Close
                </Button>
                <Button variant="primary" type="button">
                  Save changes
                </Button>
              </ModalFooter>
            </Modal>
          </div>
        </CardBody>
      </Card>
    </Col>
  )
}

const ToggleBetweenModals = () => {
  const { isTrue: isOpen, toggle: toggleModal } = useToggle()
  const { isTrue: isNextOpen, toggle: toggleNextModal } = useToggle()
  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Toggle Between Modals</CardTitle>
          <p className="card-subtitle">
            Toggle between multiple modals with some clever placement of the <code>data-bs-target</code> and
            <code>data-bs-toggle</code> attributes. For example, you could toggle a password reset modal from within an already open sign in modal.
            <strong>Please note multiple modals cannot be open at the same time</strong>
            —this method simply toggles between two separate modals.
          </p>
        </CardHeader>
        <CardBody>
          <Button variant="primary" onClick={toggleModal}>
            Open first modal
          </Button>

          <Modal className="fade" show={isOpen} onHide={toggleModal} centered>
            <ModalHeader closeButton>
              <ModalTitle as="h5">Modal 1</ModalTitle>
            </ModalHeader>
            <ModalBody className="modal-body">Show a second modal and hide this one with the button below.</ModalBody>
            <ModalFooter>
              <Button
                variant="primary"
                onClick={() => {
                  toggleModal()
                  toggleNextModal()
                }}>
                Open second modal
              </Button>
            </ModalFooter>
          </Modal>
          <Modal className="fade" show={isNextOpen} onHide={toggleNextModal} centered>
            <ModalHeader closeButton>
              <ModalTitle as="h5">Modal 2</ModalTitle>
            </ModalHeader>
            <ModalBody>Hide this modal and show the first with the button below.</ModalBody>
            <ModalFooter>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <Button
                variant="primary"
                onClick={() => {
                  toggleModal()
                  toggleNextModal()
                }}>
                Back to first
              </Button>
            </ModalFooter>
          </Modal>
        </CardBody>
      </Card>
    </Col>
  )
}

const ModalSizes = () => {
  const { isOpen, size, className, toggleModal, openModalWithSize } = useModal()
  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Optional Sizes</CardTitle>
          <p className="card-subtitle">
            Modals have three optional sizes, available via modifier classes to be placed on a <code>.modal-dialog</code>. These sizes kick in at
            certain breakpoints to avoid horizontal scrollbars on narrower viewports.
          </p>
        </CardHeader>
        <CardBody>
          <div className="hstack gap-2">
            <button
              onClick={() => openModalWithSize('xl')}
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModalXl">
              Extra large modal
            </button>
            <button
              onClick={() => openModalWithSize('lg')}
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModalLg">
              Large modal
            </button>
            <button
              onClick={() => openModalWithSize('sm')}
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModalSm">
              Small modal
            </button>
          </div>
          <Modal className="fade" show={isOpen} onHide={toggleModal} dialogClassName={className} size={size}>
            <ModalHeader onHide={toggleModal} closeButton>
              <h5 className="modal-title h4" id="exampleModalXlLabel">
                Extra large modal
              </h5>
            </ModalHeader>
            <ModalBody>...</ModalBody>
          </Modal>
        </CardBody>
      </Card>
    </Col>
  )
}

const FullScreenModals = () => {
  const sizes: string[] = ['sm-down', 'md-down', 'lg-down', 'xl-down', 'xxl-down']
  const [fullscreen, setFullscreen] = useState<undefined | string>(undefined)
  const [show, setShow] = useState(false)

  const handleShow = (breakpoint: string) => {
    setFullscreen(breakpoint)
    setShow(true)
  }
  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Fullscreen Modal</CardTitle>
          <p className="card-subtitle">
            Modals have three optional sizes, available via modifier classes to be placed on a <code>.modal-dialog</code>. These sizes kick in at
            certain breakpoints to avoid horizontal scrollbars on narrower viewports.
          </p>
        </CardHeader>
        <CardBody>
          <div className="hstack flex-wrap gap-2">
            <Button variant="primary" onClick={() => setShow(true)}>
              Full screen
            </Button>
            {sizes.map((size, idx) => (
              <Button key={idx} onClick={() => handleShow(size)}>
                Full Screen
                {typeof size === 'string' && ` Below ${size.split('-')[0]}`}
              </Button>
            ))}
          </div>
          <Modal show={show} className="fade" fullscreen={fullscreen ?? true} onHide={() => setShow(false)}>
            <ModalHeader closeButton>
              <ModalTitle>Modal</ModalTitle>
            </ModalHeader>
            <ModalBody>...</ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setShow(false)}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        </CardBody>
      </Card>
    </Col>
  )
}

const ModalWithAlerts = () => {
  const { isOpen, className, toggleModal, openModalWithClass } = useModal()

  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Modal Based Alerts</CardTitle>
          <p className="card-subtitle">
            Modals have three optional sizes, available via modifier classes to be placed on a <code>.modal-dialog</code>. These sizes kick in at
            certain breakpoints to avoid horizontal scrollbars on narrower viewports.
          </p>
        </CardHeader>
        <CardBody>
          <div className="hstack flex-wrap gap-2">
            <Button variant="primary" onClick={() => openModalWithClass('bg-primary')}>
              Primary Alert
            </Button>
            <Button variant="secondary" onClick={() => openModalWithClass('bg-secondary')}>
              Secondary Alert
            </Button>
            <Button variant="success" onClick={() => openModalWithClass('bg-success')}>
              Success Alert
            </Button>
            <Button variant="info" onClick={() => openModalWithClass('bg-info')}>
              Info Alert
            </Button>
          </div>
          <Modal className="fade" show={isOpen} onHide={toggleModal} size="sm">
            <div className={`modal-filled rounded-2 ${className}`}>
              <ModalBody>
                <div className="text-center">
                  <IconifyIcon icon="bx:check-double" className="display-6 mt-0 text-white" />
                  <h4 className="mt-3 text-white">Well Done!</h4>
                  <p className="mt-3">
                    Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.
                  </p>
                  <Button variant="light" type="button" className="mt-3" onClick={toggleModal}>
                    Continue
                  </Button>
                </div>
              </ModalBody>
            </div>
          </Modal>
        </CardBody>
      </Card>
    </Col>
  )
}

const AllModals = () => {
  return (
    <>
      <DefaultModal />
      <StaticBackdropModal />
      <ScrollingModals />
      <ModalPositions />
      <ToggleBetweenModals />
      <ModalSizes />
      <FullScreenModals />
      <ModalWithAlerts />
    </>
  )
}

export default AllModals
