import React, { useState } from 'react';
import { Github, ExternalLink, GitMerge, Trophy, Award, Calendar, Users, Plus, X, Upload, CheckCircle, Star, Code, Medal } from 'lucide-react';

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [showHackathonModal, setShowHackathonModal] = useState(false);
  const [showCertificationModal, setShowCertificationModal] = useState(false);

  const projects = [
    {
      id: 1,
      title: "AI Study Companion",
      description: "An intelligent study assistant that helps students learn more effectively through personalized recommendations and adaptive learning paths.",
      techStack: ["React", "Python", "TensorFlow", "MongoDB"],
      githubUrl: "https://github.com/username/ai-study-companion",
      liveUrl: "https://ai-study-companion.vercel.app",
      stars: 45,
      forks: 12,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"
    },
    {
      id: 2,
      title: "Campus Event Platform",
      description: "A comprehensive platform for discovering and managing campus events with real-time updates and social features.",
      techStack: ["Next.js", "Node.js", "PostgreSQL", "Socket.io"],
      githubUrl: "https://github.com/username/campus-events",
      liveUrl: "https://campus-events.app",
      stars: 32,
      forks: 8,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600"
    },
    {
      id: 3,
      title: "Blockchain Voting System",
      description: "Secure and transparent voting system for student government elections using blockchain technology.",
      techStack: ["Solidity", "Web3.js", "React", "IPFS"],
      githubUrl: "https://github.com/username/blockchain-voting",
      liveUrl: null,
      stars: 28,
      forks: 6,
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600"
    }
  ];

  const contributions = [
    {
      id: 1,
      repo: "facebook/react",
      title: "Fix: Memory leak in useEffect cleanup",
      description: "Fixed a memory leak issue that occurred when components unmounted before async operations completed.",
      prNumber: "#24521",
      date: "Mar 15, 2024",
      additions: 45,
      deletions: 12,
      status: "merged"
    },
    {
      id: 2,
      repo: "vercel/next.js",
      title: "Feature: Add support for dynamic imports in app directory",
      description: "Implemented dynamic import functionality for the new app directory structure.",
      prNumber: "#48732",
      date: "Feb 28, 2024",
      additions: 128,
      deletions: 23,
      status: "merged"
    },
    {
      id: 3,
      repo: "tailwindlabs/tailwindcss",
      title: "Docs: Update configuration examples",
      description: "Updated documentation with clearer examples for custom configuration options.",
      prNumber: "#10234",
      date: "Feb 10, 2024",
      additions: 34,
      deletions: 18,
      status: "merged"
    }
  ];

  const hackathons = [
    {
      id: 1,
      name: "TechCrunch Disrupt 2024",
      project: "EcoTrack - Carbon Footprint Analyzer",
      position: "1st Place",
      prize: "$10,000",
      date: "March 2024",
      teamSize: 4,
      category: "Sustainability",
      description: "Built a real-time carbon footprint tracking app with ML predictions.",
      certificateUrl: "https://certificate.url/techcrunch2024"
    },
    {
      id: 2,
      name: "MIT Hacking Medicine",
      project: "HealthBuddy - AI Medical Assistant",
      position: "Best AI Implementation",
      prize: "$5,000",
      date: "February 2024",
      teamSize: 3,
      category: "Healthcare",
      description: "Developed an AI-powered medical assistant for preliminary diagnosis.",
      certificateUrl: "https://certificate.url/mithacking2024"
    },
    {
      id: 3,
      name: "Stanford TreeHacks",
      project: "StudySync - Collaborative Learning",
      position: "2nd Place",
      prize: "$3,000",
      date: "January 2024",
      teamSize: 4,
      category: "Education",
      description: "Created a platform for real-time collaborative studying with AR features.",
      certificateUrl: "https://certificate.url/treehacks2024"
    }
  ];

  const certifications = [
    {
      id: 1,
      title: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "March 2024",
      expiryDate: "March 2027",
      credentialId: "AWS-SAA-C03-XXXXX",
      skills: ["Cloud Architecture", "AWS Services", "Security"],
      certificateUrl: "https://aws.amazon.com/verification/xxx"
    },
    {
      id: 2,
      title: "Google Cloud Professional Data Engineer",
      issuer: "Google Cloud",
      date: "February 2024",
      expiryDate: "February 2026",
      credentialId: "GCP-PDE-XXXXX",
      skills: ["BigQuery", "Dataflow", "Machine Learning"],
      certificateUrl: "https://cloud.google.com/certification/verify/xxx"
    },
    {
      id: 3,
      title: "Meta Front-End Developer Professional",
      issuer: "Meta",
      date: "January 2024",
      expiryDate: null,
      credentialId: "META-FED-XXXXX",
      skills: ["React", "JavaScript", "Web Performance"],
      certificateUrl: "https://www.coursera.org/verify/xxx"
    }
  ];

  const tabs = [
    { id: 'projects', label: 'Projects', count: projects.length },
    { id: 'contributions', label: 'Contributions', count: contributions.length },
    { id: 'hackathons', label: 'Hackathons', count: hackathons.length },
    { id: 'certifications', label: 'Certifications', count: certifications.length }
  ];

  const renderProjects = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div key={project.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="h-48 overflow-hidden">
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{project.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {project.techStack.map((tech, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {project.stars}
              </span>
              <span className="flex items-center gap-1">
                <GitMerge className="w-4 h-4" />
                {project.forks}
              </span>
            </div>

            <div className="flex gap-3">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContributions = () => (
    <div className="space-y-4">
      {contributions.map((contribution) => (
        <div key={contribution.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6">
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
            <span className="text-sm text-gray-500">{contribution.date}</span>
          </div>
          
          <p className="text-gray-600 mb-4">{contribution.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-green-600">+{contribution.additions}</span>
              <span className="text-red-600">-{contribution.deletions}</span>
              <span className="text-gray-600">{contribution.prNumber}</span>
            </div>
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
  );

  const renderHackathons = () => (
    <>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowHackathonModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Hackathon Win
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hackathons.map((hackathon) => (
          <div key={hackathon.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6">
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
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowCertificationModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Certification
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert) => (
          <div key={cert.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6">
            <div className="flex items-start justify-between mb-4">
              <Medal className="w-8 h-8 text-indigo-600" />
              {cert.expiryDate && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Valid
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{cert.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{cert.issuer}</p>
            
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Issued:</span>
                <span className="text-gray-900">{cert.date}</span>
              </div>
              {cert.expiryDate && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Expires:</span>
                  <span className="text-gray-900">{cert.expiryDate}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">ID:</span>
                <span className="text-gray-900 font-mono text-xs">{cert.credentialId}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {cert.skills.map((skill, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
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
              className={`cursor-pointer pb-4 px-1 border-b-2 font-medium text-md transition-colors ${
                activeTab === tab.id
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
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hackathon Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                    placeholder="TechCrunch Disrupt 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="month"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
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
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position *
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none">
                    <option>1st Place</option>
                    <option>2nd Place</option>
                    <option>3rd Place</option>
                    <option>Best Design</option>
                    <option>Best Innovation</option>
                    <option>People's Choice</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prize
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                    placeholder="$5,000"
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
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certificate URL
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  placeholder="https://certificate.url/..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowHackathonModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-800 transition-colors">
                  Add Hackathon
                </button>
              </div>
            </div>
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
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certification Title *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  placeholder="AWS Certified Solutions Architect"
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
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Date *
                  </label>
                  <input
                    type="month"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="month"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credential ID
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  placeholder="AWS-SAA-C03-XXXXX"
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
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCertificationModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-800 transition-colors">
                  Add Certification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTabs;