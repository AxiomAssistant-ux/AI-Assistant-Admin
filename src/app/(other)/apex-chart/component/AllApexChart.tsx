'use client'
import { ApexOptions } from 'apexcharts'
import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'

function generateDayWiseTimeSeries(baseval: number, count: number, yrange: { max: number; min: number }): any[] {
  let i = 0
  const series = []
  while (i < count) {
    const x = baseval
    const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min

    series.push([x, y])
    baseval += 86400000
    i++
  }
  return series
}

const sparklineData = [47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46]

const randomizeArray = function (arg) {
  const array = arg.slice()
  let currentIndex = array.length,
    temporaryValue,
    randomIndex

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

const seriesData = [
  {
    x: new Date(2016, 1, 1),
    y: [51.98, 56.29, 51.59, 53.85],
  },
  {
    x: new Date(2016, 2, 1),
    y: [53.66, 54.99, 51.35, 52.95],
  },
  {
    x: new Date(2016, 3, 1),
    y: [52.96, 53.78, 51.54, 52.48],
  },
  {
    x: new Date(2016, 4, 1),
    y: [52.54, 52.79, 47.88, 49.24],
  },
  {
    x: new Date(2016, 5, 1),
    y: [49.1, 52.86, 47.7, 52.78],
  },
  {
    x: new Date(2016, 6, 1),
    y: [52.83, 53.48, 50.32, 52.29],
  },
  {
    x: new Date(2016, 7, 1),
    y: [52.2, 54.48, 51.64, 52.58],
  },
  {
    x: new Date(2016, 8, 1),
    y: [52.76, 57.35, 52.15, 57.03],
  },
  {
    x: new Date(2016, 9, 1),
    y: [57.04, 58.15, 48.88, 56.19],
  },
  {
    x: new Date(2016, 10, 1),
    y: [56.09, 58.85, 55.48, 58.79],
  },
  {
    x: new Date(2016, 11, 1),
    y: [58.78, 59.65, 58.23, 59.05],
  },
  {
    x: new Date(2017, 0, 1),
    y: [59.37, 61.11, 59.35, 60.34],
  },
  {
    x: new Date(2017, 1, 1),
    y: [60.4, 60.52, 56.71, 56.93],
  },
  {
    x: new Date(2017, 2, 1),
    y: [57.02, 59.71, 56.04, 56.82],
  },
  {
    x: new Date(2017, 3, 1),
    y: [56.97, 59.62, 54.77, 59.3],
  },
  {
    x: new Date(2017, 4, 1),
    y: [59.11, 62.29, 59.1, 59.85],
  },
  {
    x: new Date(2017, 5, 1),
    y: [59.97, 60.11, 55.66, 58.42],
  },
  {
    x: new Date(2017, 6, 1),
    y: [58.34, 60.93, 56.75, 57.42],
  },
  {
    x: new Date(2017, 7, 1),
    y: [57.76, 58.08, 51.18, 54.71],
  },
  {
    x: new Date(2017, 8, 1),
    y: [54.8, 61.42, 53.18, 57.35],
  },
  {
    x: new Date(2017, 9, 1),
    y: [57.56, 63.09, 57.0, 62.99],
  },
  {
    x: new Date(2017, 10, 1),
    y: [62.89, 63.42, 59.72, 61.76],
  },
  {
    x: new Date(2017, 11, 1),
    y: [61.71, 64.15, 61.29, 63.04],
  },
]

const AllLineCharts = () => {
  const lineWithDataLabelOpts: ApexOptions = {
    chart: {
      height: 380,
      type: 'line',
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ['#6658dd', '#1abc9c'],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      width: [3, 3],
      curve: 'smooth',
    },
    series: [
      {
        name: 'High - 2018',
        data: [28, 29, 33, 36, 32, 32, 33],
      },
      {
        name: 'Low - 2018',
        data: [12, 11, 14, 18, 17, 13, 13],
      },
    ],
    title: {
      text: 'Average High & Low Temperature',
      align: 'left',
      style: {
        fontSize: '14px',
        color: '#313b5e',
      },
    },
    grid: {
      row: {
        colors: ['transparent', 'transparent'],
        opacity: 0.2,
      },
      borderColor: '#f1f3fa',
    },
    markers: {
      size: 6,
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      title: {
        text: 'Month',
      },
    },
    yaxis: {
      title: {
        text: 'Temperature',
      },
      min: 5,
      max: 40,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -25,
      offsetX: -5,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            toolbar: {
              show: false,
            },
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  }
  return (
    <>
      <Col xl={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'} className=" mb-0">
              Line with Data Labels
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div dir="ltr">
              <ReactApexChart height={380} options={lineWithDataLabelOpts} series={lineWithDataLabelOpts.series} type="line" />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const GradientLineChart = () => {
  const gradientLineChartOpts: ApexOptions = {
    chart: {
      height: 380,
      type: 'line',
      //   shadow: {
      //       enabled: false,
      //       color: '#bbb',
      //       top: 3,
      //       left: 2,
      //       blur: 3,
      //       opacity: 1
      //   },
    },
    stroke: {
      width: 5,
      curve: 'smooth',
    },
    series: [
      {
        name: 'Likes',
        data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5],
      },
    ],
    xaxis: {
      type: 'datetime',
      categories: [
        '1/11/2000',
        '2/11/2000',
        '3/11/2000',
        '4/11/2000',
        '5/11/2000',
        '6/11/2000',
        '7/11/2000',
        '8/11/2000',
        '9/11/2000',
        '10/11/2000',
        '11/11/2000',
        '12/11/2000',
        '1/11/2001',
        '2/11/2001',
        '3/11/2001',
        '4/11/2001',
        '5/11/2001',
        '6/11/2001',
      ],
    },
    title: {
      text: 'Social Media',
      align: 'left',
      style: {
        fontSize: '14px',
        color: '#666',
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: ['#f672a7'],
        shadeIntensity: 1,
        type: 'horizontal',
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100],
      },
    },
    markers: {
      size: 4,
      //   opacity: 0.9,
      colors: ['#56c2d6'],
      //   strokeColor: "#fff",/
      strokeWidth: 2,
      //   style: "inverted",
      hover: {
        size: 7,
      },
    },
    yaxis: {
      min: -10,
      max: 40,
      title: {
        text: 'Engagement',
      },
    },
    grid: {
      row: {
        colors: ['transparent', 'transparent'],
        opacity: 0.2,
      },
      borderColor: '#185a9d',
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            toolbar: {
              show: false,
            },
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  }
  return (
    <>
      <Col xl={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'} className="mb-0">
              Gradient Line Chart
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div dir="ltr">
              <ReactApexChart height={374} options={gradientLineChartOpts} series={gradientLineChartOpts.series} type="line" />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const StackedChart = () => {
  const stackedChartOpts: ApexOptions = {
    chart: {
      height: 380,
      type: 'area',
      stacked: true,
      events: {
        selection: function (e) {
          console.log(new Date(e.xaxis.min))
        },
      },
    },
    colors: ['#6658dd', '#f7b84b', '#CED4DC'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [2],
      curve: 'smooth',
    },

    series: [
      {
        name: 'South',
        data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
          min: 10,
          max: 60,
        }),
      },
      {
        name: 'North',
        data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
          min: 10,
          max: 20,
        }),
      },
      {
        name: 'Central',
        data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
          min: 10,
          max: 15,
        }),
      },
    ],
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.8,
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
    },
    xaxis: {
      type: 'datetime',
    },
  }
  return (
    <>
      <Col xl={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'} className="mb-0">
              Stacked Area
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div dir="ltr">
              <ReactApexChart height={422} options={stackedChartOpts} series={stackedChartOpts.series} type="area" className="apex-charts" />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const BasicColumnChart = () => {
  const basicChartOpts: ApexOptions = {
    chart: {
      height: 380,
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        // endingShape: "rounded",
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    colors: ['#6658dd', '#1abc9c', '#CED4DC'],
    series: [
      {
        name: 'Net Profit',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
      {
        name: 'Revenue',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
      {
        name: 'Free Cash Flow',
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      },
    ],
    xaxis: {
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    },
    legend: {
      offsetY: 5,
    },
    yaxis: {
      title: {
        text: '$ (thousands)',
      },
    },
    fill: {
      opacity: 1,
    },
    grid: {
      row: {
        colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.2,
      },
      borderColor: '#f1f3fa',
      padding: {
        bottom: 10,
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return '$ ' + val + ' thousands'
        },
      },
    },
  }
  return (
    <>
      <Col xl={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'} className="mb-0">
              Basic Column Chart
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div dir="ltr">
              <ReactApexChart height={396} options={basicChartOpts} series={basicChartOpts.series} type="bar" />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const ColumnChartWithDataLabels = () => {
  const dataLabelsChartOpts: ApexOptions = {
    chart: {
      height: 380,
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + '%'
      },
      offsetY: -30,
      style: {
        fontSize: '12px',
        colors: ['#304758'],
      },
    },
    colors: ['#6658dd'],
    series: [
      {
        name: 'Inflation',
        data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2],
      },
    ],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      position: 'top',
      labels: {
        offsetY: -18,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: 'gradient',
          gradient: {
            colorFrom: '#D8E3F0',
            colorTo: '#BED1E6',
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: true,
        offsetY: -35,
      },
    },
    fill: {
      gradient: {
        shade: 'light',
        type: 'horizontal',
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [50, 0, 100, 100],
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: function (val) {
          return val + '%'
        },
      },
    },
    title: {
      text: 'Monthly Inflation in Argentina, 2002',
      floating: true,
      offsetY: 350,
      align: 'center',
      style: {
        color: '#444',
      },
    },
    grid: {
      row: {
        colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.2,
      },
      borderColor: '#f1f3fa',
    },
  }
  return (
    <>
      <Col xl={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'} className="mb-0">
              Column Chart with Datalabels
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div dir="ltr">
              <ReactApexChart height={380} options={dataLabelsChartOpts} series={dataLabelsChartOpts.series} type="bar" />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const LineAreaChart = () => {
  const lineAreaChartOpts: ApexOptions = {
    chart: {
      height: 380,
      type: 'line',
    },
    stroke: {
      width: 2,
      curve: 'smooth',
    },

    series: [
      {
        name: 'TEAM A',
        type: 'area',
        data: [44, 55, 31, 47, 31, 43, 26, 41, 31, 47, 33],
      },
      {
        name: 'TEAM B',
        type: 'line',
        data: [55, 69, 45, 61, 43, 54, 37, 52, 44, 61, 43],
      },
    ],
    colors: ['#CED4DC', '#6658dd'],
    fill: {
      type: 'solid',
      opacity: [0.35, 1],
    },
    labels: ['Dec 01', 'Dec 02', 'Dec 03', 'Dec 04', 'Dec 05', 'Dec 06', 'Dec 07', 'Dec 08', 'Dec 09 ', 'Dec 10', 'Dec 11'],
    markers: {
      size: 0,
    },
    yaxis: [
      {
        title: {
          text: 'Series A',
        },
      },
      {
        opposite: true,
        title: {
          text: 'Series B',
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y) {
          if (typeof y !== 'undefined') {
            return y.toFixed(0) + ' points'
          }
          return y
        },
      },
    },
    legend: {
      offsetY: 7,
    },
  }
  return (
    <>
      <Col xl={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'} className="mb-0">
              Mixed Chart - Line &amp; Area
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div dir="ltr">
              <ReactApexChart height={380} options={lineAreaChartOpts} series={lineAreaChartOpts.series} type="line" />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const BasicBarChart = () => {
  const basicChartOpts: ApexOptions = {
    chart: {
      height: 380,
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    series: [
      {
        data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
      },
    ],
    colors: ['#1abc9c'],
    xaxis: {
      categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan', 'United States', 'China', 'Germany'],
    },
    states: {
      hover: {
        // filter: "none",
      },
    },
    grid: {
      borderColor: '#f1f3fa',
    },
  }
  return (
    <>
      <Col xl={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'} className="mb-0">
              Basic Bar Chart
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div dir="ltr">
              <ReactApexChart height={380} options={basicChartOpts} series={basicChartOpts.series} type="bar" />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const BarWithNegativeValueChart = () => {
  const negativeValueChartOpts: ApexOptions = {
    chart: {
      height: 380,
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    colors: ['#6658dd', '#1abc9c'],
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '80%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 1,
      colors: ['#fff'],
    },
    series: [
      {
        name: 'Males',
        data: [0.4, 0.65, 0.76, 0.88, 1.5, 2.1, 2.9, 3.8, 3.9, 4.2, 4, 4.3, 4.1, 4.2, 4.5, 3.9, 3.5, 3],
      },
      {
        name: 'Females',
        data: [-0.8, -1.05, -1.06, -1.18, -1.4, -2.2, -2.85, -3.7, -3.96, -4.22, -4.3, -4.4, -4.1, -4, -4.1, -3.4, -3.1, -2.8],
      },
    ],
    grid: {
      xaxis: {
        // showLines: false,
      },
    },
    yaxis: {
      min: -5,
      max: 5,
      title: {
        // text: 'Age',
      },
    },
    tooltip: {
      shared: false,
      x: {
        // formatter: function (val) {
        //   return val;
        // },
      },
      y: {
        formatter: function (val) {
          return Math.abs(val) + '%'
        },
      },
    },
    xaxis: {
      categories: [
        '85+',
        '80-84',
        '75-79',
        '70-74',
        '65-69',
        '60-64',
        '55-59',
        '50-54',
        '45-49',
        '40-44',
        '35-39',
        '30-34',
        '25-29',
        '20-24',
        '15-19',
        '10-14',
        '5-9',
        '0-4',
      ],
      title: {
        text: 'Percent',
      },
      //   labels: {
      //     formatter: function (val) {
      //       return Math.abs(Math.round(val)) + "%";
      //     },
      //   },
    },
    legend: {
      offsetY: 7,
    },
    // grid: {
    //   borderColor: "#f1f3fa",
    // },
  }
  return (
    <>
      <Col xl={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'} className="mb-0">
              Bar with Negative Values
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div dir="ltr">
              <ReactApexChart height={380} options={negativeValueChartOpts} series={negativeValueChartOpts.series} type="bar" />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const LineColumnAndAreaChart = () => {
  const lineColumnAreaChartOpts: ApexOptions = {
    chart: {
      height: 380,
      type: 'line',
      //   padding: {
      //     right: 0,
      //     left: 0,
      //   },
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: [0, 2, 4],
      curve: 'smooth',
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
      },
    },
    colors: ['#6658dd', '#1abc9c', '#f672a7'],
    series: [
      {
        name: 'Team A',
        type: 'column',
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
      },
      {
        name: 'Team B',
        type: 'area',
        data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
      },
      {
        name: 'Team C',
        type: 'line',
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
      },
    ],
    fill: {
      opacity: [0.85, 0.25, 1],
      gradient: {
        inverseColors: false,
        shade: 'light',
        type: 'vertical',
        opacityFrom: 0.85,
        opacityTo: 0.55,
        stops: [0, 100, 100, 100],
      },
    },
    labels: [
      '01/01/2003',
      '02/01/2003',
      '03/01/2003',
      '04/01/2003',
      '05/01/2003',
      '06/01/2003',
      '07/01/2003',
      '08/01/2003',
      '09/01/2003',
      '10/01/2003',
      '11/01/2003',
    ],
    markers: {
      size: 0,
    },
    legend: {
      offsetY: 7,
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      title: {
        text: 'Points',
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y) {
          if (typeof y !== 'undefined') {
            return y.toFixed(0) + ' points'
          }
          return y
        },
      },
    },
    grid: {
      borderColor: '#f1f3fa',
      padding: {
        bottom: 10,
      },
    },
  }
  return (
    <>
      <Col xl={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'} className="mb-0">
              Line, Column &amp; Area Chart
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div dir="ltr">
              <ReactApexChart height={380} options={lineColumnAreaChartOpts} series={lineColumnAreaChartOpts.series} type="line" />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const ScatterXYChart = () => {
  const scatterXYOpts: ApexOptions = {
    chart: {
      height: 380,
      type: 'scatter',
      zoom: {
        enabled: false,
      },
    },

    series: [
      {
        name: 'Sample A',
        data: [
          [16.4, 5.4],
          [21.7, 2],
          [25.4, 3],
          [19, 2],
          [10.9, 1],
          [13.6, 3.2],
          [10.9, 7.4],
          [10.9, 0],
          [10.9, 8.2],
          [16.4, 0],
          [16.4, 1.8],
          [13.6, 0.3],
          [13.6, 0],
          [29.9, 0],
          [27.1, 2.3],
          [16.4, 0],
          [13.6, 3.7],
          [10.9, 5.2],
          [16.4, 6.5],
          [10.9, 0],
          [24.5, 7.1],
          [10.9, 0],
          [8.1, 4.7],
          [19, 0],
          [21.7, 1.8],
          [27.1, 0],
          [24.5, 0],
          [27.1, 0],
          [29.9, 1.5],
          [27.1, 0.8],
          [22.1, 2],
        ],
      },
      {
        name: 'Sample B',
        data: [
          [6.4, 13.4],
          [1.7, 11],
          [5.4, 8],
          [9, 17],
          [1.9, 4],
          [3.6, 12.2],
          [1.9, 14.4],
          [1.9, 9],
          [1.9, 13.2],
          [1.4, 7],
          [6.4, 8.8],
          [3.6, 4.3],
          [1.6, 10],
          [9.9, 2],
          [7.1, 15],
          [1.4, 0],
          [3.6, 13.7],
          [1.9, 15.2],
          [6.4, 16.5],
          [0.9, 10],
          [4.5, 17.1],
          [10.9, 10],
          [0.1, 14.7],
          [9, 10],
          [12.7, 11.8],
          [2.1, 10],
          [2.5, 10],
          [27.1, 10],
          [2.9, 11.5],
          [7.1, 10.8],
          [2.1, 12],
        ],
      },
      {
        name: 'Sample C',
        data: [
          [21.7, 3],
          [23.6, 3.5],
          [24.6, 3],
          [29.9, 3],
          [21.7, 20],
          [23, 2],
          [10.9, 3],
          [28, 4],
          [27.1, 0.3],
          [16.4, 4],
          [13.6, 0],
          [19, 5],
          [22.4, 3],
          [24.5, 3],
          [32.6, 3],
          [27.1, 4],
          [29.6, 6],
          [31.6, 8],
          [21.6, 5],
          [20.9, 4],
          [22.4, 0],
          [32.6, 10.3],
          [29.7, 20.8],
          [24.5, 0.8],
          [21.4, 0],
          [21.7, 6.9],
          [28.6, 7.7],
          [15.4, 0],
          [18.1, 0],
          [33.4, 0],
          [16.4, 0],
        ],
      },
    ],
    xaxis: {
      tickAmount: 10,
    },
    yaxis: {
      tickAmount: 7,
    },
    colors: ['#1abc9c', '#f672a7', '#6c757d'],
    grid: {
      borderColor: '#f1f3fa',
      padding: {
        bottom: 10,
      },
    },
    legend: {
      offsetY: 7,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            toolbar: {
              show: false,
            },
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  }
  return (
    <>
      <Col xl={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'} className="mb-0">
              Scatter (XY) Chart
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div dir="ltr">
              <ReactApexChart height={380} options={scatterXYOpts} series={scatterXYOpts.series} type="scatter" />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const DatetimeScatterChart = () => {
  const dateTimeOpts: ApexOptions = {
    chart: {
      height: 380,
      type: 'scatter',
      zoom: {
        type: 'xy',
      },
    },
    series: [
      {
        name: 'Team 1',
        data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
          min: 10,
          max: 60,
        }),
      },
      {
        name: 'Team 2',
        data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
          min: 10,
          max: 60,
        }),
      },
      {
        name: 'Team 3',
        data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 30, {
          min: 10,
          max: 60,
        }),
      },
      {
        name: 'Team 4',
        data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 10, {
          min: 10,
          max: 60,
        }),
      },
      {
        name: 'Team 5',
        data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 30, {
          min: 10,
          max: 60,
        }),
      },
    ],
    dataLabels: {
      enabled: false,
    },
    colors: ['#1abc9c', '#f672a7', '#6c757d', '#6658dd', '#6559cc'],
    grid: {
      borderColor: '#f1f3fa',
      xaxis: {},
      yaxis: {},
      padding: {
        bottom: 10,
      },
    },
    legend: {
      offsetY: 7,
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      max: 70,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            toolbar: {
              show: false,
            },
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  }
  return (
    <>
      <Col xl={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'} className="mb-0">
              Scatter Chart - Datetime
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div dir="ltr">
              <ReactApexChart height={380} options={dateTimeOpts} series={dateTimeOpts.series} type="scatter" />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const SimpleCandlestickChart = () => {
  const simpleChartOpts: ApexOptions = {
    chart: {
      height: 400,
      type: 'candlestick',
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: ' #6658dd',
          downward: '#1abc9c',
        },
      },
    },
    series: [
      {
        data: seriesData,
      },
    ],

    stroke: {
      show: true,
      colors: ['#f1f3fa'],
      width: [1, 4],
    },
    xaxis: {
      type: 'datetime',
    },
    grid: {
      borderColor: '#f1f3fa',
    },
  }

  return (
    <>
      <Col xl={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'} className="mb-0">
              Simple Candlestick Chart
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div dir="ltr">
              <ReactApexChart height={400} options={simpleChartOpts} series={simpleChartOpts.series} type="candlestick" className="apex-charts" />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const SimplePieChart = () => {
  const simplePieOpts: ApexOptions = {
    chart: {
      height: 320,
      type: 'pie',
    },
    series: [44, 55, 41, 17, 15],
    labels: ['Series 1', 'Series 2', 'Series 3', 'Series 4', 'Series 5'],
    colors: ['#6658dd', '#4fc6e1', '#4a81d4', '#00b19d', '#f1556c'],
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      floating: false,
      fontSize: '14px',
      offsetX: 0,
      offsetY: 7,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 240,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  }
  return (
    <>
      <Col xl={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'} className="mb-0">
              Simple Pie Chart
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div dir="ltr">
              <ReactApexChart height={320} options={simplePieOpts} series={simplePieOpts.series} type="pie" />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const GradientDonutChart = () => {
  const gradientDonutOpts: ApexOptions = {
    chart: {
      height: 320,
      type: 'donut',
    },
    series: [44, 55, 41, 17, 15],
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      floating: false,
      fontSize: '14px',
      offsetX: 0,
      offsetY: 7,
    },
    labels: ['Series 1', 'Series 2', 'Series 3', 'Series 4', 'Series 5'],
    colors: ['#6658dd', '#4fc6e1', '#4a81d4', '#00b19d', '#f1556c'],
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 240,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
    fill: {
      type: 'gradient',
    },
  }
  return (
    <>
      <Col xl={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'} className="mb-0">
              Gradient Donut Chart
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div dir="ltr">
              <ReactApexChart height={320} options={gradientDonutOpts} series={gradientDonutOpts.series} type="donut" />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const PatternedDonutChart = () => {
  const patternedDonutOpts: ApexOptions = {
    chart: {
      height: 320,
      type: 'donut',
      dropShadow: {
        enabled: true,
        color: '#111',
        top: -1,
        left: 3,
        blur: 3,
        opacity: 0.2,
      },
    },
    stroke: {
      show: true,
      width: 2,
    },
    series: [44, 55, 41, 17, 15],
    colors: ['#6658dd', '#4fc6e1', '#4a81d4', '#00b19d', '#f1556c'],
    labels: ['Comedy', 'Action', 'SciFi', 'Drama', 'Horror'],
    dataLabels: {
      dropShadow: {
        blur: 3,
        opacity: 0.8,
      },
    },
    fill: {
      type: 'pattern',
      opacity: 1,
      pattern: {
        style: ['verticalLines', 'squares', 'horizontalLines', 'circles', 'slantedLines'],
      },
    },
    states: {
      hover: {},
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      floating: false,
      fontSize: '14px',
      offsetX: 0,
      offsetY: 7,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 240,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  }
  return (
    <>
      <Col xl={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'} className="mb-0">
              Patterned Donut Chart
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div dir="ltr">
              <div id="apex-pie-3" className="apex-charts">
                <ReactApexChart height={320} options={patternedDonutOpts} series={patternedDonutOpts.series} type="donut" />
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const BasicChart = () => {
  const basicRadialBarOpts: ApexOptions = {
    chart: {
      height: 350,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '70%',
        },
      },
    },
    colors: ['#6c757d'],
    series: [70],
    labels: ['CRICKET'],
  }
  return (
    <>
      <Col xl={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'} className="mb-0">
              Basic RadialBar Chart
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div dir="ltr">
              <div id="apex-radialbar-1" className="apex-charts">
                <ReactApexChart height={320} options={basicRadialBarOpts} series={basicRadialBarOpts.series} type="radialBar" />
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const MultipleRadialBarsChart = () => {
  const multipleRadialBarsOpts: ApexOptions = {
    chart: {
      height: 350,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '22px',
          },
          value: {
            fontSize: '16px',
          },
          total: {
            show: true,
            label: 'Total',
          },
        },
      },
    },
    colors: ['#6658dd', '#e36498', '#23b397', '#f7b84b'],
    series: [44, 55, 67, 83],
    labels: ['Apples', 'Oranges', 'Bananas', 'Berries'],
  }
  return (
    <>
      <Col xl={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'} className="mb-0">
              Multiple RadialBars
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div dir="ltr">
              <div id="apex-radialbar-2" className="apex-charts">
                <ReactApexChart height={320} options={multipleRadialBarsOpts} series={multipleRadialBarsOpts.series} type="radialBar" />
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const StrokedCircularGaugeChart = () => {
  const strokedCircularGuageOpts: ApexOptions = {
    chart: {
      height: 375,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: {
            fontSize: '16px',
            color: undefined,
            offsetY: 120,
          },
          value: {
            offsetY: 76,
            fontSize: '22px',
            color: undefined,
            formatter: function (val) {
              return val + '%'
            },
          },
        },
      },
    },
    fill: {
      gradient: {
        shade: 'dark',
        shadeIntensity: 0.15,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91],
      },
    },
    stroke: {
      dashArray: 4,
    },
    colors: ['#f1556c'],
    series: [67],
    labels: ['Median Ratio'],
    responsive: [
      {
        breakpoint: 380,
        options: {
          chart: {
            height: 280,
          },
        },
      },
    ],
  }
  return (
    <>
      <Col xl={6}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'} className="mb-0">
              Stroked Circular Guage
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div dir="ltr">
              <div id="apex-radialbar-3" className="apex-charts">
                <ReactApexChart height={380} options={strokedCircularGuageOpts} series={strokedCircularGuageOpts.series} type="radialBar" />
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const SparklineCharts = () => {
  const SparklineChartsOpts1: ApexOptions = {
    chart: {
      type: 'area',
      height: 160,
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      width: 2,
      curve: 'straight',
    },
    fill: {
      opacity: 0.2,
    },
    series: [
      {
        name: 'Sales ',
        data: randomizeArray(sparklineData),
      },
    ],
    yaxis: {
      min: 0,
    },
    colors: ['#6658dd'],
    title: {
      text: '$424,652',
      offsetX: 10,
      style: {
        fontSize: '22px',
      },
    },
    subtitle: {
      text: 'Total Sales',
      offsetX: 10,
      offsetY: 35,
      style: {
        fontSize: '13px',
      },
    },
  }
  const SparklineChartsOpts2: ApexOptions = {
    chart: {
      type: 'area',
      height: 160,
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      width: 2,
      curve: 'straight',
    },
    fill: {
      opacity: 0.2,
    },
    series: [
      {
        name: 'Expenses ',
        data: randomizeArray(sparklineData),
      },
    ],
    yaxis: {
      min: 0,
    },
    colors: ['#DCE6EC'],
    title: {
      text: '$235,312',
      offsetX: 10,
      style: {
        fontSize: '22px',
      },
    },
    subtitle: {
      text: 'Expenses',
      offsetX: 10,
      offsetY: 35,
      style: {
        fontSize: '13px',
      },
    },
  }

  const SparklineChartsOpts3: ApexOptions = {
    chart: {
      type: 'area',
      height: 160,
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      width: 2,
      curve: 'straight',
    },
    fill: {
      opacity: 0.2,
    },
    series: [
      {
        name: 'Net Profits ',
        data: randomizeArray(sparklineData),
      },
    ],
    xaxis: {
      crosshairs: {
        width: 1,
      },
    },
    yaxis: {
      min: 0,
    },
    colors: ['#f672a7'],
    title: {
      text: '$135,965',
      offsetX: 10,
      style: {
        fontSize: '22px',
      },
    },
    subtitle: {
      text: 'Profits',
      offsetX: 10,
      offsetY: 35,
      style: {
        fontSize: '13px',
      },
    },
  }

  return (
    <>
      <Col xs={12}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'} className="mb-0">
              Sparkline Charts
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div dir="ltr">
              <Row className=" pt-3">
                <Col md={4}>
                  <div id="spark1" className="apex-charts mb-sm-0 mb-4">
                    <ReactApexChart height={160} options={SparklineChartsOpts1} series={SparklineChartsOpts1.series} type="area" />
                  </div>
                </Col>
                <Col md={4}>
                  <div id="spark2" className="apex-charts mb-sm-0 mb-4">
                    <ReactApexChart height={160} options={SparklineChartsOpts2} series={SparklineChartsOpts2.series} type="area" />
                  </div>
                </Col>
                <Col md={4}>
                  <div id="spark3" className="apex-charts mb-sm-0 mb-4">
                    <ReactApexChart height={160} options={SparklineChartsOpts3} series={SparklineChartsOpts3.series} type="area" />
                  </div>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

const AllApexChart = () => {
  return (
    <>
      <Row>
        <AllLineCharts />
        <GradientLineChart />
      </Row>
      <Row>
        <StackedChart />
        <BasicColumnChart />
      </Row>
      <Row>
        <ColumnChartWithDataLabels />
        <LineAreaChart />
      </Row>
      <Row>
        <BasicBarChart />
        <BarWithNegativeValueChart />
      </Row>
      <Row>
        <LineColumnAndAreaChart />
        <ScatterXYChart />
        <DatetimeScatterChart />
        <SimpleCandlestickChart />
        <SimplePieChart />
        <GradientDonutChart />
        <PatternedDonutChart />
        <BasicChart />
        <MultipleRadialBarsChart />
        <StrokedCircularGaugeChart />
        <SparklineCharts />
      </Row>
    </>
  )
}

export default AllApexChart
