import LeftSideBarToggle from './components/LeftSideBarToggle'
import ProfileDropdown from './components/ProfileDropdown'
import ThemeModeToggle from './components/ThemeModeToggle'
import { Container } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Notifications from './components/Notifications'

const page = () => {
  return (
    <header className="app-topbar">
      <div>
        <Container fluid>
          <div className="navbar-header">
            <div className="d-flex align-items-center gap-2">
              <LeftSideBarToggle />
              <form className="app-search d-none d-md-block me-auto">
                <div className="position-relative">
                  <input type="search" className="form-control" placeholder="admin,widgets..." autoComplete="off" />
                  <IconifyIcon icon="solar:magnifer-outline" className="search-widget-icon" />
                </div>
              </form>
            </div>
            <div className="d-flex align-items-center gap-2">
              <ThemeModeToggle />
              <Notifications />
              <ProfileDropdown />
            </div>
          </div>
        </Container>
      </div>
    </header>
  )
}

export default page
