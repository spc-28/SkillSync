import { BadRequestException, Injectable } from '@nestjs/common';
import { db } from 'src/config/firebase.config';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {

    async createProject(createProjectDto: CreateProjectDto) {
        try {
            const docRef = await db.collection('projects').add({ ...createProjectDto, github: "", link: "" });
            return { id: docRef.id, ...createProjectDto };
        }
        catch (error: any) {
            throw new Error(`Failed to create project: ${error.message}`);
        }
    }


    async findAll() {
        try {
            const snapshot = await db.collection("projects").get();

            const projects = await Promise.all(
                snapshot.docs.map(async (doc) => {
                    const data = doc.data();
                    const authorRef = db.collection("users").doc(data.author);
                    const authorSnap = await authorRef.get();
                    const authorData = authorSnap.data();

                    return {
                        id: doc.id,
                        ...data,
                        author: {
                            id: authorSnap.id,
                            fullName: authorData?.fullName || "Unknown",
                        },
                    };
                })
            )

            return projects;
        }
        catch (error: any) {
            throw new BadRequestException(`Failed to fetch events: ${error.message}`);
        }
    }

    async workspaceProjects(id: string) {
        try {
        const snapshot = await db.collection("projects").get();

        const projects = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const data = doc.data();
                const authorRef = db.collection("users").doc(data.author);
                const authorSnap = await authorRef.get();
                const authorData = authorSnap.data();

                return {
                    id: doc.id,
                    title: data.title,
                    description: data.description,
                    teamIds: data.teamIds,
                    members: data.members,
                    author: {
                        id: authorSnap.id,
                        fullName: authorData?.fullName || "Unknown",
                    },
                };
            })
        );

        const self = projects.filter((project) => project.author.id === id);
        const others = projects.filter((project) => 
            //@ts-ignore
            Array.isArray(project.teamIds) && project.teamIds.includes(id)
        );

        return {
            self,
            others,
        };
    } catch (error: any) {
        throw new BadRequestException(`Failed to fetch projects: ${error.message}`);
    }
    }
}
