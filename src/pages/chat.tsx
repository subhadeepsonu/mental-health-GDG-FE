import ChatInput from "@/components/cards/ChatBotInput";
import ChatMessage from "@/components/cards/MessageCard";
import NavBar from "@/components/navBar";
import { BASEURL } from "@/utils/constant";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
type ChatMessage = {
    id: string;
    userId: string;
    fromUser: boolean;
    message: string;
    createdAt: string;
};
export default function Chat() {
    const QUeryMessage = useQuery({
        queryKey: ["message"],
        queryFn: async () => {
            const response = await axios.get(`${BASEURL}/chat`, {
                headers: {
                    Authorization: ` ${localStorage.getItem("token")}`
                }
            })
            return response.data
        }
    })
    if (QUeryMessage.isLoading) {
        return <div>Loading...</div>
    }
    if (QUeryMessage.isError) {
        return <div>Error...</div>
    }
    return <div className="min-h-screen w-full flex flex-col px-2 py-20 overflow-auto">
        <NavBar />
        {QUeryMessage.data.data.map((message: any) => {
            return <ChatMessage fromUser={message.fromUser} id={message.id} message={message.message} userId={message.userId} />
        })}
        <ChatInput />
    </div>
}