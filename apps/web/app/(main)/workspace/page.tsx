'use client'
import React, { useState, useEffect } from 'react';
import { Folder, CheckCircle, Circle, MoreVertical, MessageSquare, UserPlus, Settings, Tag, TrendingUp, AlertCircle, Star, ArrowRight, Filter, Search, Grid, List, Crown, Check, Users } from 'lucide-react';
import axios from 'axios';
import { useUserStore } from '../../../zustand/userStore';
import { toast } from 'sonner';

const WorkspacePage = () => {

  type Task = {
    id: number;
    title: string;
    status: 'completed' | 'pending';
    priority: 'high' | 'medium' | 'low';
    dueDate: string;
  };

  type TeamMember = {
    id: number;
    name: string;
    avatar: string;
    role: string;
  };

  type Project = {
    id: string;
    title: string;
    description: string;
    teamIds: string[];
    members: number;
    author: {
      id: string;
      fullName: string;
    };
    myTasks?: Task[];
    githubLink?: string;
    liveLink?: string;
  };

  type AvailableUser = {
    id: string;
    name: string;
    email: string;
    avatar: string;
    skills: string[];
  };

  type JoinRequest = {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    userEmail: string;
    requestDate: string;
    message?: string;
  };


 const { userId: currentUserId } = useUserStore();


  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'created' | 'joined'>('all');
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showCompleteDialog, setShowCompleteDialog] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showTaskCompleteDialog, setShowTaskCompleteDialog] = useState<{projectId: string, taskId: number, taskTitle: string} | null>(null);
  const [inviteSearchTerm, setInviteSearchTerm] = useState<string>('');
  const [showRequestsModal, setShowRequestsModal] = useState<boolean>(false);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);

  // Dummy join requests data
  const dummyJoinRequests: JoinRequest[] = [
    {
      id: "req1",
      userId: "user001",
      userName: "Alice Johnson",
      userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      userEmail: "alice.johnson@university.edu",
      requestDate: "2 hours ago",
      message: "I'm interested in contributing to the frontend development"
    },
    {
      id: "req2",
      userId: "user002",
      userName: "Bob Smith",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      userEmail: "bob.smith@university.edu",
      requestDate: "5 hours ago",
      message: "I have experience with ML and would love to help"
    },
    {
      id: "req3",
      userId: "user003",
      userName: "Carol Davis",
      userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      userEmail: "carol.davis@university.edu",
      requestDate: "1 day ago"
    }
  ];

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

 
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_DEV_API_URL}/project/${currentUserId}`);
      const data = response.data;

      // Map API response to component structure (matching API format)
      const mappedProjects = [
        ...(data.self?.map((project: any) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          teamIds: project.teamIds || [],
          members: project.members || 0,
          author: project.author || {},
        })) || []),
        ...(data.others?.map((project: any) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          teamIds: project.teamIds || [],
          members: project.members || 0,
          author: project.author || {},
        })) || [])
      ];

      setProjects(mappedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Available users for invitation
  const availableUsers: AvailableUser[] = [
    {
      id: "user789",
      name: "Jessica Martinez",
      email: "jessica.martinez@university.edu",
      avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150",
      skills: ["UI/UX Design", "Frontend", "Figma"]
    },
    {
      id: "user790",
      name: "Robert Taylor",
      email: "robert.taylor@university.edu",
      avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150",
      skills: ["Machine Learning", "Python", "TensorFlow"]
    },
    {
      id: "user791",
      name: "Anna Williams",
      email: "anna.williams@university.edu",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
      skills: ["Frontend", "React", "TypeScript"]
    },
    {
      id: "user792",
      name: "James Chen",
      email: "james.chen@university.edu",
      avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150",
      skills: ["Blockchain", "Solidity", "Security"]
    },
    {
      id: "user793",
      name: "Maria Garcia",
      email: "maria.garcia@university.edu",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150",
      skills: ["Backend", "Node.js", "Security Auditing"]
    }
  ];

  const getTaskStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleTaskStatusChange = async (projectId: string, taskId: number, newStatus: 'completed' | 'pending') => {
    try {
      // API call to update task status
      await axios.post(`/api/projects/${projectId}/tasks/${taskId}/status`, {
        status: newStatus
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Update local state
      setProjects(prevProjects => 
        prevProjects.map(project => {
          if (project.id === projectId) {
            return {
              ...project,
              myTasks: project.myTasks?.map(task =>
                task.id === taskId ? { ...task, status: newStatus } : task
              )
            };
          }
          return project;
        })
      );
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status');
    }
  };

  const handleProjectComplete = async () => {
    if (!selectedProject || !selectedProject.githubLink) return;

    try {
      // API call to mark project as completed
      await axios.post(`/api/projects/${selectedProject.id}/complete`, {
        githubLink: selectedProject.githubLink,
        liveLink: selectedProject.liveLink
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Update local state or refetch projects
      await fetchProjects();
      
      setShowCompleteDialog(false);
      setSelectedProject(null);
      alert('Project marked as completed successfully!');
    } catch (error) {
      console.error('Error completing project:', error);
      alert('Failed to mark project as completed');
    }
  };

  const handleRequestAction = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      // API call to handle request
      await axios.post(`/api/projects/${selectedProject?.id}/requests/${requestId}/${action}`, {}, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Remove from local state
      setJoinRequests(prev => prev.filter(req => req.id !== requestId));
      
      toast(`Request ${action}d successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      toast(`Failed to ${action} request`);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };


