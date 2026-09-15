import React from 'react'
import { useAuth } from '../context/AuthContext'

function Home() {
  const {user} = useAuth()
  return (
    <div>
    <h1 className='text-4xl'>Home</h1>
    <h3 className='text-4xl'>{user.username}</h3>
    </div>
  )
}

export default Home


// Public Routes - Resources accesible publicly
// Protected Routes - verifivation required to access