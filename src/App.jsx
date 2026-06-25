import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from "./pages/auth/login";
import Dashboard from "./pages/Dashboard"
import History from './pages/History';
import PortectedRoutes from "./utils/protectedRoutes";
import ProtectedRoutes from './utils/protectedRoutes';
import "leaflet/dist/leaflet.css";
import NotFound from './pages/NotFound';
import { Toaster } from 'react-hot-toast';
import HistoryData from './pages/HistoryData';
import PublicRoutes from './utils/PublicRoutes';





function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* protected routes */}
          <Route element={<ProtectedRoutes />}>
            <Route path='/' exact element={<Dashboard />} />
            <Route path="/activity" exact element={<History />} />
            <Route path="/activity/:activityId" element={<HistoryData />} />
          </Route>

          {/* public routes */}
          <Route element={<PublicRoutes />}>
            <Route path="/login" exact element={<Login />} />
          </Route>

          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  )
}

export default App
