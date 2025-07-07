'use client'
import React, { useState, useRef, useEffect, KeyboardEvent, MouseEvent, ChangeEvent } from 'react';
import { Send, Bot, Users, Plus, Image, X, ArrowLeft, Sparkles, CheckSquare } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useSocketStore } from '../../../../zustand/socketStore';
import { useUserStore } from '../../../../zustand/userStore';

type UploadedImage = {
  file: File;
  url: string;
  name: string;
};
type AiMessage = {
  id: number;
  text?: string;
  image?: UploadedImage | null;
  timestamp: string;
  isUser: boolean;
};
type AiChat = {
  id: number;
  name: string;
  messages: AiMessage[];
};
type TeamMessage = {
  id: number;
  user: string;
  initials: string;
  text?: string;
  image?: UploadedImage | null;
  timestamp: string;
  isCurrentUser: boolean;
  messageType?: 'normal' | 'ai' | 'task';
};
type TeamMember = {
  name: string;
  initials: string;
  color: string;
  online: boolean;
};

type ChatMode = 'normal' | 'ai' | 'task';

const ChatInterface: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [projectName] = useState<string>(()=>{
    if(id == '1'){
      return "Phoenix Development"
    }
    else {
      return "Drone Dev"
    }
  
  });
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(50);
  const { ws } = useSocketStore()
  const { userId } = useUserStore();
  const [aiChats, setAiChats] = useState<AiChat[]>([
    {
      id: 1,
      name: "Chat 1",
      messages: [
        {
          id: 1,
          text: "Hello! I'm your AI assistant. How can I help you today?",
          timestamp: "21:53",
          isUser: false,
        },
      ],
    },
  ]);

  useEffect(() => {
    if (!ws) return;

    ws.on('userJoined', (msg) => {
      console.log(msg);
    });

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formatted = `${hours}:${minutes}`;

    ws.on('newMessage', (data: { sender: string; message: string; senderName: string }) => {

      if (data.sender !== userId) {
        setTeamMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            user: data.senderName,
            initials: data.sender.slice(0, 2).toUpperCase(),
            text: data.message,
            timestamp: formatted,
            isCurrentUser: false,
            messageType: 'normal',
          },
        ]);
      }
    });

    if (userId) {
      ws.emit('joinRoom', {
        room: projectName.split(' ').join('_'),
        userId: userId,
      });
    }

    return () => {
      ws.off('userJoined');
      ws.off('newMessage');
    };
  }, [ws, userId]);

  const [currentAiChatId, setCurrentAiChatId] = useState<number>(1);
  const [teamMessages, setTeamMessages] = useState<TeamMessage[]>([
    {
      id: 1,
      user: "Alex Johnson",
      initials: "AJ",
      text: "Hey everyone! How's the project going?",
      timestamp: "21:48",
      isCurrentUser: false,
      messageType: 'normal',
    },
    {
      id: 2,
      user: "Irene Brooks",
      initials: "IB",
      text: "Making great progress! Just finished the design mockups.",
      timestamp: "21:49",
      isCurrentUser: false,
      messageType: 'normal',
    },
    {
      id: 3,
      user: "David Kim",
      initials: "DK",
      text: "Awesome! Can't wait to review them.",
      timestamp: "21:50",
      isCurrentUser: false,
      messageType: 'normal',
    },
  ]);
  const [aiInput, setAiInput] = useState<string>("");
  const [teamInput, setTeamInput] = useState<string>("");
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [aiUploadedImage, setAiUploadedImage] = useState<UploadedImage | null>(null);
  const [teamUploadedImage, setTeamUploadedImage] = useState<UploadedImage | null>(null);
  const [chatMode, setChatMode] = useState<ChatMode>('normal');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const aiFileInputRef = useRef<HTMLInputElement | null>(null);
  const teamFileInputRef = useRef<HTMLInputElement | null>(null);

  const teamMembers: TeamMember[] = [
    { name: "Irene", initials: "IB", color: "bg-purple-500", online: true },
    { name: "Alex", initials: "AJ", color: "bg-blue-500", online: true },
    { name: "Maria", initials: "MG", color: "bg-pink-500", online: true },
    { name: "David", initials: "DK", color: "bg-green-500", online: false },
  ];

  const getCurrentAiMessages = (): AiMessage[] => {
    const currentChat = aiChats.find((chat) => chat.id === currentAiChatId);
    return currentChat ? currentChat.messages : [];
  };

  const addNewAiChat = (): void => {
    const newChatId = aiChats.length > 0 ? Math.max(...aiChats.map((chat) => chat.id)) + 1 : 1;
    const newChat: AiChat = {
      id: newChatId,
      name: `Chat ${newChatId}`,
      messages: [
        {
          id: 1,
          text: "Hello! I'm your AI assistant. How can I help you today?",
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          }),
          isUser: false,
        },
      ],
    };
    setAiChats([...aiChats, newChat]);
    setCurrentAiChatId(newChatId);
  };

  const handleImageUpload = (file: File, isAiChat: boolean): void => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const imageData: UploadedImage = {
          file: file,
          url: e.target?.result as string,
          name: file.name,
        };
        if (isAiChat) {
          setAiUploadedImage(imageData);
        } else {
          setTeamUploadedImage(imageData);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeUploadedImage = (isAiChat: boolean): void => {
    if (isAiChat) {
      setAiUploadedImage(null);
    } else {
      setTeamUploadedImage(null);
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>): void => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent | globalThis.MouseEvent): void => {
    if (!isResizing || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    if (newWidth >= 20 && newWidth <= 80) {
      setLeftPanelWidth(newWidth);
    }
  };

  const handleMouseUp = (): void => {
    setIsResizing(false);
  };

  useEffect(() => {
    const mouseMoveHandler = (e: globalThis.MouseEvent) => handleMouseMove(e);
    const mouseUpHandler = () => handleMouseUp();
    if (isResizing) {
      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    return () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  const sendAiMessage = (): void => {
    if (aiInput.trim() || aiUploadedImage) {
      const currentMessages = getCurrentAiMessages();
      const newMessage: AiMessage = {
        id: currentMessages.length + 1,
        text: aiInput,
        image: aiUploadedImage,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
        isUser: true,
      };
      const updatedChats = aiChats.map((chat) => {
        if (chat.id === currentAiChatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
          };
        }
        return chat;
      });
      setAiChats(updatedChats);
      setAiInput("");
      setAiUploadedImage(null);
      // Simulate AI response
      setTimeout(() => {
        const aiResponse: AiMessage = {
          id: currentMessages.length + 2,
          text: aiUploadedImage
            ? "I can see the image you've shared. How can I help you with it?"
            : "I understand your request. Let me help you with that!",
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          }),
          isUser: false,
        };
        setAiChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat.id === currentAiChatId) {
              return {
                ...chat,
                messages: [...chat.messages, aiResponse],
              };
            }
            return chat;
          })
        );
      }, 1000);
    }
  };

  const sendTeamMessage = (): void => {
    if (teamInput.trim() || teamUploadedImage) {
      const timestamp = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });

      // Send message via socket
      if (ws && userId && chatMode=="normal") {
        ws.emit('sendMessage', {
          sender: userId,
          message: teamInput,
          room: projectName.split(' ').join('_'),
          timestamp: new Date().toISOString()
        });
      }

      if (chatMode === 'ai') {
        // Send to AI chat
        const currentMessages = getCurrentAiMessages();
        const newAiMessage: AiMessage = {
          id: currentMessages.length + 1,
          text: teamInput,
          image: teamUploadedImage,
          timestamp: timestamp,
          isUser: true,
        };
        const updatedChats = aiChats.map((chat) => {
          if (chat.id === currentAiChatId) {
            return {
              ...chat,
              messages: [...chat.messages, newAiMessage],
            };
          }
          return chat;
        });
        setAiChats(updatedChats);

        // Also add to team chat with AI indicator
        const teamMessage: TeamMessage = {
          id: teamMessages.length + 1,
          user: "You",
          initials: "YU",
          text: teamInput,
          image: teamUploadedImage,
          timestamp: timestamp,
          isCurrentUser: true,
          messageType: 'ai',
        };
        setTeamMessages([...teamMessages, teamMessage]);

        // Simulate AI response
        setTimeout(() => {
          const aiResponse: AiMessage = {
            id: currentMessages.length + 2,
            text: "I've analyzed your request and here's my response.",
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            }),
            isUser: false,
          };
          setAiChats((prevChats) =>
            prevChats.map((chat) => {
              if (chat.id === currentAiChatId) {
                return {
                  ...chat,
                  messages: [...chat.messages, aiResponse],
                };
              }
              return chat;
            })
          );
        }, 1000);
      } else if (chatMode === 'task') {
        // Send as task (would normally call API here)
        const taskMessage: TeamMessage = {
          id: teamMessages.length + 1,
          user: "You",
          initials: "YU",
          text: teamInput,
          image: teamUploadedImage,
          timestamp: timestamp,
          isCurrentUser: true,
          messageType: 'task',
        };
        setTeamMessages([...teamMessages, taskMessage]);

        // Simulate API call
        console.log('Task API call:', {
          text: teamInput,
          image: teamUploadedImage,
          timestamp: timestamp,
        });
      } else {
        // Normal message
        const newMessage: TeamMessage = {
          id: teamMessages.length + 1,
          user: "You",
          initials: "YU",
          text: teamInput,
          image: teamUploadedImage,
          timestamp: timestamp,
          isCurrentUser: true,
          messageType: 'normal',
        };
        setTeamMessages([...teamMessages, newMessage]);
      }

      setTeamInput("");
      setTeamUploadedImage(null);
      setChatMode('normal'); // Reset to normal mode after sending
    }
  };

  const handleKeyPress = (
    e: KeyboardEvent<HTMLInputElement>,
    sendFunction: () => void
  ): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendFunction();
    }
  };

  const goBack = (): void => {
    router.push('/main');
  };

  const getPlaceholder = (): string => {
    switch (chatMode) {
      case 'ai':
        return 'Ask AI assistant...';
      case 'task':
        return 'Create a task...';
      default:
        return 'Type a message...';
    }
  };

  const getMessageBackgroundColor = (message: TeamMessage): string => {
    if (!message.isCurrentUser) {
      return 'bg-gray-200 text-gray-900';
    }
    
    switch (message.messageType) {
      case 'ai':
        return 'bg-blue-500 text-white';
      case 'task':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-green-500 text-white';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      {/* Top Navigation Bar */}
      <div className="bg-white border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={goBack}
              className="flex cursor-pointer items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-xl font-semibold text-gray-900">{projectName}</h1>
          </div>
          <div className="text-sm text-gray-500">
            Collaborative Workspace
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div 
        ref={containerRef}
        className="flex flex-1 overflow-hidden"
      >
        {/* AI Assistant Panel */}
        <div 
          className="bg-white flex flex-col shadow-lg"
          style={{ width: `${leftPanelWidth}%` }}
        >
          {/* AI Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">AI Assistant</h2>
                <p className="text-sm text-gray-500">Helping with {projectName}</p>
              </div>
            </div>
          </div>

          {/* Chat Tabs */}
          {/* <div className="border-b border-gray-100">
            <div className="flex items-center">
              {aiChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setCurrentAiChatId(chat.id)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    currentAiChatId === chat.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {chat.name}
                </button>
              ))}
              <button
                onClick={addNewAiChat}
                className="p-2 ml-2 hover:bg-gray-100 rounded transition-colors"
                title="Add new chat"
              >
                <Plus className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div> */}

          {/* AI Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {getCurrentAiMessages().map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.isUser
                      ? 'bg-blue-500 text-white rounded-br-md'
                      : 'bg-gray-200 text-gray-900 rounded-bl-md'
                  }`}
                >
                  {message.image && (
                    <div className="mb-2">
                      <img
                        src={message.image.url}
                        alt={message.image.name}
                        className="max-w-full h-auto rounded-lg"
                        style={{ maxHeight: '200px' }}
                      />
                    </div>
                  )}
                  {message.text && <p className="text-sm">{message.text}</p>}
                  <p className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resizer */}
        <div
          className="w-1 bg-gray-300 cursor-col-resize hover:bg-gray-400 transition-colors"
          onMouseDown={handleMouseDown}
        />

        {/* Team Chat Panel */}
        <div 
          className="bg-white flex flex-col shadow-lg"
          style={{ width: `${100 - leftPanelWidth}%` }}
        >
          {/* Team Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Team Chat</h2>
                <p className="text-sm text-gray-500">{projectName} • 3 online</p>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              {teamMembers.map((member, index) => (
                <div key={index} className="relative">
                  <div className={`w-8 h-8 ${member.color} rounded-full flex items-center justify-center text-white font-medium text-sm`}>
                    {member.initials}
                  </div>
                  {member.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
              {teamMembers.map((member, index) => (
                <span key={index}>{member.name}</span>
              ))}
            </div>
          </div>

          {/* Team Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {teamMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isCurrentUser && (
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {message.user[0]}
                    </div>
                  </div>
                )}
                <div className={`max-w-xs lg:max-w-md ${message.isCurrentUser ? 'text-right' : ''}`}>
                  {!message.isCurrentUser && (
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{message.user}</span>
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                    </div>
                  )}
                  <div className="relative">
                    {message.messageType && message.messageType !== 'normal' && message.isCurrentUser && (
                      <div className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                        message.messageType === 'ai' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                      }`}>
                        {message.messageType === 'ai' ? 'AI' : 'Task'}
                      </div>
                    )}
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        message.isCurrentUser
                          ? `${getMessageBackgroundColor(message)} rounded-br-md`
                          : 'bg-gray-200 text-gray-900 rounded-bl-md'
                      }`}
                    >
                      {message.image && (
                        <div className="mb-2">
                          <img
                            src={message.image.url}
                            alt={message.image.name}
                            className="max-w-full h-auto rounded-lg"
                            style={{ maxHeight: '200px' }}
                          />
                        </div>
                      )}
                      {message.text && <p className="text-sm">{message.text}</p>}
                      {message.isCurrentUser && (
                        <p className={`text-xs mt-1 ${
                          message.messageType === 'ai' ? 'text-blue-100' : 
                          message.messageType === 'task' ? 'text-purple-100' : 
                          'text-green-100'
                        }`}>
                          {message.timestamp}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Team Input */}
          <div className="p-4 border-t border-gray-200">
            {/* Image Preview */}
            {teamUploadedImage && (
              <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={teamUploadedImage.url}
                      alt={teamUploadedImage.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <span className="text-sm text-gray-600">{teamUploadedImage.name}</span>
                  </div>
                  <button
                    onClick={() => removeUploadedImage(false)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => teamFileInputRef.current?.click()}
                className="p-2 cursor-pointer text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                title="Upload image"
              >
                <Image className="w-5 h-5" />
              </button>
              <input
                ref={teamFileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, false);
                }}
                className="hidden"
              />
              
              {/* AI Button */}
              <button
                onClick={() => setChatMode(chatMode === 'ai' ? 'normal' : 'ai')}
                className={`p-2 cursor-pointer rounded-lg transition-colors ${
                  chatMode === 'ai' 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                title="Send to AI"
              >
                <Sparkles className="w-5 h-5" />
              </button>
              
              {/* Task Button */}
              <button
                onClick={() => setChatMode(chatMode === 'task' ? 'normal' : 'task')}
                className={`p-2 cursor-pointer rounded-lg transition-colors ${
                  chatMode === 'task' 
                    ? 'bg-purple-500 text-white hover:bg-purple-600' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                title="Create task"
              >
                <CheckSquare className="w-5 h-5" />
              </button>
              
              <input
                type="text"
                value={teamInput}
                onChange={(e) => setTeamInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, sendTeamMessage)}
                placeholder={getPlaceholder()}
                className={`cursor-pointer flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                  chatMode === 'ai' 
                    ? 'border-blue-300 focus:ring-blue-500' 
                    : chatMode === 'task'
                    ? 'border-purple-300 focus:ring-purple-500'
                    : 'border-gray-300 focus:ring-green-500'
                }`}
              />
              <button
                onClick={sendTeamMessage}
                className={`cursor-pointer p-2.5 text-white rounded-lg transition-colors ${
                  chatMode === 'ai'
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : chatMode === 'task'
                    ? 'bg-purple-500 hover:bg-purple-600'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                <Send className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;