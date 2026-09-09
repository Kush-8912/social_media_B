import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../axiosCalls/axios";



const AuthContext = createContext()


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            const user = await axiosInstance.get('/users/me')

            console.log(user)
        }

        fetchUser()
    } , [])


    return (
        <AuthProvider>
          {children}  
        </AuthProvider>
    )




}

export const useAuth = ()=> useContext(AuthContext)
