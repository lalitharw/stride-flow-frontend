import { useEffect, useState } from "react";
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


export default function DashboardMap() {
    const [walkedPath, setWalkedPath] = useState([]);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    const [accuracy, setAccuracy] = useState(null);
    const [startActivity, setStartActivity] = useState(false);
    const [loadingStartActivity, setLoadingStartActivity] = useState(false)

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
                setWalkedPath([currentLocation])

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
        event.preventDefault()
        try {
            const activity = JSON.parse(localStorage.getItem("activity"))
            const response = await api.patch(`activities/stop-activity/${activity.id}`)
            if (response.data.success === true) {
                alert(response.data.message)
                localStorage.removeItem("activity")
                setStartActivity(false)
                setWalkedPath([])
            }
        }
        catch (error) {
            // alert(error.response?.data.message)
            toast.error(error.response?.message || "Something went wrong!")
        }
    }

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
                    setWalkedPath((oldPath) => [...oldPath, point]);
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
                {startActivity ? (<Button className="w-[200px]" onClick={handleStopActivity}>Stop</Button>) : (<Button isPending={loadingStartActivity} className="w-[200px]" onClick={handleStartActivity}>{({ isPending }) => (
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