'use client'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { Card, CardBody, CardHeader, CardTitle, Col, Nav, NavItem, NavLink, Row, Tab, TabContainer, TabContent, TabPane, Tabs } from 'react-bootstrap'
import { tabContents } from '../data'

const NavTabs = () => {
  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Nav Tabs</CardTitle>
          <p className="card-subtitle">
            Use the <code>.nav-tabs</code> class to generate a tabbed interface.
          </p>
        </CardHeader>
        <CardBody>
          <Tabs defaultActiveKey={'2'} variant="underline" className="card-tabs border-bottom">
            {tabContents.map((tab, idx) => (
              <Tab
                className="nav-item"
                eventKey={tab.id}
                key={idx}
                title={
                  <div className="fw-semibold">
                    <span className="d-block d-sm-none">
                      <IconifyIcon icon={tab.icon} />
                    </span>
                    <span className="d-none d-sm-block">{tab.title}</span>
                  </div>
                }>
                {tab.description}
              </Tab>
            ))}
          </Tabs>
        </CardBody>
      </Card>
    </Col>
  )
}

const TabsJustified = () => {
  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Tabs Justified</CardTitle>
          <p className="card-subtitle">
            Using class <code>.nav-justified</code>, you can force your tabs menu items to use the full available width.
          </p>
        </CardHeader>
        <CardBody>
          <Tabs justify defaultActiveKey={'2'} variant="underline" className="border-bottom card-tabs">
            {tabContents.map((tab, idx) => (
              <Tab
                className="nav-item"
                eventKey={tab.id}
                key={idx}
                title={
                  <div className="fw-semibold">
                    <span className="d-block d-sm-none">
                      <IconifyIcon icon={tab.icon} />
                    </span>
                    <span className="d-none d-sm-block">{tab.title}</span>
                  </div>
                }>
                {tab.description}
              </Tab>
            ))}
          </Tabs>
        </CardBody>
      </Card>
    </Col>
  )
}

const NavPills = () => {
  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Nav Pills</CardTitle>
          <p className="card-subtitle">
            Use the <code>.nav-pills</code> class to generate a pilled interface.
          </p>
        </CardHeader>
        <CardBody>
          <TabContainer defaultActiveKey={'2'}>
            <Nav as={'ul'} variant="pills">
              {tabContents.map((tab, idx) => (
                <NavItem as={'li'} key={idx}>
                  <NavLink eventKey={tab.id}>
                    <span className="d-block d-sm-none">
                      <IconifyIcon icon={tab.icon} />
                    </span>
                    <span className="d-none d-sm-block">{tab.title}</span>
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
            <TabContent className="pt-2 text-muted">
              {tabContents.map((tab, idx) => (
                <TabPane eventKey={tab.id} key={idx}>
                  <p className="mb-0">{tab.description}</p>
                </TabPane>
              ))}
            </TabContent>
          </TabContainer>
        </CardBody>
      </Card>
    </Col>
  )
}

const PillsJustified = () => {
  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Pills Justified</CardTitle>
          <p className="card-subtitle">
            Using class <code>.nav-justified</code>, you can force your pills menu items to use the full available width.
          </p>
        </CardHeader>
        <CardBody>
          <div className="d-flex flex-wrap gap-2">
            <TabContainer defaultActiveKey={'2'}>
              <Nav as={'ul'} variant="pills" justify className="p-1">
                {tabContents.map((tab, idx) => (
                  <NavItem as={'li'} key={idx}>
                    <NavLink eventKey={tab.id}>
                      <span className="d-block d-sm-none">
                        <IconifyIcon icon={tab.icon} />
                      </span>
                      <span className="d-none d-sm-block">{tab.title}</span>
                    </NavLink>
                  </NavItem>
                ))}
              </Nav>
              <TabContent className="pt-2 text-muted">
                {tabContents.map((tab, idx) => (
                  <TabPane eventKey={tab.id} key={idx}>
                    <p className="mb-0">{tab.description}</p>
                  </TabPane>
                ))}
              </TabContent>
            </TabContainer>
          </div>
        </CardBody>
      </Card>
    </Col>
  )
}

const TabsVerticalLeft = () => {
  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Tabs Vertical Left</CardTitle>
          <p className="card-subtitle">
            You can stack your navigation by changing the flex item direction with the <code>.flex-column</code> utility.
          </p>
        </CardHeader>
        <CardBody>
          <Row>
            <TabContainer defaultActiveKey={'1'}>
              <Col sm={3} className="mb-2 mb-sm-0">
                <Nav variant="pills" className="flex-column">
                  {tabContents.map((tab, idx) => (
                    <NavLink key={idx} eventKey={tab.id}>
                      <span>{tab.title}</span>
                    </NavLink>
                  ))}
                </Nav>
              </Col>
              <Col sm={9}>
                <TabContent className="pt-0">
                  {tabContents.map((tab, idx) => (
                    <TabPane className="fade" eventKey={tab.id} key={idx}>
                      <p className="mb-0">{tab.description.slice(0, 400)}</p>
                    </TabPane>
                  ))}
                </TabContent>
              </Col>
            </TabContainer>
          </Row>
        </CardBody>
      </Card>
    </Col>
  )
}

const TabsVerticalRight = () => {
  return (
    <Col lg={6}>
      <Card>
        <CardHeader>
          <CardTitle as={'h5'}>Tabs Vertical Right</CardTitle>
          <p className="card-subtitle">
            You can stack your navigation by changing the flex item direction with the <code>.flex-column</code> utility.
          </p>
        </CardHeader>
        <CardBody>
          <Row>
            <TabContainer defaultActiveKey={'1'}>
              <Col sm={9} className="mb-2 mb-sm-0">
                <TabContent className="pt-0">
                  {tabContents.map((tab, idx) => (
                    <TabPane className="fade" eventKey={tab.id} key={idx}>
                      <p className="mb-0">{tab.description.slice(0, 400)}</p>
                    </TabPane>
                  ))}
                </TabContent>
              </Col>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                  {tabContents.map((tab, idx) => (
                    <NavLink key={idx} eventKey={tab.id}>
                      <span>{tab.title}</span>
                    </NavLink>
                  ))}
                </Nav>
              </Col>
            </TabContainer>
          </Row>
        </CardBody>
      </Card>
    </Col>
  )
}

const AllNavTabs = () => {
  return (
    <>
      <NavTabs />
      <TabsJustified />
      <NavPills />
      <PillsJustified />
      <TabsVerticalLeft />
      <TabsVerticalRight />
    </>
  )
}

export default AllNavTabs
