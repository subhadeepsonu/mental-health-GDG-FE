

type ChatMessageProps = {
    id: string;
    userId: string;
    fromUser: boolean;
    message: string;
};

export default function ChatMessage(props: ChatMessageProps) {
    return (
        <div className={`flex ${props.fromUser ? "justify-end" : "justify-start"} mb-2`}>
            <div
                className={`max-w-xs px-4 py-2 rounded-lg shadow-md text-white ${props.fromUser ? "bg-blue-500" : "bg-gray-500"
                    }`}
            >
                <p className="text-sm">{props.message}</p>

            </div>
        </div>
    );
};


