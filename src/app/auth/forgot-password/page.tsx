import { Metadata } from 'next'
import ForgotPassword from './components/ForgotPassword'

export const metadata: Metadata = {
    title: 'Forgot Password',
    description: 'Request a password reset',
}

export default function ForgotPasswordPage() {
    return <ForgotPassword />
}
