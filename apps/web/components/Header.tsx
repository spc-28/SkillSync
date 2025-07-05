'use client'
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Logo = () => (
    <svg viewBox="0 0 200 200" className="w-8 h-8">
        <g transform="translate(100, 100)">
            <path d="M 60 0 A 60 60 0 0 1 0 60" fill="none" stroke="#6366F1" strokeWidth="8" strokeLinecap="round" />
            <path d="M -60 0 A 60 60 0 0 1 0 -60" fill="none" stroke="#8B5CF6" strokeWidth="8" strokeLinecap="round" />
            <circle cx="0" cy="-60" r="10" fill="#6366F1" />
            <circle cx="0" cy="60" r="10" fill="#8B5CF6" />
            <g transform="scale(1.2)">
                <path d="M -10 -5 L -10 5 L -5 5 M 5 5 L 10 5 L 10 -5 M 10 -5 L 5 -5" fill="none" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
                <path d="M -7 -8 L -13 -2 L -7 4" fill="none" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 7 8 L 13 2 L 7 -4" fill="none" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </g>
        </g>
    </svg>
);

export default function Header() {
    const [hover, setHover] = useState(false);
    const router = useRouter();
    return (
        <header className="fixed top-0 left-0 right-0 shadow z-40 bg-white px-6 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <div onClick={() => router.push('/discover')} className="cursor-pointer flex items-center gap-2">
                    <div className='size-[1.8rem] overflow-hidden flex items-center justify-center'>
                        <Logo />
                    </div>
                    <span className="font-semibold text-xl">SkillSync</span>
                </div>
            </div>
            <nav className="hidden md:flex items-center gap-16 text-[1.1rem] font-[500]">
                <p onClick={() => router.push('/discover')} className="cursor-pointer text-gray-700 hover:text-gray-900 hover-underline-animation left">Discover</p>
                <p onClick={() => router.push('/projects')} className="cursor-pointer text-gray-700 hover:text-gray-900 hover-underline-animation left">Projects</p>
                <p onClick={() => router.push('/events')} className="cursor-pointer text-gray-700 hover:text-gray-900 hover-underline-animation left">Events</p>
            </nav>
            <div className="flex items-center gap-4">
                <button onClick={() => router.push('/chats')} className="p-2 hover:bg-gray-100 cursor-pointer rounded-lg">
                    <MessageCircle className="w-5 h-5" />
                </button>
                <button onClick={() => router.push('/workspace')} className="px-4 py-2 bg-purple-600 cursor-pointer text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                    Workspace
                </button>

                <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}  className="relative">
                    <div className="size-[2.85rem] bg-gradient-to-br from-orange-400 to-pink-500 rounded-full cursor-pointer border-2 border-orange-400 hover:border-pink-500 transition-colors"></div>
                    {hover && <div className="absolute right-0 w-36 bg-white border border-gray-300 rounded-lg shadow-lg  pointer-events-auto transition-opacity duration-200 z-50 flex flex-col">
                        <button className="block text-left px-4 py-2 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none rounded-t-lg" tabIndex={0} onClick={() => router.push(`/profile/${localStorage.getItem('id')}`)}>Profile</button>
                        <button className="block text-left px-4 py-2 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none rounded-b-lg" tabIndex={0} onClick={() => {localStorage.removeItem('token'); router.push('/')}}>Logout</button>
                    </div>
                    } </div>
            </div>
        </header>
    )
}