import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import api from "../../utils/api";
import { renderToString } from "react-dom/server";
import { FaPerson } from "react-icons/fa6";
import { IoIosDisc } from "react-icons/io";
import { Separator, Skeleton, Button, Spinner } from "@heroui/react";
import toast from "react-hot-toast"
import "../../css/pulse_icon.css"
import FollowUser from "../../components/FollowUser";
import HaverSineDistance from "../../utils/HaverSineDistance";



export default function DashboardMap({ onActivityStopped }) {
    const [walkedPath, setWalkedPath] = useState(() => {
        const saved = localStorage.getItem("walked_path")
        return saved ? JSON.parse(saved) : []
    });
    const [currentLocation, setCurrentLocation] = useState(null);
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    const [accuracy, setAccuracy] = useState(null);
    const sequenceRef = useRef(0)
    const [pendingPoints, setPendingPoints] = useState(() => {
        const saved = localStorage.getItem("pending_points")
        return saved ? JSON.parse(saved) : []
    })
    const [startActivity, setStartActivity] = useState(() => {
        return !!localStorage.getItem("activity")
    });
    const [loadingStartActivity, setLoadingStartActivity] = useState(false)
    const [loadingStopActivity, setLoadingStopActivity] = useState(false)

    const pulseIcon = L.divIcon({
        className: "",
        html: '<div class="pulse-marker"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
    });

    const personIcon = L.divIcon({
        html: renderToString(<FaPerson size={24} color={"green"} />),
        className: "",
        iconSize: [24, 24],
    });
    const startDisc = L.divIcon({
        html: renderToString(<IoIosDisc size={24} color={"red"} />),
        className: "",
        iconSize: [24, 24],
    });
    const endDisc = L.divIcon({
        html: renderToString(<IoIosDisc size={24} color={"green"} />),
        className: "",
        iconSize: [24, 24],
    });

    const handleStartActivity = async (event) => {
        event.preventDefault()
        setLoadingStartActivity(true)
        try {
            const response = await api.post("/activities")
            if (response.data.success === true) {
                // alert(response.data.message)
                toast.success(response.data.message)
                localStorage.setItem("activity", JSON.stringify(response.data.data?.activity))
                setStartActivity(true)
                sequenceRef.current += 1
                localStorage.setItem("mysequence", sequenceRef.current)
                // setWalkedPath([currentLocation])

            }
        }
        catch (err) {
            console.log(err.message)
            // alert(err.response?.message || "Something went wrong!")
            toast.error(
                err.response?.data?.message ||
                err.message ||
                "Something went wrong!"
            );
        }
        finally {
            setLoadingStartActivity(false)
        }
    }

    const handleStopActivity = async (event) => {
        event?.preventDefault()
        setLoadingStopActivity(true)
        const activity = JSON.parse(localStorage.getItem("activity"))
        const pendingPoints = JSON.parse(localStorage.getItem("pending_points") || [])

        if (!activity) {
            toast.error("No active activity Found!")
            return
        }

        try {

            await handleStoreActivity(pendingPoints)
            const response = await api.patch(`activities/stop-activity/${activity.id}`)
            if (response.data.success === true) {
                // alert(response.data.message)
                toast.success(response.data.message)
                localStorage.removeItem("activity")
                localStorage.removeItem("walked_path")
                localStorage.removeItem("pending_points")
                setStartActivity(false)
                setWalkedPath([])
                setPendingPoints([])
                sequenceRef.current = 0
                localStorage.removeItem("mysequence")
                onActivityStopped?.();
            }
        }
        catch (error) {
            // alert(error.response?.data.message)
            toast.error(error.response?.data.message || "Something went wrong!")
        }
        finally {
            setLoadingStopActivity(false)
        }
    }

    const handleStoreActivity = async (path) => {
        const activity = JSON.parse(localStorage.getItem("activity"))
        try {
            const response = await api.post(`activity-points`, {
                "co_ordinates": path,
                "activity_id": activity.id,
                "sequence": sequenceRef.current
            })
            sequenceRef.current += 1
            localStorage.setItem("mysequence", sequenceRef.current)




        }
        catch (error) {
            toast.error(error.response?.message || "Something went wrong!")
        }
    }

    // geolocation navigator
    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const point = [
                    position.coords.latitude,
                    position.coords.longitude,
                ];

                setLat(position.coords.latitude);
                setLong(position.coords.longitude);
                setAccuracy(position.coords.accuracy);
                setCurrentLocation(point);

                if (startActivity) {
                    setWalkedPath((oldPath) => {
                        const newPath = [...oldPath, point];
                        localStorage.setItem(
                            "walked_path",
                            JSON.stringify(newPath)
                        );
                        return newPath;
                    });

                    setPendingPoints((prev) => {
                        const points = [...prev, point]
                        localStorage.setItem(
                            "pending_points",
                            JSON.stringify(points)
                        )
                        return points
                    })
                }
            },
            (error) => {
                console.error("Location Error:", error);
            },
            {
                maximumAge: 0,
                timeout: 10000,
                enableHighAccuracy: true,
            }
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [startActivity]);


    // to save batch points
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (
            !startActivity ||
            isUploading ||
            pendingPoints.length < 10
        ) {
            return;
        }

        const uploadBatch = async () => {
            const batch = pendingPoints.slice(0, 10);

            try {
                setIsUploading(true);

                await handleStoreActivity(batch);

                setPendingPoints(prev => prev.slice(10));
            } finally {
                setIsUploading(false);
            }
        };

        uploadBatch();
    }, [pendingPoints, startActivity, isUploading]);


    useEffect(() => {
        localStorage.setItem(
            "pending_points",
            JSON.stringify(pendingPoints)
        );
    }, [pendingPoints]);


    // useEffect(() => {
    //     console.log(walkedPath)
    //     console.log("Inside walkedpath useEffect")
    //     if (!startActivity) return;


    //     if (walkedPath.length > 10) {
    //         handleStoreActivity(walkedPath)
    //     }
    // }

    //     , [walkedPath])


    // use Effect to check time of inactivity
    useEffect(() => {
        if (!startActivity || walkedPath.length < 2) return;
        const timer = setTimeout(() => {
            const last = walkedPath[walkedPath.length - 1]
            const prev = walkedPath[walkedPath.length - 2]

            const distance = HaverSineDistance(last, prev)

            if (distance < 5) {
                handleStopActivity()
                toast("Activity auto-stopped due to inactivity")
            }
        }, 5 * 60 * 1000)

        return () => clearTimeout(timer);

    }, [walkedPath])




    if (!currentLocation) {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-center mb-[10px]">
                    <Skeleton animationType="none" className="h-[25px] w-[200px] rounded-xl" />
                </div>
                <Skeleton animationType="none" className="h-[15px] w-2/4 rounded-xl" />
                <Skeleton animationType="none" className="h-[500px] rounded-xl" />
            </div>);
    }

    const mapCenter = startActivity && walkedPath.length > 0
        ? walkedPath[walkedPath.length - 1]
        : currentLocation;

    return (
        <>
            <div className="flex items-center justify-center">
                {startActivity ? (<Button isPending={loadingStopActivity} className="w-[200px]" onClick={handleStopActivity}>
                    {({ isPending }) => (
                        <>
                            {isPending ? <Spinner color="current" size="sm" /> : "Stop"}
                        </>
                    )}
                </Button>) : (<Button isPending={loadingStartActivity} className="w-[200px]" onClick={handleStartActivity}>{({ isPending }) => (
                    <>
                        {isPending ? <Spinner color="current" size="sm" /> : "Start"}
                    </>
                )}</Button>)}
            </div>
            <Separator className="my-5" />

            <p className="mb-[5px]">Lat: {lat}, Long: {long}, Accuracy: {accuracy}</p>

            <div className="container rounded-lg shadow-xl" style={{ height: "500px" }}>
                <MapContainer
                    className="rounded-lg"
                    center={mapCenter}
                    zoom={17}

                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <FollowUser
                        currentLocation={mapCenter}
                        startActivity={startActivity}
                    />

                    {startActivity ? (
                        <>
                            <Polyline positions={walkedPath} />

                            {walkedPath.length > 0 && (
                                <Marker position={walkedPath[0] || currentLocation} icon={startDisc
                                }>
                                    <Popup>Start</Popup>
                                </Marker>
                            )}

                            {walkedPath.length > 0 && (
                                <Marker position={walkedPath[walkedPath.length - 1] || currentLocation} icon={endDisc
                                }>
                                    <Popup>End</Popup>
                                </Marker>
                            )}
                        </>
                    ) : (
                        <Marker position={currentLocation} icon={pulseIcon} >
                            <Popup>Current Location</Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </>
    );
}