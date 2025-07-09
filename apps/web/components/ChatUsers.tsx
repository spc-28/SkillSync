'use client'
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useChatStore } from "../zustand/chatStore";
import type { User as StoreUser } from "../types/chatTypes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


type ApiUser = {
    fullName: string;
    uid: string;
};


export default function ChatUsers() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const { selectedUser, setSelectedUser, messages, chatEndRef, users, setUsers } = useChatStore();
    const router = useRouter();

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, selectedUser]);

    return (
        <div className="w-[26rem] bg-white border-r border-gray-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search team members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-y-auto">
                {filteredUsers.map(user => (
                    <div
                        key={user.id}
                        onClick={() =>{ 
                            setSelectedUser(user);
                            router.push(`/chats/${user.id}`)
                        }}
                        className={`p-4 border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedUser && selectedUser.id === user.id ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : ''}`}
                    >
                        <div className="flex items-center space-x-3 py-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                {user.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}