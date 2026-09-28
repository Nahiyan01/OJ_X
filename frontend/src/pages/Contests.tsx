import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Plus, 
  Key, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Calendar, 
  Hash, 
  Copy, 
  Check, 
  Play, 
  FileCode2, 
  ShieldCheck, 
  Sparkles,
  BarChart2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Contest, Problem, ContestParticipant, SubmissionResult } from '../types';
import { INITIAL_CONTESTS } from '../data/problems';
import { CodeEditor } from '../components/CodeEditor';

interface ContestsProps {
  problems: Problem[];
  onSolved: (id: string) => void;
}

export const Contests: React.FC<ContestsProps> = ({
  problems,
  onSolved,
}) => {
  const [contests, setContests] = useState<Contest[]>(() => {
    try {
      const saved = localStorage.getItem('ojx_contests');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_CONTESTS;
  });

  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'upcoming'>('all');
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [joinError, setJoinError] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Create Contest Modal
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDuration, setNewDuration] = useState<number>(60);
  const [selectedProblemIds, setSelectedProblemIds] = useState<string[]>([problems[0]?.id, problems[1]?.id]);

  // Active Contest Session State
  const [activeContest, setActiveContest] = useState<Contest | null>(null);
  const [contestSecondsLeft, setContestSecondsLeft] = useState<number>(3600);
  const [arenaTab, setArenaTab] = useState<'problems' | 'standings'>('problems');
  const [selectedProblemIndex, setSelectedProblemIndex] = useState<number>(0);
  
  // Simulated Leaderboard
  const [leaderboard, setLeaderboard] = useState<ContestParticipant[]>([
    {
      rank: 1,
      name: 'AlgorithmGod (You)',
      avatar: 'AG',
      solvedCount: 0,
      totalScore: 0,
      penaltyMinutes: 0,
      problemScores: {},
      isCurrentUser: true,
    },
    {
      rank: 2,
      name: 'Devin_0x',
      avatar: 'D0',
      solvedCount: 2,
      totalScore: 200,
      penaltyMinutes: 44,
      problemScores: {
        'prob-1': { solved: true, attempts: 1, timeMinutes: 12 },
        'prob-2': { solved: true, attempts: 2, timeMinutes: 32 },
      },
    },
    {
      rank: 3,
      name: 'BitShift_Master',
      avatar: 'BM',
      solvedCount: 1,
      totalScore: 100,
      penaltyMinutes: 18,
      problemScores: {
        'prob-1': { solved: true, attempts: 1, timeMinutes: 18 },
      },
    },
    {
      rank: 4,
      name: 'NullPointer_X',
      avatar: 'NP',
      solvedCount: 1,
      totalScore: 100,
      penaltyMinutes: 29,
      problemScores: {
        'prob-2': { solved: true, attempts: 2, timeMinutes: 29 },
      },
    },
    {
      rank: 5,
      name: 'RecursiveRaven',
      avatar: 'RR',
      solvedCount: 0,
      totalScore: 0,
      penaltyMinutes: 0,
      problemScores: {},
    },
  ]);

  // Save contests to localStorage
  const saveContests = (newContests: Contest[]) => {
    setContests(newContests);
    try {
      localStorage.setItem('ojx_contests', JSON.stringify(newContests));
    } catch (e) {}
  };

  // Timer for active contest
  useEffect(() => {
    let interval: any = null;
    if (activeContest && contestSecondsLeft > 0) {
      interval = setInterval(() => {
        setContestSecondsLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeContest, contestSecondsLeft]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError('');

    const trimmed = joinCodeInput.trim().toUpperCase();
    if (!trimmed) {
      setJoinError('Please enter a contest code.');
      return;
    }

    const matched = contests.find((c) => c.code.toUpperCase() === trimmed);
    if (!matched) {
      setJoinError(`Contest with code "${trimmed}" was not found. Try OJX-7892 or CAMPUS-2026.`);
      return;
    }

    // Enter contest arena
    handleEnterContest(matched);
    setJoinCodeInput('');
  };

  const handleCreateContest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newCode = `LOCAL-${randomSuffix}`;

    const newContest: Contest = {
      id: 'contest-' + Date.now(),
      code: newCode,
      title: newTitle,
      description: 'Custom offline local coding contest configured with local problem set.',
      durationMinutes: newDuration,
      status: 'live',
      problemIds: selectedProblemIds.length > 0 ? selectedProblemIds : [problems[0].id],
      participantsCount: 1,
      isRegistered: true,
    };

    const updated = [newContest, ...contests];
    saveContests(updated);
    setShowCreateModal(false);
    setNewTitle('');

    // Launch directly
    handleEnterContest(newContest);
  };

  const handleEnterContest = (contest: Contest) => {
    setActiveContest(contest);
    setContestSecondsLeft(contest.durationMinutes * 60);
    setSelectedProblemIndex(0);
    setArenaTab('problems');
  };

  const handleContestSubmission = (sub: SubmissionResult, problemId: string) => {
    if (sub.verdict === 'Accepted') {
      onSolved(problemId);

      // Update current user score in leaderboard
      setLeaderboard((prev) => {
        return prev.map((p) => {
          if (p.isCurrentUser) {
            const currentScore = p.problemScores[problemId];
            if (!currentScore?.solved) {
              const newSolvedCount = p.solvedCount + 1;
              const newTotalScore = p.totalScore + 100;
              const newScores = {
                ...p.problemScores,
                [problemId]: { solved: true, attempts: (currentScore?.attempts || 0) + 1, timeMinutes: Math.floor((3600 - contestSecondsLeft) / 60) },
              };
              return {
                ...p,
                solvedCount: newSolvedCount,
                totalScore: newTotalScore,
                problemScores: newScores,
              };
            }
          }
          return p;
        }).sort((a, b) => b.totalScore - a.totalScore || a.penaltyMinutes - b.penaltyMinutes)
        .map((p, idx) => ({ ...p, rank: idx + 1 }));
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const formatContestTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // If inside Active Contest Arena
  if (activeContest) {
    const contestProblems = problems.filter((p) => activeContest.problemIds.includes(p.id));
    const currentProblem = contestProblems[selectedProblemIndex] || contestProblems[0];

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {/* Arena Top Navigation Header */}
        <div className="bg-[#0e1422] p-4 rounded-xl border border-[#23304c] flex flex-wrap items-center justify-between gap-4 shadow-card-dark">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {activeContest.code}
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Round
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {activeContest.title}
              </h2>
            </div>
          </div>

          {/* Arena Clock */}
          <div className="flex items-center gap-3 bg-[#141c2e] px-4 py-2 rounded-xl border border-[#23304c]">
            <Clock className="w-4 h-4 text-amber-400" />
            <div className="flex flex-col">
              <span className="font-mono text-xl font-black text-amber-300">
                {formatContestTime(contestSecondsLeft)}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Contest Timer</span>
            </div>
          </div>

          {/* Arena Tabs & Exit */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#141c2e] p-1 rounded-lg border border-[#23304c]">
              <button
                onClick={() => setArenaTab('problems')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  arenaTab === 'problems'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>Problems</span>
              </button>

              <button
                onClick={() => setArenaTab('standings')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  arenaTab === 'standings'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Standings</span>
              </button>
            </div>

            <button
              onClick={() => setActiveContest(null)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-[#182238] border border-[#23304c] transition-all"
            >
              Leave Arena
            </button>
          </div>
        </div>

        {arenaTab === 'problems' ? (
          <div className="space-y-4">
            {/* Problem Navigation Tabs (A, B, C...) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {contestProblems.map((prob, idx) => {
                const charCode = String.fromCharCode(65 + idx);
                const isSelected = selectedProblemIndex === idx;
                const userScore = leaderboard.find((p) => p.isCurrentUser)?.problemScores[prob.id];
                const isSolved = userScore?.solved;

                return (
                  <button
                    key={prob.id}
                    onClick={() => setSelectedProblemIndex(idx)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-glow-indigo'
                        : 'bg-[#0e1422] text-slate-400 hover:text-white border border-[#23304c]'
                    }`}
                  >
                    <span>Problem {charCode}: {prob.title}</span>
                    {isSolved && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Split Screen Solver for Current Contest Problem */}
            {currentProblem && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5 bg-[#0e1422] rounded-xl border border-[#23304c] p-5 max-h-[850px] overflow-y-auto space-y-4 shadow-card-dark text-xs sm:text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      Problem {String.fromCharCode(65 + selectedProblemIndex)}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentProblem.difficulty === 'Easy'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : currentProblem.difficulty === 'Medium'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {currentProblem.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{currentProblem.title}</h3>

                  <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-line leading-relaxed">
                    {currentProblem.description}
                  </div>

                  {/* Examples */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Examples
                    </h4>
                    {currentProblem.examples.map((ex, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-[#141c2e] border border-[#23304c] space-y-1.5 text-xs"
                      >
                        <div className="font-semibold text-slate-300">Example {idx + 1}:</div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Input:</span>
                          <code className="p-1 rounded bg-[#090d16] border border-[#23304c] text-indigo-300 block font-mono">
                            {ex.input}
                          </code>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Output:</span>
                          <code className="p-1 rounded bg-[#090d16] border border-[#23304c] text-emerald-300 block font-mono">
                            {ex.output}
                          </code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-7 h-[850px]">
                  <CodeEditor
                    problem={currentProblem}
                    onSubmissionComplete={(sub) => handleContestSubmission(sub, currentProblem.id)}
                    customTimerNode={
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-[#23304c] text-xs font-mono text-amber-300">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatContestTime(contestSecondsLeft)}</span>
                      </div>
                    }
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Live Standings / Leaderboard */
          <div className="bg-[#0e1422] rounded-xl border border-[#23304c] p-6 space-y-6 shadow-card-dark">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Live Contest Standings</h3>
                <p className="text-xs text-slate-400">
                  Real-time offline scoreboard with ICPC penalty metrics.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#141c2e] border border-[#23304c] text-slate-300">
                  {leaderboard.length} Participants
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#141c2e] border-b border-[#23304c] text-slate-400 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">Rank</th>
                    <th className="py-3 px-4">Participant</th>
                    <th className="py-3 px-4 text-center">Solved</th>
                    <th className="py-3 px-4 text-center">Score</th>
                    <th className="py-3 px-4 text-center">Penalty</th>
                    {contestProblems.map((_, idx) => (
                      <th key={idx} className="py-3 px-4 text-center">
                        Prob {String.fromCharCode(65 + idx)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b253b] text-slate-300">
                  {leaderboard.map((item) => (
                    <tr
                      key={item.name}
                      className={`hover:bg-[#141c2e]/60 transition-colors ${
                        item.isCurrentUser ? 'bg-indigo-950/30 border-l-2 border-indigo-500' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center font-bold">
                        {item.rank === 1 ? (
                          <span className="text-amber-400">🥇 1</span>
                        ) : item.rank === 2 ? (
                          <span className="text-slate-300">🥈 2</span>
                        ) : item.rank === 3 ? (
                          <span className="text-amber-600">🥉 3</span>
                        ) : (
                          item.rank
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            item.isCurrentUser ? 'bg-indigo-600 text-white' : 'bg-[#1e2a44] text-slate-300'
                          }`}>
                            {item.avatar}
                          </div>
                          <div>
                            <span className={`font-semibold ${item.isCurrentUser ? 'text-indigo-400 font-bold' : 'text-white'}`}>
                              {item.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-white">
                        {item.solvedCount}
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-emerald-400">
                        {item.totalScore}
                      </td>

                      <td className="py-3.5 px-4 text-center text-slate-400 font-mono">
                        {item.penaltyMinutes}m
                      </td>

                      {contestProblems.map((prob) => {
                        const score = item.problemScores[prob.id];
                        return (
                          <td key={prob.id} className="py-3.5 px-4 text-center">
                            {score?.solved ? (
                              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                                +{score.attempts} ({score.timeMinutes}m)
                              </span>
                            ) : score?.attempts ? (
                              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[10px] border border-rose-500/30">
                                -{score.attempts}
                              </span>
                            ) : (
                              <span className="text-slate-600 font-mono">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Contests Directory & Join / Create view
  const filteredContests = contests.filter((c) => {
    if (activeTab === 'live') return c.status === 'live';
    if (activeTab === 'upcoming') return c.status === 'upcoming';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold tracking-wide mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>Synchronized Offline Arena</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Contests
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Join a contest with an access code or create a customized local contest with custom durations and problem sets.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-glow-indigo transition-all transform hover:-translate-y-0.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Contest</span>
        </button>
      </div>

      {/* Quick Join via Code Section */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141c2e] to-[#0e1422] border border-[#23304c] space-y-4 shadow-card-dark">
        <div className="flex items-center gap-2 text-indigo-400">
          <Key className="w-5 h-5" />
          <h2 className="text-base font-bold text-white">Join Contest via Code</h2>
        </div>
        <p className="text-xs text-slate-400 max-w-xl">
          Enter the contest passcode shared by your instructor or peer to enter the synchronized arena.
        </p>

        <form onSubmit={handleJoinByCode} className="flex flex-col sm:flex-row gap-3 max-w-md">
          <div className="relative flex-1">
            <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value)}
              placeholder="e.g. OJX-7892 or CAMPUS-2026"
              className="w-full pl-9 pr-4 py-2.5 bg-[#090d16] border border-[#23304c] rounded-xl text-xs font-mono uppercase text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-glow-indigo shrink-0"
          >
            <span>Enter Contest</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {joinError && (
          <div className="text-xs text-rose-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{joinError}</span>
          </div>
        )}
      </div>

      {/* Contests Tabs */}
      <div className="flex items-center justify-between border-b border-[#23304c] pb-3">
        <div className="flex items-center gap-2">
          {(['all', 'live', 'upcoming'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#141c2e]'
              }`}
            >
              {tab === 'all' ? 'All Contests' : tab}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400">
          Showing {filteredContests.length} Contests
        </span>
      </div>

      {/* Contests Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContests.map((contest) => (
          <div
            key={contest.id}
            className="p-6 rounded-2xl bg-[#0e1422] border border-[#23304c] hover:border-indigo-500/40 transition-all shadow-card-dark flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 ${
                    contest.status === 'live'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : contest.status === 'upcoming'
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      : 'bg-slate-700/30 text-slate-400 border border-slate-600/30'
                  }`}
                >
                  {contest.status === 'live' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                  {contest.status}
                </span>

                {/* Code Copy Tag */}
                <div
                  onClick={() => handleCopyCode(contest.code)}
                  className="cursor-pointer group flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#141c2e] hover:bg-[#1c2740] border border-[#23304c] text-[11px] font-mono text-slate-300 transition-colors"
                  title="Click to copy code"
                >
                  <span>{contest.code}</span>
                  {copiedCode === contest.code ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {contest.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {contest.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 p-2 rounded bg-[#141c2e] border border-[#23304c]">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{contest.durationMinutes} Minutes</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded bg-[#141c2e] border border-[#23304c]">
                  <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{contest.problemIds.length} Problems</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#23304c] flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {contest.participantsCount} Enrolled
              </span>

              <button
                onClick={() => handleEnterContest(contest)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-glow-indigo"
              >
                <span>Enter Arena</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Contest Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-lg w-full bg-[#0e1422] border border-[#23304c] rounded-2xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#23304c] pb-4">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Create Offline Contest</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContest} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Contest Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Algorithm Speed Cup 2026"
                  className="w-full px-3 py-2 bg-[#141c2e] border border-[#23304c] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Duration (Minutes)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[30, 60, 90, 120].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setNewDuration(dur)}
                      className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                        newDuration === dur
                          ? 'bg-indigo-600 text-white shadow-glow-indigo'
                          : 'bg-[#141c2e] text-slate-400 hover:text-white border border-[#23304c]'
                      }`}
                    >
                      {dur}m
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Select Included Problems ({selectedProblemIds.length})
                </label>
                <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 bg-[#141c2e] border border-[#23304c] rounded-lg">
                  {problems.map((p) => {
                    const isChecked = selectedProblemIds.includes(p.id);
                    return (
                      <label
                        key={p.id}
                        className="flex items-center justify-between p-1.5 rounded hover:bg-[#182238] cursor-pointer text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProblemIds([...selectedProblemIds, p.id]);
                              } else {
                                setSelectedProblemIds(selectedProblemIds.filter((id) => id !== p.id));
                              }
                            }}
                            className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                          />
                          <span className="text-slate-200">{p.title}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          p.difficulty === 'Easy'
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : p.difficulty === 'Medium'
                            ? 'text-amber-400 bg-amber-500/10'
                            : 'text-rose-400 bg-rose-500/10'
                        }`}>
                          {p.difficulty}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#23304c]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-glow-indigo transition-all"
                >
                  Create & Launch Arena
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
