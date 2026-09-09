import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./Pages/Login"
import Signup from "./Pages/Signup"
import Home from "./Pages/Home"
import Landing from "./Pages/Landing"
import { AuthProvider } from "./context/AuthContext"

function App() {


  return (
  
    <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
          </Routes>


        </BrowserRouter>
        </AuthProvider>
  

  )
}

export default App
