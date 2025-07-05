'use client'
import React, { useEffect, useState } from 'react';

const PageLoader = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState<any>('Initializing');

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Change loading text
    const textSequence = [
      'Initializing',
      'Connecting Skills',
      'Building Networks',
      'Syncing Projects',
      'Almost Ready'
    ];
    
    let textIndex = 0;
    const textInterval = setInterval(() => {
      textIndex = (textIndex + 1) % textSequence.length;
      setLoadingText(textSequence[textIndex]);
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 z-50 flex items-center justify-center">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 -right-20 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main loader content */}
      <div className="relative z-10 text-center">
        {/* Animated Logo */}
        <div className="mb-8 relative">
          <svg viewBox="0 0 200 200" className="w-32 h-32 mx-auto">
            <g transform="translate(100, 100)">
              {/* Outer rotating circle */}
              <circle 
                cx="0" 
                cy="0" 
                r="80" 
                fill="none" 
                stroke="#E0E7FF" 
                strokeWidth="2"
                strokeDasharray="10 5"
                className="animate-spin-slow"
              />
              
              {/* Main sync paths */}
              <path 
                d="M 60 0 A 60 60 0 0 1 0 60" 
                fill="none" 
                stroke="#6366F1" 
                strokeWidth="8" 
                strokeLinecap="round"
                className="animate-draw-path"
              />
              <path 
                d="M -60 0 A 60 60 0 0 1 0 -60" 
                fill="none" 
                stroke="#8B5CF6" 
                strokeWidth="8" 
                strokeLinecap="round"
                className="animate-draw-path animation-delay-500"
              />
              
              {/* Animated dots */}
              <circle cx="0" cy="-60" r="10" fill="#6366F1" className="animate-pulse-scale"/>
              <circle cx="60" cy="0" r="8" fill="#6366F1" className="animate-pulse-scale animation-delay-200"/>
              <circle cx="0" cy="60" r="10" fill="#8B5CF6" className="animate-pulse-scale animation-delay-400"/>
              <circle cx="-60" cy="0" r="8" fill="#8B5CF6" className="animate-pulse-scale animation-delay-600"/>
              
              {/* Center sync arrows */}
              <g transform="scale(1.2)" className="animate-pulse">
                <path 
                  d="M -10 -5 L -10 5 L -5 5 M 5 5 L 10 5 L 10 -5 M 10 -5 L 5 -5" 
                  fill="none" 
                  stroke="#1F2937" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />
                <path 
                  d="M -7 -8 L -13 -2 L -7 4" 
                  fill="none" 
                  stroke="#1F2937" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M 7 8 L 13 2 L 7 -4" 
                  fill="none" 
                  stroke="#1F2937" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </g>
            </g>
          </svg>

          {/* Orbiting dots */}
          <div className="absolute inset-0 animate-spin-reverse-slow">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Brand name */}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          SkillSync
        </h1>

        {/* Loading text */}
        <p className="text-gray-600 mb-8 h-6">
          {loadingText}
          <span className="inline-flex ml-1">
            <span className="animate-bounce animation-delay-0">.</span>
            <span className="animate-bounce animation-delay-200">.</span>
            <span className="animate-bounce animation-delay-400">.</span>
          </span>
        </p>

        {/* Progress bar */}
        <div className="w-64 mx-auto">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{progress}%</p>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse-slow {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes draw-path {
          0% {
            stroke-dasharray: 0 400;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            stroke-dasharray: 400 0;
            opacity: 1;
          }
        }

        @keyframes pulse-scale {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-spin-reverse-slow {
          animation: spin-reverse-slow 6s linear infinite;
        }

        .animate-draw-path {
          animation: draw-path 2s ease-out forwards;
        }

        .animate-pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-0 {
          animation-delay: 0ms;
        }
      `}</style>
    </div>
  );
};

export default PageLoader;