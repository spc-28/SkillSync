'use client'
import React from 'react';
import { ArrowLeft, Mail, User, School, Eye, EyeOff, ChevronDown, Lock, Sparkles, Users, Code } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SignUpFormProps {
  formData: {
    fullName: string;
    email: string;
    password: string;
    college: string;
  };
  colleges: string[];
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: () => void;
}

const Logo = () => (
  <svg viewBox="0 0 200 200" className="w-10 h-10">
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



const SignUpForm: React.FC<SignUpFormProps> = ({ formData, colleges, showPassword, setShowPassword, handleInputChange, handleSubmit }) => {
  const router = useRouter();
  return(
  <div className="min-h-screen flex">
    {/* Left Panel - Form */}
    <div className="flex-1 flex items-center justify-center px-8 py-12 bg-white">
      <div className="w-full max-w-md">
        <button onClick={()=> router.push('/')} className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to home
        </button>
        
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Logo />
            <span className="text-2xl font-bold text-gray-900">SkillSync</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-600">Join thousands of students building together</p>
        </div>

        {/* Google Sign Up */}
        <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors mb-6">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="font-medium text-gray-700">Sign up with Google</span>
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-sm text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Sign Up Form */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              College/University
            </label>
            <div className="relative">
              <School className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                name="college"
                value={formData.college}
                onChange={handleInputChange}
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="">Select your college</option>
                {colleges.map((college) => (
                  <option key={college} value={college}>{college}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                placeholder="john@university.edu"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
            </label>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 cursor-pointer bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Create Account
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/signin')}
            className="text-indigo-600 font-semibold hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>

    {/* Right Panel - Feature Showcase */}
    <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-12 items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10 max-w-lg text-white">
        <h2 className="text-4xl font-bold mb-6">Start Building Amazing Projects</h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Find Your Dream Team</h3>
              <p className="text-white/80">Connect with talented students across all departments</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center flex-shrink-0">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Showcase Your Skills</h3>
              <p className="text-white/80">Build a verified portfolio with GitHub integration</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">AI-Powered Assistance</h3>
              <p className="text-white/80">Get help from our intelligent project assistant</p>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <div className="flex -space-x-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur border-2 border-white/30"></div>
            ))}
          </div>
          <p className="text-sm mt-3 text-white/80">Join 2,985+ students already on SkillSync</p>
        </div>
      </div>
    </div>
  </div>
)};

export default SignUpForm;
