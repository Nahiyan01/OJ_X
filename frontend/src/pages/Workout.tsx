import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Flame, 
  Clock, 
  Trophy, 
  Dumbbell, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  Sliders, 
  Sparkles,
  Zap,
  BarChart3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Problem, SubmissionResult } from '../types';
import { CodeEditor } from '../components/CodeEditor';

interface WorkoutProps {
  problems: Problem[];
  onSolved: (id: string) => void;
}

export const Workout: React.FC<WorkoutProps> = ({
  problems,
  onSolved,
}) => {
  // Workout Configuration State
  const [selectedDuration, setSelectedDuration] = useState<number>(15); // in minutes
  const [customMinutes, setCustomMinutes] = useState<number>(15);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Medium');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Active Workout State
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(900); // in seconds
  const [totalWorkoutSeconds, setTotalWorkoutSeconds] = useState<number>(900);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  
  // Results & Summary
  const [workoutStatus, setWorkoutStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle');
  const [completionStats, setCompletionStats] = useState<{
    timeTakenSeconds: number;
    verdict: string;
    passedCases: number;
    totalCases: number;
  } | null>(null);

  const timerRef = useRef<any>(null);

  // Timer interval handling
  useEffect(() => {
    if (isStarted && !isPaused && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, isPaused, timeLeft]);

  const handleStartWorkout = () => {
    const minutes = selectedDuration === -1 ? customMinutes : selectedDuration;
    const targetSeconds = minutes * 60;
    setTotalWorkoutSeconds(targetSeconds);
    setTimeLeft(targetSeconds);

    // Pick a matching problem
    let candidateProblems = problems;
    if (selectedDifficulty !== 'All') {
      candidateProblems = candidateProblems.filter((p) => p.difficulty === selectedDifficulty);
    }
    if (selectedCategory !== 'All') {
      candidateProblems = candidateProblems.filter((p) => p.category === selectedCategory);
    }
    if (candidateProblems.length === 0) {
      candidateProblems = problems;
    }

    // Pick random problem from candidates
    const chosen = candidateProblems[Math.floor(Math.random() * candidateProblems.length)];
    setCurrentProblem(chosen);
    setIsStarted(true);
    setIsPaused(false);
    setWorkoutStatus('running');
    setCompletionStats(null);
  };

  const handleTimeUp = () => {
    setWorkoutStatus('failed');
    setIsPaused(true);
  };

  const handleSubmissionComplete = (sub: SubmissionResult) => {
    if (sub.verdict === 'Accepted') {
      const timeTaken = totalWorkoutSeconds - timeLeft;
      setCompletionStats({
        timeTakenSeconds: timeTaken,
        verdict: 'Accepted',
        passedCases: sub.passedCount,
        totalCases: sub.totalCount,
      });
      setWorkoutStatus('completed');
      setIsPaused(true);

      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
      });

      if (currentProblem) {
        onSolved(currentProblem.id);
      }
    }
  };

  const handleQuitWorkout = () => {
    if (confirm('Are you sure you want to end this timed workout?')) {
      setIsStarted(false);
      setWorkoutStatus('idle');
      setCurrentProblem(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progressPercent = Math.max(0, Math.min(100, (timeLeft / totalWorkoutSeconds) * 100));

  // If in active workout session
  if (isStarted && currentProblem) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {/* Top Sticky Workout HUD */}
        <div className="bg-[#0e1422] p-4 rounded-xl border border-[#23304c] flex flex-wrap items-center justify-between gap-4 shadow-card-dark">
          {/* Left: Problem & Difficulty */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Active Workout
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
              <h2 className="text-base sm:text-lg font-bold text-white">
                {currentProblem.title}
              </h2>
            </div>
          </div>

          {/* Center: Digital Timer Display */}
          <div className="flex items-center gap-4 bg-[#141c2e] px-5 py-2.5 rounded-xl border border-[#23304c]">
            <Clock className={`w-5 h-5 ${timeLeft < 120 ? 'text-rose-400 animate-pulse' : 'text-indigo-400'}`} />
            <div className="flex flex-col items-center">
              <span className={`font-mono text-2xl font-black tracking-widest ${
                timeLeft < 60
                  ? 'text-rose-400 animate-pulse'
                  : timeLeft < 180
                  ? 'text-amber-400'
                  : 'text-white'
              }`}>
                {formatTime(timeLeft)}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Time Remaining</span>
            </div>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white bg-[#182238] border border-[#23304c] transition-all ml-2"
              title={isPaused ? 'Resume Timer' : 'Pause Timer'}
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
            </button>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleQuitWorkout}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all"
            >
              End Workout
            </button>
          </div>
        </div>

        {/* Workout Progress Bar */}
        <div className="w-full bg-[#141c2e] h-1.5 rounded-full overflow-hidden border border-[#23304c]">
          <div
            className={`h-full transition-all duration-1000 ${
              timeLeft < 60 ? 'bg-rose-500' : timeLeft < 180 ? 'bg-amber-500' : 'bg-indigo-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Split Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Problem statement */}
          <div className="lg:col-span-5 bg-[#0e1422] rounded-xl border border-[#23304c] p-5 max-h-[850px] overflow-y-auto space-y-4 shadow-card-dark text-xs sm:text-sm">
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                Category: {currentProblem.category}
              </span>
              <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-line leading-relaxed">
                {currentProblem.description}
              </div>
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

            {/* Constraints */}
            <div className="space-y-1.5 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Constraints
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-xs font-mono">
                {currentProblem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Code Editor & Judge */}
          <div className="lg:col-span-7 h-[850px]">
            <CodeEditor
              problem={currentProblem}
              onSolved={onSolved}
              onSubmissionComplete={handleSubmissionComplete}
              customTimerNode={
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-[#23304c] text-xs font-mono text-emerald-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              }
            />
          </div>
        </div>

        {/* Modal on Completion or Time Expired */}
        {workoutStatus === 'completed' && completionStats && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="max-w-md w-full bg-[#0e1422] border border-emerald-500/40 rounded-2xl p-6 space-y-6 shadow-2xl text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Trophy className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white">Workout Conquered!</h3>
                <p className="text-xs text-slate-400">
                  You successfully solved the problem within your target time window.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#141c2e] border border-[#23304c] text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Time Elapsed</span>
                  <span className="font-mono text-lg font-bold text-emerald-400">
                    {formatTime(completionStats.timeTakenSeconds)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Time Left</span>
                  <span className="font-mono text-lg font-bold text-white">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsStarted(false);
                    setWorkoutStatus('idle');
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-[#182238] hover:bg-[#202c46] border border-[#23304c] transition-all"
                >
                  Return to Workouts
                </button>
                <button
                  onClick={handleStartWorkout}
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-glow-indigo transition-all"
                >
                  Next Problem
                </button>
              </div>
            </div>
          </div>
        )}

        {workoutStatus === 'failed' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="max-w-md w-full bg-[#0e1422] border border-rose-500/40 rounded-2xl p-6 space-y-6 shadow-2xl text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Clock className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white">Time Expired!</h3>
                <p className="text-xs text-slate-400">
                  The countdown timer reached 0:00 before solution acceptance.
                </p>
              </div>

              <p className="text-xs text-slate-300">
                Competitive coding under time pressure builds speed and muscle memory. Don't worry—try another sprint or review the problem in untimed mode.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsStarted(false);
                    setWorkoutStatus('idle');
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-[#182238] hover:bg-[#202c46] border border-[#23304c] transition-all"
                >
                  Exit Workout
                </button>
                <button
                  onClick={handleStartWorkout}
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-glow-indigo transition-all"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Otherwise, render Workout Setup & Sprint Config Page
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold tracking-wide mb-3">
          <Dumbbell className="w-3.5 h-3.5" />
          <span>Timed Speed Drills</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Workout Arena
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Solve previous questions on a set countdown timer. Build algorithmic reflex, optimize your runtime, and train for live interviews and contests.
        </p>
      </div>

      {/* Workout Preset Cards */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          1. Select Timer Duration
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Preset 1: 5 Min */}
          <div
            onClick={() => setSelectedDuration(5)}
            className={`cursor-pointer p-5 rounded-xl border transition-all flex flex-col justify-between ${
              selectedDuration === 5
                ? 'bg-indigo-600/15 border-indigo-500 shadow-glow-indigo'
                : 'bg-[#0e1422] border-[#23304c] hover:border-slate-600'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Blitz
                </span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">5 Mins</div>
              <p className="text-xs text-slate-400">
                Ultra-fast sprint for quick syntax and basic algorithmic reflexes.
              </p>
            </div>
          </div>

          {/* Preset 2: 15 Min */}
          <div
            onClick={() => setSelectedDuration(15)}
            className={`cursor-pointer p-5 rounded-xl border transition-all flex flex-col justify-between ${
              selectedDuration === 15
                ? 'bg-indigo-600/15 border-indigo-500 shadow-glow-indigo'
                : 'bg-[#0e1422] border-[#23304c] hover:border-slate-600'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Rapid
                </span>
                <Clock className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">15 Mins</div>
              <p className="text-xs text-slate-400">
                Standard technical phone screen / initial round duration.
              </p>
            </div>
          </div>

          {/* Preset 3: 30 Min */}
          <div
            onClick={() => setSelectedDuration(30)}
            className={`cursor-pointer p-5 rounded-xl border transition-all flex flex-col justify-between ${
              selectedDuration === 30
                ? 'bg-indigo-600/15 border-indigo-500 shadow-glow-indigo'
                : 'bg-[#0e1422] border-[#23304c] hover:border-slate-600'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Standard
                </span>
                <Flame className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white">30 Mins</div>
              <p className="text-xs text-slate-400">
                Optimal time for Medium/Hard algorithmic optimization drills.
              </p>
            </div>
          </div>

          {/* Preset 4: 45 Min */}
          <div
            onClick={() => setSelectedDuration(45)}
            className={`cursor-pointer p-5 rounded-xl border transition-all flex flex-col justify-between ${
              selectedDuration === 45
                ? 'bg-indigo-600/15 border-indigo-500 shadow-glow-indigo'
                : 'bg-[#0e1422] border-[#23304c] hover:border-slate-600'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Endurance
                </span>
                <Trophy className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-white">45 Mins</div>
              <p className="text-xs text-slate-400">
                Full-scale on-site mock interview simulation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty & Category Filter */}
      <div className="p-6 rounded-2xl bg-[#0e1422] border border-[#23304c] space-y-6">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          2. Workout Parameters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Difficulty Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 block">
              Target Difficulty:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-indigo-600 text-white shadow-glow-indigo'
                      : 'bg-[#141c2e] text-slate-400 hover:text-white border border-[#23304c]'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Focus */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 block">
              Topic Category:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-[#141c2e] border border-[#23304c] rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="All">All Topics (Randomized)</option>
              <option value="Arrays & Hashing">Arrays & Hashing</option>
              <option value="Dynamic Programming">Dynamic Programming</option>
              <option value="Stack">Stack</option>
              <option value="Sliding Window">Sliding Window</option>
              <option value="Two Pointers">Two Pointers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Launch Action */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/30 to-[#0e1422] border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">
            Ready to Begin Your {selectedDuration} Minute Drill?
          </h3>
          <p className="text-xs text-slate-400">
            A problem will be selected based on your parameters and the countdown timer will begin immediately.
          </p>
        </div>

        <button
          onClick={handleStartWorkout}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-glow-indigo transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Start Workout Now</span>
        </button>
      </div>
    </div>
  );
};
