import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../axiosCalls/axios";



const AuthContext = createContext()


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await axiosInstance.get('/users/me')
            setUser(userData.data.authenticatedUser)
        }

        fetchUser()
    } , [])


    return (
        <AuthContext.Provider value={{user}}>
          {children}  
        </AuthContext.Provider>
    )




}

export const useAuth = ()=> useContext(AuthContext)
