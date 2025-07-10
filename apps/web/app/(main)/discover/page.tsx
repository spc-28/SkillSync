'use client'
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, TrendingUp, Send, Image, Smile, Sparkles, Users, Calendar, Rocket, ChevronRight, MessageSquare, UserPlus, Code, Zap, Coffee, Loader2 } from 'lucide-react';
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
  
  const [recommendations, setRecommendations] = useState<any>(null);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [recommendationsError, setRecommendationsError] = useState<string | null>(null);
  
  const { userId } = useUserStore();
    const userGender = useUserStore((state) => state.userGender);
    const userName = useUserStore((state) => state.userName);
  const router = useRouter();
  
  const RECOMMENDATIONS_KEY = 'cached_recommendations';
  const RECOMMENDATIONS_TIMESTAMP_KEY = 'recommendations_timestamp';
  const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 hour
  
  const isCacheValid = () => {
    const timestamp = sessionStorage.getItem(RECOMMENDATIONS_TIMESTAMP_KEY);
    if (!timestamp) return false;
    
    const age = Date.now() - parseInt(timestamp);
    return age < CACHE_DURATION;
  };
  
  // Get cached recommendations
  const getCachedRecommendations = () => {
    try {
      const cached = sessionStorage.getItem(RECOMMENDATIONS_KEY);
      if (cached && isCacheValid()) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }
    return null;
  };
  
  // Save recommendations to cache
  const cacheRecommendations = (data: any) => {
    try {
      sessionStorage.setItem(RECOMMENDATIONS_KEY, JSON.stringify(data));
      sessionStorage.setItem(RECOMMENDATIONS_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  };
  
  // Clear recommendations cache
  const clearRecommendationsCache = () => {
    sessionStorage.removeItem(RECOMMENDATIONS_KEY);
    sessionStorage.removeItem(RECOMMENDATIONS_TIMESTAMP_KEY);
  };
  
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


  const fetchRecommendations = async (forceRefresh = false) => {
    if (!forceRefresh) {
      const cached = getCachedRecommendations();
      if (cached) {
        console.log('Using cached recommendations');
        setRecommendations(cached);
        setRecommendationsLoading(false);
        return;
      }
    }
    
    setRecommendationsLoading(true);
    setRecommendationsError(null);
    try {
      console.log('Fetching fresh recommendations...');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_DEV_API_URL}/gemini/recommendation/${userId}`);
      setRecommendations(res.data);
      cacheRecommendations(res.data);
    } catch (err: any) {
      setRecommendationsError(err?.response?.data?.message || 'Failed to load recommendations.');
    } finally {
      setRecommendationsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch posts and recommendations independently
    fetchPosts();
    fetchRecommendations();
  }, []);

  // Post submit handler
  const handlePostSubmit = async () => {
    if (!postContent.trim() && !imageFile) return;
    setLoading(true);
    setError(null);
    try {
      let imageUrl = null;
      if (imageFile) {
        // Upload image via API
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await axios.post(`${process.env.NEXT_PUBLIC_DEV_API_URL}/post/image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = uploadRes.data?.imageUrl;
      }
      const res = await axios.post(`${process.env.NEXT_PUBLIC_DEV_API_URL}/post`, {
        authorId: userId,
        content: postContent,
        ...(imageUrl ? { imageUrl } : {})
      });
      setPostContent('');
      setImageFile(null);
      setImagePreview(null);
      toast.success(res.data.message);
      await fetchPosts();
    } 
    catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to post. Please try again.');
    } 
    finally {
      setLoading(false);
    }
  };

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

  // Format date for events
  const formatEventDate = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    
    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString('en-US', { ...options, year: 'numeric' });
    }
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
    </div>
  );

  const handleRefreshRecommendations = () => {
    clearRecommendationsCache();
    fetchRecommendations(true);
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
                  src={`https://avatar.iran.liara.run/public/${userGender}?username=${userName}`} 
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
                        className="mt-4 rounded-xl w-full max-h-96 object-cover border border-gray-200"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
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
                </div>
              ))
            )}
          </div>

          {/* Right Sidebar - AI Recommendations */}
          <div className="space-y-6">
            {/* AI Badge */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-semibold">AI-Powered Recommendations</h3>
                </div>
                {!recommendationsLoading && (
                  <button
                    onClick={handleRefreshRecommendations}
                    className="text-white/80 hover:text-white transition-colors"
                    title="Refresh recommendations"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
              <p className="text-sm text-white/80">
                {recommendationsLoading ? 'Analyzing your interests...' : 'Personalized suggestions based on your skills and interests'}
              </p>
            </div>

            {/* Recommended Users */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                People to Connect With
              </h3>
              {recommendationsLoading ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Finding perfect matches for you...
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <LoadingSkeleton />
                    </div>
                  ))}
                </div>
              ) : recommendationsError ? (
                <p className="text-sm text-red-500">Failed to load recommendations</p>
              ) : recommendations?.recommendedUsers?.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.recommendedUsers.map((user: any, idx: number) => (
                    <div key={user.userId} className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={`https://avatar.iran.liara.run/public/${user.gender === 'Female' ? 'girl' : 'boy'}?${idx}`} 
                          alt={user.fullName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{user.fullName}</h4>
                        </div>
                      </div>
                      <button 
                        onClick={() => router.push(`/profile/${user.userId}`)}
                        className="px-3 py-1 cursor-pointer bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1"
                      >
                        <UserPlus className="w-3 h-3" />
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No recommendations available</p>
              )}
            </div>

            {/* Recommended Projects */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-purple-600" />
                Projects for You
              </h3>
              {recommendationsLoading ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Discovering exciting projects...
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2 pb-4 border-b last:border-0">
                      <LoadingSkeleton />
                    </div>
                  ))}
                </div>
              ) : recommendationsError ? (
                <p className="text-sm text-red-500">Failed to load projects</p>
              ) : recommendations?.recommendedProjects?.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.recommendedProjects.map((project: any) => (
                    <div key={project.projectId} className="border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{project.title}</h4>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full capitalize">
                          {project.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{project.description}</p>
                      <button 
                        onClick={() => router.push(`/projects`)}
                        className="text-indigo-600 cursor-pointer text-xs font-medium hover:text-indigo-700"
                      >
                        View Project →
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No projects available</p>
              )}
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-600" />
                Events to Join
              </h3>
              {recommendationsLoading ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading upcoming events...
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2 pb-3 border-b last:border-0">
                      <LoadingSkeleton />
                    </div>
                  ))}
                </div>
              ) : recommendationsError ? (
                <p className="text-sm text-red-500">Failed to load events</p>
              ) : recommendations?.recommendedEvents?.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.recommendedEvents.map((event: any) => (
                    <div key={event.id} className="border-b last:border-0 pb-3 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{event.eventName}</h4>
                          <p className="text-xs text-gray-600">
                            {formatEventDate(event.startDate, event.endDate)} • {event.eventType}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{event.organizer}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          event.status 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {event.status ? 'Open' : 'Closed'}
                        </span>
                      </div>
                      {/* {event.officialWebsite && (
                        <a 
                          href={event.officialWebsite} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-600 text-xs font-medium hover:text-indigo-700 inline-block mt-2"
                        >
                          Learn More →
                        </a>
                      )} */}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No events available</p>
              )}
              <Link href="/events">
                <button className="cursor-pointer w-full mt-4 text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center justify-center gap-1">
                  Browse All Events
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;