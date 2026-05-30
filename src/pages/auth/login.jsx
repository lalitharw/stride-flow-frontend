import axios from "axios"
import React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// useEffect(() => {

// }, [])



function Login() {
    const navigate = useNavigate()
    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}auth/login`, {
                email,
                password
            })

            localStorage.setItem("token", response.data.data.token)
            localStorage.setItem("users", JSON.stringify(response.data.data.user))
            alert("Login Successful")
            navigate("/", {
                replace: true
            })

        }
        catch (error) {
            setEmail("")
            setPassword("")
            if (error.response) {
                alert(error.response.data.message || "Something went wrong!")
                return
            }

            alert("Something went wrong")
            console.log(error)
        }

    }
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
        <>
            <div className="d-flex justify-content-center">
                <form method="POST" onSubmit={handleSubmit}>
                    <div className="my-3 d-flex gap-2">
                        <label>Email: </label>
                        <input type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)} id="" />
                    </div>
                    <div className="my-3 d-flex gap-2">
                        <label>Password: </label>
                        <input type="text" name="password" value={password} onChange={(e) => setPassword(e.target.value)} id="" />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
    )
}


export default Login