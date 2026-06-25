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
import { Skeleton } from "@heroui/react"


const History = React.lazy(() => import("./History"))


function Dashboard() {




    const navigate = useNavigate()
    const handleLogout = (event) => {
        event.preventDefault()
        localStorage.clear()
        navigate("/login", {
            replace: true
        })
    }


    const [user, setUser] = useState(JSON.parse(localStorage.getItem("users")))
    const [refreshHistory, setRefreshHistory] = useState(false)

    const handleActivityStopped = () => {
        setRefreshHistory(true);
    };


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">

                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">
                    <div className="flex items-center justify-between">

                        <div>
                            <h1 className="text-3xl font-bold">
                                Stride Flow
                            </h1>
                            <p className="text-gray-500">
                                Track and review your activities
                            </p>
                        </div>

                        <Dropdown>
                            <DropdownTrigger>
                                <div className="flex items-center gap-3 cursor-pointer rounded-lg px-4 py-2 hover:bg-gray-100 transition">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                        {user?.email?.charAt(0).toUpperCase()}
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Logged in as
                                        </p>

                                        <p className="font-medium">
                                            {user?.email ?? "Guest"}
                                        </p>
                                    </div>
                                </div>
                            </DropdownTrigger>

                            <DropdownPopover>
                                <DropdownMenu aria-label="User menu">
                                    <DropdownItem
                                        key="logout"
                                        color="danger"
                                        className="text-danger"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </DropdownItem>
                                </DropdownMenu>
                            </DropdownPopover>
                        </Dropdown>

                    </div>
                </div>

                {/* Live Map */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-6">

                    <div className="px-6 py-4 border-b">
                        <h2 className="text-xl font-semibold">
                            Live Tracking
                        </h2>
                    </div>

                    <div className="p-4">
                        <DashboardMap onActivityStopped={handleActivityStopped} />
                    </div>

                </div>

                {/* History */}
                <div className="bg-white rounded-xl shadow-sm border">

                    <div className="px-6 py-4 border-b">
                        <h2 className="text-xl font-semibold">
                            Activity History
                        </h2>
                    </div>

                    <div className="p-4">
                        <Suspense
                            fallback={
                                <div className="w-full max-w-md space-y-3">
                                    <Skeleton className="h-4 w-full rounded" />
                                    <Skeleton className="h-4 w-5/6 rounded" />
                                    <Skeleton className="h-4 w-4/6 rounded" />
                                    <Skeleton className="h-4 w-full rounded" />
                                    <Skeleton className="h-4 w-3/6 rounded" />
                                </div>
                            }
                        >
                            <History refreshHistory={refreshHistory} />
                        </Suspense>
                    </div>

                </div>

            </div>
        </div>
    );
}


export default Dashboard