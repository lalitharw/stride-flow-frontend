import React, { lazy, Suspense } from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../utils/api"
import DashboardMap from "./map/DashboardMap"
import { Button } from '@heroui/react'
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownPopover
} from "@heroui/react";
import { FaRegUserCircle } from "react-icons/fa";


const History = React.lazy(() => import("./History"))


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
        <>
            <div className="container mx-auto px-5 py-5 md:px-10 md:py-10">
                <div className="flex items-center justify-end">
                    <Dropdown>
                        <DropdownTrigger>
                            <div className="flex items-center justify-center gap-2 cursor-pointer">
                                <FaRegUserCircle className="text-2xl" />
                                <p>Hello, {user?.email ?? "Guest"}</p>
                            </div>
                        </DropdownTrigger>
                        <DropdownPopover>
                            <DropdownMenu aria-label="User menu">
                                {/* <DropdownItem key="profile">Profile</DropdownItem> */}
                                <DropdownItem onClick={handleLogout} key="logout" className="text-danger" color="danger">
                                    Logout
                                </DropdownItem>
                            </DropdownMenu>
                        </DropdownPopover>
                    </Dropdown>
                </div>
                <div className="my-3">
                    <DashboardMap />
                </div>
            </div>

            <Suspense fallback={<div>Loading...</div>}>
                <History />
            </Suspense>
        </>
    )
}


export default Dashboard