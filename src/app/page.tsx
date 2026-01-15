import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Assist Dashboard',
  // description: 'Dashbaord',
}

export default function HomePage() {
  redirect('/auth/sign-in')
}
