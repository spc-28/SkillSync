'use client'
import React, { useState } from 'react';
import { MapPin, Users, Calendar, Award, Code, Shield, ArrowRight, Menu, X, Clock, Target, Sparkles, MessageSquare, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 overflow-x-hidden">
      {/* Gradient Blob */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-300 rounded-full filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 lg:px-12 py-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-12">
            <a href="/" className="flex items-center gap-2">
              <Logo />
              <span className="text-xl font-bold text-gray-900">SkillSync</span>
            </a>
            <ul className="hidden lg:flex gap-8">
              <li><a href="/discover" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Discover</a></li>
              <li><a href="/events" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Events</a></li>
              <li><a href="/projects" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Projects</a></li>
              <li><a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">How it Works</a></li>
            </ul>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={()=>router.push('/signin')} className="hidden lg:block px-6 py-2.5 bg-white border-2 border-indigo-300 text-balck rounded-xl font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg cursor-pointer">
              Sign In
            </button>
            <button onClick={()=>router.push('/signup')} className="hidden lg:block px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all hover:-translate-y-0.5 hover:shadow-lg cursor-pointer">
              Sign Up
            </button>
            <button 
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 lg:px-12 py-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Connect Skills,<br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Build Together</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Join the campus network where verified skills meet real opportunities. Find your perfect team, join exciting projects, and showcase what you can do.
            </p>
            <div className="flex flex-wrap gap-4 mb-16">
              <button onClick={()=>router.push('/signup')} className="px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all hover:-translate-y-0.5 hover:shadow-xl">
                Get Started Free
              </button>
              <button className="px-8 py-3.5 bg-white/80 backdrop-blur text-gray-700 rounded-xl font-semibold border border-gray-200 hover:bg-white transition-all hover:-translate-y-0.5 hover:shadow-xl">
                Watch Demo
              </button>
            </div>
            <div className="flex gap-12">
              <div className="text-center">
                <div className="text-4xl font-extrabold text-gray-900">2,985</div>
                <div className="text-sm text-gray-600 mt-1">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-extrabold text-gray-900">548</div>
                <div className="text-sm text-gray-600 mt-1">Projects Created</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-extrabold text-gray-900">132</div>
                <div className="text-sm text-gray-600 mt-1">Teams Formed</div>
              </div>
            </div>
          </div>
          
          {/* Profile Preview */}
          <div className="bg-white rounded-3xl p-10 shadow-2xl">
            <div className="flex gap-6 mb-8">
              <img 
                src="https://avatar.iran.liara.run/public/boy?username=shardul" 
                alt="Profile" 
                className="w-28 h-28 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">Shardul Chorghade</h3>
                </div>
                <p className="text-gray-600 mb-1">Full Stack Developer</p>
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  The LNM Institute of Information Technology
                </p>
                <div className="flex gap-3 mt-5">
                  <button className="px-6 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                    Connect
                  </button>
                  <button className="px-6 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                    Collaborate
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Next.js ✓</span>
              <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Python ✓</span>
              <span className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">Node.js</span>
              <span className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">Prisma</span>
              <span className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">LLMs</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-1">🔥 12 Active Projects</span>
              <span className="flex items-center gap-1">👥 48 Collaborations</span>
              <span className="flex items-center gap-1">🏆 5 Hackathon Wins</span>
            </div>
          </div>
        </div>
      </section>

      {/* What is SkillSync Section */}
      <section className="px-6 lg:px-12 py-20 bg-white/50 backdrop-blur">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What is SkillSync?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SkillSync is your campus collaboration hub that transforms how students connect, learn, and build together. 
              We break down department silos and create meaningful connections based on verified skills and shared goals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Verified Skills</h3>
              <p className="text-gray-600">
                Connect your GitHub, showcase certificates, and build a trusted skill profile that speaks louder than any resume.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Matching</h3>
              <p className="text-gray-600">
                Our AI-powered system matches you with the perfect teammates and projects based on skills, interests, and availability.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Built-in Workspace</h3>
              <p className="text-gray-600">
                From team chat to AI assistance, get everything you need to collaborate effectively in one integrated platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-6 lg:px-12 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How SkillSync Works</h2>
            <p className="text-xl text-gray-600">Get started in minutes and find your dream team</p>
          </div>
          
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Your Profile</h3>
              <p className="text-gray-600">Sign up with your university email and build your skill profile with automatic GitHub verification</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Discover Opportunities</h3>
              <p className="text-gray-600">Browse projects, hackathons, and events. Filter by skills, time commitment, and interests</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Join or Create Teams</h3>
              <p className="text-gray-600">Apply to join existing projects or post your own idea and let the perfect team find you</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                4
              </div>
              <h3 className="text-xl font-semibold mb-3">Build Together</h3>
              <p className="text-gray-600">Collaborate in our integrated workspace with team chat, task management, and AI assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 lg:px-12 py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600">Powerful features designed for student collaboration</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur rounded-xl p-6 hover:bg-white transition-all">
              <Code className="w-10 h-10 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">GitHub Integration</h3>
              <p className="text-gray-600 text-sm">Automatically verify your coding skills by connecting your repositories</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur rounded-xl p-6 hover:bg-white transition-all">
              <Calendar className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Event Discovery</h3>
              <p className="text-gray-600 text-sm">Never miss a hackathon, workshop, or networking opportunity</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur rounded-xl p-6 hover:bg-white transition-all">
              <Target className="w-10 h-10 text-pink-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Skill Matching</h3>
              <p className="text-gray-600 text-sm">Find teammates with complementary skills for balanced teams</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur rounded-xl p-6 hover:bg-white transition-all">
              <Sparkles className="w-10 h-10 text-amber-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI Assistant</h3>
              <p className="text-gray-600 text-sm">Get help with coding, brainstorming, and project management</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur rounded-xl p-6 hover:bg-white transition-all">
              <Briefcase className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Project Showcase</h3>
              <p className="text-gray-600 text-sm">Build your portfolio with completed projects and achievements</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur rounded-xl p-6 hover:bg-white transition-all">
              <Award className="w-10 h-10 text-red-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Achievements</h3>
              <p className="text-gray-600 text-sm">Earn badges for hackathon wins, contributions, and milestones</p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="px-6 lg:px-12 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Featured Projects</h2>
            <a href="/projects" className="text-indigo-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View all projects <ArrowRight className="w-5 h-5" />
            </a>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-6xl">🚀</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">AI Study Buddy</h3>
                <p className="text-gray-600 mb-4">Building an AI-powered study assistant that helps students learn more effectively</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">Python</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">React</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">OpenAI</span>
                </div>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> 3/5 members
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> 2 weeks ago
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className="text-6xl">📱</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Campus Events App</h3>
                <p className="text-gray-600 mb-4">Mobile app for discovering and managing campus events in real-time</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">React Native</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">Firebase</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">UI/UX</span>
                </div>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> 2/4 members
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> 3 days ago
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center">
                <span className="text-6xl">🌱</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">EcoTracker</h3>
                <p className="text-gray-600 mb-4">Sustainability tracking platform for reducing campus carbon footprint</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">Vue.js</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">Node.js</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">Data Viz</span>
                </div>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> 4/4 members
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> 1 week ago
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="px-6 lg:px-12 py-20 bg-white/50 backdrop-blur">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Upcoming Events</h2>
            <a href="/events" className="text-indigo-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View all events <ArrowRight className="w-5 h-5" />
            </a>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all flex gap-6">
              <div className="bg-indigo-600 text-white rounded-2xl p-4 text-center min-w-[80px]">
                <div className="text-3xl font-bold">24</div>
                <div className="text-sm uppercase">MAR</div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Spring Hackathon 2024</h3>
                <div className="flex gap-4 text-gray-600 mb-3">
                  <span>📍 Engineering Building</span>
                  <span>⏰ 48 hours</span>
                  <span>🏆 $10k in prizes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 bg-gray-300 rounded-full border-2 border-white"></div>
                    <div className="w-7 h-7 bg-gray-400 rounded-full border-2 border-white"></div>
                    <div className="w-7 h-7 bg-gray-500 rounded-full border-2 border-white"></div>
                    <div className="w-7 h-7 bg-gray-600 rounded-full border-2 border-white"></div>
                  </div>
                  <span>12 teams forming • 48 spots left</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all flex gap-6">
              <div className="bg-green-600 text-white rounded-2xl p-4 text-center min-w-[80px]">
                <div className="text-3xl font-bold">02</div>
                <div className="text-sm uppercase">APR</div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">AI/ML Workshop Series</h3>
                <div className="flex gap-4 text-gray-600 mb-3">
                  <span>📍 CS Department</span>
                  <span>⏰ 3 hours</span>
                  <span>👥 Beginner friendly</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 bg-gray-300 rounded-full border-2 border-white"></div>
                    <div className="w-7 h-7 bg-gray-400 rounded-full border-2 border-white"></div>
                    <div className="w-7 h-7 bg-gray-500 rounded-full border-2 border-white"></div>
                  </div>
                  <span>24 registered • 16 spots left</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-12 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Find Your Dream Team?</h2>
          <p className="text-xl text-gray-600 mb-10">
            Join thousands of students who are already building amazing projects together on SkillSync
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={()=>router.push('/signup')} className="px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all hover:-translate-y-0.5 hover:shadow-xl">
              Get Started for Free
            </button>
            <button onClick={()=>router.push('/')} className="px-8 py-3.5 bg-white/80 backdrop-blur text-gray-700 rounded-xl font-semibold border border-gray-200 hover:bg-white transition-all hover:-translate-y-0.5 hover:shadow-xl">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Logo />
                <span className="text-xl font-bold">SkillSync</span>
              </div>
              <p className="text-gray-400 text-sm">
                Connecting campus talent to build the future together
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Universities</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 SkillSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;