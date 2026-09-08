import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios'

function Signup() {

    const [form, setForm] = useState({ name: "", username: "", email: "", password: "" })

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }


    const handleSubmit =async (e)=>{
        e.preventDefault()
        try {
            await axiosInstance.post('/users/register' , form)
            console.log('User Registered')

        } catch (error) {
            console.log(error)
        }
    }
















    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased">
            {/* Header / Logo Area */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 text-white shadow-sm mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create your account</h2>
                <p className="mt-2 text-sm text-slate-500">Join the community and start sharing today.</p>
            </div>

            {/* Form Card */}
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
                <div className="bg-white py-8 px-6 shadow-sm ring-1 ring-slate-900/5 sm:rounded-2xl sm:px-10">
                    <form className="space-y-4">

                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Alex Morgan"
                                className="w-full rounded-xl border-0 py-2.5 px-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-900 text-sm transition-all duration-150 outline-none"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                                Username
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 text-sm select-none">
                                    @
                                </span>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="alexmorgan"
                                    className="w-full rounded-xl border-0 py-2.5 pl-8 pr-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-900 text-sm transition-all duration-150 outline-none"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="alex@example.com"
                                onChange={handleChange}
                                className="w-full rounded-xl border-0 py-2.5 px-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-900 text-sm transition-all duration-150 outline-none"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                onChange={handleChange}
                                className="w-full rounded-xl border-0 py-2.5 px-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-900 text-sm transition-all duration-150 outline-none"
                            />
                        </div>

                        {/* Sign Up Button */}
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-all duration-150 shadow-sm cursor-pointer"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>

                    {/* Terms Notice */}
                    <p className="mt-4 text-center text-xs text-slate-400">
                        By signing up, you agree to our{' '}
                        <a href="#terms" className="underline hover:text-slate-600">Terms</a> and{' '}
                        <a href="#privacy" className="underline hover:text-slate-600">Privacy Policy</a>.
                    </p>
                </div>

                {/* Link to Login */}
                <p className="mt-6 text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-slate-900 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Signup