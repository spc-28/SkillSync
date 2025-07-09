import { BadRequestException, Injectable } from '@nestjs/common';
import { db } from 'src/config/firebase.config';

@Injectable()
export class WorkspaceService {

    async workspaceInfo(id: string) {
        try {

            const projectDoc = await db.collection("projects").doc(id).get();
            if (!projectDoc.exists) {
                throw new Error("Project not found");
            }

            const projectData = projectDoc.data();

            const authorDoc = await db.collection("users").doc(projectData?.author).get();
            const authorData = authorDoc.data();

            const teamMembers = await Promise.all(
                (projectData?.teamIds || []).map(async (teamId: string) => {
                    const memberDoc = await db.collection("users").doc(teamId).get();
                    const memberData = memberDoc.data();
                    return {
                        id: memberDoc.id,
                        fullName: memberData?.fullName || "Unknown"
                    };
                })
            );


            const chatsSnapshot = await db.collection("roomChats")
                .where("room", "==", id)
                .orderBy("timestamp", "asc")
                .get();

            const chats = chatsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            teamMembers.push({
                id: authorDoc.id,
                fullName: authorData?.fullName || "Unknown"
            })

            return {
                project: {
                    id: projectDoc.id,
                    title: projectData?.title,
                    teamMembers,
                    status: projectData?.status
                },
                chats
            };

        }
        catch (error: any) {
            throw new BadRequestException(`Failed to fetch project details: ${error.message}`);
        }
    }

    async createTask(data: { projectId: string; userId: string; task: string; timestamp: string;}) {
        try {
            const docRef = db.collection('tasks').doc();
            const taskData = {
                id: docRef.id,
                ...data,
                status: false
            };

            await docRef.set(taskData);

            return taskData;
        }
        catch (error: any) {
            throw new BadRequestException(`Failed to create task: ${error.message}`);
        }
    }

}
