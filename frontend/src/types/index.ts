export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface TestCase {
  id: string;
  input: any[];
  expected: any;
  displayInput: string;
  displayExpected: string;
  hidden?: boolean;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  acceptanceRate: string;
  solved?: boolean;
  timeLimit: string;
  memoryLimit: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: {
    javascript: string;
    python: string;
    cpp: string;
  };
  functionName: string;
  testCases: TestCase[];
}

export type Verdict = 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Evaluating' | 'Pending';

export interface TestResult {
  testCaseId: string;
  passed: boolean;
  actual?: any;
  expected?: any;
  input: string;
  executionTimeMs: number;
  error?: string;
  logs?: string[];
}

export interface SubmissionResult {
  id: string;
  problemId: string;
  problemTitle: string;
  verdict: Verdict;
  language: string;
  passedCount: number;
  totalCount: number;
  runtimeMs: number;
  memoryMb: number;
  timestamp: string;
  testResults: TestResult[];
  code: string;
}

export interface Contest {
  id: string;
  code: string;
  title: string;
  description: string;
  durationMinutes: number;
  startTime?: string;
  status: 'upcoming' | 'live' | 'completed';
  problemIds: string[];
  participantsCount: number;
  isRegistered?: boolean;
}

export interface ContestParticipant {
  rank: number;
  name: string;
  avatar: string;
  solvedCount: number;
  totalScore: number;
  penaltyMinutes: number;
  problemScores: Record<string, { solved: boolean; attempts: number; timeMinutes?: number }>;
  isCurrentUser?: boolean;
}

export interface WorkoutSession {
  id: string;
  problem: Problem;
  targetSeconds: number;
  remainingSeconds: number;
  startedAt: string;
  completedAt?: string;
  status: 'in-progress' | 'completed' | 'failed' | 'paused';
  passedCases: number;
  totalCases: number;
}
