'use client'
import avatar1 from '@/assets/images/users/avatar-1.jpg'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuth } from '@/context/useAuthContext'
import Image from 'next/image'
import { Dropdown, DropdownHeader, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap'

const ProfileDropdown = () => {
  const { user, signOut } = useAuth()

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    signOut()
  }

  return (
    <Dropdown className=" topbar-item">
      <DropdownToggle
        type="button"
        className="topbar-button content-none"
        id="page-header-user-dropdown"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false">
        <span className="d-flex align-items-center">
          <Image
            className="rounded-circle"
            width={32}
            // height={32}
            src={avatar1}
            alt="avatar-3"
          />
        </span>
      </DropdownToggle>
      <DropdownMenu className=" dropdown-menu-end">
        <DropdownHeader>
          <div className="mb-0 fw-medium">{user?.name || 'User'}</div>
          <small className="text-muted">{user?.email || 'user@example.com'}</small>
          {user?.role && (
            <div>
              <span className="badge bg-primary mt-1">{user.role}</span>
            </div>
          )}
        </DropdownHeader>
        <DropdownItem href="org-settings">
          <IconifyIcon icon="solar:user-outline" className="align-middle me-2 fs-18" />
          <span className="align-middle">My Account</span>
        </DropdownItem>
        {/* <DropdownItem href="">
          <IconifyIcon icon="solar:wallet-outline" className="align-middle me-2 fs-18" />
          <span className="align-middle">Pricing</span>
        </DropdownItem> */}
        <DropdownItem href="/contact-support">
          <IconifyIcon icon="solar:help-outline" className="align-middle me-2 fs-18" />
          <span className="align-middle">Help</span>
        </DropdownItem>
        {/* <DropdownItem href="/auth/lock-screen">
          <IconifyIcon icon="solar:lock-keyhole-outline" className="align-middle me-2 fs-18" />
          <span className="align-middle">Lock screen</span>
        </DropdownItem> */}
        <div className="dropdown-divider my-1" />
        <DropdownItem className=" text-danger" onClick={handleLogout}>
          <IconifyIcon icon="solar:logout-3-outline" className="align-middle me-2 fs-18" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export default ProfileDropdown
