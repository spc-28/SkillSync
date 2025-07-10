import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { db } from 'src/config/firebase.config';
import { UpdateUserDto } from './dto/profile.dto';
import { removeEmptyValues } from 'src/utils/helper';
import { CertificationDTO, ContributionDTO, HackathonDTO, ProjectDTO } from './dto/profile-meta-dto';
import { FieldValue } from 'firebase-admin/firestore';

@Injectable()
export class ProfileService {

    async getUserById(userId: string) {
        try {
            const userRef = db.collection('users').doc(userId);
            const userSnap = await userRef.get();

            if (!userSnap.exists) {
                throw new NotFoundException(`User with ID ${userId} not found`);
            }

            const data = userSnap.data();

            return {
                id: userSnap.id,
                institute: data?.institute,
                fullName: data?.fullName,
                techStack: data?.techStack,
                gender: data?.gender,
                description: data?.description,
                semester: data?.semester,
                experience: data?.experience,
                branch: data?.branch
            };

        }
        catch (error: any) {
            console.error('Error fetching user:', error);
            throw new InternalServerErrorException(`Failed to fetch user: ${error.message}`);
        }
    }

    async updateUserDetails(userId: string, payload: UpdateUserDto) {
        try {
            const userRef = db.collection('users').doc(userId);
            const userSnap = await userRef.get();
            const data = userSnap.data();
            const content = removeEmptyValues(payload);

            if (!userSnap.exists) {
                throw new NotFoundException(`User with ID ${userId} does not exist`);
            }

            await userRef.update({ ...data, ...content });

            return {
                message: 'User profile updated successfully',
                user: {
                    fullName: data?.fullName,
                    gender: payload.gender ,
                }
            };
        }
        catch (error: any) {
            console.error('Error updating user:', error);
            throw new InternalServerErrorException(`Failed to update user: ${error.message}`);
        }
    }

    async addProject(userId: string, project: ProjectDTO) {
        try {
            await db.collection('userMeta').doc(userId).update({
                projects: FieldValue.arrayUnion({ ...project })
            });
            return { message: 'Project added successfully' };
        } catch (error) {
            console.error('Error adding project:', error);
            throw error;
        }
    }

    async addContribution(userId: string, contribution: ContributionDTO) {
        try {
            await db.collection('userMeta').doc(userId).update({
                contributions: FieldValue.arrayUnion({ ...contribution })
            });
            return { message: 'Contribution added successfully' };
        } catch (error) {
            console.error('Error adding contribution:', error);
            throw error;
        }
    }

    async addHackathon(userId: string, hackathon: HackathonDTO) {
        try {
            await db.collection('userMeta').doc(userId).update({
                hackathons: FieldValue.arrayUnion({ ...hackathon })
            });
            return { message: 'Hackathon added successfully' };
        } catch (error) {
            console.error('Error adding hackathon:', error);
            throw error;
        }
    }

    async addCertification(userId: string, certification: CertificationDTO) {
        try {
            await db.collection('userMeta').doc(userId).update({
                certifications: FieldValue.arrayUnion({ ...certification })
            });
            return { message: 'Certification added successfully' };
        } catch (error) {
            console.error('Error adding certification:', error);
            throw error;
        }
    }

    async getAllMeta(userId: string) {
        try {
            const userRef = db.collection('users').doc(userId);
            const userSnap = await userRef.get();

            if(!userSnap.exists) {
                throw new NotFoundException(`User with ID ${userId} does not exist`);
            }

            const docRef = await db.collection('userMeta').doc(userId).get();

            return { ...docRef.data() };
        }
        catch (error) {
            console.error('Error finding data', error);
            throw error;
        }
    }

}
