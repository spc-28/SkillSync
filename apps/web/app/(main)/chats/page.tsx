'use client'
import React, { useEffect } from 'react';
import { useChatStore } from '../../../zustand/chatStore';


const ChatInterface: React.FC = () => {

  const { selectedUser, messages, chatEndRef } = useChatStore();
 
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedUser]);


  return (
    <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a member to start chatting</h3>
            <p className="text-gray-500">Choose someone to begin the conversation</p>
          </div>
        </div>
    </div>
  );
};

export default ChatInterface;