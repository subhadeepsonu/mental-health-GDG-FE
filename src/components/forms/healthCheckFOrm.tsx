import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BASEURL } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

enum Mood {
    HAPPY = "HAPPY",
    SAD = "SAD",
    ANXIOUS = "ANXIOUS",
    NEUTRAL = "NEUTRAL",
}

enum EnergyLevel {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
}

export const dailyCheckinQuestions = [
    {
        id: 1,
        question: "How are you feeling today?",
        type: "scale",
    },
    {
        id: 2,
        question: "Did you sleep well last night?",
        type: "boolean",
    },
    {
        id: 3,
        question: "What is one thing you're looking forward to today?",
        type: "text",
    },
    {
        id: 4,
        question: "Do you feel prepared for the tasks ahead?",
        type: "boolean",
    },
    {
        id: 5,
        question: "Is there anything on your mind you'd like to share?",
        type: "text",
    },
    {
        id: 6,
        question: "What is your current mood?",
        type: "enum",
        options: Object.values(Mood),
    },
    {
        id: 7,
        question: "What is your current energy level?",
        type: "enum",
        options: Object.values(EnergyLevel),
    },
];
// Generate Zod Schema dynamically
const formSchema = z.object({
    q1: z.string().nonempty("This field is required"),
    q2: z.boolean().default(false),
    q3: z.string().nonempty("This field is required"),
    q4: z.boolean().default(false),
    q5: z.string().optional(),
    q6: z.nativeEnum(Mood),
    q7: z.nativeEnum(EnergyLevel),
});

export default function HealthCheckForm() {
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const MutateCheckIN = useMutation({
        mutationFn: async () => {
            const resp = await axios.post(`${BASEURL}/checkin`, {
                ...getValues()
            }, {
                headers: {
                    Authorization: ` ${localStorage.getItem("token")}`
                }
            })
            return resp.data
        }, onSettled(data) {
            if (data.success) {
                toast.success("Checkin submitted successfully")
                navigate("/chat")
            } else {
                toast.error("Something went wrong")
            }
        }
    })
    const onSubmit = (data: z.infer<typeof formSchema>) => {
        MutateCheckIN.mutate()
        console.log(data);
    };

    return (
        <div className="h-screen w-full flex justify-center items-center bg-gray-100">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Daily Health Check</h2>

                {dailyCheckinQuestions.map((q, index) => (
                    <div key={q.id} className="mb-3">
                        <label className="block text-gray-700">{q.question}</label>
                        {q.type === "text" && (
                            <input
                                {...register(`q${index + 1}` as keyof z.infer<typeof formSchema>)}
                                className="w-full border p-2 rounded"
                                placeholder="Type your answer..."
                            />
                        )}

                        {q.type === "boolean" && (
                            <div className="flex gap-3 items-center">
                                <Input type="checkbox" {...register(`q${index + 1}` as keyof z.infer<typeof formSchema>)} className="w-4 h-4 " />
                                <span>Yes</span>
                            </div>
                        )}

                        {q.type === "scale" && (
                            <input
                                type="range"
                                min="1"
                                max="10"

                                {...register(`q${index + 1}` as keyof z.infer<typeof formSchema>)}
                                className="w-full"
                            />
                        )}

                        {q.type === "enum" && q.options && (
                            <select {...register(`q${index + 1}` as keyof z.infer<typeof formSchema>)} className="w-full border p-2 rounded">
                                {q.options.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        )}

                        {errors[`q${index + 1}` as keyof z.infer<typeof formSchema>] && (
                            <p className="text-red-500 text-sm">{errors[`q${index + 1}` as keyof z.infer<typeof formSchema>]?.message}</p>
                        )}
                    </div>
                ))}

                <Button disabled={MutateCheckIN.isPending} type="submit" className="w-full">
                    Submit Check-In
                </Button>
            </form>
        </div>
    );
}
