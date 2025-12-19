import { Metadata } from 'next'
import LockScreen from './components/LockScreen'

export const metadata: Metadata = {
  title: 'Lock Screen',
  description: 'Unlock your session',
}

export default function LockScreenPage() {
  return <LockScreen />
}
