import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { axiosInstance } from '../axiosCalls/axios'

const PersonList = ({ title, people }) => {
    if (!people?.length) {
        return (
            <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center text-sm text-gray-500">
                No {title.toLowerCase()} yet.
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {people.map((person) => (
                <Link
                    key={person._id}
                    to={`/profile/${person.username}`}
                    className="flex items-center gap-3 rounded-xl p-2 hover:bg-gray-50 transition-colors"
                >
                    <img
                        src={
                            person.profileImage ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name || person.username)}&background=random`
                        }
                        alt={person.username}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{person.name}</p>
                        <p className="text-sm text-gray-500 truncate">@{person.username}</p>
                    </div>
                </Link>
            ))}
        </div>
    )
}

function Profile() {
    const { user } = useAuth()
    const { username } = useParams()

    const [userData, setUserData] = useState(null)
    const [isFollowing, setIsFollowing] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)
    const [activeList, setActiveList] = useState(null)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get(`/users/profile/${username}`)
                setUserData(response.data.userData)
                setIsFollowing(response.data.isFollowing)
            } catch (error) {
                console.error('Error fetching profile:', error)
            }
        }

        fetchProfile()
    }, [username])

    const handleFollowToggle = async () => {
        if (!userData || actionLoading) return

        setActionLoading(true)

        try {
            const endpoint = isFollowing
                ? `/users/${userData._id}/unfollow`
                : `/users/${userData._id}/follow`

            const response = await axiosInstance.post(endpoint)

            setUserData(response.data.userData)
            setIsFollowing(response.data.isFollowing)
        } catch (error) {
            console.error('Follow action failed:', error)
            alert(error.response?.data?.message || 'Something went wrong')
        } finally {
            setActionLoading(false)
        }
    }

    if (!user || !userData) return null

    const isOwner = user._id === userData._id || user.username === userData.username

    return (
        <div className="max-w-5xl mx-auto my-8 px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="flex-shrink-0">
                        <img
                            src={
                                userData.profileImage ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || userData.username)}&background=random`
                            }
                            alt={userData.username}
                            className="w-32 h-32 rounded-full border-4 border-indigo-50 shadow-sm object-cover"
                        />
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-4 w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
                                    {userData.isVerified && <span className="text-blue-500 text-sm">✓</span>}
                                </div>
                                <p className="text-gray-500 font-medium">@{userData.username}</p>
                            </div>

                            {isOwner ? (
                                <button className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold rounded-lg transition-colors border border-gray-200">
                                    Edit Profile
                                </button>
                            ) : (
                                <button
                                    onClick={handleFollowToggle}
                                    disabled={actionLoading}
                                    className={`px-6 py-2 text-sm font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${
                                        isFollowing
                                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200'
                                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                    }`}
                                >
                                    {actionLoading ? 'Please wait...' : isFollowing ? 'Following' : 'Follow'}
                                </button>
                            )}
                        </div>

                        <div className="flex justify-center md:justify-start gap-10 py-2">
                            <div className="text-center md:text-left">
                                <span className="font-bold text-gray-900 mr-1.5">{userData.posts?.length || 0}</span>
                                <span className="text-gray-500 text-sm">Posts</span>
                            </div>

                            <button
                                onClick={() => setActiveList(activeList === 'followers' ? null : 'followers')}
                                className="text-center md:text-left hover:opacity-70 transition-opacity"
                            >
                                <span className="font-bold text-gray-900 mr-1.5">{userData.followers?.length || 0}</span>
                                <span className="text-gray-500 text-sm">Followers</span>
                            </button>

                            <button
                                onClick={() => setActiveList(activeList === 'following' ? null : 'following')}
                                className="text-center md:text-left hover:opacity-70 transition-opacity"
                            >
                                <span className="font-bold text-gray-900 mr-1.5">{userData.following?.length || 0}</span>
                                <span className="text-gray-500 text-sm">Following</span>
                            </button>
                        </div>

                        <p className="text-gray-700 text-sm leading-relaxed max-w-xl">
                            {userData.bio || 'No bio available.'}
                        </p>
                    </div>
                </div>
            </div>

            {activeList && (
                <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">
                            {activeList === 'followers' ? 'Followers' : 'Following'}
                        </h3>
                        <button
                            onClick={() => setActiveList(null)}
                            className="text-sm text-gray-500 hover:text-gray-900"
                        >
                            Close
                        </button>
                    </div>
                    <PersonList
                        title={activeList === 'followers' ? 'Followers' : 'Following'}
                        people={activeList === 'followers' ? userData.followers : userData.following}
                    />
                </div>
            )}
        </div>
    )
}

export default Profile
