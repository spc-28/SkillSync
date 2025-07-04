'use client'
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, TrendingUp, Send, Image, Smile, Sparkles, Users, Calendar, Rocket, ChevronRight, MessageSquare, UserPlus, Code, Zap, Coffee } from 'lucide-react';
import Link from 'next/link';

const DiscoverPage = () => {
  const [postContent, setPostContent] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const posts = [
    {
      id: 1,
      author: {
        name: "Sarah Chen",
        username: "@sarahchen",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        role: "Full Stack Developer"
      },
      content: "Just deployed our AI study companion app! 🚀 Used Next.js + OpenAI API + Tailwind. The real-time response generation is mind-blowing. Looking for beta testers - especially if you're studying CS or Math. Drop a comment if interested! #AIProject #EdTech",
      timestamp: "2h ago",
      likes: 45,
      comments: 12,
      shares: 8,
      tags: ["AI", "EdTech", "NextJS"],
      hasImage: false
    },
    {
      id: 2,
      author: {
        name: "Mike Johnson",
        username: "@mikej",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        role: "Mobile Developer"
      },
      content: "Hot take: Flutter > React Native for campus apps. Just finished migrating our campus event app and the performance difference is insane. DM me if you want to see the benchmarks! Also looking for a UI/UX designer to polish the interface 🎨",
      timestamp: "4h ago",
      likes: 32,
      comments: 28,
      shares: 5,
      tags: ["Flutter", "MobileApp", "UIUXNeeded"],
      hasImage: true,
      image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600"
    },
    {
      id: 3,
      author: {
        name: "Emily Green",
        username: "@emilygreen",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        role: "Environmental Science + CS"
      },
      content: "Update on our Sustainable Campus Tracker: We just integrated real-time data from campus IoT sensors! 📊 Now tracking energy usage across 15 buildings. Need help with data visualization - any D3.js experts here? #Sustainability #DataViz #IoT",
      timestamp: "6h ago",
      likes: 67,
      comments: 23,
      shares: 15,
      tags: ["GreenTech", "IoT", "DataViz"],
      hasImage: false
    },
    {
      id: 4,
      author: {
        name: "Alex Rivera",
        username: "@alexrivera",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        role: "VR Developer"
      },
      content: "🤯 Just discovered Three.js can handle 10k+ objects in WebVR without dropping frames if you use instanced meshes correctly. Working on a virtual campus tour that lets prospective students explore in VR. Who wants to collab on the 3D modeling side?",
      timestamp: "8h ago",
      likes: 89,
      comments: 34,
      shares: 22,
      tags: ["VR", "ThreeJS", "3DModeling"],
      hasImage: false
    },
    {
      id: 5,
      author: {
        name: "Lisa Wang",
        username: "@lisawang",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
        role: "Data Science Major"
      },
      content: "Machine Learning tip of the day: If your model is overfitting, try dropout layers before reaching for more data. Just improved our recommendation engine accuracy from 72% to 89% with this simple trick! Working on a tutorial, drop a 💡 if you want to see it!",
      timestamp: "12h ago",
      likes: 124,
      comments: 45,
      shares: 38,
      tags: ["MachineLearning", "Tutorial", "DataScience"],
      hasImage: false
    }
  ];

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
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" 
                  alt="Your avatar" 
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Share your project updates, tech thoughts, or ask for collaborators..."
                    className="w-full p-4 border border-gray-200 rounded-xl resize-none h-24 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
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
                    <button className="cursor-pointer px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                        <span className="text-gray-500 text-sm">{post.author.username}</span>
                      </div>
                      <p className="text-sm text-gray-600">{post.author.role} • {post.timestamp}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-gray-800 leading-relaxed">{post.content}</p>
                  {post.hasImage && (
                    <img 
                      src={post.image} 
                      alt="Post content" 
                      className="mt-4 rounded-xl w-full max-h-96 object-cover"
                    />
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, idx) => (
                    <span key={idx} className="text-indigo-600 text-sm hover:underline cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-end pr-2 pt-4 border-t">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 transition-colors ${
                      likedPosts.has(post.id) 
                        ? 'text-red-600' 
                        : 'text-gray-500 hover:text-red-600'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  {/* <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </button> */}
                  {/* <button className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.shares}</span>
                  </button> */}
                  {/* <button className="text-gray-500 hover:text-indigo-600 transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </button> */}
                </div>
              </div>
            ))}
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
            <div className="bg-white rounded-2xl shadow-sm p-6">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;