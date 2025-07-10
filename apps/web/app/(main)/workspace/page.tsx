'use client'
import React, { useState, useEffect } from 'react';
import { Folder, CheckCircle, Circle, MoreVertical, MessageSquare, UserPlus, Settings, Tag, TrendingUp, AlertCircle, Star, ArrowRight, Filter, Search, Grid, List, Crown, Check, Users, Github, Link } from 'lucide-react';
import axios from 'axios';
import { useUserStore } from '../../../zustand/userStore';
import { toast } from 'sonner';
import { useChatStore } from '../../../zustand/chatStore';
import { useRouter } from 'next/navigation';

const WorkspacePage = () => {

  type Task = {
    id: number;
    title: string;
    status: boolean;
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
    github?: string;
    link?: string;
    status: 'ongoing' | 'completed';
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
    message?: string;
    projectId: string;
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
  const [showTaskCompleteDialog, setShowTaskCompleteDialog] = useState<{ projectId: string, taskId: number, taskTitle: string } | null>(null);
  const [inviteSearchTerm, setInviteSearchTerm] = useState<string>('');
  const [showRequestsModal, setShowRequestsModal] = useState<boolean>(false);
  const [joinRequestsByProject, setJoinRequestsByProject] = useState<Record<string, JoinRequest[]>>({});
  const [requestsLoading, setRequestsLoading] = useState<boolean>(false);
  const users  = useChatStore((data)=>data.users);
  const { userId } = useUserStore();
  const router = useRouter();

  const fetchJoinRequests = async () => {
    setRequestsLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_DEV_API_URL}/project/request/${userId}`);
      const dataArr = Array.isArray(res.data) ? res.data : (res.data?.requests || []);
      const filtered = dataArr.filter((req: any) => req.status === false);
      // Group requests by projectId
      const grouped: Record<string, JoinRequest[]> = {};
      filtered.forEach((req: any) => {
        const joinReq: JoinRequest = {
          id: req.id,
          userId: req.userId,
          userName: req.userId, // Replace with actual user name if available
          message: req.message,
          projectId: req.projectId,
        };
        if (!grouped[joinReq.projectId]) grouped[joinReq.projectId] = [];
        //@ts-ignore
        grouped[joinReq.projectId].push(joinReq);
      });
      setJoinRequestsByProject(grouped);
    } catch (error) {
      setJoinRequestsByProject({});
      console.error('Failed to fetch join requests', error);
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchJoinRequests();
  }, []);


  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_DEV_API_URL}/project/${currentUserId}`);
      const data = response.data;

      const tasksRes = await axios.get(`${process.env.NEXT_PUBLIC_DEV_API_URL}/project/task/${userId}`);
      const allTasks = tasksRes.data;

      const mappedProjects = [
        ...(data.self?.map((project: any) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          teamIds: project.teamIds || [],
          members: project.members || 0,
          author: project.author || {},
          github: project.github,
          link: project.link,
          status: project.status === 'completed' ? 'completed' : 'ongoing',
        })) || []),
        ...(data.others?.map((project: any) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          teamIds: project.teamIds || [],
          members: project.members || 0,
          author: project.author || {},
          github: project.github,
          link: project.link,
          status: project.status === 'completed' ? 'completed' : 'ongoing',
        })) || [])
      ];

      // Place the tasks for each project accordingly
      const projectsWithTasks = mappedProjects.map((project) => {
        const projectTasks = allTasks
          .filter((task: any) => task.projectId === project.id)
          .map((task: any) => ({
            id: task.id,
            title: task.task,
            status: !!task.status,
            priority: 'medium', 
            dueDate: task.timestamp,
          }));
        return {
          ...project,
          myTasks: projectTasks,
        };
      });

      setProjects(projectsWithTasks);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const availableUsers: { id: string; name: string }[] = React.useMemo(() => {
    if (!users) return [];
    if (!selectedProject) {
      return users.filter((u: any) => u && u.id && u.name).map((u: any) => ({ id: u.id, name: u.name }));
    }
    const excludeIds = new Set([
      selectedProject.author?.id,
      ...(selectedProject.teamIds || [])
    ]);
    return users
      .filter((u: any) => u && u.id && u.name && !excludeIds.has(u.id))
      .map((u: any) => ({ id: u.id, name: u.name }));
  }, [users, selectedProject]);


  const getTaskStatusIcon = (status: Task['status']) => {
    return status
      ? <CheckCircle className="w-4 h-4 text-green-600" />
      : <Circle className="w-4 h-4 text-gray-400" />;
  };

  const handleTaskStatusChange = async (projectId: string, taskId: number, newStatus: boolean) => {
    const apiStatus = newStatus ? 'completed' : 'pending';
    try {
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
      toast('Failed to update task status');
    }
  };

  const handleProjectComplete = async () => {
    if (!selectedProject || !selectedProject.github) return;

    try {

      await axios.patch(`${process.env.NEXT_PUBLIC_DEV_API_URL}/project/${selectedProject.id}`, {
        githubLink: selectedProject.github,
        liveLink: selectedProject.link
      });

      await fetchProjects();

      setShowCompleteDialog(false);
      setSelectedProject(null);
      toast('Project marked as completed successfully!');
    } catch (error) {
      console.error('Error completing project:', error);
      toast('Failed to mark project as completed');
    }
  };

  const handleRequestAction = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      if (action == 'approve') {
        await axios.patch(`${process.env.NEXT_PUBLIC_DEV_API_URL}/project/request/${requestId}`);
      }
      else {
        await axios.delete(`${process.env.NEXT_PUBLIC_DEV_API_URL}/project/request/${requestId}`)
      };

      if (selectedProject) {
        setJoinRequestsByProject(prev => {
          const updated = { ...prev };
          if (Array.isArray(updated[selectedProject.id])) {
            updated[selectedProject.id] = updated[selectedProject.id]!.filter((req) => req.id !== requestId);
          }
          return updated;
        });
      }
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
      user.name.toLowerCase().includes(inviteSearchTerm.toLowerCase())
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
              {String(projects.reduce((acc, p) => acc + (p.myTasks ? p.myTasks.filter((t: any) => t.status === 'completed').length : 0), 0))} completed
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
              className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-all ${filterType === 'all'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
            >
              All Projects ({projects.length})
            </button>
            <button
              onClick={() => setFilterType('created')}
              className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-all ${filterType === 'created'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
            >
              Created by Me ({projects.filter(p => p.author && p.author.id === currentUserId).length})
            </button>
            <button
              onClick={() => setFilterType('joined')}
              className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-all ${filterType === 'joined'
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
                        {project.status === 'completed' ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Completed
                          </span>
                        ) : isCreator && (
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
                    {project.status=='ongoing' ?
                      (isCreator && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedProject(project);
                              fetchJoinRequests();
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
                      )) :
                      (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>{ setSelectedProject(project); window.open(project.github, "_blank")}}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                          >
                            <Github className="w-4 h-4" />
                            Github
                          </button>
                          <button
                            onClick={() =>{ setSelectedProject(project); window.open(project.link, "_blank")}}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            <Link className="w-4 h-4" />
                            Live Link
                          </button>
                        </div>
                      )
                    }
                  </div>

                  {/* My Tasks Section (hide for completed projects) */}
                  {project.status !== 'completed' && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-indigo-600" />
                        My Tasks ({project.myTasks?.filter((t: any) => !t.status).length} active)
                      </h4>
                      <div className="space-y-2 max-h-36 overflow-y-auto">
                        {project.myTasks?.filter((task: Task) => !task.status).map((task: Task) => (
                          <div key={task.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                            <div className="flex items-center gap-3">
                              {getTaskStatusIcon(task.status)}
                              <span
                                className={`text-sm text-gray-700 cursor-pointer hover:underline`}
                                onClick={() => {
                                  setShowTaskCompleteDialog({ projectId: project.id, taskId: task.id, taskTitle: task.title });
                                }}
                                title={'Mark as completed'}
                              >
                                {task.title}
                              </span>
                            </div>
                          </div>
                        ))}
                        {(!project.myTasks || project.myTasks.filter((t: any) => !t.status).length === 0) && (
                          <div className="text-gray-400 text-sm text-center py-2">No active tasks</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <a
                      href={`/workspace/${project.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Discussions
                    </a>
                    {isCreator && project.status === 'ongoing' && (
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
                    value={selectedProject.github || ''}
                    onChange={e => setSelectedProject({ ...selectedProject, github: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Live Link (optional)</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                    placeholder="https://your-live-app.com"
                    value={selectedProject.link || ''}
                    onChange={e => setSelectedProject({ ...selectedProject, link: e.target.value })}
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
                disabled={!selectedProject.github}
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
                onClick={async () => {
                  if (showTaskCompleteDialog) {
                    try {
                      await axios.patch(`${process.env.NEXT_PUBLIC_DEV_API_URL}/project/task/${showTaskCompleteDialog.taskId}`);
                      toast.success("Task completed successfully")
                    }
                    catch (error) {
                      toast.error("Failed to update task")
                      console.error('Failed to patch task status:', error);
                    }
                    handleTaskStatusChange(
                      showTaskCompleteDialog.projectId,
                      showTaskCompleteDialog.taskId,
                      true
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
              {requestsLoading ? (
                <div className="flex justify-center items-center py-12 text-gray-500">Loading requests...</div>
              ) : (joinRequestsByProject[selectedProject.id]?.length ?? 0) > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">User</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Message</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {joinRequestsByProject[selectedProject.id]?.map((request) => (
                        <tr key={request.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <span onClick={()=>router.push(`/profile/${request.userName}`)} className="font-medium text-gray-900 cursor-pointer py-1 px-1.5 border-1 rounded-lg">Visit Profile</span>
                            </div>
                          </td>
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
                  setJoinRequestsByProject({});
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
                    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedUsers.includes(user.id)
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
                          {user.name?.[0] || '?'}
                        </div>
                        {selectedUsers.includes(user.id) && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{user.name}</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div onClick={()=> router.push(`/profile/${user.id}`)} className='px-2 py-0.5 border-1 font-semibold rounded-md text-[0.7rem] z-50 bg-purple-200 text-purple-500'>Profile</div>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => { }}
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
                  onClick={async () => {
                    if (!selectedProject) return;
                    try {
                      await axios.patch(`${process.env.NEXT_PUBLIC_DEV_API_URL}/project/addUsers/${selectedProject.id}`,
                        { ids: selectedUsers }
                      );
                      toast.success('Users added successfully!');
                    } catch (error) {
                      toast.error('Failed to send invites');
                      console.error('Failed to send invites:', error);
                    }
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