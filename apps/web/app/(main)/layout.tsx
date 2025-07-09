'use client'
import { useEffect } from "react";
import { AuthGuard } from "../../components/AuthGuard";
import Header from "../../components/Header";
import { io } from "socket.io-client";
import { useSocketStore } from "../../zustand/socketStore";
import { useUserStore } from "../../zustand/userStore";
import { useChatStore } from "../../zustand/chatStore";
import { toast } from "sonner";
import { User as StoreUser } from "../../types/chatTypes";
import axios from "axios";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    
    const { userId } = useUserStore();
    const { setWs } = useSocketStore();

const { setUsers } = useChatStore()

    useEffect(() => {
        const socket = io("http://localhost:8001", {
            query: {
                userId
            }
        });
        setWs(socket);

        // return () => {
        //     socket.disconnect();
        //     setWs(null);
        // };
    }, [userId]);

        useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_DEV_API_URL}/chat/users`);

                const mappedUsers: StoreUser[] = response.data.map((u: any) => ({
                    id: u.uid,
                    name: u.fullName,
                }));
                setUsers(mappedUsers);
            } catch (error) {
                toast.error("Failed opening message")
            }
        };
        fetchUsers();
    }, []);

    return (
        <>
            <AuthGuard>
                <Header />
                {children}
            </AuthGuard>
        </>
    );
}
