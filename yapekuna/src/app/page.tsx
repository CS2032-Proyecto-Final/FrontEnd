import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to /auth/login
  redirect('/auth/login');
  return null; 
}