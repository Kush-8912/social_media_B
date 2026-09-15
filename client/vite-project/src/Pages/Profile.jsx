import React from 'react'
import { useAuth } from '../context/AuthContext'

function Profile() {
    const {user} = useAuth()

    console.log("ProfilePage" , user)
  return (
     <h1>{user.username}</h1>
  )
}

export default Profile