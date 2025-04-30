import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './components/Login.jsx'
import PlantLists from './components/pages/PlantLists.jsx'
import { Provider } from 'react-redux'
import store from './utils/store.js'
import ProtectedRoutes from './components/ProtectedRoutes.jsx'
import PlantMissions from './components/pages/PlantMissions.jsx'
import { LoadScript } from '@react-google-maps/api'

const apikey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const appRouter = createHashRouter([
  {
    path:"/",
    element:<Login/>,
  },
  {
    path: "",
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/plants",
        element: <App />,
        children:[
          {
            path:"",
            element:<PlantLists/>
          },
          {
            path: ":id/plantMissions",
            element: <PlantMissions />
          }       
        ]
      },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <LoadScript googleMapsApiKey={apikey}>
        <RouterProvider router={appRouter}/>
      </LoadScript>
    </Provider>
  </StrictMode>,
)
