'use client'
import { CanadaVectorMap, IraqVectorMap, RussiaVectorMap, SpainVectorMap } from '@/components/VectorMap'
import WorldVectorMap from '@/components/VectorMap/WorldMap'
import React from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col } from 'react-bootstrap'

const WorldVectorMaps = () => {
  const worldMapOptions = {
    map: 'world',
    zoomOnScroll: true,
    zoomButtons: true,
    markersSelectable: true,
    markers: [
      { name: 'Greenland', coords: [72, -42] },
      { name: 'Canada', coords: [56.1304, -106.3468] },
      { name: 'Brazil', coords: [-14.235, -51.9253] },
      { name: 'Egypt', coords: [26.8206, 30.8025] },
      { name: 'Russia', coords: [61, 105] },
      { name: 'China', coords: [35.8617, 104.1954] },
      { name: 'United States', coords: [37.0902, -95.7129] },
      { name: 'Norway', coords: [60.472024, 8.468946] },
      { name: 'Ukraine', coords: [48.379433, 31.16558] },
    ],
    markerStyle: {
      initial: { fill: '#7f56da' },
      selected: { fill: '#22c55e' },
    },
    regionStyle: {
      initial: {
        fill: 'rgba(169,183,197, 0.3)',
        fillOpacity: 1,
      },
    },
  }
  return (
    <>
      <Col>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>World Vector Map</CardTitle>
            <p className="card-subtitle">
              Give textual form controls like
              <code>&lt;input&gt;</code>s and <code>&lt;textarea&gt;</code>s an upgrade with custom styles, sizing, focus states, and more.
            </p>
          </CardHeader>
          <CardBody>
            <div id="world-map-markers">
              <WorldVectorMap height="360px" width="100%" options={worldMapOptions} />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const CanadaMap = () => {
  return (
    <>
      <Col>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Canada Vector Map</CardTitle>
            <p className="card-subtitle">
              Give textual form controls like
              <code>&lt;input&gt;</code>s and <code>&lt;textarea&gt;</code>s an upgrade with custom styles, sizing, focus states, and more.
            </p>
          </CardHeader>
          <CardBody>
            <div>
              <CanadaVectorMap
                height="360px"
                width="100%"
                options={{
                  zoomOnScroll: false,
                  backgroundColor: 'transparent',
                  regionStyle: {
                    initial: {
                      fill: '#1e84c4',
                    },
                  },
                }}
              />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const RussiaMap = () => {
  return (
    <>
      <Col>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Russia Vector Map</CardTitle>
            <p className="card-subtitle">
              Give textual form controls like
              <code>&lt;input&gt;</code>s and <code>&lt;textarea&gt;</code>s an upgrade with custom styles, sizing, focus states, and more.
            </p>
          </CardHeader>
          <CardBody>
            <div>
              <RussiaVectorMap
                height="360px"
                width="100%"
                options={{
                  zoomOnScroll: false,
                  backgroundColor: 'transparent',
                  regionStyle: {
                    initial: {
                      fill: '#1bb394',
                    },
                  },
                }}
              />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const IraqMap = () => {
  return (
    <>
      <Col>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Iraq Vector Map</CardTitle>
            <p className="card-subtitle">
              Give textual form controls like
              <code>&lt;input&gt;</code>s and <code>&lt;textarea&gt;</code>s an upgrade with custom styles, sizing, focus states, and more.
            </p>
          </CardHeader>
          <CardBody>
            <div>
              <IraqVectorMap
                height="360px"
                width="100%"
                options={{
                  zoomOnScroll: false,
                  backgroundColor: 'transparent',
                  regionStyle: {
                    initial: {
                      fill: '#f8ac59',
                    },
                  },
                }}
              />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const SpainMap = () => {
  return (
    <>
      <Col>
        <Card>
          <CardHeader>
            <CardTitle as={'h5'}>Spain Vector Map</CardTitle>
            <p className="card-subtitle">
              Give textual form controls like
              <code>&lt;input&gt;</code>s and <code>&lt;textarea&gt;</code>s an upgrade with custom styles, sizing, focus states, and more.
            </p>
          </CardHeader>
          <CardBody>
            <div>
              <SpainVectorMap
                height="360px"
                width="100%"
                options={{
                  zoomOnScroll: false,
                  backgroundColor: 'transparent',
                  regionStyle: {
                    initial: {
                      fill: '#23c6c8',
                    },
                  },
                }}
              />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const AllVectorMaps = () => {
  return (
    <>
      <WorldVectorMaps />
      <CanadaMap />
      <RussiaMap />
      <IraqMap />
      <SpainMap />
    </>
  )
}

export default AllVectorMaps
