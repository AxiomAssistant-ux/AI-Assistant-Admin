import { Metadata } from 'next'
import PlatformSignUp from './components/PlatformSignUp'

export const metadata: Metadata = {
  title: 'Platform Admin Sign Up',
  description: 'Create a platform administrator account',
}

export default function PlatformSignUpPage() {
  return <PlatformSignUp />
}
