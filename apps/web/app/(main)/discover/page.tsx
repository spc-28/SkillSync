'use client'
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, TrendingUp, Send, Image, Smile, Sparkles, Users, Calendar, Rocket, ChevronRight, MessageSquare, UserPlus, Code, Zap, Coffee } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner';
import { useUserStore } from '../../../zustand/userStore';
import { useRouter } from 'next/navigation';

const DiscoverPage = () => {
  const [postContent, setPostContent] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false); // for post submit
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);
  const { userId } = useUserStore();
  const router = useRouter();
  // Fetch posts from API
  const fetchPosts = async () => {
    setPostsLoading(true);
    setPostsError(null);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_DEV_API_URL}/post`);
      setPosts(res.data);
    } catch (err: any) {
      setPostsError(err?.response?.data?.message || 'Failed to load posts.');
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Post submit handler
  const handlePostSubmit = async () => {
    if (!postContent.trim() && !imageFile) return;
    setLoading(true);
    setError(null);
    try {
      // const formData = new FormData();
      // formData.append('content', postContent);
      // if (imageFile) formData.append('image', imageFile);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_DEV_API_URL}/post`, {
        authorId: userId,
        content: postContent
      });
      setPostContent('');
      setImageFile(null);
      setImagePreview(null);
      toast.success(res.data.message);
      await fetchPosts(); // Refresh posts after posting
    } 
    catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to post. Please try again.');
    } 
    finally {
      setLoading(false);
    }
  };

  // ...existing code...

  const recommendedUsers = [
    {
      id: 1,
      name: "David Kim",
      username: "@davidkim",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150",
      role: "Backend Developer",
      skills: ["Python", "Django", "PostgreSQL"],
      matchReason: "Working on similar AI projects"
    },
    {
      id: 2,
      name: "Nina Patel",
      username: "@ninapatel",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      role: "UI/UX Designer",
      skills: ["Figma", "React", "Tailwind"],
      matchReason: "Looking for developers"
    },
    {
      id: 3,
      name: "Carlos Mendez",
      username: "@carlosm",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      role: "Full Stack Developer",
      skills: ["MERN Stack", "AWS", "Docker"],
      matchReason: "Interested in EdTech"
    }
  ];

  const recommendedProjects = [
    {
      id: 1,
      title: "Blockchain Study Groups",
      description: "Building a decentralized platform for study group management",
      skills: ["Solidity", "React", "Web3"],
      teamSize: "2/4 members",
      matchScore: 95
    },
    {
      id: 2,
      title: "Campus Food Tracker",
      description: "Real-time tracking of campus dining hall menus and nutrition",
      skills: ["React Native", "Node.js", "MongoDB"],
      teamSize: "3/5 members",
      matchScore: 88
    },
    {
      id: 3,
      title: "AI Research Assistant",
      description: "Chrome extension that helps with academic research using AI",
      skills: ["JavaScript", "Python", "NLP"],
      teamSize: "1/3 members",
      matchScore: 82
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      name: "Web3 Hackathon",
      date: "March 24-26",
      type: "Hackathon",
      registrationOpen: true,
      spotsLeft: 45
    },
    {
      id: 2,
      name: "AI/ML Workshop Series",
      date: "April 2",
      type: "Workshop",
      registrationOpen: true,
      spotsLeft: 20
    },
    {
      id: 3,
      name: "Tech Career Fair",
      date: "May 5-6",
      type: "Conference",
      registrationOpen: false,
      spotsLeft: 0
    }
  ];

  const handleLike = (postId: any) => {
    const newLikedPosts = new Set(likedPosts);
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);
  };

  // Simple emoji list for demonstration
  const emojiList = ['😀','😂','😍','😎','🤔','🙌','🔥','🚀','🎉','💡','👍','🙏','🥳','😅','😇','😜','🤖','💻','📚','🧑‍💻'];

  const handleEmojiClick = (emoji: string) => {
    setPostContent(postContent + emoji);
    setShowEmojiPicker(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex gap-4">
                <img 
                  src="https://avatar.iran.liara.run/public" 
                  alt="Your avatar" 
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Share your project updates, tech thoughts, or ask for collaborators..."
                    className="w-full p-4 border border-gray-200 rounded-xl resize-none h-32 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  />
                  {/* Image preview */}
                  {imagePreview && (
                    <div className="relative mt-2 w-full flex justify-center">
                      <img src={imagePreview} alt="Preview" className="max-h-48 rounded-xl border border-gray-200" />
                      <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-red-100">
                        <span className="text-xs text-red-500">✕</span>
                      </button>
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-4 items-center relative">
                      {/* Image upload button */}
                      <label className="text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer">
                        <Image className="w-5 h-5" />
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </label>
                      {/* Emoji picker button */}
                      <button type="button" className="text-gray-500 hover:text-indigo-600 transition-colors relative" onClick={() => setShowEmojiPicker((v) => !v)}>
                        <Smile className="w-5 h-5" />
                        {showEmojiPicker && (
                          <div className="absolute left-0 top-10 z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-2 grid grid-cols-6 gap-2 w-64">
                            {emojiList.map((emoji) => (
                              <div key={emoji} className="text-xl hover:bg-gray-100 rounded p-1" onClick={() => handleEmojiClick(emoji)}>{emoji}</div>
                            ))}
                          </div>
                        )}
                      </button>
                    </div>
                    <button
                      onClick={handlePostSubmit}
                      disabled={loading}
                      className={`cursor-pointer px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {loading ? <span className="animate-spin mr-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg></span> : <Send className="w-4 h-4" />}
                      {loading ? 'Posting...' : 'Post'}
                    </button>
                    {error && <span className="ml-4 text-red-500 text-sm">{error}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            {postsLoading ? (
              <div className="flex justify-center items-center py-12">
                <span className="text-gray-500">Loading posts...</span>
              </div>
            ) : postsError ? (
              <div className="flex justify-center items-center py-12">
                <span className="text-red-500">{postsError}</span>
              </div>
            ) : posts.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <span className="text-gray-500">No posts yet.</span>
              </div>
            ) : (
              posts.map((post, idx) => (
                <div key={post.id} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div onClick={()=>router.push(`/profile/${post.authorId}`)} className="flex gap-3 items-center cursor-pointer">
                      <img 
                        src={`https://avatar.iran.liara.run/public/${idx + 1}`} 
                        alt={post.authorName || 'User'}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-semibold text-gray-900" >{post.authorName || 'User'}</h3>
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-800 leading-relaxed">{post.content}</p>
                    {post.imageUrl && (
                      <img 
                        src={post.imageUrl} 
                        alt="Post content" 
                        className="mt-4 rounded-xl w-full max-h-96 object-cover"
                      />
                    )}
                  </div>

                   <div className="flex flex-wrap gap-2 mb-4">
                  {(post.tags || ['ai/ml', 'Dev']).map((tag: string, idx: number) => (
                    <span key={idx} className="text-indigo-600 text-sm hover:underline cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>

                  {/* Tags not present in API, skip for now */}

                  {/* Like button (optional, not functional) */}
                  {/* <div className="flex items-center justify-end pr-2 pt-4 border-t">
                    <button 
                      // onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 transition-colors text-gray-500 hover:text-red-600`}
                    >
                      <Heart className={`w-5 h-5`} />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </button>
                  </div> */}
                </div>
              ))
            )}
          </div>

          {/* Right Sidebar - AI Recommendations */}
          <div className="space-y-6">
            {/* AI Badge */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-semibold">AI-Powered Recommendations</h3>
              </div>
              <p className="text-sm text-white/80">Personalized suggestions based on your skills and interests</p>
            </div>

            {/* Recommended Users */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                People to Connect With
              </h3>
              <div className="space-y-4">
                {recommendedUsers.map((user) => (
                  <div key={user.id} className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{user.name}</h4>
                        <p className="text-xs text-gray-600">{user.role}</p>
                        <p className="text-xs text-indigo-600 mt-1">{user.matchReason}</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      Chat
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Projects */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-purple-600" />
                Projects for You
              </h3>
              <div className="space-y-4">
                {recommendedProjects.map((project) => (
                  <div key={project.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{project.title}</h4>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {project.matchScore}% match
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{project.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{project.teamSize}</span>
                      <button className="text-indigo-600 text-xs font-medium hover:text-indigo-700">
                        View Project →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-600" />
                Events to Join
              </h3>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border-b last:border-0 pb-3 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{event.name}</h4>
                        <p className="text-xs text-gray-600">{event.date} • {event.type}</p>
                      </div>
                      {event.registrationOpen ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          {event.spotsLeft} spots
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          Full
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/events"><button className="cursor-pointer w-full mt-4 text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center justify-center gap-1">
                Browse All Events
                <ChevronRight className="w-4 h-4" />
              </button></Link>
            </div>

            {/* Trending Topics */}
            {/* <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Trending Topics
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-indigo-600 hover:underline cursor-pointer">#AIProjects</span>
                  <span className="text-xs text-gray-500">128 posts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-indigo-600 hover:underline cursor-pointer">#WebDev</span>
                  <span className="text-xs text-gray-500">94 posts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-indigo-600 hover:underline cursor-pointer">#Hackathon2024</span>
                  <span className="text-xs text-gray-500">76 posts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-indigo-600 hover:underline cursor-pointer">#OpenSource</span>
                  <span className="text-xs text-gray-500">61 posts</span>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;