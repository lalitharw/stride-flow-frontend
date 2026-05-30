import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from "./pages/auth/login";
import Dashboard from "./pages/Dashboard"
import PortectedRoutes from "./utils/protectedRoutes";
import ProtectedRoutes from './utils/protectedRoutes';
import "leaflet/dist/leaflet.css";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />


        {/* protected routes */}

        <Route element={<ProtectedRoutes />}>
          <Route path='/' exact element={<Dashboard />} />
        </Route>


      </Routes>
    </BrowserRouter>
  )
}

export default App
