import { Injectable } from '@nestjs/common';
import { db } from 'src/config/firebase.config';

@Injectable()
export class ChatService {
  
  async findAllUsers() {
    try {
      const usersSnapshot = await db.collection('users').get();
      return usersSnapshot.docs.map(doc => ({
        fullName: doc.data().fullName,
        uid: doc.data().uid
      }));
    } 
    catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  async findAllChats(id: string) {
    try {
      const chatsSnapshot1 = await db.collection('chats').where('senderId', '==', id).get();
      const chatsSnapshot2 = await db.collection('chats').where('receiverId', '==', id).get();
      return [...chatsSnapshot1.docs, ...chatsSnapshot2.docs].reverse().map(doc => ({ id: doc.id, ...doc.data() }));
    } 
    catch (error) {
      console.error('Error fetching chats:', error);
      throw new Error('Failed to fetch chats');
    }
  }

}
