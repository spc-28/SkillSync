'use client'
import React, { useState } from 'react';
import { Folder, Users, Calendar, Clock, CheckCircle, Circle, MoreVertical, MessageSquare, UserPlus, Settings, Tag, TrendingUp, AlertCircle, Star, ArrowRight, Filter, Search, Grid, List, Crown } from 'lucide-react';

const WorkspacePage = () => {

  type Task = {
    id: number;
    title: string;
    status: 'completed' | 'in-progress' | 'pending';
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
    id: number;
    title: string;
    description: string;
    category: string;
    creatorId: string;
    creator: {
      name: string;
      avatar: string;
    };
    team: TeamMember[];
    vacantPositions: string[];
    progress: number;
    deadline: string;
    tasksAssigned: number;
    tasksCompleted: number;
    totalTasks: number;
    discussions: number;
    lastActivity: string;
    status: 'on-track' | 'needs-attention' | 'delayed' | string;
    myTasks: Task[];
  };

  const [filterType, setFilterType] = useState<'all' | 'created' | 'joined'>('all');
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showCompleteDialog, setShowCompleteDialog] = useState<boolean>(false);

  const currentUserId = "user123";

  const projects = [
    {
      id: 1,
      title: "AI Study Companion",
      description: "Building an intelligent study assistant that helps students learn more effectively through personalized recommendations.",
      category: "AI/ML",
      creatorId: "user123",
      creator: {
        name: "You",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
      },
      team: [
        { id: 1, name: "You", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", role: "Project Lead" },
        { id: 2, name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", role: "Frontend Dev" },
        { id: 3, name: "Mike Johnson", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150", role: "Backend Dev" }
      ],
      vacantPositions: ["UI/UX Designer", "ML Engineer"],
      progress: 65,
      deadline: "Apr 15, 2024",
      tasksAssigned: 8,
      tasksCompleted: 5,
      totalTasks: 12,
      discussions: 24,
      lastActivity: "2 hours ago",
      status: "on-track",
      myTasks: [
        { id: 1, title: "Review ML model architecture", status: "in-progress", priority: "high", dueDate: "Mar 28" },
        { id: 2, title: "Set up CI/CD pipeline", status: "pending", priority: "medium", dueDate: "Mar 30" },
        { id: 3, title: "Create API documentation", status: "completed", priority: "low", dueDate: "Mar 25" }
      ]
    },
    {
      id: 2,
      title: "Campus Event Platform",
      description: "Comprehensive platform for students to discover, organize, and manage campus events with real-time updates.",
      category: "Web Development",
      creatorId: "user456", // Current user is member
      creator: {
        name: "Emily Green",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
      },
      team: [
        { id: 1, name: "Emily Green", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", role: "Project Lead" },
        { id: 2, name: "You", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", role: "Full Stack Dev" },
        { id: 3, name: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", role: "Backend Dev" },
        { id: 4, name: "Lisa Wang", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150", role: "UI/UX Designer" }
      ],
      vacantPositions: [],
      progress: 40,
      deadline: "May 1, 2024",
      tasksAssigned: 5,
      tasksCompleted: 2,
      totalTasks: 20,
      discussions: 18,
      lastActivity: "5 hours ago",
      status: "on-track",
      myTasks: [
        { id: 1, title: "Implement event creation flow", status: "in-progress", priority: "high", dueDate: "Mar 29" },
        { id: 2, title: "Add real-time notifications", status: "pending", priority: "high", dueDate: "Apr 2" },
        { id: 3, title: "Optimize database queries", status: "pending", priority: "medium", dueDate: "Apr 5" }
      ]
    },
    {
      id: 3,
      title: "Blockchain Voting System",
      description: "Secure and transparent voting system for student government elections using blockchain technology.",
      category: "Blockchain",
      creatorId: "user123", // Current user is creator
      creator: {
        name: "You",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
      },
      team: [
        { id: 1, name: "You", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", role: "Project Lead" },
        { id: 2, name: "David Kim", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", role: "Blockchain Dev" }
      ],
      vacantPositions: ["Frontend Developer", "Security Auditor", "Backend Developer"],
      progress: 25,
      deadline: "Jun 15, 2024",
      tasksAssigned: 10,
      tasksCompleted: 3,
      totalTasks: 28,
      discussions: 12,
      lastActivity: "1 day ago",
      status: "needs-attention",
      myTasks: [
        { id: 1, title: "Design smart contract architecture", status: "completed", priority: "high", dueDate: "Mar 20" },
        { id: 2, title: "Set up development environment", status: "completed", priority: "medium", dueDate: "Mar 22" },
        { id: 3, title: "Write initial smart contracts", status: "in-progress", priority: "high", dueDate: "Apr 1" }
      ]
    }
  ];

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'on-track': return 'text-green-600 bg-green-100';
      case 'needs-attention': return 'text-amber-600 bg-amber-100';
      case 'delayed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTaskStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Circle className="w-4 h-4 text-blue-600 fill-blue-600" />;
      default: return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Filter by type first
  let filteredProjects = filterType === 'all' 
    ? projects 
    : filterType === 'created' 
      ? projects.filter(p => p.creatorId === currentUserId)
      : projects.filter(p => p.creatorId !== currentUserId);

  // Then filter by search term
  if (searchTerm.trim() !== '') {
    const lower = searchTerm.toLowerCase();
    filteredProjects = filteredProjects.filter(p =>
      p.title.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower) ||
      (p.category && p.category.toLowerCase().includes(lower))
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
              {projects.reduce((acc, p) => acc + p.tasksAssigned, 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {projects.reduce((acc, p) => acc + p.tasksCompleted, 0)} completed
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
              Created by Me ({projects.filter(p => p.creatorId === currentUserId).length})
            </button>
            <button
              onClick={() => setFilterType('joined')}
              className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-all ${
                filterType === 'joined' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Joined Projects ({projects.filter(p => p.creatorId !== currentUserId).length})
            </button>
          </div>
        </div>

        {/* Projects Grid/List */}
        <div className={'space-y-6'}>
          {filteredProjects.map((project: any) => {
            const isCreator = project.creatorId === currentUserId;
            
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
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status.replace('-', ' ')}
                        </span>
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
                        {project.team.slice(0, 4).map((member: TeamMember) => (
                          <img
                            key={member.id}
                            src={member.avatar}
                            alt={member.name}
                            className="w-8 h-8 rounded-full border-2 border-white"
                            title={member.name}
                          />
                        ))}
                        {project.team.length > 4 && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">+{project.team.length - 4}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">{project.team.length} members</span>
                    </div>
                    {isCreator && project.vacantPositions.length > 0 && (
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setShowInviteModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                      >
                        <UserPlus className="w-4 h-4" />
                        Invite ({project.vacantPositions.length} open)
                      </button>
                    )}
                  </div>

                  {/* My Tasks Section */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-indigo-600" />
                      My Tasks ({project.myTasks.filter((t:any) => t.status !== 'completed').length} active)
                    </h4>
                    <div className="space-y-2">
                      {project.myTasks.slice(0, 3).map((task: Task) => (
                        <div key={task.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            {getTaskStatusIcon(task.status)}
                            <span className={`text-sm ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-700'}`}> 
                              {task.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}> 
                              {task.priority}
                            </span>
                            <span className="text-xs text-gray-500">Due {task.dueDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {project.myTasks.length > 3 && (
                      <button className="text-sm text-indigo-600 hover:text-indigo-700 mt-2">
                        View all tasks →
                      </button>
                    )}
                  </div>

                  {/* Project Meta Info */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{project.totalTasks}</p>
                      <p className="text-xs text-gray-600">Total Tasks</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{project.discussions}</p>
                      <p className="text-xs text-gray-600">Discussions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{project.deadline.split(' ')[1]}</p>
                      <p className="text-xs text-gray-600">Deadline</p>
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
                        className=" cursor-pointer px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors"
                        onClick={() => {
                          setSelectedProject(project);
                          setShowCompleteDialog(true);
                        }}
                      >
                        Mark as Completed
                      </button>
                    )}
      {/* Complete Project Confirmation Dialog */}
      {showCompleteDialog && selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mark Project as Completed?</h2>
              <p className="text-sm text-gray-600">Are you sure you want to mark <span className="font-semibold">{selectedProject.title}</span> as completed? This action cannot be undone.</p>
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
                onClick={() => {
                  // Here you would update the project status in real app
                  setShowCompleteDialog(false);
                  setSelectedProject(null);
                  // Optionally show a toast/notification
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Invite Team Members</h2>
              <p className="text-sm text-gray-600">Fill vacant positions in {selectedProject.title}</p>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-gray-700">Open Positions:</h3>
              {selectedProject.vacantPositions.map((position: string, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{position}</span>
                  <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">
                    Find candidates →
                  </button>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invite by email or username
              </label>
              <input
                type="text"
                placeholder="Enter email or @username"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                Send Invites
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspacePage;