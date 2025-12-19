import { Metadata } from 'next'
import ResetPassword from './components/ResetPassword'

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset your account password',
}

export default function ResetPasswordPage() {
  return <ResetPassword />
}
