import ChatUsers from "../../../components/ChatUsers";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col bg-gray-50 mt-16">
            <div className='flex h-[calc(100vh-4rem)]'>
                <ChatUsers/>
                {children}
            </div>
        </div>
    );
}
