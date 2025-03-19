import MoodEnergyCharts from "@/components/graph";
import NavBar from "@/components/navBar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate()
    return <div className="h-screen w-full flex justify-center items-center">
        <NavBar />
        <MoodEnergyCharts />
        <Button onClick={() => {
            navigate("/chat")
        }} className="fixed bottom-3 right-3  " size={"lg"}>Chat with AI</Button>
    </div>
}