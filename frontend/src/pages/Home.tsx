import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Dumbbell, 
  Code2, 
  Zap, 
  Cpu, 
  ShieldCheck, 
  WifiOff, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Flame,
  Activity,
  HardDrive
} from 'lucide-react';
import { Problem, SubmissionResult } from '../types';

interface HomeProps {
  onNavigate: (tab: 'home' | 'contests' | 'workout' | 'problems', problemId?: string) => void;
  problems: Problem[];
  submissions: SubmissionResult[];
  solvedCount: number;
}

export const Home: React.FC<HomeProps> = ({
  onNavigate,
  problems,
  submissions,
  solvedCount,
}) => {
  const dailyProblem = problems[0] || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#141c2e] via-[#0e1422] to-[#090d16] border border-[#23304c] p-8 sm:p-12 shadow-2xl">
        {/* Background glow effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Next-Gen Offline Judge v2.4</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
            <span className="text-emerald-400 font-medium">100% Local</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Code, Compete & Practice <br />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Without Internet Limits.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
            OJ-X delivers a high-contrast, sub-millisecond offline coding judge platform. 
            Join local contests via code, practice high-intensity workouts on a set timer, 
            or solve deep algorithmic challenges with built-in sandbox execution.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('problems')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-glow-indigo transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Code2 className="w-4 h-4" />
              <span>Explore Problems</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('workout')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-200 bg-[#182238] hover:bg-[#202c46] border border-[#2e3e60] transition-all transform hover:-translate-y-0.5"
            >
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              <span>Launch Timed Workout</span>
            </button>

            <button
              onClick={() => onNavigate('contests')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-200 bg-[#182238] hover:bg-[#202c46] border border-[#2e3e60] transition-all transform hover:-translate-y-0.5"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Enter Contest</span>
            </button>
          </div>
        </div>

        {/* Floating Quick Stats in Hero */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-[#23304c]/80">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Judge Latency</span>
            <span className="text-2xl font-black text-emerald-400">&lt; 2 ms</span>
            <span className="text-[11px] text-slate-500">In-browser sandbox</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Problems Solved</span>
            <span className="text-2xl font-black text-indigo-400">{solvedCount} / {problems.length}</span>
            <span className="text-[11px] text-slate-500">Locally saved</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Contests Active</span>
            <span className="text-2xl font-black text-amber-400">1 Live</span>
            <span className="text-[11px] text-slate-500">Passcode enabled</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Offline Status</span>
            <span className="text-2xl font-black text-cyan-400">100% Ready</span>
            <span className="text-[11px] text-slate-500">Zero network calls</span>
          </div>
        </div>
      </section>

      {/* Main 3 Navigation Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Core Modules</h2>
            <p className="text-xs text-slate-400">Direct access to the judge platform components</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Contests */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={() => onNavigate('contests')}
            className="cursor-pointer group p-6 rounded-2xl bg-[#0e1422] border border-[#23304c] hover:border-indigo-500/50 shadow-card-dark transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <Trophy className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Live Contest Ready
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                  Contest Arena
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Create custom local contests or join via a unique room code. Features ICPC penalty tracking and real-time offline leaderboards.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
                <span className="px-2 py-0.5 rounded bg-[#182238] border border-[#23304c]">Join with Code</span>
                <span className="px-2 py-0.5 rounded bg-[#182238] border border-[#23304c]">Custom Timers</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#23304c] flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
              <span>Enter Contests</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Card 2: Workout */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={() => onNavigate('workout')}
            className="cursor-pointer group p-6 rounded-2xl bg-[#0e1422] border border-[#23304c] hover:border-emerald-500/50 shadow-card-dark transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Sprint Trainer
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Workout Sprints
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Solve previous questions on a set countdown timer. Choose 5-min blitz, 15-min rapid, or custom intervals to simulate high-pressure interviews.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
                <span className="px-2 py-0.5 rounded bg-[#182238] border border-[#23304c]">5 / 15 / 30 Min</span>
                <span className="px-2 py-0.5 rounded bg-[#182238] border border-[#23304c]">Sudden Death</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#23304c] flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
              <span>Start Workout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Card 3: Problems */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={() => onNavigate('problems')}
            className="cursor-pointer group p-6 rounded-2xl bg-[#0e1422] border border-[#23304c] hover:border-indigo-500/50 shadow-card-dark transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                  <Code2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Untimed Practice
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                  Problem Archive
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Browse curated algorithmic challenges across Dynamic Programming, Sliding Window, Trees, and Two Pointers without time restrictions.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
                <span className="px-2 py-0.5 rounded bg-[#182238] border border-[#23304c]">8+ Problems</span>
                <span className="px-2 py-0.5 rounded bg-[#182238] border border-[#23304c]">JS / Python / C++</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#23304c] flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
              <span>Browse Problems</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Daily Challenge Spotlight & System Details */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Highlight */}
        {dailyProblem && (
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0e1422] border border-[#23304c] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Daily Featured Problem</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {dailyProblem.difficulty}
              </span>
            </div>

            <div>
              <h4 className="text-xl font-bold text-white">{dailyProblem.title}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {dailyProblem.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              {dailyProblem.tags.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-0.5 rounded-md bg-[#182238] text-slate-300 border border-[#23304c]">
                  {tag}
                </span>
              ))}
              <span className="text-xs text-slate-400 ml-auto">
                Acceptance: <strong className="text-slate-200">{dailyProblem.acceptanceRate}</strong>
              </span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => onNavigate('problems', dailyProblem.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-glow-indigo"
              >
                <span>Solve Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('workout')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-slate-300 bg-[#182238] hover:bg-[#202c46] border border-[#23304c] transition-all"
              >
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Solve in Workout (Timed)</span>
              </button>
            </div>
          </div>
        )}

        {/* Offline Engine Architecture card */}
        <div className="p-6 rounded-2xl bg-[#0e1422] border border-[#23304c] space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <Cpu className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Local Sandbox Spec</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every submission is executed directly inside an isolated, non-blocking browser context with timeout interception.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#141c2e] border border-[#23304c]">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Isolation
                </span>
                <span className="font-semibold text-slate-200">Scoped Context</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#141c2e] border border-[#23304c]">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  TLE Threshold
                </span>
                <span className="font-semibold text-slate-200">2000 ms</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#141c2e] border border-[#23304c]">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                  Persistence
                </span>
                <span className="font-semibold text-slate-200">HTML5 LocalStorage</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 pt-2 border-t border-[#23304c]">
            OJ-X requires 0 external server connections to evaluate code.
          </div>
        </div>
      </section>

      {/* Recent Submissions Feed */}
      {submissions.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">Recent Local Submissions</h3>
            </div>
            <span className="text-xs text-slate-400">Saved offline ({submissions.length})</span>
          </div>

          <div className="bg-[#0e1422] rounded-xl border border-[#23304c] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#141c2e] border-b border-[#23304c] text-slate-400 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Problem</th>
                    <th className="py-3 px-4">Verdict</th>
                    <th className="py-3 px-4">Language</th>
                    <th className="py-3 px-4">Cases</th>
                    <th className="py-3 px-4">Runtime</th>
                    <th className="py-3 px-4">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b253b] text-slate-300">
                  {submissions.slice(0, 5).map((sub) => (
                    <tr key={sub.id} className="hover:bg-[#141c2e]/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">
                        {sub.problemTitle}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          sub.verdict === 'Accepted'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : sub.verdict === 'Time Limit Exceeded'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {sub.verdict}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">
                        {sub.language}
                      </td>
                      <td className="py-3 px-4">
                        {sub.passedCount} / {sub.totalCount}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {sub.runtimeMs}ms
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {sub.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
