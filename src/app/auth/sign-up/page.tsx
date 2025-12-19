import { Metadata } from 'next'
import SignUp from './components/SignUp'

export const metadata: Metadata = {
  title: 'Contact Sales - Org User',
  description: 'Contact sales to create your organization account',
}

export default function SignUpPage() {
  return <SignUp />
}
