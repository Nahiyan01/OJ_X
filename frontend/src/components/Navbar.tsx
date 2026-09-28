import React from 'react';
import { Terminal, Trophy, Dumbbell, Code2, Zap, WifiOff, HardDrive, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'contests' | 'workout' | 'problems';
  setActiveTab: (tab: 'home' | 'contests' | 'workout' | 'problems') => void;
  solvedCount: number;
  totalProblems: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  solvedCount,
  totalProblems,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#090d16]/90 backdrop-blur-md border-b border-[#23304c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-glow-indigo text-white font-black text-xl tracking-wider transition-transform duration-200 group-hover:scale-105">
              <Terminal className="w-5 h-5 text-white" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#090d16]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                  OJ<span className="text-indigo-500">-X</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Offline Core
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium -mt-0.5">
                Zero-Latency Judge Engine
              </span>
            </div>
          </div>

          {/* Horizontal Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'home'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('contests')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'contests'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Contest</span>
            </button>

            <button
              onClick={() => setActiveTab('workout')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'workout'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>Workout</span>
            </button>

            <button
              onClick={() => setActiveTab('problems')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'problems'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Problems</span>
            </button>
          </nav>

          {/* System & Offline Status Badge */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <WifiOff className="w-3.5 h-3.5 text-emerald-400 ml-0.5" />
              <span>100% Offline Ready</span>
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-[#23304c]">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#141c2e] border border-[#23304c] text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-slate-400 font-normal">Solved:</span>
                <span className="font-bold text-white">{solvedCount}/{totalProblems}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
