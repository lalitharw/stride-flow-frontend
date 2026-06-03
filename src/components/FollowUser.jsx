import { useMap } from "react-leaflet";
import { useEffect } from "react";

export default function FollowUser({ currentLocation, startActivity }) {
    const map = useMap();

    useEffect(() => {
        console.log("FollowUser:", {
            startActivity,
            currentLocation,
            center: map.getCenter(),
        });

        if (!startActivity || !currentLocation) return;

        map.panTo(currentLocation, {
            animate: true,
            duration: 1,
        });
    }, [currentLocation, startActivity, map]);

    return null;
}