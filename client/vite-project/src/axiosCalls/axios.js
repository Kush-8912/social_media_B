// address - 8085
//json
// cookies ,credentails

import axios from "axios";

export const axiosInstance = axios.create({
    baseURL : 'http://localhost:8085/',
    withCredentials : true,
    headers:{
        "Content-Type":"application/json"
    }

})

