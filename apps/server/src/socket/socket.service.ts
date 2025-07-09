import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';
import { db } from 'src/config/firebase.config';

@Injectable()
export class SocketService {
    private socketToUser = new Map<string, string>();

    addToMap(clientId: string, uid: string ) {
        this.socketToUser.set(uid, clientId);
    }
    removeFromMap(clientId: string) {
        this.socketToUser.delete(clientId);
    }

    getFromMap(uid:string): string {
       return this.socketToUser.get(uid)!;
    }

    async findUserName(uid: string) {
        const userDoc = await db.collection('users').doc(uid).get();
		const userData = userDoc.data();
        return userData?.fullName;
    }

    async create(createChatDto: CreateChatDto) {
        const { senderId, receiverId, message, timestamp } = createChatDto;

        try {
            const chat = await db.collection('chats').doc().set({
                senderId,
                receiverId,
                message,
                timestamp
            })
            console.log(chat)
            return chat

        }
        catch (err: any) {
            throw new BadRequestException("Failed to store chat")
        }
    }

    async createRoomChat(data: { room: string; message: string; sender: string; timestamp: string }) {

        const { room, message, sender, timestamp } = data;

        try {
            const chat = await db.collection('roomChats').doc().set({
                sender,
                room,
                message,
                timestamp,
            })

            return chat

        }
        catch (err: any) {
            throw new BadRequestException("Failed to store chat")
        }
    }

}
