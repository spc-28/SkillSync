'use client'
import { useEffect } from "react";
import { AuthGuard } from "../../components/AuthGuard";
import Header from "../../components/Header";
import { io } from "socket.io-client";
import { useSocketStore } from "../../zustand/socketStore";
import { useUserStore } from "../../zustand/userStore";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    
    const { userId } = useUserStore();
    const { setWs } = useSocketStore();

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

    return (
        <>
            <AuthGuard>
                <Header />
                {children}
            </AuthGuard>
        </>
    );
}
