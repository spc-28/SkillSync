import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { db } from 'src/config/firebase.config';
import { FieldValue } from 'firebase-admin/firestore';

@Injectable()
export class PostService {
  async create(createPostDto: CreatePostDto) {
    try {
      await db.collection('posts').doc().set({
        ...createPostDto,
        likes: 0,
        timestamp: (new Date()).toISOString()
      });


      const createdEvent = {
        message: "Post created successfully"
      }

      return createdEvent;

    }
    catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to create event: ${error.message}`);
    }
  }

async findAll() {
  try {
    const snapshot = await db.collection("posts").orderBy('timestamp', 'desc').get();
    
    const posts = await Promise.all(
      snapshot.docs.map(async (doc: any) => {
        const data = doc.data();
        const userDoc = await db.collection("users").doc(data.authorId).get();
        const userData = userDoc.data();
        
        return {
          id: doc.id, 
          ...data,
          authorName: userData?.fullName || 'Unknown User'
        };
      })
    );
    
    return posts;
  } catch (error: any) {
    throw new BadRequestException(`Failed to fetch posts: ${error.message}`);
  }
}

  async addLike(id: string) {
    try {
      await db.collection('posts').doc(id).update({
        likes: FieldValue.increment(1)
      });

      return {
        message: "Liked successfully"
      }
    } 
    catch (error: any) {
      throw new Error("Failed liking the post");
    }
  }
}
