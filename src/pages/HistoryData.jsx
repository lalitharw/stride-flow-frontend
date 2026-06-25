import { useParams } from "react-router-dom"
import api from "../utils/api"
import toast from "react-hot-toast"
import { useState, useEffect } from "react"
import {
    Polyline,
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap
} from "react-leaflet"
import "leaflet/dist/leaflet.css";
import { Spinner } from '@heroui/react';


function ChangeView({ center }) {
    const map = useMap();

    useEffect(() => {
        map.setView(
            [Number(center[0]), Number(center[1])],
            17
        );
    }, [center, map]);

    return null;
}

export default function HistoryData() {



    const { activityId } = useParams()

    const [activity, setActivity] = useState(null)
    const [walkedPath, setWalkedPath] = useState([])
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await api.get(`activities/${activityId}`)
                if (response.data.success === true) {
                    console.log(response.data.data)
                    setActivity(response.data.data.activity)
                    setWalkedPath(response.data.data.activity.route)
                }
            }
            catch (error) {
                console.log(error.response?.data?.message || "Something went wrong!")
            }
            finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [activityId])


    if (isLoading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
                <Spinner size="lg" />
                <p className="text-gray-500">
                    Loading activity data...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">
                        Activity #{activityId}
                    </h1>
                    <p className="text-gray-500">
                        Activity Details & Route History
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-sm text-gray-500">Activity Type</p>
                        <h2 className="text-xl font-semibold capitalize">
                            {activity?.type}
                        </h2>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-sm text-gray-500">Started At</p>
                        <h2 className="font-medium">
                            {activity?.formatted_start_time}
                        </h2>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-sm text-gray-500">Ended At</p>
                        <h2 className="font-medium">
                            {activity?.formatted_end_time}
                        </h2>
                    </div>

                </div>

                {/* Route Card */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

                    <div className="border-b px-6 py-4">
                        <h2 className="text-lg font-semibold">
                            Route Map
                        </h2>
                    </div>

                    {activity && walkedPath.length > 0 ? (
                        <div className="p-4">
                            <div
                                className="rounded-xl overflow-hidden"
                                style={{ height: "550px" }}
                            >
                                <MapContainer
                                    center={[19.0760, 72.8777]}
                                    zoom={17}
                                    style={{ height: "100%", width: "100%" }}
                                >
                                    <TileLayer
                                        attribution="&copy; OpenStreetMap contributors"
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />

                                    <ChangeView center={walkedPath[0]} />

                                    <Polyline
                                        positions={walkedPath}
                                    />

                                    <Marker position={walkedPath[0]}>
                                        <Popup>Start Point</Popup>
                                    </Marker>

                                    <Marker
                                        position={
                                            walkedPath[
                                            walkedPath.length - 1
                                            ]
                                        }
                                    >
                                        <Popup>End Point</Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        </div>
                    ) : (
                        <div className="py-16 text-center">
                            <div className="text-5xl mb-4">
                                📍
                            </div>

                            <h3 className="text-lg font-semibold">
                                No Route Data Available
                            </h3>

                            <p className="text-gray-500 mt-2">
                                No GPS points were captured for
                                this activity.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}