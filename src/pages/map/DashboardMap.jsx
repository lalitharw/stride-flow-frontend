import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import api from "../../utils/api";
import { renderToString } from "react-dom/server";
import { FaPerson } from "react-icons/fa6";
import { IoIosDisc } from "react-icons/io";


export default function DashboardMap() {
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
    const [walkedPath, setWalkedPath] = useState([]);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    const [accuracy, setAccuracy] = useState(null);
    const [startActivity, setStartActivity] = useState(false);

    const handleStartActivity = async (event) => {
        event.preventDefault()
        try {
            const response = await api.post("/activities")
            if (response.data.success === true) {
                alert(response.data.message)
                localStorage.setItem("activity", JSON.stringify(response.data.data?.activity))
                setStartActivity(true)
                setWalkedPath([currentLocation])
            }
        }
        catch (err) {
            alert(err.response?.data.message)
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
            alert(error.response?.data.message)
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
        return "Loading Map...";
    }

    const mapCenter = startActivity && walkedPath.length > 0
        ? walkedPath[walkedPath.length - 1]
        : currentLocation;

    return (
        <>
            {startActivity ? (<button onClick={handleStopActivity}>Stop</button>) : (<button onClick={handleStartActivity}>Start</button>)}
            <hr />
            Lat: {lat}, Long: {long}, Accuracy: {accuracy}

            <div className="container" style={{ height: "600px", width: "100vw" }}>
                <MapContainer
                    center={mapCenter}
                    zoom={17}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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

                            {walkedPath.length > 1 && (
                                <Marker position={walkedPath[walkedPath.length - 1] || currentLocation} icon={endDisc
                                }>
                                    <Popup>End</Popup>
                                </Marker>
                            )}
                        </>
                    ) : (
                        <Marker position={currentLocation} icon={personIcon} >
                            <Popup>Current Location</Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </>
    );
}