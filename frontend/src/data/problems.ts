import { Problem } from '../types';

export const PROBLEMS: Problem[] = [
  {
    id: 'prob-1',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    tags: ['Array', 'Hash Table'],
    acceptanceRate: '51.4%',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    functionName: 'twoSum',
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, n in enumerate(nums):
            diff = target - n
            if diff in seen:
                return [seen[diff], i]
            seen[n] = i
        return []`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (seen.count(complement)) return {seen[complement], i};
            seen[nums[i]] = i;
        }
        return {};
    }
};`
    },
    testCases: [
      {
        id: 'tc-1',
        input: [[2, 7, 11, 15], 9],
        expected: [0, 1],
        displayInput: 'nums = [2, 7, 11, 15], target = 9',
        displayExpected: '[0, 1]',
      },
      {
        id: 'tc-2',
        input: [[3, 2, 4], 6],
        expected: [1, 2],
        displayInput: 'nums = [3, 2, 4], target = 6',
        displayExpected: '[1, 2]',
      },
      {
        id: 'tc-3',
        input: [[3, 3], 6],
        expected: [0, 1],
        displayInput: 'nums = [3, 3], target = 6',
        displayExpected: '[0, 1]',
      },
      {
        id: 'tc-4',
        input: [[-1, -2, -3, -4, -5], -8],
        expected: [2, 4],
        displayInput: 'nums = [-1, -2, -3, -4, -5], target = -8',
        displayExpected: '[2, 4]',
        hidden: true,
      },
      {
        id: 'tc-5',
        input: [[1000000, 500, 2000000], 1000500],
        expected: [0, 1],
        displayInput: 'nums = [1000000, 500, 2000000], target = 1000500',
        displayExpected: '[0, 1]',
        hidden: true,
      }
    ]
  },
  {
    id: 'prob-2',
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    tags: ['String', 'Stack'],
    acceptanceRate: '40.8%',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.'
    ],
    functionName: 'isValid',
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {')': '(', '}': '{', ']': '['}
        for char in s:
            if char in mapping:
                top = stack.pop() if stack else '#'
                if mapping[char] != top:
                    return False
            else:
                stack.append(char)
        return not stack`,
      cpp: `#include <string>
