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
          }
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={appRouter}/>
    </Provider>
  </StrictMode>,
)
