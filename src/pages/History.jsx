import api from "../utils/api"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

export default function History({ refreshHistory }) {
    const [activity, setActivity] = useState([])

    useEffect(() => {
        const getActivity = async () => {
            try {
                const response = await api.get("/activities")
                if (response.data.success == true) {
                    setActivity(response.data.data.activity)
                }
            }
            catch (error) {
                alert(error.response.data.message)
            }

        }
        getActivity()
    }, [refreshHistory])

    return (
        <>
            {
                activity.map((activityPoint, index) => (
                    <>
                        <li key={index}><Link to={`/activity/${activityPoint.id}`}>{activityPoint.id}</Link></li>
                    </>
                ))
            }
        </>
    )
}