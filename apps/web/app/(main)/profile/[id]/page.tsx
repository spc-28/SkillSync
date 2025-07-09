'use client'
import React, { useState } from 'react';
import { Heart, MessageCircle, Upload, ChevronDown, MoreHorizontal, Briefcase, Code2, Sparkles, Layers, X } from 'lucide-react';
import ProfileTabs from '../../../../components/ProfileThings';
import { useChatStore } from '../../../../zustand/chatStore';
import { useParams, useRouter } from 'next/navigation';
import { useUserStore } from '../../../../zustand/userStore';
import { toast } from 'sonner';
import axios from 'axios';

const Portfolio = () => {
	const router = useRouter();
	const { id } = useParams();
	const { userId } = useUserStore();

	// State for modal
	const [showEditModal, setShowEditModal] = useState(false);
	const [editLoading, setEditLoading] = useState(false);
	const [profile, setProfile] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [editForm, setEditForm] = useState<{
		semester: string;
		about: string;
		techStack: string[];
		roles: string[];
	}>({
		semester: '',
		about: '',
		techStack: [],
		roles: []
	});

	React.useEffect(() => {
		async function fetchProfile() {
			setLoading(true);
			try {
				const res = await axios.get(`${process.env.NEXT_PUBLIC_DEV_API_URL}/profile/${id}`);
				setProfile(res.data);
				setEditForm({
					semester: res.data.semester || '',
					about: res.data.description || '',
					techStack: res.data.techStack || [],
					roles: res.data.experience || []
				});
			} catch (err) {
				toast.error('Failed to load profile');
			} finally {
				setLoading(false);
			}
		}
		if (id) fetchProfile();
	}, [id]);
	const isOwner = userId === id;
	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<span className="text-lg text-gray-500">Loading profile...</span>
			</div>
		);
	}
	if (!profile) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<span className="text-lg text-red-500">Profile not found.</span>
			</div>
		);
	}
	return (
		<div className="min-h-full bg-white mt-32">
			{/* Background Gradient */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-40"></div>
				<div className="absolute top-20 -left-40 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-40"></div>
				<div className="absolute bottom-0 right-1/3 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-30"></div>
			</div>

			{/* Profile Section */}
			<div className="relative z-10 container mx-auto px-6 mt-12">
				<div className="flex flex-col lg:flex-row items-start gap-12 mb-12">
					{/* Left Column - Profile Photo & Basic Info */}
					<div className="flex flex-col items-center lg:items-start">
						{/* Profile Photo */}
						<div className="w-48 h-48 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-purple-100">
							<img
								src="https://avatar.iran.liara.run/public"
								alt="Profile"
								className="w-full h-full object-cover"
							/>
						</div>

						{/* Profile Info */}
						<div className="text-center lg:text-left mt-6">
							<div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
								<h1 className="text-3xl font-bold">{profile.fullName}</h1>
							</div>
							<p className="text-gray-600 mb-6">
								Semester {profile.semester}<br />
								<span className='font-semibold'>{profile.branch}</span>
							</p>
							<div className="flex flex-col gap-3 justify-center lg:justify-start">
								<button onClick={() => {
									router.push(`/chats/${id}`)
								}} className="px-6 py-2 cursor-pointer bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
									Have a Chat
								</button>
								{isOwner && (
									<button
										onClick={() => setShowEditModal(true)}
										className="px-6 py-2 cursor-pointer bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
									>
										Update Details
									</button>
								)}
							</div>
							{/* Edit Details Modal */}
							{showEditModal && (
								<div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
									<div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-xl relative">
										<button
											className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
											onClick={() => setShowEditModal(false)}
										>
											<X className="w-5 h-5" />
										</button>
										<h2 className="text-2xl font-bold mb-6">Edit Profile Details</h2>
										<form className="space-y-4">
											<div className="flex gap-4">
												<div className="flex-1">
													<label className="block text-sm font-medium mb-1">Semester</label>
													<input
														type="text"
														className="w-full px-3 py-2 border rounded-lg"
														value={editForm.semester}
														onChange={e => setEditForm(f => ({ ...f, semester: e.target.value }))}
													/>
												</div>
											</div>
											<div>
												<label className="block text-sm font-medium mb-1">About Me</label>
												<textarea
													className="w-full px-3 py-2 border rounded-lg min-h-[80px]"
													value={editForm.about}
													onChange={e => setEditForm(f => ({ ...f, about: e.target.value }))}
												/>
											</div>
											<div>
												<label className="block text-sm font-medium mb-1">Tech Stack (comma separated)</label>
												<input
													type="text"
													className="w-full px-3 py-2 border rounded-lg"
													value={Array.isArray(editForm.techStack) ? editForm.techStack.join(', ') : ''}
													onChange={e => setEditForm(f => ({ ...f, techStack: e.target.value.split(',').map((s: string) => s.trim()) as string[] }))}
												/>
											</div>
											<div>
												<label className="block text-sm font-medium mb-1">Roles (comma separated)</label>
												<input
													type="text"
													className="w-full px-3 py-2 border rounded-lg"
													value={Array.isArray(editForm.roles) ? editForm.roles.join(', ') : ''}
													onChange={e => setEditForm(f => ({ ...f, roles: e.target.value.split(',').map((s: string) => s.trim()) as string[] }))}
												/>
											</div>
											<div className="flex gap-3 pt-4">
												<button
													type="button"
													className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
													onClick={() => setShowEditModal(false)}
												>
													Cancel
												</button>
												<button
													type="button"
													className={`flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 ${editLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
													disabled={editLoading}
													onClick={async () => {
														setEditLoading(true);
														try {
															const payload = {
																semester: editForm.semester,
																description: editForm.about,
																techStack: editForm.techStack,
																experience: editForm.roles
															};
														await axios.put(`${process.env.NEXT_PUBLIC_DEV_API_URL}/profile/${id}`, payload);
														// Update local state for real-time UI update
														setProfile((prev: any) => ({
														  ...prev,
														  semester: payload.semester,
														  description: payload.description,
														  techStack: payload.techStack,
														  experience: payload.experience
														}));
														toast.success("Profile updated successfully")
														setShowEditModal(false);
														} catch (err) {
															toast.error("Failed to update profile")
															setShowEditModal(false);
														} finally {
															setEditLoading(false);
														}
													}}
												>
													{editLoading ? (
														<>
															<span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
															Saving...
														</>
													) : (
														'Save Changes'
													)}
												</button>
											</div>
										</form>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Right Column - Description & Tech Stack */}
					<div className="flex-1 max-w-7xl mt-5 ml-16">
						{/* Description Section */}
						<div className="mb-8">
							<h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
								<Sparkles className="w-5 h-5 text-purple-600" />
								About Me
							</h2>
							<p className="text-gray-700 leading-relaxed whitespace-pre-line">
								{profile.description}
							</p>
						</div>

						<div className="mb-9">
							<h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
								<Layers className="w-5 h-5 text-purple-600" />
								Tech Stack
							</h2>
							<div className="flex flex-wrap gap-3">
								{Array.isArray(profile.techStack) && profile.techStack.map((item: string, idx: number) => (
									<span key={idx} className={`px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium`}>
										{item}
									</span>
								))}
							</div>
						</div>

						{/* Roles Section */}
						<div className="mb-8">
							<h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
								<Briefcase className="w-5 h-5 text-purple-600" />
								Experience
							</h2>
							<div className="flex flex-wrap gap-3">
								{Array.isArray(profile.experience) && profile.experience.map((item: string, idx: number) => (
									<span key={idx} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
										{item}
									</span>
								))}
							</div>
						</div>
					</div>
				</div>

				<ProfileTabs showActions={isOwner} />
			</div>
		</div>
	);
};

export default Portfolio;