import Image from 'next/image'
import React from 'react'
import avatar2 from '@/assets/images/users/avatar-2.jpg'
import avatar3 from '@/assets/images/users/avatar-3.jpg'
import avatar4 from '@/assets/images/users/avatar-4.jpg'
import avatar5 from '@/assets/images/users/avatar-5.jpg'
import avatar6 from '@/assets/images/users/avatar-6.jpg'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Link from 'next/link'
import { Card, CardBody, CardTitle, Col, Row } from 'react-bootstrap'
import { currentYear } from '@/context/constants'

const User = () => {
  return (
    <>
      <Row>
        <Col xl={4}>
          <Card>
            <CardBody>
              <div className="d-flex align-items-center justify-content-between ">
                <CardTitle as={'h4'}>New Users</CardTitle>
                <Link href="" className="btn btn-sm btn-primary">
                  <IconifyIcon icon="ic:sharp-plus" className="bx me-1" />
                  Add New User
                </Link>
              </div>
            </CardBody>
            <div className="table-responsive table-centered">
              <table className="table mb-0">
                <thead className="bg-light bg-opacity-50">
                  <tr>
                    <th className="border-0 py-2">Date</th>
                    <th className="border-0 py-2">User</th>
                    <th className="border-0 py-2">Account</th>
                    <th className="border-0 py-2">Username</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>24 April, {currentYear}</td>
                    <td>
                      <Image src={avatar2} alt="avatar-2" className="img-fluid avatar-xs rounded-circle" />
                      <span className="align-middle ms-1">Dan Adrick</span>
                    </td>
                    <td>
                      <span className="badge badge-soft-success">Verified</span>
                    </td>
                    <td>@omions </td>
                  </tr>
                  <tr>
                    <td>24 April,{currentYear}</td>
                    <td>
                      <Image src={avatar3} alt="avatar-2" className="img-fluid avatar-xs rounded-circle" />
                      <span className="align-middle ms-1">Daniel Olsen</span>
                    </td>
                    <td>
                      <span className="badge badge-soft-success">Verified</span>
                    </td>
                    <td>@alliates </td>
                  </tr>
                  <tr>
                    <td>20 April, {currentYear}</td>
                    <td>
                      <Image src={avatar4} alt="avatar-2" className="img-fluid avatar-xs rounded-circle" />
                      <span className="align-middle ms-1">Jack Roldan</span>
                    </td>
                    <td>
                      <span className="badge badge-soft-warning">Pending</span>
                    </td>
                    <td>@griys </td>
                  </tr>
                  <tr>
                    <td>18 April, {currentYear}</td>
                    <td>
                      <Image src={avatar5} alt="avatar-2" className="img-fluid avatar-xs rounded-circle" />
                      <span className="align-middle ms-1">Betty Cox</span>
                    </td>
                    <td>
                      <span className="badge badge-soft-success">Verified</span>
                    </td>
                    <td>@reffon </td>
                  </tr>
                  <tr>
                    <td>18 April, {currentYear}</td>
                    <td>
                      <Image src={avatar6} alt="avatar-2" className="img-fluid avatar-xs rounded-circle" />
                      <span className="align-middle ms-1">Carlos Johnson</span>
                    </td>
                    <td>
                      <span className="badge badge-soft-danger">Blocked</span>
                    </td>
                    <td>@bebo </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="align-items-center justify-content-between row g-0 text-center text-sm-start p-3 border-top">
              <div className="col-sm">
                <div className="text-muted">
                  Showing <span className="fw-semibold">5</span> of&nbsp;
                  <span className="fw-semibold">587</span> users
                </div>
              </div>
              <div className="col-sm-auto mt-3 mt-sm-0">
                <ul className="pagination pagination-rounded m-0">
                  <li className="page-item">
                    <Link href="" className="page-link">
                      <IconifyIcon icon="tdesign:arrow-left" className="bx" />
                    </Link>
                  </li>
                  <li className="page-item active">
                    <Link href="" className="page-link">
                      1
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link href="" className="page-link">
                      2
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link href="" className="page-link">
                      3
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link href="" className="page-link">
                      <IconifyIcon icon="tdesign:arrow-right" className="bx" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </Col>
        <Col xl={8}>
          <Card>
            <CardBody>
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="card-title">Recent Orders</h4>
                <Link href="" className="btn btn-sm btn-primary">
                  <IconifyIcon icon="ic:sharp-plus" className="bx me-1" />
                  Create Order
                </Link>
              </div>
            </CardBody>
            <div className="table-responsive table-centered">
              <table className="table mb-0">
                <thead className="bg-light bg-opacity-50">
                  <tr>
                    <th className="border-0 py-2">Order ID.</th>
                    <th className="border-0 py-2">Date</th>
                    <th className="border-0 py-2">Customer Name</th>
                    <th className="border-0 py-2">Phone No.</th>
                    <th className="border-0 py-2">Address</th>
                    <th className="border-0 py-2">Payment Type</th>
                    <th className="border-0 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Link href="">#TZ5625</Link>
                    </td>
                    <td>29 April {currentYear}</td>
                    <td>
                      <Link href="">Anna M. Hines</Link>
                    </td>
                    <td>(+1)-555-1564-261</td>
                    <td>Burr Ridge/Illinois</td>
                    <td>Credit Card</td>
                    <td>
                      <IconifyIcon icon="bxs:circle" className="bx  text-success me-1" />
                      Completed
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Link href="">#TZ9652</Link>
                    </td>
                    <td>25 April {currentYear}</td>
                    <td>
                      <Link href="">Judith H. Fritsche</Link>
                    </td>
                    <td>(+57)-305-5579-759</td>
                    <td>SULLIVAN/Kentucky</td>
                    <td>Credit Card</td>
                    <td>
                      <IconifyIcon icon="bxs:circle" className="bx  text-success me-1" />
                      Completed
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Link href="">#TZ5984</Link>
                    </td>
                    <td>25 April {currentYear}</td>
                    <td>
                      <Link href="">Peter T. Smith</Link>
                    </td>
                    <td>(+33)-655-5187-93</td>
                    <td>Yreka/California</td>
                    <td>Pay Pal</td>
                    <td>
                      <IconifyIcon icon="bxs:circle" className="bx  text-success me-1" />
                      Completed
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Link href="">#TZ3625</Link>
                    </td>
                    <td>21 April {currentYear}</td>
                    <td>
                      <Link href="">Emmanuel J. Delcid</Link>
                    </td>
                    <td>(+30)-693-5553-637</td>
                    <td>Atlanta/Georgia</td>
                    <td>Pay Pal</td>
                    <td>
                      <IconifyIcon icon="bxs:circle" className="bx  text-primary me-1" />
                      Processing
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Link href="">#TZ8652</Link>
                    </td>
                    <td>18 April {currentYear}</td>
                    <td>
                      <Link href="">William J. Cook</Link>
                    </td>
                    <td>(+91)-855-5446-150</td>
                    <td>Rosenberg/Texas</td>
                    <td>Credit Card</td>
                    <td>
                      <IconifyIcon icon="bxs:circle" className="bx  text-primary me-1" />
                      Processing
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="align-items-center justify-content-between row g-0 text-center text-sm-start p-3 border-top">
              <div className="col-sm">
                <div className="text-muted">
                  Showing <span className="fw-semibold">5</span> of&nbsp;
                  <span className="fw-semibold">90,521</span> orders
                </div>
              </div>
              <div className="col-sm-auto mt-3 mt-sm-0">
                <ul className="pagination pagination-rounded m-0">
                  <li className="page-item">
                    <Link href="" className="page-link">
                      <IconifyIcon icon="tdesign:arrow-left" className="bx" />
                    </Link>
                  </li>
                  <li className="page-item active">
                    <Link href="" className="page-link">
                      1
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link href="" className="page-link">
                      2
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link href="" className="page-link">
                      3
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link href="" className="page-link">
                      <IconifyIcon icon="tdesign:arrow-right" className="bx" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default User
