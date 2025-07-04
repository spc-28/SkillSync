'use client'
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../zustand/chatStore";
import { useRouter } from "next/navigation";

type User = {
    id: string;
    name: string;
    role: string;
    avatar: string;
    status: string;
    lastSeen: string;
};

export default function ChatUsers() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const { selectedUser, setSelectedUser, messages, setMessages, chatEndRef } = useChatStore();

    const router = useRouter();

    const users: User[] = [
        { id: 'sarah', name: 'Sarah Chen', role: 'Project Lead', avatar: '👩‍💻', status: 'online', lastSeen: 'now' },
        { id: 'alex', name: 'Alex Rodriguez', role: 'Full Stack Developer', avatar: '👨‍💻', status: 'online', lastSeen: 'now' },
        { id: 'emily', name: 'Emily Johnson', role: 'UI/UX Designer', avatar: '👩‍🎨', status: 'away', lastSeen: '5 min ago' },
        { id: 'david', name: 'David Kim', role: 'ML Engineer', avatar: '👨‍🔬', status: 'online', lastSeen: 'now' },
        { id: 'lisa', name: 'Lisa Wang', role: 'Data Scientist', avatar: '👩‍🔬', status: 'offline', lastSeen: '2 hours ago' },
        { id: 'mike', name: 'Mike Thompson', role: 'DevOps Engineer', avatar: '👨‍🔧', status: 'away', lastSeen: '15 min ago' },
        { id: 'anna', name: 'Anna Petrov', role: 'QA Tester', avatar: '👩‍💼', status: 'online', lastSeen: 'now' },
        { id: 'james', name: 'James Wilson', role: 'Backend Developer', avatar: '👨‍💻', status: 'offline', lastSeen: '1 hour ago' }
        
    ];

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, selectedUser]);

    return (
        <div className="w-[26rem] bg-white border-r border-gray-200 flex flex-col">
            {/* Header */}
            {/* <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <h2 className="text-xl font-bold mb-2">Team Chat</h2>
          <p className="text-sm text-indigo-100">500+ Active Members</p>
        </div> */}

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
                        className={`p-4 border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedUser && selectedUser.id === user.id ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : ''
                            }`}
                    >
                        <div className="flex items-center space-x-3 py-2">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                    {user.avatar}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                                    {user.status === 'online' && (
                                        <span className="text-xs text-green-600 font-medium">Online</span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400">{user.lastSeen}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}