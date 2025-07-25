'use client'
import React, { useState, useRef, useEffect, KeyboardEvent, MouseEvent, ChangeEvent } from 'react';
import { Send, Bot, Users, Plus, Image, X, ArrowLeft, Sparkles, CheckSquare } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useSocketStore } from '../../../../zustand/socketStore';
import { useUserStore } from '../../../../zustand/userStore';
import { toast } from 'sonner';
import MarkdownRenderer from '../../../../utils/markdownRender';

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
  id?: string;
};

type ChatMode = 'normal' | 'ai' | 'task';

// API Response Types
type ApiTeamMember = {
  id: string;
  fullName: string;
};

type ApiProject = {
  id: string;
  title: string;
  status: string;
  teamMembers: ApiTeamMember[];
};

type ApiChat = {
  id: string;
  sender: string;
  room: string;
  message: string;
  timestamp: string;
};

type ApiResponse = {
  project: ApiProject;
  chats: ApiChat[];
};

const ChatInterface: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const { ws } = useSocketStore();
  const { userId } = useUserStore();

  // State for API data
  const [projectName, setProjectName] = useState<string>('Loading...');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(50);
  const [aiChats, setAiChats] = useState<AiChat[]>([
    {
      id: 1,
      name: "Chat 1",
      messages: [
        {
          id: 1,
          text: "Hello! I'm your AI assistant. How can I help you today?",
          timestamp: "--:--",
          isUser: false,
        },
      ],
    },
  ]);

  const [currentAiChatId, setCurrentAiChatId] = useState<number>(1);
  const [teamMessages, setTeamMessages] = useState<TeamMessage[]>([]);
  const [aiInput, setAiInput] = useState<string>("");
  const [teamInput, setTeamInput] = useState<string>("");
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [aiUploadedImage, setAiUploadedImage] = useState<UploadedImage | null>(null);
  const [teamUploadedImage, setTeamUploadedImage] = useState<UploadedImage | null>(null);
  const [chatMode, setChatMode] = useState<ChatMode>('normal');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const aiFileInputRef = useRef<HTMLInputElement | null>(null);
  const teamFileInputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<string>()

  const generateInitials = (fullName: string): string => {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const generateColor = (index: number): string => {
    const colors = ['bg-purple-500', 'bg-blue-500', 'bg-pink-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'];
    return colors[index % colors.length] ?? 'bg-blue-500';
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fetch project data
  const fetchProjectData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Replace with your actual API endpoint
      const response = await axios.get<ApiResponse>(`${process.env.NEXT_PUBLIC_DEV_API_URL}/workspace/${id}`);
      const { project, chats } = response.data;

      // Set project name
      setProjectName(project.title);
      setStatus(project.status);

      // Map team members
      const mappedTeamMembers: TeamMember[] = project.teamMembers.map((member, index) => ({
        name: member.fullName.split(' ')[0] || '',
        initials: generateInitials(member.fullName),
        color: generateColor(index),
        online: true, // You might want to implement actual online status
        id: member.id,
      }));
      setTeamMembers(mappedTeamMembers);

      // Map chat messages
      const mappedMessages: TeamMessage[] = chats.map((chat, index) => {
        const isCurrentUser = chat.sender === userId;
        const senderMember = project.teamMembers.find(member => member.id === chat.sender);
        const senderName = isCurrentUser ? 'You' : (senderMember?.fullName || 'Unknown User');

        return {
          id: index + 1,
          user: senderName,
          initials: isCurrentUser ? 'YU' : generateInitials(senderMember?.fullName || 'Unknown'),
          text: chat.message,
          timestamp: formatTimestamp(chat.timestamp),
          isCurrentUser,
          messageType: 'normal' as const,
        };
      });
      setTeamMessages(mappedMessages);

    } catch (err) {
      console.error('Error fetching project data:', err);
      setError('Failed to load project data');
      // Fallback to default values
      setProjectName('Project');
      setTeamMembers([
        { name: "You", initials: "YU", color: "bg-blue-500", online: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (id) {
      fetchProjectData();
      // Fetch AI chat history
      (async () => {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_DEV_API_URL}/gemini/${id}`);
          const aiHistory = res.data;
          if (Array.isArray(aiHistory) && aiHistory.length > 0) {
            const aiMessages = aiHistory
              .filter((msg: any) => msg.projectId === id)
              .map((msg: any, idx: number) => ({
                id: idx + 1,
                text: msg.message,
                timestamp: formatTimestamp(msg.timestamp),
                isUser: idx % 2 === 0, // even index: user, odd: ai
              }));
            setAiChats([{ id: 1, name: "Chat 1", messages: aiMessages }]);

          }
        } catch (e) {
          toast.error("Failed getting ai responses")
        }
      })();
    }
  }, [id, userId]);

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
        room: id,
        userId: userId,
      });
    }

    return () => {
      ws.off('userJoined');
      ws.off('newMessage');
    };
  }, [ws, userId]);

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

  // sendAiMessage removed, logic will be placed inline in sendTeamMessage for chatMode 'ai'

  const sendTeamMessage = async (): Promise<void> => {
    if (teamInput.trim() || teamUploadedImage) {
      const timestamp = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });

      // Send message via socket
      if (ws && userId && chatMode === "normal") {
        ws.emit('sendMessage', {
          sender: userId,
          message: teamInput,
          room: id,
          timestamp: new Date().toISOString()
        });
      }

      if (chatMode === 'ai') {
        // Inline AI chat logic (formerly sendAiMessage)
        const currentMessages = getCurrentAiMessages();
        const newMessage: AiMessage = {
          id: currentMessages.length + 1,
          text: teamInput,
          image: teamUploadedImage,
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
        setTeamInput("");
        setTeamUploadedImage(null);

        setAiLoading(true);
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_DEV_API_URL}/gemini/stream`,
            {
              message: teamInput,
              projectId: id,
            }
          );
          const aiText = response.data?.message || "AI did not return a response.";
          const aiResponse: AiMessage = {
            id: currentMessages.length + 2,
            text: aiText,
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
        } catch (error) {
          const aiResponse: AiMessage = {
            id: currentMessages.length + 2,
            text: "Failed to get AI response.",
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
        }
        setAiLoading(false);
        setChatMode('normal'); // Reset to normal mode after sending
        return;
      } else if (chatMode === 'task') {
        (async () => {
          try {
            await axios.post(`${process.env.NEXT_PUBLIC_DEV_API_URL}/workspace/task`, {
              task: teamInput,
              timestamp: new Date().toISOString(),
              userId: userId,
              projectId: id
            });
            toast.success("Task created successfully");
          }
          catch (error: any) {
            console.error('Failed to create task:', error);
            toast.error('Failed to create task');
          }
        })();
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProjectData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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

          {/* AI Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {getCurrentAiMessages().map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.isUser
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
                  {message.text && (
                    <div className="text-sm max-h-fit overflow-auto custom-scrollbar">
                      <MarkdownRenderer markdown={message.text} />
                    </div>
                  )}

                  <style jsx global>{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    background: #e5e7eb;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #a3a3a3;
    border-radius: 4px;
  }
`}</style>
                  <p className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            {aiLoading && (
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-gray-200 text-gray-900 rounded-bl-md flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></span>
                  <span className="text-sm">AI is typing...</span>
                </div>
              </div>
            )}
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
                <p className="text-sm text-gray-500">{projectName}</p>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-10">
              {teamMembers.map((member, index) => (
                <div key={index} className="relative">
                  <div className={`w-8 h-8 ${member.color} rounded-full flex items-center justify-center text-white font-medium text-sm`}>
                    {member.initials}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-7 mt-2 text-xs text-gray-600">
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
                      <div className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-medium ${message.messageType === 'ai' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                        }`}>
                        {message.messageType === 'ai' ? 'AI' : 'Task'}
                      </div>
                    )}
                    <div
                      className={`px-4 py-2 rounded-2xl ${message.isCurrentUser
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
                        <p className={`text-xs mt-1 ${message.messageType === 'ai' ? 'text-blue-100' :
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

            {status == "ongoing" && <div className="flex items-center space-x-2">
              {/* <button
                onClick={() => teamFileInputRef.current?.click()}
                className="p-2 cursor-pointer text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                title="Upload image"
              >
                <Image className="w-5 h-5" />
              </button> */}
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
                className={`p-2 cursor-pointer rounded-lg transition-colors ${chatMode === 'ai'
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
                className={`p-2 cursor-pointer rounded-lg transition-colors ${chatMode === 'task'
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
                className={`cursor-pointer flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${chatMode === 'ai'
                  ? 'border-blue-300 focus:ring-blue-500'
                  : chatMode === 'task'
                    ? 'border-purple-300 focus:ring-purple-500'
                    : 'border-gray-300 focus:ring-green-500'
                  }`}
              />
              <button
                onClick={sendTeamMessage}
                className={`cursor-pointer p-2.5 text-white rounded-lg transition-colors ${chatMode === 'ai'
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : chatMode === 'task'
                    ? 'bg-purple-500 hover:bg-purple-600'
                    : 'bg-green-500 hover:bg-green-600'
                  }`}
              >
                <Send className="size-5" />
              </button>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;