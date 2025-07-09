'use client'
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Users, Clock, Calendar, Tag, MessageSquare, GitBranch, Star, ExternalLink, X, Upload, ChevronDown, Sparkles, Rocket, Award, TrendingUp, Code, Palette, BarChart, MessageCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useUserStore } from '../../../zustand/userStore';
import { useRouter } from 'next/navigation';

const ProjectsPage = () => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showRequirementsModal, setShowRequirementsModal] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiProjects, setApiProjects] = useState<any[]>([]);
  const [showPingModal, setShowPingModal] = useState<string | null>(null);
  const [pingPitch, setPingPitch] = useState<string>('');
  const [pingLoading, setPingLoading] = useState<boolean>(false);
  const { userId } = useUserStore();
  const router = useRouter();
  const [formData, setFormData] = useState<{

    title: string;
    description: string;
    category: string;
    deadline: string;
    teamSize: string;
    skillsNeeded: string[];
    requirements: string;
  }>({
    title: '',
    description: '',
    category: '',
    deadline: '',
    teamSize: '',
    skillsNeeded: [],
    requirements: ''
  });

  const categories = [
    { id: 'all', name: 'All Projects', icon: BarChart },
    { id: 'web', name: 'Web Development', icon: Code },
    { id: 'mobile', name: 'Mobile Apps', icon: Rocket },
    { id: 'ai', name: 'AI/ML', icon: Sparkles },
    { id: 'design', name: 'Design', icon: Palette },
    { id: 'other', name: 'Other', icon: Award }
  ];


  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`${process.env.NEXT_PUBLIC_DEV_API_URL}/project`)
      .then(res => {
        setApiProjects(res.data || []);
      })
      .catch(() => setApiProjects([]))
      .finally(() => setLoading(false));
  }, []);

  // Filter API projects
  const filteredProjects = apiProjects.filter((p) => {
    const matchesTab = p.status === activeTab;
    const matchesCategory = selectedCategory === 'all' || (p.category || '').toLowerCase().includes(selectedCategory);
    const term = searchTerm.trim().toLowerCase();
    if (!term) return matchesTab && matchesCategory;
    const inSkills = p.skillsNeeded && p.skillsNeeded.some((skill: string) => skill.toLowerCase().includes(term));
    return matchesTab && matchesCategory && (
      (p.title || '').toLowerCase().includes(term) ||
      (p.description || '').toLowerCase().includes(term) ||
      (p.author || '').toLowerCase().includes(term) ||
      inSkills
    );
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    setFormData(prev => ({ ...prev, skillsNeeded: skills }));
  };

  const handleSubmitProject = async () => {
    setIsSubmitting(true);
    try {
      // Validate form data
      if (!formData.title || !formData.description || !formData.category || !formData.deadline || !formData.teamSize) {
        toast('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      // API call to create project
      const response = await axios.post(`${process.env.NEXT_PUBLIC_DEV_API_URL}/project`,
        {
          title: formData.title,
          description: formData.description,
          category: (formData.category).toLowerCase(),
          deadline: formData.deadline,
          members: parseInt(formData.teamSize),
          author: userId,
          teamIds: [],
          skillsNeeded: formData.skillsNeeded,
          requirements: formData.requirements
        }
      );

      if (!response.status) {
        throw new Error('Failed to create project');
      }

      const data = response.data;
      console.log('Project created successfully:', data);

      setFormData({
        title: '',
        description: '',
        category: '',
        deadline: '',
        teamSize: '',
        skillsNeeded: [],
        requirements: ''
      });
      setShowCreateModal(false);
      toast.success("Project created successfully")
      // You might want to refresh the projects list here
      // fetchProjects();

    } catch (error) {
      console.error('Error creating project:', error);
      toast('Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">Discover & Build Amazing Projects</h2>
              <p className="text-lg text-white/90 mb-6">Join innovative teams or start your own project. Connect with talented students across campus.</p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  <span className="font-semibold">{apiProjects.length} Total Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">90% Success Rate</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="cursor-pointer flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-gray-50 transition-all hover:shadow-2xl hover:-translate-y-0.5 text-lg whitespace-nowrap"
            >
              <Plus className="w-6 h-6" />
              Create New Project
            </button>
          </div>
        </div>

        {/* Filters and Tabs */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              />
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'ongoing'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Ongoing Projects
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'completed'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${selectedCategory === cat.id
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="text-lg text-gray-500 animate-pulse">Loading projects...</span>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <span className="text-lg text-gray-400">No projects found.</span>
            </div>
          ) : filteredProjects.map((project, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-gray-900">{project.title}</h3>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                        {project.category.toUpperCase()}
                      </span>
                      {project.requirements && (
                        <button
                          onClick={() => setShowRequirementsModal(project.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                          title="View Requirements"
                        >
                          <Info className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-600 leading-relaxed max-w-3xl">
                      {project.description}
                    </p>
                  </div>
                  {project.status === 'ongoing' ? (
                    <button
                      className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                      onClick={() => setShowPingModal(project.id)}
                    >
                      Ping to Collaborate
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  ) : (
                    <p
                      onClick={()=> router.push(`/workspace/${project.id}`)}
                      className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                    >
                      Open Workspace
                      <ExternalLink className="w-4 h-4" />
                    </p>
                  )}

                  {/* Ping to Collaborate Modal */}
                  {showPingModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                      <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="mb-4">
                          <h2 className="text-xl font-bold text-gray-900 mb-2">Send a Pitch to Join</h2>
                          <p className="text-sm text-gray-600 mb-2">Tell the project creator why you want to join this project.</p>
                          <textarea
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none resize-none"
                            rows={4}
                            placeholder="Write your pitch here..."
                            value={pingPitch}
                            onChange={e => setPingPitch(e.target.value)}
                            disabled={pingLoading}
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setShowPingModal(null);
                              setPingPitch('');
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            disabled={pingLoading}
                          >
                            Cancel
                          </button>
                          <button
                            className={`flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors ${pingLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                            disabled={pingLoading || !pingPitch.trim()}
                            onClick={async () => {
                              setPingLoading(true);
                              try {
                                await axios.post(`${process.env.NEXT_PUBLIC_DEV_API_URL}/project/request`, {
                                  userId,
                                  message: pingPitch.trim(),
                                  projectId: project.id,
                                  authorId: project.author.id
                                });
                                toast.success('Request sent!');
                                setShowPingModal(null);
                                setPingPitch('');
                              } catch (error) {
                                toast.error('Failed to send request.');
                              } finally {
                                setPingLoading(false);
                              }
                            }}
                          >
                            {pingLoading ? 'Sending...' : 'Send Request'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Author Info (API only returns author id, so just show id or placeholder) */}
                <div onClick={()=> router.push(`/profile/${project.author.id}`)} className="flex items-center gap-4 mb-6 w-fit cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xl">
                    <img
                      src={`https://avatar.iran.liara.run/public/${index + 1}`}
                      alt="Your avatar"
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{typeof project.author.fullName === 'string' ? project.author.fullName : 'Author'}</p>
                  </div>
                </div>

                {/* Skills Needed */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Skills Needed</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.skillsNeeded && project.skillsNeeded.map((skill: string, idx: number) => {
                      // Generate a subtle random color for each tag
                      const pastelColors = [
                        'bg-rose-100 text-rose-700',
                        'bg-orange-100 text-orange-700',
                        'bg-amber-100 text-amber-700',
                        'bg-lime-100 text-lime-700',
                        'bg-emerald-100 text-emerald-700',
                        'bg-sky-100 text-sky-700',
                        'bg-indigo-100 text-indigo-700',
                        'bg-purple-100 text-purple-700',
                        'bg-pink-100 text-pink-700',
                        'bg-cyan-100 text-cyan-700',
                        'bg-fuchsia-100 text-fuchsia-700',
                        'bg-teal-100 text-teal-700',
                        'bg-blue-100 text-blue-700',
                        'bg-violet-100 text-violet-700',
                        'bg-green-100 text-green-700',
                        'bg-yellow-100 text-yellow-700',
                        'bg-red-100 text-red-700',
                      ];
                      // Use a hash of the skill name to pick a color
                      let hash = 0;
                      for (let i = 0; i < skill.length; i++) {
                        hash = skill.charCodeAt(i) + ((hash << 5) - hash);
                      }
                      const colorIdx = Math.abs(hash) % pastelColors.length;
                      const colorClass = pastelColors[colorIdx];
                      return (
                        <span key={idx} className={`px-3 py-2.5 rounded-lg text-sm font-medium ${colorClass}`}>
                          {skill}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Project Stats */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                      </div>
                      <span className="text-sm text-gray-600">
                        <Users className="w-4 h-4 inline mr-1" />
                        {project.teamIds.length} / {project.members}
                      </span>
                    </div>

                    {/* Deadline */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      Due {project.deadline}
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  {/* <div className="flex items-center gap-4">
                    <button className="cursor-pointer flex items-center gap-1.5 text-gray-600 hover:text-amber-600 transition-colors">
                      <Star className="w-4 h-4" />
                      <span className="text-sm font-medium">{project.stars || 0}</span>
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements Modal */}
      {showRequirementsModal !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Project Requirements</h3>
                <button
                  onClick={() => setShowRequirementsModal(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 leading-relaxed">
                {apiProjects.find(p => p.id === showRequirementsModal)?.requirements || 'No specific requirements listed.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Project Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  placeholder="Enter your project title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none"
                  placeholder="Describe your project and its goals..."
                />
              </div>

              {/* Category and Deadline */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  >
                    <option value="">Select category</option>
                    <option value="web development">Web Development</option>
                    <option value="mobile apps">Mobile Apps</option>
                    <option value="ai/ml">AI/ML</option>
                    <option value="design">Design</option>
                    <option value="others">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deadline *
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    min={today}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Team Size and Skills */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Size *
                  </label>
                  <input
                    type="number"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleInputChange}
                    min="2"
                    max="10"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    placeholder="e.g., 4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills Needed
                  </label>
                  <input
                    type="text"
                    onChange={handleSkillsChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    placeholder="React, Node.js, UI/UX..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Requirements & Expectations
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none"
                  placeholder="What are you looking for in team members? Any specific requirements?"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitProject}
                  disabled={isSubmitting}
                  className={`flex-1 px-6 py-3 rounded-xl font-medium transition-colors ${isSubmitting
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                >
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;