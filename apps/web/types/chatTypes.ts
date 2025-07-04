export type User = {
    id: string;
    name: string;
    role: string;
    avatar: string;
    status: string;
    lastSeen: string;
};

export type Message = {
    id: number;
    text: string;
    sender: string;
    timestamp: string;
    type: 'text' | 'image';
    fileName?: string;
};

export type MessagesMap = {
    [userId: string]: Message[];
};