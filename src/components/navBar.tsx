import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export default function NavBar() {
    const navigate = useNavigate()
    const location = useLocation()
    const [token, setToken] = useState("")
    useEffect(() => {
        if (location.pathname == "/login" || location.pathname == "/register") {
            if (localStorage.getItem("token")) {
                navigate("/")
            }
        }

        console.log(localStorage.getItem("token"))
        setToken(localStorage.getItem("token") || "")
    }, [navigate])
    return <div className="w-full flex justify-between items-center p-4 fixed top-0 left-0 bg-gray-300  text-white">
        <Link to={"/dashboard"} className="text-2xl text-black font-bold">MindfulMe</Link>
        <div className="flex space-x-4">
            {token.length === 0 ?
                <>
                    <Button onClick={() => {
                        navigate("/login")
                    }} className="cursor-pointer" variant={"secondary"}>Login</Button>
                    <Button onClick={() => {
                        navigate("/register")
                    }} className="cursor-pointer" variant={"secondary"}>Register</Button>
                </>
                : <Button onClick={() => {
                    localStorage.removeItem("token")
                    setToken("")
                    navigate("/login")
                }}>Logout</Button>
            }
        </div>
    </div>
}