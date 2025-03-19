import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function NavBar() {
    const navigate = useNavigate()
    return <div className="w-full flex justify-between items-center p-4 fixed top-0 left-0 bg-gray-300  text-white">
        <div className="text-2xl text-black font-bold">MindfulMe</div>
        <div className="flex space-x-4">
            <Button onClick={() => {
                navigate("/login")
            }} className="cursor-pointer" variant={"secondary"}>Login</Button>
            <Button onClick={() => {
                navigate("/register")
            }} className="cursor-pointer" variant={"secondary"}>Register</Button>
        </div>
    </div>
}