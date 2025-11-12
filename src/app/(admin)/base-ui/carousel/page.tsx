import Image from 'next/image'
import { Card, CardBody, CardHeader, CardTitle, Carousel as CarouselBootstrap, CarouselItem, Col, Row } from 'react-bootstrap'
import React from 'react'
import Img1 from '@/assets/images/small/img-1.jpg'
import Img2 from '@/assets/images/small/img-2.jpg'
import Img3 from '@/assets/images/small/img-3.jpg'
import Img4 from '@/assets/images/small/img-4.jpg'
import Img5 from '@/assets/images/small/img-5.jpg'
import Img6 from '@/assets/images/small/img-6.jpg'
import Img7 from '@/assets/images/small/img-7.jpg'
import Img8 from '@/assets/images/small/img-8.jpg'
import Img9 from '@/assets/images/small/img-9.jpg'
import Img10 from '@/assets/images/small/img-10.jpg'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Carousel' }

const SlidesOnlyCarousel = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <div>
              <CardTitle as={'h5'}>Slides Only</CardTitle>
              <p className="card-subtitle">
                Here’s a carousel with slides only. Note the presence of the&nbsp;
                <code>.d-block</code> and <code> .img-fluid</code> on carousel images to prevent browser default image alignment.
              </p>
            </div>
          </CardHeader>
          <CardBody>
            <CarouselBootstrap indicators={false} controls={false}>
              <CarouselItem>
                <Image src={Img2} width={710} height={471} className="d-block w-100" alt="img-2" />
              </CarouselItem>
              <CarouselItem>
                <Image src={Img3} width={710} height={471} className="d-block w-100" alt="img-3" />
              </CarouselItem>
              <CarouselItem>
                <Image src={Img4} width={710} height={471} className="d-block w-100" alt="img-4" />
              </CarouselItem>
            </CarouselBootstrap>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const ControlsCarousel = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>With Controls</CardTitle>
            <p className="card-subtitle">Adding in the previous and next controls:</p>
          </CardHeader>
          <CardBody>
            <CarouselBootstrap indicators={false}>
              <CarouselItem>
                <Image src={Img4} width={710} height={471} className="d-block h-auto w-100" alt="img-2" />
              </CarouselItem>
              <CarouselItem>
                <Image src={Img2} width={710} height={471} className="d-block h-auto w-100" alt="img-3" />
              </CarouselItem>
              <CarouselItem>
                <Image src={Img3} width={710} height={471} className="d-block h-auto w-100" alt="img-4" />
              </CarouselItem>
            </CarouselBootstrap>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const IndicatorsCarousel = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>With Indicators</CardTitle>
            <p className="card-subtitle">You can also add the indicators to the carousel, alongside the controls, too.</p>
          </CardHeader>
          <CardBody>
            <CarouselBootstrap>
              <CarouselItem>
                <Image src={Img5} width={710} height={471} className="d-block h-auto w-100" alt="img-5" />
              </CarouselItem>
              <CarouselItem>
                <Image src={Img6} width={710} height={471} className="d-block h-auto w-100" alt="img-6" />
              </CarouselItem>
              <CarouselItem>
                <Image src={Img7} width={710} height={471} className="d-block h-auto w-100" alt="img-7" />
              </CarouselItem>
            </CarouselBootstrap>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const CaptionsCarousel = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>With Captions</CardTitle>
            <p className="card-subtitle">
              Add captions to your slides easily with the
              <code>.carousel-caption</code> element within any
              <code>.carousel-item</code>. They can be easily hidden on smaller viewports, as shown below, with optional display utilities. We hide
              them initially with <code>.d-none</code> and bring them back on medium-sized devices with <code>.d-md-block</code>.
            </p>
          </CardHeader>
          <CardBody>
            <CarouselBootstrap indicators={false}>
              <CarouselItem>
                <Image src={Img6} width={710} height={471} className="d-block h-auto w-100" alt="img-6" />
                <div className="carousel-caption d-none d-md-block">
                  <h5 className="text-white">First slide label</h5>
                  <p>Some representative placeholder content for the first slide.</p>
                </div>
              </CarouselItem>
              <CarouselItem>
                <Image src={Img7} width={710} height={471} className="d-block h-auto w-100" alt="img-7" />
                <div className="carousel-caption d-none d-md-block">
                  <h5 className="text-white">Second slide label</h5>
                  <p>Some representative placeholder content for the second slide.</p>
                </div>
              </CarouselItem>
              <CarouselItem>
                <Image src={Img5} width={710} height={471} className="d-block h-auto w-100" alt="img-5" />
                <div className="carousel-caption d-none d-md-block">
                  <h5 className="text-white">Third slide label</h5>
                  <p>Some representative placeholder content for the third slide.</p>
                </div>
              </CarouselItem>
            </CarouselBootstrap>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const CrossfadeCarousel = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Crossfade</CardTitle>
            <p className="card-subtitle">
              Add <code>.carousel-fade</code> to your carousel to animate slides with a fade transition instead of a slide. Depending on your carousel
              content (e.g., text only slides), you may want to add
              <code>.bg-body</code> or some custom CSS to the
              <code>.carousel-item</code>s for proper crossfading.
            </p>
          </CardHeader>
          <CardBody>
            <CarouselBootstrap indicators={false} fade>
              <CarouselItem>
                <Image src={Img1} width={710} height={471} className="d-block h-auto w-100" alt="img-2" />
              </CarouselItem>
              <CarouselItem>
                <Image src={Img2} width={710} height={471} className="d-block h-auto w-100" alt="img-3" />
              </CarouselItem>
              <CarouselItem>
                <Image src={Img3} width={710} height={471} className="d-block h-auto w-100" alt="img-4" />
              </CarouselItem>
            </CarouselBootstrap>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const IndividualCarousel = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>
              Individual <code> .carousel-item </code> interval
            </CardTitle>
            <p className="card-subtitle">
              Add <code>data-bs-interval=&quot;&quot;</code> to a<code>.carousel-item</code> to change the amount of time to delay between
              automatically cycling to the next item.
            </p>
          </CardHeader>
          <CardBody>
            <CarouselBootstrap indicators={false}>
              <CarouselItem interval={10000}>
                <Image src={Img1} width={710} height={471} className="d-block h-auto w-100" alt="img-2" />
              </CarouselItem>
              <CarouselItem interval={2000}>
                <Image src={Img2} width={710} height={471} className="d-block h-auto w-100" alt="img-3" />
              </CarouselItem>
              <CarouselItem>
                <Image src={Img3} width={710} height={471} className="d-block h-auto w-100" alt="img-4" />
              </CarouselItem>
            </CarouselBootstrap>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const DisableTouchCarousel = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>
              Disable touch swiping <code> .carousel-item </code> interval
            </CardTitle>
            <p className="card-subtitle">
              Carousels support swiping left/right on touchscreen devices to move between slides. This can be disabled using the
              <code>data-bs-touch</code> attribute. The example below also does not include the <code>data-bs-ride</code> attribute so it doesn’t
              autoplay.
            </p>
          </CardHeader>
          <CardBody>
            <CarouselBootstrap indicators={false} touch={false}>
              <CarouselItem>
                <Image src={Img4} width={710} height={471} className="d-block h-auto w-100" alt="img-2" />
              </CarouselItem>
              <CarouselItem>
                <Image src={Img5} width={710} height={471} className="d-block h-auto w-100" alt="img-3" />
              </CarouselItem>
              <CarouselItem>
                <Image src={Img6} width={710} height={471} className="d-block h-auto w-100" alt="img-4" />
              </CarouselItem>
            </CarouselBootstrap>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const DarkVariant = () => {
  return (
    <>
      <Col lg={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>
              Dark Variant <code> .carousel-item </code> interval
            </CardTitle>
            <p className="card-subtitle">
              Add <code>.carousel-dark</code> to the <code>.carousel</code>
              for darker controls, indicators, and captions. Controls have been inverted from their default white fill with the
              <code>filter</code> CSS property. Captions and controls have additional Sass variables that customize the <code>color</code>
              and <code>background-color</code>.
            </p>
          </CardHeader>
          <CardBody>
            <CarouselBootstrap className="carousel-dark">
              <CarouselItem interval={10000}>
                <Image height={302} src={Img8} className="d-block h-auto w-100" alt="..." />
                <div className="carousel-caption d-none d-md-block">
                  <h5>First slide label</h5>
                  <p>Some representative placeholder content for the first slide.</p>
                </div>
              </CarouselItem>
              <CarouselItem interval={2000}>
                <Image src={Img9} height={302} className="d-block h-auto w-100" alt="..." />
                <div className="carousel-caption d-none d-md-block">
                  <h5>Second slide label</h5>
                  <p>Some representative placeholder content for the second slide.</p>
                </div>
              </CarouselItem>
              <CarouselItem>
                <Image src={Img10} height={302} className="d-block h-auto w-100" alt="..." />
                <div className="carousel-caption d-none d-md-block">
                  <h5>Third slide label</h5>
                  <p>Some representative placeholder content for the third slide.</p>
                </div>
              </CarouselItem>
            </CarouselBootstrap>
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
            <h4 className="mb-0">Carousel</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="">Base UI</Link>
              </li>
              <div className="mx-1" style={{ height: 24 }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Carousel</li>
            </ol>
          </div>
        </Col>
      </Row>
      <Row>
        <SlidesOnlyCarousel />
        <ControlsCarousel />
        <IndicatorsCarousel />
        <CaptionsCarousel />
        <CrossfadeCarousel />
        <IndividualCarousel />
        <DisableTouchCarousel />
        <DarkVariant />
      </Row>
    </>
  )
}

export default page
