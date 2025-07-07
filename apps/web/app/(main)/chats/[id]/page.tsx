'use client'
import type { Message, MessagesMap } from '../../../../types/chatTypes';
import { useChatStore } from "../../../../zustand/chatStore";
import { useEffect, useRef, useState } from "react";
import { ImageIcon, Send } from "lucide-react";
import { useImageChatStore } from "../../../../zustand/imageChatStore";
import { useParams } from 'next/navigation';
import { useSocketStore } from '../../../../zustand/socketStore';
import { useUserStore } from '../../../../zustand/userStore';

export default function Page() {
    const { id } = useParams();
    const [message, setMessage] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { imagePreview, setImagePreview, imageFile, setImageFile } = useImageChatStore();
    const { selectedUser, messages, chatEndRef, setMessages } = useChatStore();
    const { ws } = useSocketStore();
    const { userId } = useUserStore();

    useEffect(() => {
        if (!ws) return;
        const handler = (msg: { from: string; message: string; timeStamp?: { _seconds: number; _nanoseconds: number } }) => {
            if (!selectedUser || msg.from !== selectedUser.id) return;
            const response: Message = {
                id: Date.now() + 1,
                text: msg.message,
                sender: msg.from,
                timestamp: msg.timeStamp && msg.timeStamp._seconds
                    ? new Date(msg.timeStamp._seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'text',
            };
            setMessages((prev: MessagesMap) => {
                const updated = {
                    ...prev,
                    [selectedUser.id]: [
                        ...((prev[selectedUser.id] as Message[] ?? [])),
                        response
                    ]
                };
                // Sort messages by timeStamp if available
                const arr = updated[selectedUser.id];
                if (Array.isArray(arr)) {
                    updated[selectedUser.id] = arr.slice().sort((a, b) => {
                        const aSec = (a as any).timeStamp?._seconds || 0;
                        const bSec = (b as any).timeStamp?._seconds || 0;
                        return aSec - bSec;
                    });
                }
                return updated;
            });
        };
        ws.on('receive_chat', handler);
        return () => {
            ws.off('receive_chat', handler);
        };
    }, [ws, selectedUser, setMessages]);

    const currentMessages: Message[] = selectedUser?.id == id ? messages[id!] || [] : [];

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const sendChatMessage = (content: string) => {
        if (!ws || !selectedUser) return;
        ws.emit('chat', {
            senderId: userId,
            receiverId: selectedUser.id,
            message: content,
        });
    };

    const handleSendMessage = () => {
        if (!selectedUser) return;

        if (imageFile && imagePreview) {
            const imageMessage: Message = {
                id: Date.now(),
                text: imagePreview,
                sender: 'me',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'image',
                fileName: imageFile.name,
            };
            setMessages((prev: MessagesMap) => ({
                ...prev,
                [selectedUser.id]: [
                    ...((prev[selectedUser.id] as Message[] ?? [])),
                    imageMessage
                ],
            }));
            setImagePreview(null);
            setImageFile(null);
            // Optionally, you can emit image messages here if supported
            return;
        }
        // Otherwise, send text message
        if (!message.trim()) return;
        const newMessage: Message = {
            id: Date.now(),
            text: message,
            sender: 'me',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'text',
        };
        setMessages((prev: MessagesMap) => ({
            ...prev,
            [selectedUser.id]: [
                ...((prev[selectedUser.id] as Message[] ?? [])),
                newMessage
            ]
        }));
        sendChatMessage(message);
        setMessage('');
    };
    return (
        <div className='flex-1 flex flex-col'>
            {/* Chat Header */}
            <div className="p-4 border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                {selectedUser?.name[0]}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{selectedUser?.name}</h3>

                        </div>
                    </div>
                    {/* <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Video className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div> */}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {currentMessages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                        <div className="text-6xl mb-4">💬</div>
                        <h3 className="text-lg font-semibold text-gray-700">Start a conversation with {selectedUser?.name}</h3>
                        <p className="text-sm text-gray-500 mt-2">Send a message to begin collaborating on your project</p>
                    </div>
                ) : (
                    currentMessages.map((msg: Message) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender === 'me'
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                                    : 'bg-white text-gray-800 border border-gray-200'
                                    }`}
                            >
                                {msg.type === 'image' ? (
                                    <div className="flex flex-col items-start space-y-1">
                                        <ImageIcon className="w-4 h-4 mb-1" />
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={msg.text} alt={msg.fileName || 'Image'} className="rounded-lg max-w-[220px] max-h-[180px] border border-gray-200" />
                                        {msg.fileName && <span className="text-xs text-gray-400 mt-1">{msg.fileName}</span>}
                                    </div>
                                ) : (
                                    <p className="text-sm">{msg.text}</p>
                                )}
                                <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-indigo-100' : 'text-gray-400'}`}>
                                    {msg.timestamp}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
                {/* Image Preview */}
                {imagePreview && (
                    <div className="mb-3 flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imagePreview} alt="Preview" className="rounded-lg max-w-[120px] max-h-[90px] border border-gray-200" />
                        <button
                            onClick={() => { setImagePreview(null); setImageFile(null); }}
                            className="text-xs text-red-500 hover:underline ml-2"
                        >
                            Remove
                        </button>
                    </div>
                )}
                <div className="flex items-center space-x-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ImageIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder={`Message ${selectedUser?.name || ''}...`}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        disabled={!!imagePreview}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={(!message.trim() && !imagePreview) || !selectedUser}
                        className="p-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}