#include <stack>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(' || c == '{' || c == '[') st.push(c);
            else {
                if (st.empty()) return false;
                if (c == ')' && st.top() != '(') return false;
                if (c == '}' && st.top() != '{') return false;
                if (c == ']' && st.top() != '[') return false;
                st.pop();
            }
        }
        return st.empty();
    }
};`
    },
    testCases: [
      {
        id: 'tc-2-1',
        input: ['()'],
        expected: true,
        displayInput: 's = "()"',
        displayExpected: 'true',
      },
      {
        id: 'tc-2-2',
        input: ['()[]{}'],
        expected: true,
        displayInput: 's = "()[]{}"',
        displayExpected: 'true',
      },
      {
        id: 'tc-2-3',
        input: ['(]'],
        expected: false,
        displayInput: 's = "(]"',
        displayExpected: 'false',
      },
      {
        id: 'tc-2-4',
        input: ['([{}])'],
        expected: true,
        displayInput: 's = "([{}])"',
        displayExpected: 'true',
        hidden: true,
      },
      {
        id: 'tc-2-5',
        input: ['{[]()(()}'],
        expected: false,
        displayInput: 's = "{[]()(()}"',
        displayExpected: 'false',
        hidden: true,
      }
    ]
  },
  {
    id: 'prob-3',
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    acceptanceRate: '34.2%',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with length 3.'
      }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    functionName: 'lengthOfLongestSubstring',
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  let maxLength = 0;
  let left = 0;
  const map = new Map();
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (map.has(char) && map.get(char) >= left) {
      left = map.get(char) + 1;
    }
    map.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_map = {}
        left = 0
        max_len = 0
        for right, char in enumerate(s):
            if char in char_map and char_map[char] >= left:
                left = char_map[char] + 1
            char_map[char] = right
            max_len = max(max_len, right - left + 1)
        return max_len`,
      cpp: `#include <string>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        vector<int> last(256, -1);
        int maxLen = 0, left = 0;
        for (int i = 0; i < s.length(); i++) {
            if (last[(unsigned char)s[i]] >= left)
                left = last[(unsigned char)s[i]] + 1;
            last[(unsigned char)s[i]] = i;
            maxLen = max(maxLen, i - left + 1);
        }
        return maxLen;
    }
};`
    },
    testCases: [
      {
        id: 'tc-3-1',
        input: ['abcabcbb'],
        expected: 3,
        displayInput: 's = "abcabcbb"',
        displayExpected: '3',
      },
      {
        id: 'tc-3-2',
        input: ['bbbbb'],
        expected: 1,
        displayInput: 's = "bbbbb"',
        displayExpected: '1',
      },
      {
        id: 'tc-3-3',
        input: ['pwwkew'],
        expected: 3,
        displayInput: 's = "pwwkew"',
        displayExpected: '3',
      },
      {
        id: 'tc-3-4',
        input: [''],
        expected: 0,
        displayInput: 's = ""',
        displayExpected: '0',
        hidden: true,
      },
      {
        id: 'tc-3-5',
        input: ['tmmzuxt'],
        expected: 5,
        displayInput: 's = "tmmzuxt"',
        displayExpected: '5',
        hidden: true,
      }
    ]
  },
  {
    id: 'prob-4',
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    tags: ['Array', 'Divide and Conquer', 'Dynamic Programming'],
    acceptanceRate: '50.3%',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.`,
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.'
      },
      {
        input: 'nums = [1]',
        output: '1'
      },
      {
        input: 'nums = [5,4,-1,7,8]',
        output: '23'
      }
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    functionName: 'maxSubArray',
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  let maxSum = nums[0];
  let curSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    curSum = Math.max(nums[i], curSum + nums[i]);
    maxSum = Math.max(maxSum, curSum);
  }
  return maxSum;
}`,
      python: `class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        cur_sum = max_sum = nums[0]
        for n in nums[1:]:
            cur_sum = max(n, cur_sum + n)
            max_sum = max(max_sum, cur_sum)
        return max_sum`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int cur = nums[0], maxVal = nums[0];
        for (size_t i = 1; i < nums.size(); i++) {
            cur = max(nums[i], cur + nums[i]);
            maxVal = max(maxVal, cur);
        }
        return maxVal;
    }
};`
    },
    testCases: [
      {
        id: 'tc-4-1',
        input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]],
        expected: 6,
        displayInput: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        displayExpected: '6',
      },
      {
        id: 'tc-4-2',
        input: [[1]],
        expected: 1,
        displayInput: 'nums = [1]',
        displayExpected: '1',
      },
      {
        id: 'tc-4-3',
        input: [[5, 4, -1, 7, 8]],
        expected: 23,
        displayInput: 'nums = [5,4,-1,7,8]',
        displayExpected: '23',
      },
      {
        id: 'tc-4-4',
        input: [[-1, -2, -3, -4]],
        expected: -1,
        displayInput: 'nums = [-1,-2,-3,-4]',
        displayExpected: '-1',
        hidden: true,
      }
    ]
  },
  {
    id: 'prob-5',
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    tags: ['Math', 'Dynamic Programming', 'Memoization'],
    acceptanceRate: '52.7%',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    examples: [
      {
        input: 'n = 2',
        output: '2',
        explanation: 'There are two ways: (1 step + 1 step) or (2 steps).'
      },
      {
        input: 'n = 3',
        output: '3',
        explanation: 'There are three ways: (1+1+1), (1+2), or (2+1).'
      }
    ],
    constraints: [
      '1 <= n <= 45'
    ],
    functionName: 'climbStairs',
    starterCode: {
      javascript: `/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
  if (n <= 2) return n;
  let prev2 = 1, prev1 = 2;
  for (let i = 3; i <= n; i++) {
    const cur = prev1 + prev2;
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}`,
      python: `class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n
        a, b = 1, 2
        for _ in range(3, n + 1):
            a, b = b, a + b
        return b`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
};`
    },
    testCases: [
      {
        id: 'tc-5-1',
        input: [2],
        expected: 2,
        displayInput: 'n = 2',
        displayExpected: '2',
      },
      {
        id: 'tc-5-2',
        input: [3],
        expected: 3,
        displayInput: 'n = 3',
        displayExpected: '3',
      },
      {
        id: 'tc-5-3',
        input: [5],
        expected: 8,
        displayInput: 'n = 5',
        displayExpected: '8',
      },
      {
        id: 'tc-5-4',
        input: [10],
        expected: 89,
        displayInput: 'n = 10',
        displayExpected: '89',
        hidden: true,
      }
    ]
  },
  {
    id: 'prob-6',
    title: 'Valid Palindrome',
    slug: 'valid-palindrome',
    difficulty: 'Easy',
    category: 'Two Pointers',
    tags: ['Two Pointers', 'String'],
    acceptanceRate: '45.1%',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: 'true',
        explanation: '"amanaplanacanalpanama" is a palindrome.'
      },
      {
        input: 's = "race a car"',
        output: 'false',
        explanation: '"raceacar" is not a palindrome.'
      },
      {
        input: 's = " "',
        output: 'true',
        explanation: 's is an empty string "" after removing non-alphanumeric characters. Since an empty string reads the same forward and backward, it is a palindrome.'
      }
    ],
    constraints: [
      '1 <= s.length <= 2 * 10^5',
      's consists only of printable ASCII characters.'
    ],
    functionName: 'isPalindrome',
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
      python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        clean = [c.lower() for c in s if c.isalnum()]
        return clean == clean[::-1]`,
      cpp: `#include <string>
