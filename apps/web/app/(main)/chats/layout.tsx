'use client'
import { useEffect, useState } from "react";
import type { MessagesMap, Message } from "../../../types/chatTypes";
import axios from "axios";
import ChatUsers from "../../../components/ChatUsers";
import { useUserStore } from "../../../zustand/userStore";
import { useChatStore } from "../../../zustand/chatStore";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const { userId } = useUserStore();
    const { setMessages } = useChatStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        axios.get(`${process.env.NEXT_PUBLIC_DEV_API_URL}/chat/${userId}`)
            .then(res => {
                const messagesMap: MessagesMap = {};
                res.data.forEach((chat: any) => {
                    const otherUserId: string = chat.senderId === userId ? chat.receiverId : chat.senderId;
                    if (!messagesMap[otherUserId]) messagesMap[otherUserId] = [];
                    const msg: Message = {
                        id: chat.id,
                        text: chat.message,
                        sender: chat.senderId === userId ? 'me' : chat.senderId,
                        timestamp: new Date(chat.timeStamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        type: 'text',
                    };
                    messagesMap[otherUserId].push(msg);
                });
                setMessages(messagesMap);
            })
            .catch(err => {
                setError('Failed to load chats');
            })
            .finally(() => setLoading(false));
    },[]);

    return (
        <div className="flex flex-col bg-gray-50 mt-16">
            {loading && <div className="text-center py-2 text-indigo-600">Loading chats...</div>}
            {error && <div className="text-center py-2 text-red-500">{error}</div>}
            <div className='flex h-[calc(100vh-4rem)]'>
                <ChatUsers/>
                {children}
            </div>
        </div>
    );
}
