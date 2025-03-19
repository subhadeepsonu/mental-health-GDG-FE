import HealthCheckForm from "@/components/forms/healthCheckFOrm";
import NavBar from "@/components/navBar";

export default function Form() {
    return <div className="h-screen flex justify-center items-center w-full pt-20">
        <NavBar />
        <HealthCheckForm />
    </div>
}