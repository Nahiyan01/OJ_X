import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Problems } from './pages/Problems';
import { Contests } from './pages/Contests';
import { Workout } from './pages/Workout';
import { PROBLEMS } from './data/problems';
import { Problem, SubmissionResult } from './types';
import { WifiOff, Cpu, HardDrive, ShieldCheck, Heart } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'contests' | 'workout' | 'problems'>('home');
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);

  // Solved problems persistence
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ojx_solved');
      return saved ? JSON.parse(saved) : ['prob-1'];
    } catch (e) {
      return ['prob-1'];
    }
  });

  // Submissions persistence
  const [submissions, setSubmissions] = useState<SubmissionResult[]>(() => {
    try {
      const saved = localStorage.getItem('ojx_submissions');
      return saved ? JSON.parse(saved) : [
        {
          id: 'sub-sample-1',
          problemId: 'prob-1',
          problemTitle: 'Two Sum',
          verdict: 'Accepted',
          language: 'javascript',
          passedCount: 5,
          totalCount: 5,
          runtimeMs: 2,
          memoryMb: 42.1,
          timestamp: '12:45:10 PM',
          testResults: [],
          code: '',
        }
      ];
    } catch (e) {
      return [];
    }
  });

  const handleProblemSolved = (problemId: string) => {
    if (!solvedProblemIds.includes(problemId)) {
      const updated = [...solvedProblemIds, problemId];
      setSolvedProblemIds(updated);
      try {
        localStorage.setItem('ojx_solved', JSON.stringify(updated));
      } catch (e) {}
    }
    // Refresh submissions
    try {
      const saved = localStorage.getItem('ojx_submissions');
      if (saved) setSubmissions(JSON.parse(saved));
    } catch (e) {}
  };

  const handleNavigate = (tab: 'home' | 'contests' | 'workout' | 'problems', problemId?: string) => {
    setActiveTab(tab);
    if (problemId) {
      setSelectedProblemId(problemId);
    } else if (tab === 'problems') {
      setSelectedProblemId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'problems') setSelectedProblemId(null);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        solvedCount={solvedProblemIds.length}
        totalProblems={PROBLEMS.length}
      />

      {/* Main Page Content with Animated Transitions */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Home
                onNavigate={handleNavigate}
                problems={PROBLEMS}
                submissions={submissions}
                solvedCount={solvedProblemIds.length}
              />
            </motion.div>
          )}

          {activeTab === 'contests' && (
            <motion.div
              key="contests"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Contests
                problems={PROBLEMS}
                onSolved={handleProblemSolved}
              />
            </motion.div>
          )}

          {activeTab === 'workout' && (
            <motion.div
              key="workout"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Workout
                problems={PROBLEMS}
                onSolved={handleProblemSolved}
              />
            </motion.div>
          )}

          {activeTab === 'problems' && (
            <motion.div
              key="problems"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Problems
                problems={PROBLEMS}
                submissions={submissions}
                solvedProblemIds={solvedProblemIds}
                selectedProblemId={selectedProblemId}
                onSelectProblem={setSelectedProblemId}
                onSolved={handleProblemSolved}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* System Footer */}
      <footer className="mt-16 border-t border-[#23304c] bg-[#0c121e] text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center font-bold text-white text-[11px]">
              OJ
            </div>
            <div>
              <span className="font-bold text-slate-200">OJ-X Coding Judge</span>
              <span className="text-slate-500 mx-2">|</span>
              <span className="text-[11px] text-slate-400">Pure Client-Side Sandboxed Evaluation</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Isolated JS Sandbox
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              Sub-millisecond Latency
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
              LocalStorage Indexed
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            Engineered for zero-network competitive coding & contest simulation.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
