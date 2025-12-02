import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Chat, GoogleGenAI } from '@google/genai';
import { initializeFirebase } from 'src/config/firebase.config';
import { recomendationsPrompt, tagsPrompt } from 'src/utils/helper';

@Injectable()
export class GeminiService {
    private readonly genAI: GoogleGenAI;
    private readonly db;

    constructor(private configService: ConfigService) {
        this.genAI = new GoogleGenAI({
            apiKey: this.configService.get<string>('GOOGLE_AI_API_KEY'),
        });
        this.db = initializeFirebase(this.configService);
    }

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

            await this.db.collection('geminiChats').doc().set({
                projectId: sessionId,
                message,
                timestamp: new Date().toISOString()
            })

            await this.db.collection('geminiChats').doc().set({
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
            const chatsSnapshot = await this.db.collection('geminiChats').where('projectId', '==', projectId).orderBy("timestamp", "asc").get();

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

    async getGeminiRecomendations(userId: string) {
        try {
            const userSnap = await this.db.collection('users').doc(userId).get();
            if (!userSnap.exists) {
                throw new Error('User not found');
            }
            const currentUser = userSnap.data();

            const usersSnap = await this.db.collection('users').get();
            const allUsers = usersSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            const projectsSnap = await this.db.collection('projects').get();
            const allProjects = projectsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            const response = await this.genAI.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [`You have to give result for this user ${JSON.stringify(currentUser)}`, JSON.stringify(allUsers), JSON.stringify(allProjects)],
                config: {
                    systemInstruction: recomendationsPrompt,
                },
            });

            const snapshot = await this.db.collection("events").limit(3).get();
            const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const cleaned = String(response.text).replace(/^```json\s*|\s*```$/g, '');
            const obj = JSON.parse(cleaned);

            return { ...obj, recommendedEvents: [...events] };
        }
        catch (error: any) {
            console.error('Error fetching recomendations:', error);
            throw new Error('Failed to fetch recomendations');
        }
    }

    async getTags(content: string) {
        try {
            const response = await this.genAI.models.generateContent({
                model: "gemini-2.0-flash-001",
                contents: [content],
                config: {
                    systemInstruction: tagsPrompt,
                },
            });

            const cleaned = String(response.text).replace(/^```json\s*|\s*```$/g, '');
            let obj = [];

            try {
                obj = JSON.parse(cleaned);
            } 
            catch (error) {
                obj = [];
            }

            return obj;
        }
        catch (error: any) {
            console.error('Error fetching tags:', error);
            throw new Error('Failed to fetch tags');
        }
    }

}
