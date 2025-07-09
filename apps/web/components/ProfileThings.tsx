import React, { useState } from 'react';
import axios from 'axios';
import { Github, ExternalLink, GitMerge, Trophy, Award, Calendar, Users, Plus, X, Upload, CheckCircle, Star, Code, Medal } from 'lucide-react';
import { useUserStore } from '../zustand/userStore';
import { toast } from 'sonner';

const ProfileTabs = ({ showActions = true }: { showActions?: boolean }) => {
  const [activeTab, setActiveTab] = useState('projects');
  const [showHackathonModal, setShowHackathonModal] = useState(false);
  const [showCertificationModal, setShowCertificationModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', techStack: '', githubUrl: '', liveUrl: ''
  });
  const [contributionForm, setContributionForm] = useState({
    repo: '', title: '', description: '', prNumber: '', link: '', status: 'merged'
  });
  const [hackathonForm, setHackathonForm] = useState({
    name: '', date: '', project: '', description: '', position: '', prize: '', teamSize: '', category: '', certificateUrl: ''
  });
  const [certificationForm, setCertificationForm] = useState({
    title: '', issuer: '', date: '', certificateUrl: '', skills: ''
  });
  const [projectLoading, setProjectLoading] = useState(false);
  const [contributionLoading, setContributionLoading] = useState(false);
  const [hackathonLoading, setHackathonLoading] = useState(false);
  const [certificationLoading, setCertificationLoading] = useState(false);
  const { userId } = useUserStore();

  // API-driven state for meta data
  const [projects, setProjects] = useState<any[]>([]);
  const [contributions, setContributions] = useState<any[]>([]);
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [metaLoading, setMetaLoading] = useState(true);
  const [metaError, setMetaError] = useState<string | null>(null);

  // Fetch meta data from single API
  const fetchMetaData = async () => {
    setMetaLoading(true);
    setMetaError(null);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_DEV_API_URL}/profile/meta/${userId}`);
      setProjects(res.data.projects || []);
      setContributions(res.data.contributions || []);
      setHackathons(res.data.hackathons || []);
      setCertifications(res.data.certifications || []);
    } catch (err: any) {
      setMetaError('Failed to load profile data.');
    } finally {
      setMetaLoading(false);
    }
  };

  React.useEffect(() => {
    if (userId) fetchMetaData();
    // eslint-disable-next-line
  }, [userId]);

  const tabs = [
    { id: 'projects', label: 'Projects', count: projects.length },
    { id: 'contributions', label: 'Contributions', count: contributions.length },
    { id: 'hackathons', label: 'Hackathons', count: hackathons.length },
    { id: 'certifications', label: 'Certifications', count: certifications.length }
  ];

  const renderProjects = () => (
    <>
      {showActions && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowProjectModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>
      )}
      <div className="space-y-6">
        {projects.map((project: any, idx) => (
          <div key={`project-${idx}`} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-base text-gray-600 mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.techStack.map((tech: string, idx: number) => (
                    <span key={`project-tech-${idx}`} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 min-w-[160px] w-44 items-end">
                <div className="flex flex-col w-full gap-2">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Add Project</h2>
              <button onClick={() => setShowProjectModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              setProjectLoading(true);
              try {
                await axios.post(`${process.env.NEXT_PUBLIC_DEV_API_URL}/profile/${userId}/project`, {
                  ...projectForm,
                  techStack: projectForm.techStack.split(',').map(s => s.trim()).filter(Boolean)
                });
                await fetchMetaData();
                setShowProjectModal(false);
                setProjectForm({ title: '', description: '', techStack: '', githubUrl: '', liveUrl: '' });
                toast.success('Project added successfully');
              } catch (err) {
                toast.error('Failed adding project');
              } finally {
                setProjectLoading(false);
              }
            }}>
              <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="Title" value={projectForm.title} onChange={e => setProjectForm(f => ({ ...f, title: e.target.value }))} required />
              <textarea className="w-full px-3 py-2 border rounded-lg" placeholder="Description" value={projectForm.description} onChange={e => setProjectForm(f => ({ ...f, description: e.target.value }))} required />
              <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="Tech Stack (comma separated)" value={projectForm.techStack} onChange={e => setProjectForm(f => ({ ...f, techStack: e.target.value }))} />
              <input type="url" className="w-full px-3 py-2 border rounded-lg" placeholder="GitHub URL" value={projectForm.githubUrl} onChange={e => setProjectForm(f => ({ ...f, githubUrl: e.target.value }))} />
              <input type="url" className="w-full px-3 py-2 border rounded-lg" placeholder="Live URL" value={projectForm.liveUrl} onChange={e => setProjectForm(f => ({ ...f, liveUrl: e.target.value }))} />
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowProjectModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-800 transition-colors" disabled={projectLoading}>{projectLoading ? 'Adding...' : 'Add Project'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  const renderContributions = () => (
    <>
      {showActions && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowContributionModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Contribution
          </button>
        </div>
      )}
      <div className="space-y-4">
        {contributions.map((contribution: any, idx) => (
          <div key={`contribution-${idx}`} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-gray-600">{contribution.repo}</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Merged
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{contribution.title}</h3>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{contribution.description}</p>
            <div className="flex items-center justify-between">
              <a
                href={`https://github.com/${contribution.repo}/pull/${contribution.prNumber.slice(1)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Github className="w-4 h-4" />
                View PR
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Contribution Modal */}
      {showContributionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Add Contribution</h2>
              <button onClick={() => setShowContributionModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              setContributionLoading(true);
              try {
                await axios.post(`${process.env.NEXT_PUBLIC_DEV_API_URL}/profile/${userId}/contribution`, contributionForm);
                await fetchMetaData();
                setShowContributionModal(false);
                setContributionForm({ repo: '', title: '', description: '', prNumber: '', link: '', status: 'merged' });
                toast.success('Contribution added successfully');
              } catch (err) {
                toast.error('Failed adding contribution');
              } finally {
                setContributionLoading(false);
              }
            }}>
              <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="Repository (e.g. facebook/react)" value={contributionForm.repo} onChange={e => setContributionForm(f => ({ ...f, repo: e.target.value }))} required />
              <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="Title" value={contributionForm.title} onChange={e => setContributionForm(f => ({ ...f, title: e.target.value }))} required />
              <textarea className="w-full px-3 py-2 border rounded-lg" placeholder="Description" value={contributionForm.description} onChange={e => setContributionForm(f => ({ ...f, description: e.target.value }))} required />
              <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="PR Number (e.g. #12345)" value={contributionForm.prNumber} onChange={e => setContributionForm(f => ({ ...f, prNumber: e.target.value }))} required />
              <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="link to PR" value={contributionForm.link} onChange={e => setContributionForm(f => ({ ...f, link: e.target.value }))} required />
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowContributionModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-800 transition-colors" disabled={contributionLoading}>{contributionLoading ? 'Adding...' : 'Add Contribution'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  const renderHackathons = () => (
    <>
      {showActions && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowHackathonModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Hackathon Win
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hackathons.map((hackathon: any, idx) => (
          <div key={`hackathon-${idx}`} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{hackathon.name}</h3>
                <p className="text-sm text-gray-600">{hackathon.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span className="font-semibold text-amber-600">{hackathon.position}</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="font-medium text-gray-900 mb-1">{hackathon.project}</p>
              <p className="text-sm text-gray-600">{hackathon.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-500">Prize:</span>
                <p className="font-medium text-gray-900">{hackathon.prize}</p>
              </div>
              <div>
                <span className="text-gray-500">Team Size:</span>
                <p className="font-medium text-gray-900">{hackathon.teamSize} members</p>
              </div>
              <div>
                <span className="text-gray-500">Category:</span>
                <p className="font-medium text-gray-900">{hackathon.category}</p>
              </div>
            </div>

            <a
              href={hackathon.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
            >
              <Award className="w-4 h-4" />
              View Certificate
            </a>
          </div>
        ))}
      </div>
    </>
  );

  const renderCertifications = () => (
    <>
      {showActions && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowCertificationModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Certification
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert: any, idx) => (
          <div key={`certification-${idx}`} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6">
            <div className="flex items-start mb-4">
              <Medal className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{cert.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{cert.issuer}</p>
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Issued:</span>
                <span className="text-gray-900">{cert.date}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {cert.skills.map((skill: string, idx: number) => (
                <span key={`cert-skill-${idx}`} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                  {skill}
                </span>
              ))}
            </div>
            <a
              href={cert.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Award className="w-4 h-4" />
              View Certificate
            </a>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="max-w-full mx-auto px-6 py-8">
      {/* Tabs */}
      <div className="border-b border-zinc-500/40 mb-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer pb-4 px-1 border-b-2 font-medium text-md transition-colors ${activeTab === tab.id
                  ? 'border-zinc-600 text-zinc-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              {tab.label}
              <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'contributions' && renderContributions()}
        {activeTab === 'hackathons' && renderHackathons()}
        {activeTab === 'certifications' && renderCertifications()}
      </div>

      {/* Hackathon Modal */}
      {showHackathonModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Add Hackathon Win</h2>
                <button
                  onClick={() => setShowHackathonModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <form className="p-6 space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              setHackathonLoading(true);
              try {
                await axios.post(`${process.env.NEXT_PUBLIC_DEV_API_URL}/profile/${userId}/hackathon`, hackathonForm);
                await fetchMetaData();
                setShowHackathonModal(false);
                setHackathonForm({ name: '', date: '', project: '', description: '', position: '', prize: '', teamSize: '', category: '', certificateUrl: '' });
                toast.success('Hackathon added successfully');
              } catch (err) {
                toast.error('Failed adding hackathon');
              } finally {
                setHackathonLoading(false);
              }
            }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hackathon Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                    placeholder="TechCrunch Disrupt 2024"
                    value={hackathonForm.name}
                    onChange={e => setHackathonForm(f => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="month"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                    value={hackathonForm.date}
                    onChange={e => setHackathonForm(f => ({ ...f, date: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  placeholder="AI-Powered Study Assistant"
                  value={hackathonForm.project}
                  onChange={e => setHackathonForm(f => ({ ...f, project: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Description *
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none resize-none"
                  placeholder="Brief description of your project..."
                  value={hackathonForm.description}
                  onChange={e => setHackathonForm(f => ({ ...f, description: e.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                    placeholder="e.g. 1st Place, Best Design, etc."
                    value={hackathonForm.position}
                    onChange={e => setHackathonForm(f => ({ ...f, position: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prize
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                    placeholder="$5,000"
                    value={hackathonForm.prize}
                    onChange={e => setHackathonForm(f => ({ ...f, prize: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Size
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                    placeholder="4"
                    value={hackathonForm.teamSize}
                    onChange={e => setHackathonForm(f => ({ ...f, teamSize: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  placeholder="Sustainability, Healthcare, etc."
                  value={hackathonForm.category}
                  onChange={e => setHackathonForm(f => ({ ...f, category: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certificate URL
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  placeholder="https://certificate.url/..."
                  value={hackathonForm.certificateUrl}
                  onChange={e => setHackathonForm(f => ({ ...f, certificateUrl: e.target.value }))}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowHackathonModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-800 transition-colors" disabled={hackathonLoading}>
                  {hackathonLoading ? 'Adding...' : 'Add Hackathon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certification Modal */}
      {showCertificationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Add Certification</h2>
                <button
                  onClick={() => setShowCertificationModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <form className="p-6 space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              setCertificationLoading(true);
              try {
                await axios.post(`${process.env.NEXT_PUBLIC_DEV_API_URL}/profile/${userId}/certification`, {
                  ...certificationForm,
                  skills: certificationForm.skills.split(',').map(s => s.trim()).filter(Boolean)
                });
                await fetchMetaData();
                setShowCertificationModal(false);
                setCertificationForm({ title: '', issuer: '', date: '', certificateUrl: '', skills: '' });
                toast.success('Certification added successfully');
              } catch (err) {
                toast.error('Failed adding certification');
              } finally {
                setCertificationLoading(false);
              }
            }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certification Title *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  placeholder="AWS Certified Solutions Architect"
                  value={certificationForm.title}
                  onChange={e => setCertificationForm(f => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  placeholder="Amazon Web Services"
                  value={certificationForm.issuer}
                  onChange={e => setCertificationForm(f => ({ ...f, issuer: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Date *
                </label>
                <input
                  type="month"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  value={certificationForm.date}
                  onChange={e => setCertificationForm(f => ({ ...f, date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certificate URL *
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  placeholder="https://verify.certification.com/..."
                  value={certificationForm.certificateUrl}
                  onChange={e => setCertificationForm(f => ({ ...f, certificateUrl: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  placeholder="Cloud Architecture, AWS, Security"
                  value={certificationForm.skills}
                  onChange={e => setCertificationForm(f => ({ ...f, skills: e.target.value }))}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCertificationModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-800 transition-colors" disabled={certificationLoading}>
                  {certificationLoading ? 'Adding...' : 'Add Certification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTabs;