'use client'
import React, { useState } from 'react';
import { Plus, Search, Filter, Users, Clock, Calendar, Tag, MessageSquare, GitBranch, Star, ExternalLink, X, Upload, ChevronDown, Sparkles, Rocket, Award, TrendingUp, Code, Palette, BarChart, MessageCircle } from 'lucide-react';

const ProjectsPage = () => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: string;
    duration: string;
    teamSize: string;
    skillsNeeded: string[];
    requirements: string;
  }>({
    title: '',
    description: '',
    category: '',
    duration: '',
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

  type ProjectStatus = 'ongoing' | 'completed';
  type TeamMember = { id: number; avatar: string };
  type Author = { name: string; avatar: string; role: string };
  type OngoingProject = {
    id: number;
    title: string;
    description: string;
    category: string;
    author: Author;
    team: TeamMember[];
    skillsNeeded: string[];
    progress: number;
    deadline: string;
    members: string;
    stars: number;
    discussions: number;
    status: 'ongoing';
  };
  type CompletedProject = {
    id: number;
    title: string;
    description: string;
    category: string;
    author: Author;
    team: TeamMember[];
    skillsNeeded: string[];
    github?: string;
    link?: string;
    progress: number;
    completedDate: string;
    members: string;
    stars: number;
    discussions: number;
    status: 'completed';
  };
  type Project = OngoingProject | CompletedProject;

  const ongoingProjects: OngoingProject[] = [
    {
      id: 1,
      title: "AI-Powered Study Companion",
      description: "Building an intelligent study assistant that helps students learn more effectively through personalized recommendations and adaptive learning paths.",
      category: "AI/ML",
      author: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        role: "Project Lead"
      },
      team: [
        { id: 1, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
        { id: 2, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" },
        { id: 3, avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150" }
      ],
      skillsNeeded: ["Python", "React", "TensorFlow", "UI/UX"],
      progress: 65,
      deadline: "Apr 15, 2024",
      members: "3/5",
      stars: 24,
      discussions: 18,
      status: "ongoing"
    },
    {
      id: 2,
      title: "Campus Event Management Platform",
      description: "Creating a comprehensive platform for students to discover, organize, and manage campus events with real-time updates and social features.",
      category: "Web Development",
      author: {
        name: "Mike Johnson",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        role: "Full Stack Developer"
      },
      team: [
        { id: 1, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" },
        { id: 2, avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150" }
      ],
      skillsNeeded: ["Next.js", "Node.js", "MongoDB", "Tailwind CSS"],
      progress: 40,
      deadline: "May 1, 2024",
      members: "2/4",
      stars: 18,
      discussions: 12,
      status: "ongoing"
    },
    {
      id: 3,
      title: "Sustainable Campus Tracker",
      description: "Developing a mobile app to track and gamify sustainable practices on campus, including recycling, energy usage, and carbon footprint reduction.",
      category: "Mobile Apps",
      author: {
        name: "Emily Green",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        role: "Environmental Science"
      },
      team: [
        { id: 1, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150" },
        { id: 2, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150" },
        { id: 3, avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150" },
        { id: 4, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" }
      ],
      skillsNeeded: ["React Native", "Firebase", "Data Visualization"],
      progress: 80,
      deadline: "Mar 30, 2024",
      members: "4/4",
      stars: 32,
      discussions: 25,
      status: "ongoing"
    }
  ];

  const completedProjects: CompletedProject[] = [
    {
      id: 4,
      title: "Virtual Reality Campus Tour",
      description: "Created an immersive VR experience for prospective students to explore campus remotely with interactive hotspots and information panels.",
      category: "Other",
      author: {
        name: "Alex Rivera",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        role: "VR Developer"
      },
      team: [
        { id: 1, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
        { id: 2, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
        { id: 3, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" }
      ],
      skillsNeeded: ["Unity", "C#", "3D Modeling", "UI/UX"],
      github: "https://github.com",
      link: 'https://github.com',
      progress: 100,
      completedDate: "Feb 28, 2024",
      members: "3/3",
      stars: 45,
      discussions: 30,
      status: "completed"
    }
  ];

  const projects: Project[] = activeTab === 'ongoing' ? ongoingProjects : completedProjects;
  const [searchTerm, setSearchTerm] = useState('');
  const filteredProjects: Project[] = projects.filter((p) => {
    // Category filter
    const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase().includes(selectedCategory);
    // Search filter (case-insensitive, checks title, description, author, skills, team)
    const term = searchTerm.trim().toLowerCase();
    if (!term) return matchesCategory;
    const inSkills = p.skillsNeeded && p.skillsNeeded.some((skill: string) => skill.toLowerCase().includes(term));
    const inTeam = p.team && p.team.some((member: any) => member.avatar && member.avatar.toLowerCase().includes(term));
    return matchesCategory && (
      p.title.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      (p.author && p.author.name.toLowerCase().includes(term)) ||
      inSkills ||
      inTeam
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

  const Logo = () => (
    <svg viewBox="0 0 200 200" className="w-8 h-8">
      <g transform="translate(100, 100)">
        <path d="M 60 0 A 60 60 0 0 1 0 60" fill="none" stroke="#6366F1" strokeWidth="8" strokeLinecap="round"/>
        <path d="M -60 0 A 60 60 0 0 1 0 -60" fill="none" stroke="#8B5CF6" strokeWidth="8" strokeLinecap="round"/>
        <circle cx="0" cy="-60" r="10" fill="#6366F1"/>
        <circle cx="0" cy="60" r="10" fill="#8B5CF6"/>
        <g transform="scale(1.2)">
          <path d="M -10 -5 L -10 5 L -5 5 M 5 5 L 10 5 L 10 -5 M 10 -5 L 5 -5" fill="none" stroke="#1F2937" strokeWidth="3" strokeLinecap="round"/>
          <path d="M -7 -8 L -13 -2 L -7 4" fill="none" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M 7 8 L 13 2 L 7 -4" fill="none" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
      </g>
    </svg>
  );

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
                  <span className="font-semibold">{ongoingProjects.length + completedProjects.length} Total Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">500+ Active Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">85% Success Rate</span>
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
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'ongoing' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Ongoing Projects
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'completed' 
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
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
          {filteredProjects.map((project: Project) => (
            <div key={project.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-gray-900">{project.title}</h3>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                        {project.category}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed max-w-3xl">
                      {project.description}
                    </p>
                  </div>
                  <a
                    href={`/workspace/${project.id}`}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                  >
                    {project.status=='ongoing' ? "Ping to Collaborate" : "Open Workspace"}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={project.author.avatar} 
                    alt={project.author.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{project.author.name}</p>
                    <p className="text-sm text-gray-600">{project.author.role}</p>
                  </div>
                </div>

                {/* Skills Needed */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Skills Needed</h4>
                  <div className="flex justify-between">
                    <div className='flex flex-wrap gap-2'>
                    {project.skillsNeeded.map((skill, idx) => (
                      <span key={idx} className="px-3 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                    </div>
                    {project.status === 'completed' && 'github' in project && 'link' in project ? (
                    <div className="flex gap-2 min-w-[160px]">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors justify-center"
                        >
                          <GitBranch className="w-4 h-4" />
                          GitHub
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors justify-center"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Live Link
                        </a>
                      )}
                    </div>
                  ) : ""}
                  </div>
                </div>

                {/* Project Stats */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <div className="flex items-center gap-6">
                    {/* Team Members */}
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {project.team.slice(0, 4).map((member: TeamMember) => (
                          <img
                            key={member.id}
                            src={member.avatar}
                            alt=""
                            className="w-8 h-8 rounded-full border-2 border-white"
                          />
                        ))}
                        {project.team.length > 4 && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">+{project.team.length - 4}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">
                        <Users className="w-4 h-4 inline mr-1" />
                        {project.members}
                      </span>
                    </div>

                    {/* Progress */}
                    {project.status === 'ongoing' && (
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{project.progress}%</span>
                      </div>
                    )}

                    {/* Deadline/Completed Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {project.status === 'ongoing' ? (
                        <>Due {project.deadline}</>
                      ) : (
                        <>Completed {project.completedDate}</>
                      )}
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  <div className="flex items-center gap-4">
                    <button className="cursor-pointer flex items-center gap-1.5 text-gray-600 hover:text-amber-600 transition-colors">
                      <Star className="w-4 h-4" />
                      <span className="text-sm font-medium">{project.stars}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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

              {/* Category and Duration */}
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
                    <option value="web">Web Development</option>
                    <option value="mobile">Mobile Apps</option>
                    <option value="ai">AI/ML</option>
                    <option value="design">Design</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration *
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  >
                    <option value="">Select duration</option>
                    <option value="1-2weeks">1-2 weeks</option>
                    <option value="1month">1 month</option>
                    <option value="2-3months">2-3 months</option>
                    <option value="3-6months">3-6 months</option>
                    <option value="6months+">6+ months</option>
                  </select>
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
                  onClick={() => {
                    console.log('Creating project:', formData);
                    setShowCreateModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
                  Create Project
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