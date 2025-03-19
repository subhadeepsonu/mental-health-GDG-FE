import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import axios from "axios";
import { BASEURL } from "@/utils/constant";
import { useState, useRef, useEffect } from "react";

export default function ChatInput() {
    const [message, setMessage] = useState("");
    const queryClient = useQueryClient();
    const inputRef = useRef<HTMLInputElement>(null);  // Create a ref for input
    const containerRef = useRef<HTMLDivElement>(null); // Create a ref for scrolling

    const mutateChat = useMutation({
        mutationFn: async () => {
            const response = await axios.post(
                `${BASEURL}/chat`,
                { message },
                {
                    headers: { Authorization: ` ${localStorage.getItem("token")}` }
                }
            );
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["message"] });
            setMessage(""); // Clear input after sending

            // Auto-scroll down after sending a message
            setTimeout(() => {
                containerRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    });

    // Auto-focus input field on render
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div className="w-full flex fixed bottom-1 right-0 rounded-2xl justify-between items-center p-4 bg-gray-200" ref={containerRef}>
            <Input
                type="text"
                ref={inputRef} // Attach ref to input field
                className="w-full p-2"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <Button
                disabled={mutateChat.isPending || message.trim() === ""}
                onClick={(e) => {
                    e.preventDefault();
                    mutateChat.mutate();
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                {mutateChat.isPending ? "Sending..." : "Send"}
            </Button>
        </div>
    );
}
