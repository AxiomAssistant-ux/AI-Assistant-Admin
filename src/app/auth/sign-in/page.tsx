import { Metadata } from 'next'
import SignIn from './components/SignIn'

export const metadata: Metadata = {
  title: 'Sign In - Org User',
  description: 'Sign in to your organization account',
}

export default function SignInPage() {
  return <SignIn />
}
