import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeFirebase } from 'src/config/firebase.config';

@Injectable()
export class ChatService {
  private readonly db;

  constructor(private configService: ConfigService) {
    this.db = initializeFirebase(this.configService);
  }
  
  async findAllUsers() {
    try {
      const usersSnapshot = await this.db.collection('users').get();
      return usersSnapshot.docs.map((doc: any) => ({
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
      const chatsSnapshot1 = await this.db.collection('chats').where('senderId', '==', id).get();
      const chatsSnapshot2 = await this.db.collection('chats').where('receiverId', '==', id).get();
      //@ts-ignore
      return [...chatsSnapshot1.docs, ...chatsSnapshot2.docs].map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } 
    catch (error) {
      console.error('Error fetching chats:', error);
      throw new Error('Failed to fetch chats');
    }
  }

  async getUser(id: string) {
     try {
      const userSnapshot = await this.db.collection('users').doc(id).get();
      return {
        ...userSnapshot.data()
      }
    } 
    catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  }

}
