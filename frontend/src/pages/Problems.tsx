import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Circle, 
  ArrowLeft, 
  Code2, 
  Clock, 
  Cpu, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Layers,
  BookOpen,
  History
} from 'lucide-react';
import { Problem, SubmissionResult, Difficulty } from '../types';
import { CodeEditor } from '../components/CodeEditor';

interface ProblemsProps {
  problems: Problem[];
  submissions: SubmissionResult[];
  solvedProblemIds: string[];
  selectedProblemId?: string | null;
  onSelectProblem: (id: string | null) => void;
  onSolved: (id: string) => void;
}

export const Problems: React.FC<ProblemsProps> = ({
  problems,
  submissions,
  solvedProblemIds,
  selectedProblemId,
  onSelectProblem,
  onSolved,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [leftTab, setLeftTab] = useState<'description' | 'history'>('description');

  // Extract all unique tags
  const allTags = Array.from(new Set(problems.flatMap((p) => p.tags)));

  // Filter problems
  const filteredProblems = problems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDifficulty =
      selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;

    const matchesTag =
      selectedTag === 'All' || p.tags.includes(selectedTag);

    const isSolved = solvedProblemIds.includes(p.id);
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'Solved' && isSolved) ||
      (selectedStatus === 'Todo' && !isSolved);

    return matchesSearch && matchesDifficulty && matchesTag && matchesStatus;
  });

  const activeProblem = problems.find((p) => p.id === selectedProblemId);
  const activeProblemIndex = problems.findIndex((p) => p.id === selectedProblemId);

  // Problem-specific submissions
  const problemSubmissions = activeProblem
    ? submissions.filter((s) => s.problemId === activeProblem.id)
    : [];

  // If a problem is currently selected, show the split-screen IDE view
  if (activeProblem) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {/* Navigation & Problem Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0e1422] p-4 rounded-xl border border-[#23304c]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectProblem(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-[#182238] hover:bg-[#202c46] border border-[#23304c] transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Problems</span>
            </button>

            <div className="h-4 w-[1px] bg-[#23304c] hidden sm:block" />

            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                {activeProblem.title}
              </h2>

              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  activeProblem.difficulty === 'Easy'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : activeProblem.difficulty === 'Medium'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {activeProblem.difficulty}
              </span>

              {solvedProblemIds.includes(activeProblem.id) && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Solved
                </span>
              )}
            </div>
          </div>

          {/* Prev / Next controls */}
          <div className="flex items-center gap-2">
            <button
              disabled={activeProblemIndex <= 0}
              onClick={() => onSelectProblem(problems[activeProblemIndex - 1].id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-[#182238] border border-[#23304c] disabled:opacity-30 disabled:pointer-events-none transition-all"
              title="Previous Problem"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-400 font-mono">
              {activeProblemIndex + 1} / {problems.length}
            </span>
            <button
              disabled={activeProblemIndex >= problems.length - 1}
              onClick={() => onSelectProblem(problems[activeProblemIndex + 1].id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-[#182238] border border-[#23304c] disabled:opacity-30 disabled:pointer-events-none transition-all"
              title="Next Problem"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Problem Description & History */}
          <div className="lg:col-span-5 bg-[#0e1422] rounded-xl border border-[#23304c] overflow-hidden flex flex-col max-h-[850px] shadow-card-dark">
            {/* Tabs Header */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#141c2e] border-b border-[#23304c]">
              <button
                onClick={() => setLeftTab('description')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  leftTab === 'description'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Description</span>
              </button>

              <button
                onClick={() => setLeftTab('history')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  leftTab === 'history'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>History ({problemSubmissions.length})</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-5 overflow-y-auto space-y-6 text-sm leading-relaxed text-slate-200">
              {leftTab === 'description' ? (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-indigo-400" />
                        Time Limit: {activeProblem.timeLimit}
                      </span>
                      <span className="flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-cyan-400" />
                        Memory: {activeProblem.memoryLimit}
                      </span>
                    </div>

                    <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                      {activeProblem.description}
                    </div>
                  </div>

                  {/* Examples */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Examples
                    </h4>
                    {activeProblem.examples.map((ex, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg bg-[#141c2e] border border-[#23304c] space-y-2 text-xs"
                      >
                        <div className="font-semibold text-slate-200">Example {idx + 1}:</div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Input:</span>
                          <code className="p-1.5 rounded bg-[#090d16] border border-[#23304c] text-indigo-300 block font-mono">
                            {ex.input}
                          </code>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Output:</span>
                          <code className="p-1.5 rounded bg-[#090d16] border border-[#23304c] text-emerald-300 block font-mono">
                            {ex.output}
                          </code>
                        </div>
                        {ex.explanation && (
                          <div className="text-slate-400 text-[11px] italic">
                            Explanation: {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Constraints */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Constraints
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 font-mono">
                      {activeProblem.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Tags */}
                  <div className="pt-2 border-t border-[#23304c]">
                    <span className="text-xs text-slate-400 font-medium block mb-2">Topic Tags:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeProblem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-md bg-[#182238] border border-[#23304c] text-slate-300 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Offline Submissions for this problem
                  </h4>
                  {problemSubmissions.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs">
                      No submissions recorded yet for this problem.
                    </div>
                  ) : (
                    problemSubmissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3 rounded-lg bg-[#141c2e] border border-[#23304c] space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                              sub.verdict === 'Accepted'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {sub.verdict}
                          </span>
                          <span className="text-slate-500 text-[11px]">{sub.timestamp}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400 text-[11px]">
                          <span>{sub.language}</span>
                          <span>{sub.passedCount} / {sub.totalCount} passed</span>
                          <span>{sub.runtimeMs}ms</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Code Editor */}
          <div className="lg:col-span-7 h-[850px]">
            <CodeEditor
              problem={activeProblem}
              onSolved={onSolved}
            />
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render the Problems Archive Table View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Problem Archive
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Solve algorithmic problems without time restrictions. Test and execute your solutions offline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-[#0e1422] border border-[#23304c] text-xs font-semibold text-slate-300">
            Solved: <strong className="text-emerald-400 font-bold">{solvedProblemIds.length}</strong> / {problems.length}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#0e1422] border border-[#23304c] space-y-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problem title or topic tag..."
              className="w-full pl-9 pr-4 py-2 bg-[#141c2e] border border-[#23304c] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div className="relative">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full appearance-none px-3 py-2 bg-[#141c2e] border border-[#23304c] rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full appearance-none px-3 py-2 bg-[#141c2e] border border-[#23304c] rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Solved">Solved</option>
              <option value="Todo">Unsolved (Todo)</option>
            </select>
          </div>
        </div>

        {/* Tag Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#23304c]">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Tags:</span>
          <button
            onClick={() => setSelectedTag('All')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              selectedTag === 'All'
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-[#182238] text-slate-400 hover:text-white border border-[#23304c]'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-[#182238] text-slate-400 hover:text-white border border-[#23304c]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Table */}
      <div className="bg-[#0e1422] rounded-xl border border-[#23304c] overflow-hidden shadow-card-dark">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141c2e] border-b border-[#23304c] text-slate-400 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">Status</th>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Tags</th>
                <th className="py-3.5 px-4">Acceptance</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b253b] text-slate-300">
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No problems match your current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProblems.map((prob) => {
                  const isSolved = solvedProblemIds.includes(prob.id);
                  return (
                    <tr
                      key={prob.id}
                      className="hover:bg-[#141c2e]/60 transition-colors group cursor-pointer"
                      onClick={() => onSelectProblem(prob.id)}
                    >
                      <td className="py-3.5 px-4 text-center">
                        {isSolved ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-600 mx-auto group-hover:text-slate-400" />
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                          {prob.title}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            prob.difficulty === 'Easy'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : prob.difficulty === 'Medium'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {prob.difficulty}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">
                        {prob.category}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {prob.tags.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded bg-[#182238] border border-[#23304c] text-[10px] text-slate-400"
                            >
                              {t}
                            </span>
                          ))}
                          {prob.tags.length > 2 && (
                            <span className="text-[10px] text-slate-500 self-center">
                              +{prob.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 font-mono">
                        {prob.acceptanceRate}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProblem(prob.id);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-sm"
                        >
                          Solve
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
