'use client'
import { ApexOptions } from 'apexcharts'
import React from 'react'
import ReactApexChart from 'react-apexcharts'
import CountryMap from './CountryMap'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'

const Chart = () => {
  const salesChart: ApexOptions = {
    series: [
      {
        name: 'Page Views',
        type: 'bar',
        data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67],
      },
      {
        name: 'Clicks',
        type: 'area',
        data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35],
      },
      {
        name: 'Conversion Ratio',
        type: 'area',
        data: [12, 16, 11, 22, 28, 25, 15, 29, 35, 45, 42, 48],
      },
    ],
    chart: {
      height: 313,
      type: 'line',
      toolbar: {
        show: false,
      },
    },
    stroke: {
      dashArray: [0, 0, 2],
      width: [0, 2, 2],
      curve: 'smooth',
    },
    fill: {
      opacity: [1, 1, 1],
      type: ['solid', 'gradient', 'gradient'],
      gradient: {
        type: 'vertical',
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90],
      },
    },
    markers: {
      size: [0, 0],
      strokeWidth: 2,
      hover: {
        size: 4,
      },
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      axisBorder: {
        show: false,
      },
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: -2,
        bottom: 0,
        left: 10,
      },
    },
    legend: {
      show: true,
      horizontalAlign: 'center',
      offsetX: 0,
      offsetY: 5,
      markers: {
        // width: 9,
        // height: 9,
        // radius: 6,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '30%',
        barHeight: '70%',
        borderRadius: 3,
      },
    },
    colors: ['#1a80f8', '#17c553', '#7942ed'],
    tooltip: {
      shared: true,
      y: [
        {
          formatter: function (y) {
            if (typeof y !== 'undefined') {
              return y.toFixed(1) + 'k'
            }
            return y
          },
        },
        {
          formatter: function (y) {
            if (typeof y !== 'undefined') {
              return y.toFixed(1) + 'k'
            }
            return y
          },
        },
      ],
    },
  }

  return (
    <>
      <Row>
        <Col lg={6}>
          <Card className=" card-height-100">
            <CardHeader className="d-flex align-items-center justify-content-between gap-2">
              <CardTitle as={'h4'} className=" flex-grow-1">
                Top Pages
              </CardTitle>
              <div>
                <button type="button" className="btn btn-sm btn-outline-light" style={{ margin: '0px 2px' }}>
                  ALL
                </button>
                <button type="button" className="btn btn-sm btn-outline-light" style={{ margin: '0px 2px' }}>
                  1M
                </button>
                <button type="button" className="btn btn-sm btn-outline-light" style={{ margin: '0px 2px' }}>
                  6M
                </button>
                <button type="button" className="btn btn-sm btn-outline-light active" style={{ margin: '0px 2px' }}>
                  1Y
                </button>
              </div>
            </CardHeader>
            <CardBody className=" pt-0">
              <div dir="ltr">
                <div id="dash-performance-chart" className="apex-charts">
                  <ReactApexChart options={salesChart} series={salesChart.series} height={313} type="area" className="apex-charts " />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <CountryMap />
      </Row>
    </>
  )
}

export default Chart
