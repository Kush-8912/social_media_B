import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Home() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className='text-4xl'>Home</h1>
      <h3 className='text-4xl'>{user?.username}</h3>
      {user?.username && (
        <Link
          to={`/profile/${user.username}`}
          className='inline-block mt-4 px-4 py-2 rounded-lg bg-slate-900 text-white'
        >
          Go to Profile
        </Link>
      )}
    </div>
  )
}

export default Home