#include <cctype>
using namespace std;

class Solution {
public:
    bool isPalindrome(string s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            while (left < right && !isalnum(s[left])) left++;
            while (left < right && !isalnum(s[right])) right--;
            if (tolower(s[left]) != tolower(s[right])) return false;
            left++;
            right--;
        }
        return true;
    }
};`
    },
    testCases: [
      {
        id: 'tc-6-1',
        input: ['A man, a plan, a canal: Panama'],
        expected: true,
        displayInput: 's = "A man, a plan, a canal: Panama"',
        displayExpected: 'true',
      },
      {
        id: 'tc-6-2',
        input: ['race a car'],
        expected: false,
        displayInput: 's = "race a car"',
        displayExpected: 'false',
      },
      {
        id: 'tc-6-3',
        input: [' '],
        expected: true,
        displayInput: 's = " "',
        displayExpected: 'true',
      },
      {
        id: 'tc-6-4',
        input: ['0P'],
        expected: false,
        displayInput: 's = "0P"',
        displayExpected: 'false',
        hidden: true,
      }
    ]
  },
  {
    id: 'prob-7',
    title: 'Coin Change',
    slug: 'coin-change',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    tags: ['Array', 'Dynamic Programming', 'Breadth-First Search'],
    acceptanceRate: '42.9%',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    examples: [
      {
        input: 'coins = [1,2,5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1'
      },
      {
        input: 'coins = [2], amount = 3',
        output: '-1'
      },
      {
        input: 'coins = [1], amount = 0',
        output: '0'
      }
    ],
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    functionName: 'coinChange',
    starterCode: {
      javascript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      python: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0
        for i in range(1, amount + 1):
            for c in coins:
                if i - c >= 0:
                    dp[i] = min(dp[i], dp[i - c] + 1)
        return dp[amount] if dp[amount] != float('inf') else -1`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int c : coins) {
                if (i >= c) dp[i] = min(dp[i], dp[i - c] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
};`
    },
    testCases: [
      {
        id: 'tc-7-1',
        input: [[1, 2, 5], 11],
        expected: 3,
        displayInput: 'coins = [1, 2, 5], amount = 11',
        displayExpected: '3',
      },
      {
        id: 'tc-7-2',
        input: [[2], 3],
        expected: -1,
        displayInput: 'coins = [2], amount = 3',
        displayExpected: '-1',
      },
      {
        id: 'tc-7-3',
        input: [[1], 0],
        expected: 0,
        displayInput: 'coins = [1], amount = 0',
        displayExpected: '0',
      },
      {
        id: 'tc-7-4',
        input: [[186, 419, 83, 408], 6249],
        expected: 20,
        displayInput: 'coins = [186, 419, 83, 408], amount = 6249',
        displayExpected: '20',
        hidden: true,
      }
    ]
  },
  {
    id: 'prob-8',
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    category: 'Two Pointers',
    tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'],
    acceptanceRate: '60.1%',
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped.'
      },
      {
        input: 'height = [4,2,0,3,2,5]',
        output: '9'
      }
    ],
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5'
    ],
    functionName: 'trap',
    starterCode: {
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function trap(height) {
  let left = 0, right = height.length - 1;
  let maxLeft = 0, maxRight = 0;
  let water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= maxLeft) maxLeft = height[left];
      else water += maxLeft - height[left];
      left++;
    } else {
      if (height[right] >= maxRight) maxRight = height[right];
      else water += maxRight - height[right];
      right--;
    }
  }
  return water;
}`,
      python: `class Solution:
    def trap(self, height: list[int]) -> int:
        if not height:
            return 0
        l, r = 0, len(height) - 1
        left_max, right_max = height[l], height[r]
        water = 0
        while l < r:
            if left_max < right_max:
                l += 1
                left_max = max(left_max, height[l])
                water += left_max - height[l]
            else:
                r -= 1
                right_max = max(right_max, height[r])
                water += right_max - height[r]
        return water`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int trap(vector<int>& height) {
        int l = 0, r = height.size() - 1;
        int leftMax = 0, rightMax = 0, water = 0;
        while (l < r) {
            if (height[l] < height[r]) {
                if (height[l] >= leftMax) leftMax = height[l];
                else water += leftMax - height[l];
                l++;
            } else {
                if (height[rightMax] >= rightMax) rightMax = height[r];
                else water += rightMax - height[r];
                r--;
            }
        }
        return water;
    }
};`
    },
    testCases: [
      {
        id: 'tc-8-1',
        input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]],
        expected: 6,
        displayInput: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        displayExpected: '6',
      },
      {
        id: 'tc-8-2',
        input: [[4, 2, 0, 3, 2, 5]],
        expected: 9,
        displayInput: 'height = [4,2,0,3,2,5]',
        displayExpected: '9',
      },
      {
        id: 'tc-8-3',
        input: [[3, 0, 2, 0, 4]],
        expected: 7,
        displayInput: 'height = [3,0,2,0,4]',
        displayExpected: '7',
        hidden: true,
      }
    ]
  }
];

export const INITIAL_CONTESTS = [
  {
    id: 'contest-2026-01',
    code: 'OJX-7892',
    title: 'Offline Algorithm Sprint #14',
    description: 'A 60-minute intensive speed contest testing algorithmic optimization, dynamic programming, and data structures. No external networks allowed.',
    durationMinutes: 60,
    startTime: '2026-09-28T14:30:00.000Z',
    status: 'live' as const,
    problemIds: ['prob-1', 'prob-2', 'prob-4'],
    participantsCount: 42,
    isRegistered: true,
  },
  {
    id: 'contest-2026-02',
    code: 'CAMPUS-2026',
    title: 'National Collegiate Local Qualifier',
    description: 'Pre-configured ICPC collegiate simulation arena with penalty calculations and live local freeze board.',
    durationMinutes: 120,
    startTime: '2026-09-29T18:00:00.000Z',
    status: 'upcoming' as const,
    problemIds: ['prob-3', 'prob-5', 'prob-7', 'prob-8'],
    participantsCount: 88,
    isRegistered: false,
  },
  {
    id: 'contest-2026-03',
    code: 'SPEED-ALGO-4',
    title: 'Rapid Blitz: Strings & Pointers',
    description: 'Lightning-fast 30 minute round testing rapid implementation of string matching and two-pointer paradigms.',
    durationMinutes: 30,
    startTime: '2026-09-25T10:00:00.000Z',
    status: 'completed' as const,
    problemIds: ['prob-2', 'prob-3', 'prob-6'],
    participantsCount: 64,
    isRegistered: true,
  }
];
