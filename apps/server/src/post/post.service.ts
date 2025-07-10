import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { db } from 'src/config/firebase.config';
import { FieldValue } from 'firebase-admin/firestore';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class PostService {

    private storage = new Storage({
    keyFilename: 'keyfile.json', 
  });
  private bucketName = 'skill_sync_store';

  private bucket = this.storage.bucket(this.bucketName);
  async create(createPostDto: CreatePostDto, tags: string[]) {
    try {
      await db.collection('posts').doc().set({
        ...createPostDto,
        tags,
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

  //@ts-ignore
  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const ext = path.extname(file.originalname);
      const blobName = `${uuidv4()}${ext}`;
      const blob = this.bucket.file(blobName);

      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
        predefinedAcl: 'publicRead',
      });

      return await new Promise<string>((resolve, reject) => {
        blobStream.on('error', (err: Error) => {
          reject(new BadRequestException('File upload failed: ' + err.message));
        });
        blobStream.on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${blobName}`;
          resolve(publicUrl);
        });
        blobStream.end(file.buffer);
      });
    } catch (error: any) {
      throw new BadRequestException('File upload failed: ' + (error?.message || error));
    }
  }
}
