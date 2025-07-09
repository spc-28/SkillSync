import { BadRequestException, Injectable } from '@nestjs/common';
import { db } from 'src/config/firebase.config';
import { CreateProjectDto } from './dto/create-project.dto';
import { FieldValue } from 'firebase-admin/firestore';

@Injectable()
export class ProjectService {
    async createProject(createProjectDto: CreateProjectDto) {
        try {
            const docRef = await db
                .collection('projects')
                .add({ ...createProjectDto, github: '', link: '' });
            return { id: docRef.id, ...createProjectDto };
        } catch (error: any) {
            throw new Error(`Failed to create project: ${error.message}`);
        }
    }

    async findAll() {
        try {
            const snapshot = await db.collection('projects').get();

            const projects = await Promise.all(
                snapshot.docs.map(async (doc) => {
                    const data = doc.data();
                    const authorRef = db.collection('users').doc(data.author);
                    const authorSnap = await authorRef.get();
                    const authorData = authorSnap.data();

                    return {
                        id: doc.id,
                        ...data,
                        author: {
                            id: authorSnap.id,
                            fullName: authorData?.fullName || 'Unknown',
                        },
                    };
                }),
            );

            return projects;
        } catch (error: any) {
            throw new BadRequestException(`Failed to fetch events: ${error.message}`);
        }
    }

    async workspaceProjects(id: string) {
        try {
            const snapshot = await db.collection('projects').get();

            const projects = await Promise.all(
                snapshot.docs.map(async (doc) => {
                    const data = doc.data();
                    const authorRef = db.collection('users').doc(data.author);
                    const authorSnap = await authorRef.get();
                    const authorData = authorSnap.data();

                    return {
                        id: doc.id,
                        title: data.title,
                        description: data.description,
                        teamIds: data.teamIds,
                        members: data.members,
                        status: data.status,
                        link: data.link,
                        github: data.github,
                        author: {
                            id: authorSnap.id,
                            fullName: authorData?.fullName || 'Unknown',
                        },
                    };
                }),
            );

            const self = projects.filter((project) => project.author.id === id);
            const others = projects.filter(
                (project) =>
                    //@ts-ignore
                    Array.isArray(project.teamIds) && project.teamIds.includes(id),
            );

            return {
                self,
                others,
            };
        } catch (error: any) {
            throw new BadRequestException(
                `Failed to fetch projects: ${error.message}`,
            );
        }
    }

    async getAllTasks(id: string) {
        try {
            const snapshot = await db
                .collection('tasks')
                .where('userId', '==', id)
                .get();

            const tasks = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            return tasks;
        } catch (error: any) {
            throw new BadRequestException(`Failed to fetch events: ${error.message}`);
        }
    }

    async updateTaskStatus(taskId: string) {
        try {
            await db.collection('tasks').doc(taskId).update({
                status: true,
            });

            return { success: true, message: 'Task status updated successfully' };
        } catch (error: any) {
            throw new BadRequestException(
                `Failed to update task status: ${error.message}`,
            );
        }
    }

    async updateProjectStatus(id: string, githubLink: string, liveLink: string) {
        try {
            await db.collection('projects').doc(id).update({
                status: "completed",
                github: githubLink,
                link: liveLink || ""
            });

            return { success: true, message: 'Project status updated successfully' };
        } catch (error: any) {
            throw new BadRequestException(
                `Failed to update task status: ${error.message}`,
            );
        }
    }

    async createRequest(data: { userId: string, projectId: string, message: string, authorId: string }) {
        const { userId, projectId, message, authorId } = data;

        try {
            const requestData = {
                userId,
                projectId,
                message,
                authorId,
                status: false
            };

            await db.collection('requests').add(requestData);

            return {
                success: true,
                message: 'Request created successfully',
            };
        }
        catch (error: any) {
            throw new BadRequestException(
                `Failed to create request: ${error.message}`,
            );
        }
    }

    async getAllRequests(id: string) {
        try {
            const snapshot = await db.collection('requests').where('authorId', '==', id).get();

            const requests = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            return requests;
        }
        catch (error: any) {
            throw new BadRequestException(`Failed to fetch requests: ${error.message}`);
        }
    }

    async acceptRequest(requestId: string) {
        try {
            const requestDoc = await db.collection('requests').doc(requestId).get();

            if (!requestDoc.exists) {
                throw new BadRequestException('Request not found');
            }

            const requestData = requestDoc.data();
            //@ts-ignore
            const { userId, projectId } = requestData;

            const batch = db.batch();

            const requestRef = db.collection('requests').doc(requestId);
            batch.update(requestRef, {
                status: true,
                acceptedAt: new Date().toISOString()
            });

            const projectRef = db.collection('projects').doc(projectId);
            batch.update(projectRef, {
                teamsIds: FieldValue.arrayUnion(userId)
            });

            await batch.commit();

            return {
                success: true,
                message: 'Request accepted and user added to project team successfully'
            };
        } catch (error: any) {
            throw new BadRequestException(
                `Failed to accept request: ${error.message}`,
            );
        }
    }

    async deleteRequest(requestId: string) {
        try {
            await db.collection('requests').doc(requestId).delete();

            return {
                success: true,
                message: 'Request deleted successfully'
            };
        }
        catch (error: any) {
            throw new BadRequestException(
                `Failed to delete request: ${error.message}`,
            );
        }
    }

    async adduserToProject(id: string, data: { ids: string[] }) {
        try {
            
            await db.collection('projects').doc(id).update({
                teamIds: FieldValue.arrayUnion(...data.ids)
            });

            return {
                success: true,
                message: 'User added to project'
            };
        }
        catch (error: any) {
            throw new BadRequestException(
                `Failed to add users to project: ${error.message}`,
            );
        }
    }
}
