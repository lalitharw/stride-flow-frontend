export default function HaverSineDistance(last_co_ordinate, prev_co_ordinate, in_meters = false) {
    const R = 6371.0;

    const toRadians = (degree) => (degree * Math.PI) / 180;

    const lat1Rad = toRadians(last_co_ordinate[0]);
    const lon1Rad = toRadians(last_co_ordinate[1]);
    const lat2Rad = toRadians(prev_co_ordinate[0]);
    const lon2Rad = toRadians(prev_co_ordinate[1]);

    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    // Haversine formula steps
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const kilometers = R * c;

    if (in_meters) {
        return kilometers * 1000
    }

    return kilometers;
}