let filteredProjects = filterType === 'all' 
  ? projects 
  : filterType === 'created' 
    ? projects.filter(p => p.author && p.author.id === currentUserId)
    : projects.filter(p => p.author && p.author.id !== currentUserId);

if (searchTerm.trim() !== '') {
  const lower = searchTerm.toLowerCase();
  filteredProjects = filteredProjects.filter(p =>
    p.title.toLowerCase().includes(lower) ||
    p.description.toLowerCase().includes(lower)
  );
}

  // Filter available users based on search term
  const filteredAvailableUsers = inviteSearchTerm.trim() === '' 
    ? availableUsers 
    : availableUsers.filter(user => 
        user.name.toLowerCase().includes(inviteSearchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(inviteSearchTerm.toLowerCase())
      );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 mt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Total Projects</span>
              <Folder className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
            <p className="text-sm text-gray-500 mt-1">Active workspace</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">My Tasks</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {String(projects.reduce((acc, p) => acc + (p.myTasks ? p.myTasks.length : 0), 0))}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {String(projects.reduce((acc, p) => acc + (p.myTasks ? p.myTasks.filter((t:any) => t.status === 'completed').length : 0), 0))} completed
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className='flex justify-center gap-4 mb-5'>
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setFilterType('all')}
              className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-all ${
                filterType === 'all' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Projects ({projects.length})
            </button>
            <button
              onClick={() => setFilterType('created')}
              className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-all ${
                filterType === 'created' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Created by Me ({projects.filter(p => p.author && p.author.id === currentUserId).length})
            </button>
            <button
              onClick={() => setFilterType('joined')}
              className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-all ${
                filterType === 'joined' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Joined Projects ({projects.filter(p => p.author && p.author.id !== currentUserId).length})
            </button>
          </div>
        </div>

        {/* Projects Grid/List */}
        <div className={'space-y-6'}>
          {filteredProjects.map((project: any) => {
            const isCreator = project.author && project.author.id === currentUserId;

            return (
              <div key={project.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="p-6">
                  {/* Project Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                        {isCreator && (
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            Creator
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{project.description}</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Team Members */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {/* Team avatars could be rendered here if available */}
                      </div>
                      <span className="text-sm text-gray-600">{project.teamIds?.length || 0} / {project.members || 0} members</span>
                    </div>
                    {/* Show Invite and Requests buttons for project creator only */}
                    {isCreator && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedProject(project);
                            setJoinRequests(dummyJoinRequests);
                            setShowRequestsModal(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                        >
                          <Users className="w-4 h-4" />
                          Requests
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProject(project);
                            setShowInviteModal(true);
                            setSelectedUsers([]);
                            setInviteSearchTerm('');
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                          Invite
                        </button>
                      </div>
                    )}
                  </div>

                  {/* My Tasks Section */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-indigo-600" />
                      My Tasks ({project.myTasks?.filter((t:any) => t.status !== 'completed').length} active)
                    </h4>
                    <div className="space-y-2 max-h-36 overflow-y-auto">
                      {project.myTasks?.map((task: Task) => (
                        <div key={task.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            {getTaskStatusIcon(task.status)}
                            <span
                              className={`text-sm ${task.status === 'completed' ? 'line-through text-gray-400 cursor-pointer hover:underline' : 'text-gray-700 cursor-pointer hover:underline'}`}
                              onClick={() => {
                                if (task.status === 'pending') {
                                  setShowTaskCompleteDialog({projectId: project.id, taskId: task.id, taskTitle: task.title});
                                } else if (task.status === 'completed') {
                                  handleTaskStatusChange(project.id, task.id, 'pending');
                                }
                              }}
                              title={task.status === 'pending' ? 'Mark as completed' : 'Mark as pending'}
                            >
                              {task.title}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <a
                      href={`/workspace/${project.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Discussions
                    </a>
                    {isCreator && (
                      <button
                        className="cursor-pointer px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors"
                        onClick={() => {
                          setSelectedProject(project);
                          setShowCompleteDialog(true);
                        }}
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complete Project Confirmation Dialog */}
      {showCompleteDialog && selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mark Project as Completed?</h2>
              <p className="text-sm text-gray-600 mb-4">Are you sure you want to mark <span className="font-semibold">{selectedProject.title}</span> as completed? This action cannot be undone.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Link *</label>
                  <input
                    type="url"
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                    placeholder="https://github.com/your-repo"
                    value={selectedProject.githubLink || ''}
                    onChange={e => setSelectedProject({ ...selectedProject, githubLink: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Live Link (optional)</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                    placeholder="https://your-live-app.com"
                    value={selectedProject.liveLink || ''}
                    onChange={e => setSelectedProject({ ...selectedProject, liveLink: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCompleteDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                onClick={handleProjectComplete}
                disabled={!selectedProject.githubLink}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Complete Confirmation Dialog */}
      {showTaskCompleteDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mark Task as Completed?</h2>
              <p className="text-sm text-gray-600">Are you sure you want to mark <span className="font-semibold">{showTaskCompleteDialog.taskTitle}</span> as completed?</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowTaskCompleteDialog(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                onClick={() => {
                  if (showTaskCompleteDialog) {
                    handleTaskStatusChange(
                      showTaskCompleteDialog.projectId, 
                      showTaskCompleteDialog.taskId, 
                      'completed'
                    );
                    setShowTaskCompleteDialog(null);
                  }
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Requests Modal */}
      {showRequestsModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Join Requests</h2>
              <p className="text-sm text-gray-600">Manage requests to join {selectedProject.title}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {joinRequests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">User</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Request Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Message</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {joinRequests.map((request) => (
                        <tr key={request.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={request.userAvatar}
                                alt={request.userName}
                                className="w-10 h-10 rounded-full"
                              />
                              <span className="font-medium text-gray-900">{request.userName}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-600">{request.userEmail}</td>
                          <td className="py-4 px-4 text-gray-600">{request.requestDate}</td>
                          <td className="py-4 px-4 text-gray-600">
                            {request.message || <span className="text-gray-400 italic">No message</span>}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleRequestAction(request.id, 'approve')}
                                className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRequestAction(request.id, 'reject')}
                                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No pending join requests</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50">
              <button
                onClick={() => {
                  setShowRequestsModal(false);
                  setJoinRequests([]);
                }}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Invite Team Members</h2>
              <p className="text-sm text-gray-600 mb-4">Select users to invite to {selectedProject.title}</p>
              
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  value={inviteSearchTerm}
                  onChange={(e) => setInviteSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {filteredAvailableUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => toggleUserSelection(user.id)}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedUsers.includes(user.id) 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-full"
                        />
                        {selectedUsers.includes(user.id) && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => {}}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                ))}
                {filteredAvailableUsers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No users found matching "{inviteSearchTerm}"
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">
                  {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                    setSelectedUsers([]);
                    setInviteSearchTerm('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={selectedUsers.length === 0}
                  onClick={() => {
                    // Here you would send invites to selected users
                    console.log('Inviting users:', selectedUsers);
                    setShowInviteModal(false);
                    setSelectedUsers([]);
                    setInviteSearchTerm('');
                  }}
                >
                  Send Invites ({selectedUsers.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspacePage;