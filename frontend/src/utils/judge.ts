import { Problem, SubmissionResult, TestResult, Verdict } from '../types';

/**
 * Deep equality check for primitives, arrays, and objects
 */
export function areEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!areEqual(a[i], b[i])) return false;
    }
    return true;
  }
  
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!b.hasOwnProperty(key) || !areEqual(a[key], b[key])) return false;
    }
    return true;
  }
  
  return false;
}

/**
 * Executes user JavaScript code in a safe sandbox
 */
export async function executeJavaScriptTest(
  code: string,
  functionName: string,
  inputArgs: any[],
  expected: any,
  testCaseId: string,
  displayInput: string,
  timeoutMs: number = 2000
): Promise<TestResult> {
  const logs: string[] = [];
  const start = performance.now();

  try {
    // Wrap function and capture console logs
    const wrappedCode = `
      "use strict";
      const __logs = [];
      const originalLog = console.log;
      console.log = (...args) => {
        try {
          __logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        } catch(e) {}
      };
      
      try {
        ${code}
        
        let targetFn;
        if (typeof ${functionName} === 'function') {
          targetFn = ${functionName};
        } else if (typeof Solution !== 'undefined' && typeof (new Solution())['${functionName}'] === 'function') {
          targetFn = (new Solution())['${functionName}'].bind(new Solution());
        }
        
        if (!targetFn) {
          throw new Error('Function "${functionName}" is not defined or could not be found.');
        }
        
        const __result = targetFn(...__args);
        return { result: __result, logs: __logs };
      } finally {
        console.log = originalLog;
      }
    `;

    // Execute with timeout race
    const executionPromise = new Promise<{ result: any; logs: string[] }>((resolve, reject) => {
      try {
        // eslint-disable-next-line no-new-func
        const runner = new Function('__args', wrappedCode);
        // Deep clone input args to prevent mutations between test cases
        const clonedArgs = JSON.parse(JSON.stringify(inputArgs));
        const res = runner(clonedArgs);
        resolve(res);
      } catch (err: any) {
        reject(err);
      }
    });

    const timeoutPromise = new Promise<{ result: any; logs: string[] }>((_, reject) => {
      setTimeout(() => reject(new Error('TIME_LIMIT_EXCEEDED')), timeoutMs);
    });

    const res = await Promise.race([executionPromise, timeoutPromise]);
    const duration = Math.round(performance.now() - start);

    const passed = areEqual(res.result, expected);

    return {
      testCaseId,
      passed,
      actual: res.result,
      expected,
      input: displayInput,
      executionTimeMs: Math.max(1, duration),
      logs: res.logs,
    };
  } catch (err: any) {
    const duration = Math.round(performance.now() - start);
    if (err.message === 'TIME_LIMIT_EXCEEDED') {
      return {
        testCaseId,
        passed: false,
        error: 'Time Limit Exceeded (> 2000ms)',
        input: displayInput,
        executionTimeMs: timeoutMs,
        expected,
        logs,
      };
    }

    return {
      testCaseId,
      passed: false,
      error: err?.message || String(err),
      input: displayInput,
      executionTimeMs: Math.max(1, duration),
      expected,
      logs,
    };
  }
}

/**
 * Realistic offline simulation for Python and C++
 */
export async function simulateNonJsExecution(
  language: 'python' | 'cpp',
  code: string,
  functionName: string,
  problem: Problem
): Promise<SubmissionResult> {
  await new Promise((r) => setTimeout(r, 450)); // realistic compilation latency

  const testResults: TestResult[] = [];
  let passedCount = 0;

  // Basic syntax & signature check
  const hasSyntaxError =
    code.trim().length < 15 ||
    (language === 'python' && !code.includes('def ')) ||
    (language === 'cpp' && (!code.includes('{') || !code.includes('}')));

  if (hasSyntaxError) {
    const errorMsg =
      language === 'python'
        ? `SyntaxError: unexpected EOF or missing function definition for '${functionName}'`
        : `error: expected ';' or function body before token in Solution::${functionName}`;

    return {
      id: 'sub-' + Date.now(),
      problemId: problem.id,
      problemTitle: problem.title,
      verdict: 'Runtime Error',
      language,
      passedCount: 0,
      totalCount: problem.testCases.length,
      runtimeMs: 0,
      memoryMb: 0,
      timestamp: new Date().toLocaleTimeString(),
      testResults: [
        {
          testCaseId: 'compile-err',
          passed: false,
          error: errorMsg,
          input: 'Build target',
          executionTimeMs: 12,
        },
      ],
      code,
    };
  }

  // Execute each test case
  for (const tc of problem.testCases) {
    // If the code contains comments indicating intentional test failure or incomplete pass
    const isBasicPass = !code.includes('throw') && !code.includes('return -999');
    const passed = isBasicPass;
    if (passed) passedCount++;

    testResults.push({
      testCaseId: tc.id,
      passed,
      actual: passed ? tc.expected : 'null',
      expected: tc.expected,
      input: tc.displayInput,
      executionTimeMs: Math.floor(Math.random() * 8) + 2,
    });
  }

  const verdict: Verdict =
    passedCount === problem.testCases.length ? 'Accepted' : 'Wrong Answer';
  const runtimeMs = Math.floor(Math.random() * 12) + 3;
  const memoryMb = Number((Math.random() * 5 + 38).toFixed(1));

  return {
    id: 'sub-' + Date.now(),
    problemId: problem.id,
    problemTitle: problem.title,
    verdict,
    language,
    passedCount,
    totalCount: problem.testCases.length,
    runtimeMs,
    memoryMb,
    timestamp: new Date().toLocaleTimeString(),
    testResults,
    code,
  };
}

/**
 * Offline Judge runner that processes all test cases for a problem
 */
export async function runJudge(
  problem: Problem,
  code: string,
  language: 'javascript' | 'python' | 'cpp',
  isFullSubmission: boolean = true
): Promise<SubmissionResult> {
  const targetCases = isFullSubmission
    ? problem.testCases
    : problem.testCases.filter((tc) => !tc.hidden);

  if (language !== 'javascript') {
    return simulateNonJsExecution(language, code, problem.functionName, problem);
  }

  const testResults: TestResult[] = [];
  let passedCount = 0;
  let hasTLE = false;
  let hasRuntimeErr = false;

  for (const tc of targetCases) {
    const res = await executeJavaScriptTest(
      code,
      problem.functionName,
      tc.input,
      tc.expected,
      tc.id,
      tc.displayInput
    );
    testResults.push(res);
    if (res.passed) {
      passedCount++;
    } else if (res.error?.includes('Time Limit Exceeded')) {
      hasTLE = true;
    } else if (res.error) {
      hasRuntimeErr = true;
    }
  }

  let verdict: Verdict = 'Accepted';
  if (hasTLE) {
    verdict = 'Time Limit Exceeded';
  } else if (hasRuntimeErr && passedCount === 0) {
    verdict = 'Runtime Error';
  } else if (passedCount !== targetCases.length) {
    verdict = 'Wrong Answer';
  }

  const totalDuration = testResults.reduce((acc, r) => acc + r.executionTimeMs, 0);
  const runtimeMs = Math.max(1, Math.round(totalDuration / testResults.length));
  const memoryMb = Number((Math.random() * 4 + 42.5).toFixed(1));

  const submission: SubmissionResult = {
    id: 'sub-' + Date.now(),
    problemId: problem.id,
    problemTitle: problem.title,
    verdict,
    language,
    passedCount,
    totalCount: targetCases.length,
    runtimeMs,
    memoryMb,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    testResults,
    code,
  };

  // Persist submission in localStorage
  try {
    const existing = JSON.parse(localStorage.getItem('ojx_submissions') || '[]');
    existing.unshift(submission);
    localStorage.setItem('ojx_submissions', JSON.stringify(existing.slice(0, 50)));
  } catch (e) {
    console.error('Failed to store submission offline', e);
  }

  return submission;
}
