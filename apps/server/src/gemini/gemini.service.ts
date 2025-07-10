import { Injectable } from '@nestjs/common';
import { Chat, GoogleGenAI } from '@google/genai';
import { db } from 'src/config/firebase.config';

@Injectable()
export class GeminiService {
    private readonly genAI = new GoogleGenAI({
        apiKey: process.env.GOOGLE_AI_API_KEY,
    });

    private chatSessions = new Map<string, Chat>();

    private createChat(systemInstruction: string): Chat {
        return this.genAI.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction,
            },
        });
    }

    private getChat(sessionId: string): Chat {
        if (this.chatSessions.has(sessionId)) {
            return this.chatSessions.get(sessionId)!;
        }
        const chat = this.createChatInstance(sessionId, "You are a helpful assistant which help a group of student with their doubts and questions related to a common project on which they are working. Be very specific to Technology and development in tech.");
        this.chatSessions.set(sessionId, chat);
        return this.chatSessions.get(sessionId)!;
    }

    createChatInstance(sessionId: string, systemInstruction: string): Chat {
        const chat = this.createChat(systemInstruction);
        this.chatSessions.set(sessionId, chat);
        return chat;
    }

    async workspaceGemini(message: string, sessionId: string) {
        try {
            const chat = this.getChat(sessionId);
            const res = await chat.sendMessage({ message });

            await db.collection('geminiChats').doc().set({
                projectId: sessionId,
                message,
                timestamp: new Date().toISOString()
            })

            await db.collection('geminiChats').doc().set({
                projectId: sessionId,
                message: res.text,
                timestamp: new Date().toISOString()
            })

            return { message: res.text };
        }
        catch (error: any) {
            console.error('Error in workspaceGemini:', error);
            throw new Error('Failed to get response from Gemini service.');
        }
    }

    async getGeminiChats(projectId: string) {
        try {
            const chatsSnapshot = await db.collection('geminiChats').where('projectId', '==', projectId).orderBy("timestamp", "asc").get();

            const chats = chatsSnapshot.docs.map(doc => ({
                ...doc.data(),
            }));

            return chats;
        }
        catch (error) {
            console.error('Error fetching chats:', error);
            throw new Error('Failed to fetch chats');
        }
    }

}
