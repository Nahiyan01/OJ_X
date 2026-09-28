import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Send, 
  RotateCcw, 
  Copy, 
  Check, 
  Terminal, 
  Clock, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  FileCode2,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Problem, SubmissionResult, TestCase } from '../types';
import { runJudge } from '../utils/judge';

interface CodeEditorProps {
  problem: Problem;
  onSolved?: (problemId: string) => void;
  onSubmissionComplete?: (sub: SubmissionResult) => void;
  customTimerNode?: React.ReactNode;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  problem,
  onSolved,
  onSubmissionComplete,
  customTimerNode,
}) => {
  const [language, setLanguage] = useState<'javascript' | 'python' | 'cpp'>('javascript');
  const [code, setCode] = useState<string>(problem.starterCode.javascript);
  const [activeTab, setActiveTab] = useState<'testcases' | 'custom' | 'result'>('testcases');
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number>(0);
  const [customInput, setCustomInput] = useState<string>('nums = [2, 7, 11, 15], target = 9');
  
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastSubmission, setLastSubmission] = useState<SubmissionResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync starter code when language changes
  useEffect(() => {
    setCode(problem.starterCode[language]);
  }, [language, problem]);

  // Tab key indent support in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleReset = () => {
    setCode(problem.starterCode[language]);
  };

  const handleRunTests = async () => {
    setIsRunning(true);
    setActiveTab('result');
    try {
      const res = await runJudge(problem, code, language, false);
      setLastSubmission(res);
      if (res.verdict === 'Accepted') {
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#6366f1', '#10b981', '#38bdf8']
        });
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setActiveTab('result');
    try {
      const res = await runJudge(problem, code, language, true);
      setLastSubmission(res);
      if (onSubmissionComplete) {
        onSubmissionComplete(res);
      }
      if (res.verdict === 'Accepted') {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10b981', '#6366f1', '#fbbf24', '#06b6d4']
        });
        if (onSolved) {
          onSolved(problem.id);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const lineCount = code.split('\n').length;

  return (
    <div className="flex flex-col h-full bg-[#0e1422] rounded-xl border border-[#23304c] overflow-hidden shadow-card-dark">
      {/* Top Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#141c2e] border-b border-[#23304c] gap-2">
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="appearance-none bg-[#182238] border border-[#23304c] text-white text-xs font-semibold rounded-lg px-3 py-1.5 pr-8 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="javascript">JavaScript (ES6 In-Browser)</option>
              <option value="python">Python 3 (Local Runner)</option>
              <option value="cpp">C++ 20 (Local Compiler)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={handleReset}
            title="Reset to starter template"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-[#1f2a42] border border-transparent hover:border-[#23304c] transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleCopy}
            title="Copy code"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-[#1f2a42] border border-transparent hover:border-[#23304c] transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Custom Timer / Extra info */}
        {customTimerNode && (
          <div className="flex items-center">
            {customTimerNode}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunTests}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-200 bg-[#1e2a44] hover:bg-[#253454] border border-[#2e3e60] disabled:opacity-50 transition-all shadow-sm active:scale-95"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>{isRunning ? 'Running...' : 'Run Test Cases'}</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/30 disabled:opacity-50 transition-all shadow-glow-indigo active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Evaluating...' : 'Submit'}</span>
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="flex-1 relative flex overflow-hidden min-h-[300px] max-h-[460px] bg-[#090d16]">
        {/* Line Numbers */}
        <div className="select-none py-3 px-2 bg-[#0b101c] border-r border-[#1b253b] text-slate-600 text-right code-editor-font text-xs leading-relaxed w-12 shrink-0">
          {Array.from({ length: Math.max(lineCount, 15) }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="flex-1 w-full h-full p-3 bg-transparent text-slate-100 code-editor-font text-xs leading-relaxed resize-none focus:outline-none selection:bg-indigo-600/40"
          placeholder="Write your offline solution here..."
        />
      </div>

      {/* Bottom Panel: Testcases & Verdicts */}
      <div className="border-t border-[#23304c] bg-[#141c2e] flex flex-col shrink-0">
        {/* Panel Tabs */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#0f172a] border-b border-[#23304c]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('testcases')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'testcases'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Sample Cases ({problem.testCases.filter(t => !t.hidden).length})</span>
            </button>

            <button
              onClick={() => setActiveTab('custom')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'custom'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Custom Input</span>
            </button>

            {lastSubmission && (
              <button
                onClick={() => setActiveTab('result')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  activeTab === 'result'
                    ? lastSubmission.verdict === 'Accepted'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lastSubmission.verdict === 'Accepted' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span>Verdict: {lastSubmission.verdict}</span>
              </button>
            )}
          </div>

          {lastSubmission && (
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-400" />
                {lastSubmission.runtimeMs}ms
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-cyan-400" />
                {lastSubmission.memoryMb} MB
              </span>
            </div>
          )}
        </div>

        {/* Panel Content */}
        <div className="p-4 max-h-56 overflow-y-auto bg-[#0d1424]">
          {activeTab === 'testcases' && (
            <div className="space-y-3">
              {/* Case Buttons */}
              <div className="flex items-center gap-2">
                {problem.testCases
                  .filter((tc) => !tc.hidden)
                  .map((tc, idx) => (
                    <button
                      key={tc.id}
                      onClick={() => setSelectedCaseIndex(idx)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        selectedCaseIndex === idx
                          ? 'bg-slate-700 text-white font-bold border border-slate-500'
                          : 'bg-[#182238] text-slate-400 hover:text-white border border-[#23304c]'
                      }`}
                    >
                      Case {idx + 1}
                    </button>
                  ))}
              </div>

              {/* Case Details */}
              {problem.testCases[selectedCaseIndex] && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block mb-1">Input:</span>
                    <pre className="p-2.5 rounded-lg bg-[#090d16] border border-[#23304c] text-slate-200 code-editor-font overflow-x-auto">
                      {problem.testCases[selectedCaseIndex].displayInput}
                    </pre>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block mb-1">Expected Output:</span>
                    <pre className="p-2.5 rounded-lg bg-[#090d16] border border-[#23304c] text-emerald-300 code-editor-font overflow-x-auto">
                      {problem.testCases[selectedCaseIndex].displayExpected}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium block">
                Custom Test Input parameters:
              </label>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-lg bg-[#090d16] border border-[#23304c] text-slate-200 code-editor-font text-xs focus:outline-none focus:border-indigo-500"
                placeholder="e.g. nums = [1, 2, 3], target = 4"
              />
              <p className="text-[11px] text-slate-500">
                Custom inputs are executed using the local sandboxed JavaScript runtime.
              </p>
            </div>
          )}

          {activeTab === 'result' && lastSubmission && (
            <div className="space-y-3">
              {/* Verdict Banner */}
              <div
                className={`p-3 rounded-lg flex items-center justify-between border ${
                  lastSubmission.verdict === 'Accepted'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : lastSubmission.verdict === 'Time Limit Exceeded'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {lastSubmission.verdict === 'Accepted' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : lastSubmission.verdict === 'Time Limit Exceeded' ? (
                    <Clock className="w-5 h-5 text-amber-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                  )}
                  <div>
                    <span className="font-bold text-sm tracking-wide">
                      {lastSubmission.verdict}
                    </span>
                    <span className="text-xs text-slate-400 ml-2">
                      ({lastSubmission.passedCount}/{lastSubmission.totalCount} test cases passed)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span>Runtime: <strong>{lastSubmission.runtimeMs}ms</strong></span>
                  <span>Memory: <strong>{lastSubmission.memoryMb} MB</strong></span>
                </div>
              </div>

              {/* Test Cases Results List */}
              <div className="space-y-2">
                {lastSubmission.testResults.map((tr, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border text-xs flex flex-col gap-1.5 ${
                      tr.passed
                        ? 'bg-[#10201d]/40 border-emerald-500/20 text-slate-300'
                        : 'bg-[#291316]/40 border-rose-500/20 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-medium">
                        {tr.passed ? (
                          <span className="text-emerald-400 font-bold">✓ Case {idx + 1}: Passed</span>
                        ) : (
                          <span className="text-rose-400 font-bold">✕ Case {idx + 1}: Failed</span>
                        )}
                        <span className="text-slate-500">|</span>
                        <span className="text-slate-400">{tr.input}</span>
                      </div>
                      <span className="text-slate-400 text-[11px]">{tr.executionTimeMs}ms</span>
                    </div>

                    {!tr.passed && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1 text-[11px] code-editor-font">
                        <div className="p-2 bg-[#090d16] rounded border border-rose-500/20">
                          <span className="text-slate-500 block mb-0.5">Your Output:</span>
                          <span className="text-rose-300">
                            {tr.error ? tr.error : JSON.stringify(tr.actual)}
                          </span>
                        </div>
                        <div className="p-2 bg-[#090d16] rounded border border-emerald-500/20">
                          <span className="text-slate-500 block mb-0.5">Expected:</span>
                          <span className="text-emerald-300">{JSON.stringify(tr.expected)}</span>
                        </div>
                      </div>
                    )}

                    {tr.logs && tr.logs.length > 0 && (
                      <div className="p-2 bg-[#090d16] rounded border border-[#23304c] text-[11px] text-slate-400 code-editor-font">
                        <span className="text-indigo-400 block mb-0.5">Console Output:</span>
                        {tr.logs.map((log, lIdx) => (
                          <div key={lIdx}>{log}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
