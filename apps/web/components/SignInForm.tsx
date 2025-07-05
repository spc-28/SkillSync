'use client'
import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Sparkles, Users, Code } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signInWithGoogle } from '../config/firebase';

interface SignInFormProps {
  formData: {
    email: string;
    password: string;
    [key: string]: any;
  };
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  loading?: boolean;
}

const Logo = () => (
  <svg viewBox="0 0 200 200" className="w-10 h-10">
    <g transform="translate(100, 100)">
      <path d="M 60 0 A 60 60 0 0 1 0 60" fill="none" stroke="#6366F1" strokeWidth="8" strokeLinecap="round" />
      <path d="M -60 0 A 60 60 0 0 1 0 -60" fill="none" stroke="#8B5CF6" strokeWidth="8" strokeLinecap="round" />
      <circle cx="0" cy="-60" r="10" fill="#6366F1" />
      <circle cx="0" cy="60" r="10" fill="#8B5CF6" />
      <g transform="scale(1.2)">
        <path d="M -10 -5 L -10 5 L -5 5 M 5 5 L 10 5 L 10 -5 M 10 -5 L 5 -5" fill="none" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
        <path d="M -7 -8 L -13 -2 L -7 4" fill="none" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 7 8 L 13 2 L 7 -4" fill="none" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  </svg>
);



const SignInForm: React.FC<SignInFormProps> = ({ formData, showPassword, setShowPassword, handleInputChange, handleSubmit, loading }) => {
  const router = useRouter();
  const [googleLoading, setGoogleLoading] = useState(false);
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Feature Showcase */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-500 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-6">Welcome Back!</h2>
          <p className="text-xl text-white/80 mb-8">
            Your next great project is waiting for you. Sign in to continue building amazing things with your team.
          </p>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
                alt="User"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold">"SkillSync transformed my college experience"</p>
                <p className="text-sm text-white/70">- Alex Chen, CS Major</p>
              </div>
            </div>
            <p className="text-white/80 text-sm">
              "I found my co-founder and built a startup that got into Y Combinator. None of this would have happened without SkillSync."
            </p>
          </div>
          <div className="flex gap-8">
            <div>
              <div className="text-3xl font-bold">548</div>
              <div className="text-sm text-white/70">Active Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold">2.9K+</div>
              <div className="text-sm text-white/70">Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold">95%</div>
              <div className="text-sm text-white/70">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-md">
          <button onClick={() => router.push('/')} className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to home
          </button>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Logo />
              <span className="text-2xl font-bold text-gray-900">SkillSync</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-600">Sign in to continue to your projects</p>
          </div>

          {/* Google Sign In */}
          <button onClick={async () => {
            setGoogleLoading(true);
            await signInWithGoogle();
            setGoogleLoading(false);
            router.push('/discover');
          }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors mb-6">
            {googleLoading ? <p>Loading...</p> : <><svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
              <span className="font-medium text-gray-700">Sign up with Google</span></>}
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Sign In Form */}
          <div className="space-y-5">
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
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-sm text-indigo-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  placeholder="Enter your password"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
            </div>

            <button
              onClick={handleSubmit}
              className={`w-full cursor-pointer py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 text-center">
              New to SkillSync?{' '}
              <button
                onClick={() => router.push('/signup')}
                className="text-indigo-600 font-semibold hover:underline cursor-pointer"
              >
                Create an account
              </button>
            </p>
          </div>

          <div className="mt-6 flex justify-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-700">Terms</a>
            <a href="#" className="hover:text-gray-700">Privacy</a>
            <a href="#" className="hover:text-gray-700">Support</a>
          </div>
        </div>
      </div>
    </div>
  )
};

export default SignInForm;
