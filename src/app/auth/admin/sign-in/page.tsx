import { Metadata } from 'next'
import PlatformSignIn from './components/PlatformSignIn'

export const metadata: Metadata = {
  title: 'Platform Admin Sign In',
  description: 'Sign in to the platform administration panel',
}

export default function PlatformSignInPage() {
  return <PlatformSignIn />
}
