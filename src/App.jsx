import RouterApp from './routers'
import { RouterProvider } from 'react-router-dom'

import './App.css'
import { ToastContainer } from 'react-toastify'

function App() {


  return (
    <>
      <RouterProvider router={RouterApp} />
       <ToastContainer />
    </>
  )
}

export default App
