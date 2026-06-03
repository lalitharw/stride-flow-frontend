import axios from "axios"
import React from "react"
import { Button, Label, Input, Separator, Spinner } from '@heroui/react';

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AlertMessage from "../../components/AlertMessage";
import toast from "react-hot-toast"


// useEffect(() => {

// }, [])



function Login() {
    const navigate = useNavigate()
    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}auth/login`, {
                email,
                password
            })
            localStorage.setItem("token", response.data.data.token)
            localStorage.setItem("users", JSON.stringify(response.data.data.user))
            toast.success("Login Successful! Redirecting")
            setLoading(false)
            navigate("/", {
                replace: true
            })

        }
        catch (error) {

            setEmail("")
            setPassword("")
            console.log(error)
            toast.error(error.response?.data.message || "Something went wrong!")
        }
        finally {
            setLoading(false)
        }

    }
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    return (
        <>
            <div className="flex items-center flex-col justify-center h-screen">
                {/* <div className="p-10 shadow-lg rounded-xl"> */}
                <h3 className="text-center  text-xl mb-8">Welcome Back to StrideFlow</h3>
                <div className="flex  w-80 flex-col gap-10">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="input-type-email">Email</Label>
                        <Input id="input-type-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" type="email" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="input-type-password">Password</Label>
                        <Input id="input-type-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" type="password" />
                    </div>
                    <div className="text-center">
                        <Button isPending={loading} fullWidth onClick={handleSubmit}>
                            {({ isPending }) => (
                                <>
                                    {isPending ? <Spinner color="current" size="sm" /> : "Sign Up"}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
                <Separator className="my-5" />
                <p className="text-center">New to StrideFlow? Sign Up</p>
                {/* </div> */}
            </div>
        </>
    )
}


export default Login