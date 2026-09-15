import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useParams } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios'


function Profile() {
    const { user } = useAuth()
     const {username} = useParams()

     const [userData , setUserData] = useState(null)


    useEffect(() => {
        const fetchProfile = async () => {
          const user =  await axiosInstance.get(`/users/profile/${username}`)

          setUserData(user.data.userData)
        }

        fetchProfile()

    }, [username])



    console.log("ProfilePage", user)
    if (!user) return null



    return (
        <div className="max-w-4xl mx-auto my-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                    <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || userData?.username)}&background=random`}
                        alt={userData?.username}
                        className="w-32 h-32 rounded-full border-4 border-indigo-50 shadow-sm object-cover"
                    />
                </div>

                {/* Profile Information & Stats */}
                <div className="flex-1 text-center md:text-left space-y-4">
                    {/* Header: Name & Username */}
                    <div>
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <h2 className="text-2xl font-bold text-gray-900">{userData?.name}</h2>
                            {userData?.isVerified && (
                                <span className="text-blue-500 text-sm">✓</span>
                            )}
                        </div>
                        <p className="text-gray-500 font-medium">@{userData?.username}</p>
                    </div>

                    {/* Stats: Posts, Followers, Following */}
                    <div className="flex justify-center md:justify-start gap-12 py-2">
                        <div className="text-center md:text-left">
                            <span className="font-bold text-gray-900 mr-1.5">
                                {userData?.posts?.length || 0}
                            </span>
                            <span className="text-gray-500 text-sm">Posts</span>
                        </div>
                        <div className="text-center md:text-left">
                            <span className="font-bold text-gray-900 mr-1.5">
                                {userData?.followers?.length || 0}
                            </span>
                            <span className="text-gray-500 text-sm">Followers</span>
                        </div>
                        <div className="text-center md:text-left">
                            <span className="font-bold text-gray-900 mr-1.5">
                                {userData?.following?.length || 0}
                            </span>
                            <span className="text-gray-500 text-sm">Following</span>
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <p className="text-gray-700 text-sm leading-relaxed max-w-xl">
                            {userData?.bio || "No bio available."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile