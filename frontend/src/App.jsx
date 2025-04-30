import Login from "./components/Login"
import Header from "./components/Header"
import { Outlet } from "react-router-dom"
import { LoadScript } from "@react-google-maps/api"
function App() {
  const apikey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <>
      <Header/>
        <Outlet />
    </>
  )
}

export default App
