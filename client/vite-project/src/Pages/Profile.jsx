import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useParams } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios'

function Profile() {
    const { user } = useAuth()
    const { username } = useParams()

    const [userData, setUserData] = useState(null)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get(`/users/profile/${username}`)
                setUserData(response.data.userData)
            } catch (error) {
                console.error("Error fetching profile:", error)
            }
        }

        fetchProfile()
    }, [username])

    if (!user) return null

    // Check if the profile being viewed belongs to the logged-in user
    const isOwner = user._id === userData?._id || user.username === userData?.username

    return (
        <div className="max-w-4xl mx-auto my-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                    <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || userData?.username || '')}&background=random`}
                        alt={userData?.username}
                        className="w-32 h-32 rounded-full border-4 border-indigo-50 shadow-sm object-cover"
                    />
                </div>

                {/* Profile Information & Stats */}
                <div className="flex-1 text-center md:text-left space-y-4">
                    {/* Header: Name, Username & Action Button */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <h2 className="text-2xl font-bold text-gray-900">{userData?.name}</h2>
                                {userData?.isVerified && (
                                    <span className="text-blue-500 text-sm">✓</span>
                                )}
                            </div>
                            <p className="text-gray-500 font-medium">@{userData?.username}</p>
                        </div>

                        {/* Conditional Action Button */}
                        <div>
                            {isOwner ? (
                                <button className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold rounded-lg transition-colors border border-gray-200">
                                    Edit Profile
                                </button>
                            ) : (
                                <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
                                    Follow
                                </button>
                            )}
                        </div>
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