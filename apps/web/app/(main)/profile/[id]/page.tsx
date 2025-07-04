'use client'
import React, { useState } from 'react';
import { Heart, MessageCircle, Upload, ChevronDown, MoreHorizontal } from 'lucide-react';
import ProfileTabs from '../../../../components/ProfileThings';
import { useChatStore } from '../../../../zustand/chatStore';
import { useRouter } from 'next/navigation';

const Portfolio = () => {
	const router = useRouter();
	const {setSelectedUser} = useChatStore();
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
				<div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
					{/* Profile Photo */}
					<div className="w-48 h-48 rounded-full overflow-hidden flex-shrink-0">
						<img
							src="https://avatar.iran.liara.run/public"
							alt="Profile"
							className="w-full h-full object-cover"
						/>
					</div>

					{/* Profile Info */}
					<div className="flex-1 text-center md:text-left mt-3.5">
						<div className="flex items-center justify-center md:justify-start gap-2 mb-2">
							<h1 className="text-3xl font-bold">Irene Brooks</h1>
							{/* <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded flex items-center gap-1">
                PRO ✨
              </span> */}
						</div>
						<p className="text-gray-600 mb-6">
							Semester 4<br />
							<span className='font-semibold'>Computer Science and Engineering</span>
						</p>
						<div className="flex gap-3 justify-center md:justify-start mb-8">
							<button onClick={()=> {
								setSelectedUser({ id: 'james', name: 'James Wilson', role: 'Backend Developer', avatar: '👨‍💻', status: 'offline', lastSeen: '1 hour ago' });
								router.push(`/chats/${'james'}`)
							}} className="px-6 py-2 cursor-pointer bg-black text-white rounded-lg hover:bg-gray-800">
								Have a Chat
							</button>
						</div>
					</div>
				</div>
				<ProfileTabs />
			</div>

		</div>
	);
};

export default Portfolio;