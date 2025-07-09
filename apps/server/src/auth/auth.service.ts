import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { clientAuth } from '@repo/firebase-config'
import { GoogleSignUpDto } from './dto/google-sign-up.dto';


@Injectable()
export class AuthService {
	async signUp(signUpDto: SignUpDto) {
		const { email, password, fullName, institute } = signUpDto;

		try {
			const userCredential = await createUserWithEmailAndPassword(clientAuth, email, password);
			const user = userCredential.user;

			await db.collection('users').doc(user.uid).set({
				fullName,
				email,
				institute,
				createdAt: new Date(),
				uid: user.uid
			});

			await db.collection('userMeta').doc(user.uid).set({
				projects: [],
				contributions: [],
				hackathons: [],
				certifications: []
			})

			const customToken = await user.getIdToken();

			return {
				message: 'User created successfully',
				user: {
					uid: user.uid,
					email: user.email,
					fullName,
				},
				token: customToken
			};
		} catch (error: any) {
			if (error.code === 'auth/network-request-failed') {
				throw new ConflictException('Email already exists');
			}
			throw new Error(error.message);
		}
	}

	async googleSignUp(signUpDto: GoogleSignUpDto) {
		const { email, fullName, institute, uid } = signUpDto;

		const userDoc = await db.collection('users').doc(uid).get();
		try {
			if (userDoc.exists) {
				return {
					message: 'User already created',
					user: {
						uid
					}
				};
			}

			await db.collection('users').doc(uid).set({
				fullName,
				email,
				institute,
				createdAt: new Date(),
				uid
			});


			return {
				message: 'User created successfully',
				user: {
					uid,
					email,
					fullName,
				},
			};

		} catch (error: any) {
			if (error.code === 'auth/network-request-failed') {
				throw new ConflictException('Error creating user');
			}
			throw new Error(error.message);
		}
	}


	async signIn(signInDto: SignInDto) {
		const { email, password } = signInDto;

		try {
			const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
			const user = userCredential.user;

			const userDoc = await db.collection('users').doc(user.uid).get();
			const userData = userDoc.data();

			const customToken = await user.getIdToken();

			return {
				message: 'Sign in successful',
				user: {
					uid: user.uid,
					email: user.email,
					fullName: userData?.fullName,
				},
				token: customToken
			};
		} catch (error: any) {
			console.log(error)
			if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
				throw new UnauthorizedException('Invalid credentials');
			}
			throw new Error(error.message);
		}
	}
}