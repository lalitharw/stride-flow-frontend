import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../utils/api"
import DashboardMap from "./map/DashboardMap"




function Dashboard() {




    const navigate = useNavigate()
    const handleLogout = (event) => {
        event.preventDefault()
        localStorage.removeItem("users")
        localStorage.removeItem("token")
        navigate("/login", {
            replace: true
        })
    }



    const [user, setUser] = useState(JSON.parse(localStorage.getItem("users")))


    return (
        <div className="container">
            {user ? user.email : "Null"}
            <p>Dashboard</p>
            <button onClick={handleLogout}>Logout</button>
            <hr />

            <DashboardMap />

        </div>
    )
}


export default Dashboard