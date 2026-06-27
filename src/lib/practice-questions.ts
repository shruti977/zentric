export type PracticeDifficulty = "Easy" | "Medium" | "Hard";

export type PracticeQuestion = {
  id: string;
  title: string;
  topic: string;
  difficulty: PracticeDifficulty;
  description: string;
  examples: { input: string; output: string }[];
  constraints: string[];
  functionName: string;
  starterCode: string;
  inputFormat: string;
  outputFormat: string;
  tests: { stdin: string; expectedOutput: string }[];
  hint: string;
  estimatedMinutes: number;
};

type ProblemKind =
  | "anagram"
  | "baseballGame"
  | "binarySearch"
  | "bipartite"
  | "characterReplacement"
  | "climbStairs"
  | "coinChange"
  | "combinationSumCount"
  | "components"
  | "connectRopes"
  | "containerWater"
  | "countDistinct"
  | "countGreater"
  | "countLeaves"
  | "detectCycle"
  | "evaluateRpn"
  | "exactWordSearch"
  | "firstBadVersion"
  | "firstNonRepeating"
  | "firstUnique"
  | "floorSqrt"
  | "gridPaths"
  | "hasCycleUndirected"
  | "houseRobber"
  | "inversionCount"
  | "islands"
  | "kthLargest"
  | "lastStoneWeight"
  | "levelOrderSum"
  | "lisLength"
  | "longestCommonPrefix"
  | "longestNoRepeat"
  | "maxConsecutiveOnes"
  | "maxSubarray"
  | "maxWindowSum"
  | "mergeIntervals"
  | "mergeSorted"
  | "middleValue"
  | "minSubarrayLen"
  | "mostFrequent"
  | "nQueensCount"
  | "nextGreater"
  | "pairTargetSorted"
  | "palindrome"
  | "permutationsCount"
  | "prefixCount"
  | "prefixRange"
  | "productExceptSelf"
  | "removeAdjacentDuplicates"
  | "removeDuplicatesSorted"
  | "removeNth"
  | "reverseSequence"
  | "reverseWords"
  | "rotateRight"
  | "searchInsert"
  | "shortestPath"
  | "sortByFrequency"
  | "sortNumbers"
  | "subarraySumEqualsK"
  | "subsetsCount"
  | "topKFrequent"
  | "treeHeight"
  | "trieStartsWith"
  | "twoSumExists"
  | "validBrackets"
  | "wordBreakBoolean";

type Family = {
  title: string;
  concept: string;
  kind: ProblemKind;
  hint: string;
};

const topicAliases: Record<string, string> = {
  "stacks & queues": "Stacks",
  "stacks and queues": "Stacks",
  queues: "Stacks",
  stack: "Stacks",
  stacks: "Stacks",
  "linked lists": "Linked Lists",
  linkedlist: "Linked Lists",
  "linked list": "Linked Lists",
  hashmap: "Hash Maps",
  "hash maps": "Hash Maps",
  maps: "Hash Maps",
  "dynamic programming": "Dynamic Programming",
  dp: "Dynamic Programming",
  "binary search": "Binary Search",
  "sorting algorithms": "Sorting Algorithms",
  sorting: "Sorting Algorithms",
  "recursion & backtracking": "Recursion & Backtracking",
  "recursion and backtracking": "Recursion & Backtracking",
  recursion: "Recursion & Backtracking",
  backtracking: "Recursion & Backtracking",
  "sliding window": "Sliding Window",
  "two pointers": "Two Pointers",
};

const supportedTopics = [
  "Arrays",
  "Strings",
  "Linked Lists",
  "Stacks",
  "Trees",
  "Binary Search",
  "Dynamic Programming",
  "Graphs",
  "Sorting Algorithms",
  "Recursion & Backtracking",
  "Heaps",
  "Hash Maps",
  "Tries",
  "Sliding Window",
  "Two Pointers",
];

const topicFamilies: Record<string, Family[]> = {
  Arrays: [
    { title: "Threshold Counter", concept: "linear scanning", kind: "countGreater", hint: "Scan once and count values that satisfy the condition." },
    { title: "Maximum Subarray", concept: "Kadane-style running sums", kind: "maxSubarray", hint: "Track the best sum ending here and the best sum overall." },
    { title: "Rotate Array", concept: "index remapping", kind: "rotateRight", hint: "Reduce k using n, then split and join the two parts." },
    { title: "Range Sum Queries", concept: "prefix sums", kind: "prefixRange", hint: "Build prefix sums so each query is O(1)." },
    { title: "Product Except Self", concept: "left/right products", kind: "productExceptSelf", hint: "Use products before and after each index; avoid division." },
  ],
  Strings: [
    { title: "Clean Palindrome", concept: "two-pointer validation", kind: "palindrome", hint: "Compare characters from both ends after normalizing the string." },
    { title: "First Unique Character", concept: "frequency counting", kind: "firstUnique", hint: "Count first, then scan again to find the earliest count of one." },
    { title: "Valid Anagram", concept: "character maps", kind: "anagram", hint: "Two strings are anagrams when every character count matches." },
    { title: "Longest Unique Substring", concept: "sliding window over characters", kind: "longestNoRepeat", hint: "Move the left boundary past repeated characters." },
    { title: "Reverse Words", concept: "token order", kind: "reverseWords", hint: "Split words, reverse their order, then join with one space." },
  ],
  "Linked Lists": [
    { title: "Reverse Node Values", concept: "pointer reversal simulation", kind: "reverseSequence", hint: "For a real list you would reverse links; here print values in reverse order." },
    { title: "Merge Two Sorted Lists", concept: "dummy node merging", kind: "mergeSorted", hint: "Always choose the smaller current value from the two lists." },
    { title: "Remove Nth From End", concept: "two-pointer gap", kind: "removeNth", hint: "Advance one pointer n steps ahead, then move both together." },
    { title: "Middle Node", concept: "slow-fast pointers", kind: "middleValue", hint: "Fast moves twice as quickly; slow lands on the middle." },
    { title: "Cycle Check", concept: "Floyd cycle detection", kind: "detectCycle", hint: "If fast and slow meet, the list has a cycle." },
  ],
  Stacks: [
    { title: "Valid Brackets", concept: "matching pairs", kind: "validBrackets", hint: "Push openers; every closer must match the latest opener." },
    { title: "Remove Adjacent Duplicates", concept: "stack cancellation", kind: "removeAdjacentDuplicates", hint: "If the next character equals the stack top, pop instead of push." },
    { title: "Next Greater Element", concept: "monotonic stack", kind: "nextGreater", hint: "Keep unresolved values on a decreasing stack." },
    { title: "Evaluate RPN", concept: "operand stack", kind: "evaluateRpn", hint: "Push numbers; for operators, pop two values and push the result." },
    { title: "Baseball Game Score", concept: "operation simulation", kind: "baseballGame", hint: "Use a stack of valid round scores." },
  ],
  Trees: [
    { title: "Binary Tree Height", concept: "recursive depth", kind: "treeHeight", hint: "The height is one plus the max height of both children." },
    { title: "Count Leaf Nodes", concept: "DFS leaf detection", kind: "countLeaves", hint: "A leaf has no valid left or right child." },
    { title: "Level Sum", concept: "BFS levels", kind: "levelOrderSum", hint: "Process the tree level by level and sum the requested layer." },
    { title: "Tree Path Count", concept: "root-to-leaf paths", kind: "subsetsCount", hint: "A binary decision at each level creates exponential path counts." },
    { title: "BST Search Insert", concept: "ordered tree decisions", kind: "searchInsert", hint: "Use the sorted order idea: go left for smaller, right for larger." },
  ],
  "Binary Search": [
    { title: "Find Target Index", concept: "classic binary search", kind: "binarySearch", hint: "Move left or right based on comparison with mid." },
    { title: "Lower Bound", concept: "first valid position", kind: "searchInsert", hint: "Maintain the first index where value could be inserted." },
    { title: "Floor Square Root", concept: "binary search on answer", kind: "floorSqrt", hint: "Search for the largest x where x*x <= n." },
    { title: "First Bad Version", concept: "first true predicate", kind: "firstBadVersion", hint: "When mid is bad, keep the left half including mid." },
    { title: "Lower Bound Count", concept: "sorted boundary counting", kind: "prefixCount", hint: "A prefix-style boundary tells how many candidates match." },
  ],
  "Dynamic Programming": [
    { title: "Climbing Stairs", concept: "one-dimensional recurrence", kind: "climbStairs", hint: "ways[n] = ways[n-1] + ways[n-2]." },
    { title: "House Robber", concept: "choose or skip", kind: "houseRobber", hint: "At each house, choose between robbing it plus i-2 or skipping it." },
    { title: "Coin Change", concept: "minimum transitions", kind: "coinChange", hint: "dp[amount] is one plus the best previous reachable amount." },
    { title: "Longest Increasing Subsequence", concept: "state by ending index", kind: "lisLength", hint: "For each value, extend smaller previous values." },
    { title: "Grid Paths", concept: "2D tabulation", kind: "gridPaths", hint: "Each cell can be reached from top or left." },
  ],
  Graphs: [
    { title: "Connected Components", concept: "DFS/BFS traversal", kind: "components", hint: "Start a traversal whenever you find an unvisited node." },
    { title: "Shortest Path", concept: "BFS distance", kind: "shortestPath", hint: "In an unweighted graph, BFS gives the shortest edge count." },
    { title: "Cycle in Undirected Graph", concept: "visited parent tracking", kind: "hasCycleUndirected", hint: "A visited neighbor that is not the parent means a cycle exists." },
    { title: "Bipartite Check", concept: "graph coloring", kind: "bipartite", hint: "Adjacent nodes must receive opposite colors." },
    { title: "Number of Islands", concept: "grid BFS/DFS", kind: "islands", hint: "Flood-fill every unvisited land cell." },
  ],
  "Sorting Algorithms": [
    { title: "Sort the Numbers", concept: "comparison sorting", kind: "sortNumbers", hint: "Sort ascending and print the resulting order." },
    { title: "Merge Intervals", concept: "sort by start", kind: "mergeIntervals", hint: "Sort intervals, then merge overlapping ranges." },
    { title: "Kth Largest", concept: "order statistics", kind: "kthLargest", hint: "Sorting descending or using a heap both work." },
    { title: "Frequency Sort", concept: "custom comparator", kind: "sortByFrequency", hint: "Sort by frequency descending, then value ascending." },
    { title: "Inversion Count", concept: "merge-sort counting", kind: "inversionCount", hint: "When a right value beats a left value, count remaining left values." },
  ],
  "Recursion & Backtracking": [
    { title: "Subset Count", concept: "include/exclude recursion", kind: "subsetsCount", hint: "Each item has two choices: take it or skip it." },
    { title: "Permutation Count", concept: "choice tree", kind: "permutationsCount", hint: "There are n choices, then n-1, then n-2..." },
    { title: "Parentheses Count", concept: "Catalan recursion", kind: "combinationSumCount", hint: "Build only states where open count is never less than close count." },
    { title: "N Queens Count", concept: "backtracking constraints", kind: "nQueensCount", hint: "Track blocked columns and diagonals." },
    { title: "Word Break", concept: "recursive segmentation", kind: "wordBreakBoolean", hint: "Try every dictionary prefix and recurse on the suffix." },
  ],
  Heaps: [
    { title: "Kth Largest Stream", concept: "min heap of size k", kind: "kthLargest", hint: "Keep only the k largest values seen so far." },
    { title: "Connect Ropes", concept: "greedy min heap", kind: "connectRopes", hint: "Always combine the two smallest ropes first." },
    { title: "Last Stone Weight", concept: "max heap simulation", kind: "lastStoneWeight", hint: "Repeatedly smash the two heaviest stones." },
    { title: "Top K Frequent", concept: "frequency heap", kind: "topKFrequent", hint: "Count frequencies, then select the most frequent values." },
    { title: "Heap Ordered Extraction", concept: "priority ordering", kind: "sortByFrequency", hint: "A heap can express custom priority rules." },
  ],
  "Hash Maps": [
    { title: "Two Sum Exists", concept: "complement lookup", kind: "twoSumExists", hint: "For each value, ask if target - value was seen already." },
    { title: "Count Distinct", concept: "set membership", kind: "countDistinct", hint: "A set keeps one copy of every unique value." },
    { title: "Most Frequent Value", concept: "frequency map", kind: "mostFrequent", hint: "Track the highest count while counting values." },
    { title: "First Non-Repeating", concept: "ordered frequency scan", kind: "firstNonRepeating", hint: "Count first, then scan in original order." },
    { title: "Subarray Sum K", concept: "prefix sum map", kind: "subarraySumEqualsK", hint: "If prefix - k existed before, a valid subarray ends here." },
  ],
  Tries: [
    { title: "Prefix Count", concept: "prefix tree traversal", kind: "prefixCount", hint: "A trie node can store how many words pass through it." },
    { title: "Exact Word Search", concept: "terminal nodes", kind: "exactWordSearch", hint: "A prefix is not a full word unless its terminal flag is set." },
    { title: "Starts With", concept: "prefix existence", kind: "trieStartsWith", hint: "Walk every prefix character; failure means false." },
    { title: "Longest Common Prefix", concept: "shared trie path", kind: "longestCommonPrefix", hint: "Stop when words branch or one word ends." },
    { title: "Word Break Dictionary", concept: "dictionary prefix DP", kind: "wordBreakBoolean", hint: "Reuse solved suffix states to avoid exponential repeats." },
  ],
  "Sliding Window": [
    { title: "Maximum Window Sum", concept: "fixed-size window", kind: "maxWindowSum", hint: "Subtract the leaving value and add the entering value." },
    { title: "Minimum Size Subarray", concept: "shrink while valid", kind: "minSubarrayLen", hint: "Once the sum is large enough, shrink from the left." },
    { title: "Longest Unique Substring", concept: "dynamic window", kind: "longestNoRepeat", hint: "Move left past the last occurrence of duplicates." },
    { title: "Character Replacement", concept: "window with budget", kind: "characterReplacement", hint: "Window length minus max frequency must stay within k." },
    { title: "Max Consecutive Ones", concept: "zero-flip window", kind: "maxConsecutiveOnes", hint: "Track how many zeroes are inside the window." },
  ],
  "Two Pointers": [
    { title: "Sorted Pair Target", concept: "opposite pointers", kind: "pairTargetSorted", hint: "Move left if the sum is too small; move right if it is too large." },
    { title: "Reverse Sequence", concept: "in-place swapping", kind: "reverseSequence", hint: "Swap the two ends and move inward." },
    { title: "Valid Palindrome", concept: "left-right comparison", kind: "palindrome", hint: "Skip noise and compare normalized characters." },
    { title: "Container With Water", concept: "move the limiting side", kind: "containerWater", hint: "The smaller height limits area, so move that pointer." },
    { title: "Remove Duplicates", concept: "write pointer", kind: "removeDuplicatesSorted", hint: "Write a value only when it differs from the previous unique value." },
  ],
};

const roman = ["I", "II", "III", "IV", "V"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function titleCaseSlug(value: string) {
  const slug = slugify(value).replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
  return slug || "practice";
}

function line(values: Array<number | string>) {
  return values.join(" ");
}

function maxSubarray(values: number[]) {
  let best = values[0] ?? 0;
  let current = values[0] ?? 0;
  for (let index = 1; index < values.length; index += 1) {
    const value = values[index]!;
    current = Math.max(value, current + value);
    best = Math.max(best, current);
  }
  return best;
}

function rotateRight(values: number[], k: number) {
  if (!values.length) return values;
  const shift = k % values.length;
  return [...values.slice(values.length - shift), ...values.slice(0, values.length - shift)];
}

function productExceptSelf(values: number[]) {
  return values.map((_, index) =>
    values.reduce((product, value, innerIndex) => product * (innerIndex === index ? 1 : value), 1),
  );
}

function nextGreater(values: number[]) {
  return values.map((value, index) => values.slice(index + 1).find((next) => next > value) ?? -1);
}

function longestNoRepeat(value: string) {
  const lastSeen = new Map<string, number>();
  let left = 0;
  let best = 0;
  [...value].forEach((char, right) => {
    const seen = lastSeen.get(char);
    if (seen !== undefined && seen >= left) left = seen + 1;
    lastSeen.set(char, right);
    best = Math.max(best, right - left + 1);
  });
  return best;
}

function houseRobber(values: number[]) {
  let prevTwo = 0;
  let prevOne = 0;
  for (const value of values) {
    const next = Math.max(prevOne, prevTwo + value);
    prevTwo = prevOne;
    prevOne = next;
  }
  return prevOne;
}

function lisLength(values: number[]) {
  const dp = values.map(() => 1);
  for (let i = 0; i < values.length; i += 1) {
    for (let j = 0; j < i; j += 1) {
      if (values[j]! < values[i]!) dp[i] = Math.max(dp[i]!, dp[j]! + 1);
    }
  }
  return Math.max(0, ...dp);
}

function inversionCount(values: number[]) {
  let count = 0;
  for (let i = 0; i < values.length; i += 1) {
    for (let j = i + 1; j < values.length; j += 1) {
      if (values[i]! > values[j]!) count += 1;
    }
  }
  return count;
}

function factorial(value: number) {
  return Array.from({ length: value }, (_, index) => index + 1).reduce((product, item) => product * item, 1);
}

function catalan(value: number) {
  const dp = Array(value + 1).fill(0) as number[];
  dp[0] = 1;
  for (let nodes = 1; nodes <= value; nodes += 1) {
    for (let left = 0; left < nodes; left += 1) {
      dp[nodes]! += dp[left]! * dp[nodes - 1 - left]!;
    }
  }
  return dp[value]!;
}

function coinChange(coins: number[], amount: number) {
  const dp = Array(amount + 1).fill(Number.POSITIVE_INFINITY) as number[];
  dp[0] = 0;
  for (let value = 1; value <= amount; value += 1) {
    for (const coin of coins) {
      if (coin <= value) dp[value] = Math.min(dp[value]!, dp[value - coin]! + 1);
    }
  }
  return Number.isFinite(dp[amount]) ? dp[amount] : -1;
}

function connectedComponents(nodeCount: number, edges: Array<[number, number]>) {
  const graph = Array.from({ length: nodeCount }, () => [] as number[]);
  edges.forEach(([a, b]) => {
    graph[a]!.push(b);
    graph[b]!.push(a);
  });
  const seen = new Set<number>();
  let count = 0;
  for (let node = 0; node < nodeCount; node += 1) {
    if (seen.has(node)) continue;
    count += 1;
    const stack = [node];
    seen.add(node);
    while (stack.length) {
      const current = stack.pop()!;
      graph[current]!.forEach((next) => {
        if (!seen.has(next)) {
          seen.add(next);
          stack.push(next);
        }
      });
    }
  }
  return count;
}

function islands(grid: string[]) {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const seen = new Set<string>();
  let count = 0;
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const key = `${r},${c}`;
      if (grid[r]![c] !== "1" || seen.has(key)) continue;
      count += 1;
      const stack: Array<[number, number]> = [[r, c]];
      seen.add(key);
      while (stack.length) {
        const [cr, cc] = stack.pop()!;
        directions.forEach(([dr, dc]) => {
          const nr = cr + dr!;
          const nc = cc + dc!;
          const nextKey = `${nr},${nc}`;
          if (nr >= 0 && nc >= 0 && nr < rows && nc < cols && grid[nr]![nc] === "1" && !seen.has(nextKey)) {
            seen.add(nextKey);
            stack.push([nr, nc]);
          }
        });
      }
    }
  }
  return count;
}

function treeChildren(values: number[]) {
  return values.map((value, index) => ({
    value,
    left: 2 * index + 1 < values.length && values[2 * index + 1] !== -1 ? 2 * index + 1 : -1,
    right: 2 * index + 2 < values.length && values[2 * index + 2] !== -1 ? 2 * index + 2 : -1,
  }));
}

function countLeaves(values: number[]) {
  const nodes = treeChildren(values);
  return nodes.filter((node, index) => values[index] !== -1 && node.left === -1 && node.right === -1).length;
}

function levelSum(values: number[], level: number) {
  const start = 2 ** level - 1;
  const end = Math.min(values.length, 2 ** (level + 1) - 1);
  return values.slice(start, end).filter((value) => value !== -1).reduce((sum, value) => sum + value, 0);
}

function descriptionFor(kind: ProblemKind, topic: string, concept: string) {
  const descriptions: Record<ProblemKind, string> = {
    anagram: "Read two lowercase strings and print true if they are anagrams.",
    baseballGame: "Simulate a baseball scoring log. Integers add scores, C removes the previous score, D doubles it, and + adds the previous two.",
    binarySearch: "Given a sorted array and a target, print the target index or -1.",
    bipartite: "Given an undirected graph, print true if it can be colored using two colors so no adjacent nodes share a color.",
    characterReplacement: "Given a string and k, print the length of the longest substring that can become all one character after at most k replacements.",
    climbStairs: "Given n stairs, print how many distinct ways you can climb using 1 or 2 steps.",
    coinChange: "Given coin values and an amount, print the minimum number of coins needed, or -1.",
    combinationSumCount: "Given n pairs of parentheses, print how many valid parentheses strings can be formed.",
    components: "Given an undirected graph, print the number of connected components.",
    connectRopes: "Given rope lengths, repeatedly connect the two smallest ropes and print the minimum total cost.",
    containerWater: "Given heights, print the maximum water area between two lines.",
    countDistinct: "Given an array, print the number of distinct values.",
    countGreater: "Given an array and threshold x, print how many values are greater than or equal to x.",
    countLeaves: "Given a level-order binary tree where -1 means null, print the number of leaf nodes.",
    detectCycle: "Given n and a cycle position, print true when the linked list would contain a cycle.",
    evaluateRpn: "Evaluate a reverse polish notation expression and print the integer result.",
    exactWordSearch: "Given dictionary words and a query, print true if the exact word exists.",
    firstBadVersion: "Given n versions and the first bad version, print the first bad version using the first-true idea.",
    firstNonRepeating: "Given an array, print the first value that appears exactly once, or -1.",
    firstUnique: "Given a string, print the index of the first non-repeating character, or -1.",
    floorSqrt: "Given n, print floor(sqrt(n)).",
    gridPaths: "Given m and n, print how many paths go from top-left to bottom-right moving only down or right.",
    hasCycleUndirected: "Given an undirected graph, print true if it contains a cycle.",
    houseRobber: "Given house values, print the maximum money you can rob without robbing adjacent houses.",
    inversionCount: "Given an array, print how many inversion pairs exist.",
    islands: "Given a 0/1 grid, print the number of islands of connected 1s.",
    kthLargest: "Given an array and k, print the kth largest value.",
    lastStoneWeight: "Repeatedly smash the two heaviest stones and print the final stone weight, or 0.",
    levelOrderSum: "Given a level-order binary tree and a level number, print the sum at that level.",
    lisLength: "Given an array, print the length of the longest strictly increasing subsequence.",
    longestCommonPrefix: "Given words, print their longest common prefix.",
    longestNoRepeat: "Given a string, print the length of the longest substring without repeating characters.",
    maxConsecutiveOnes: "Given a binary array and k, print the longest run of 1s after flipping at most k zeroes.",
    maxSubarray: "Given an array, print the maximum possible sum of a contiguous subarray.",
    maxWindowSum: "Given an array and k, print the maximum sum of any subarray of length k.",
    mergeIntervals: "Given intervals, merge overlaps and print how many intervals remain.",
    mergeSorted: "Given two sorted arrays, merge them and print the sorted result.",
    middleValue: "Given linked-list values, print the middle node value. For even length, print the second middle.",
    minSubarrayLen: "Given an array and target, print the minimum length of a contiguous subarray with sum at least target, or 0.",
    mostFrequent: "Given an array, print the most frequent value. Break ties by smaller value.",
    nQueensCount: "Given n, print the number of valid N-Queens arrangements.",
    nextGreater: "For each value, print the next greater value to its right, or -1.",
    pairTargetSorted: "Given a sorted array and target, print true if two values sum to the target.",
    palindrome: "Given a string, ignore spaces and case, then print true if it is a palindrome.",
    permutationsCount: "Given n unique items, print how many permutations exist.",
    prefixCount: "Given words and a prefix, print how many words start with that prefix.",
    prefixRange: "Given an array and range queries, print the sum for each inclusive range.",
    productExceptSelf: "Given an array, print the product of all other elements for every index.",
    removeAdjacentDuplicates: "Given a string, repeatedly remove adjacent equal characters and print the final string.",
    removeDuplicatesSorted: "Given a sorted array, print the array after removing duplicates.",
    removeNth: "Given linked-list values and n, remove the nth node from the end and print the remaining values.",
    reverseSequence: "Given a sequence of values, print it in reverse order.",
    reverseWords: "Given a sentence, reverse the order of its words.",
    rotateRight: "Given an array and k, rotate the array right by k positions and print it.",
    searchInsert: "Given a sorted array and target, print the index where the target is or should be inserted.",
    shortestPath: "Given an unweighted graph, source, and target, print the shortest path length or -1.",
    sortByFrequency: "Sort values by descending frequency, breaking ties by smaller value, and print the result.",
    sortNumbers: "Given numbers, sort them ascending and print them.",
    subarraySumEqualsK: "Given an array and k, print how many contiguous subarrays sum to k.",
    subsetsCount: "Given n values, print how many subsets exist.",
    topKFrequent: "Given an array and k, print the k most frequent values sorted by frequency desc then value asc.",
    treeHeight: "Given a level-order binary tree where -1 means null, print its height.",
    trieStartsWith: "Given dictionary words and a prefix, print true if any word starts with that prefix.",
    twoSumExists: "Given an array and target, print true if any two values sum to the target.",
    validBrackets: "Given a bracket string, print true if every bracket is balanced and correctly nested.",
    wordBreakBoolean: "Given a string and dictionary, print true if the string can be segmented into dictionary words.",
  };

  return `${descriptions[kind]} This ${topic} exercise targets ${concept}.`;
}

function testsFor(kind: ProblemKind, variant: number) {
  const offset = variant - 1;
  const base = [2 + offset, 7, 11 + offset, 15, 3];

  switch (kind) {
    case "countGreater":
      return [
        { stdin: `5\n${line(base)}\n7\n`, expectedOutput: "3" },
        { stdin: "6\n1 4 4 9 10 2\n4\n", expectedOutput: "4" },
        { stdin: "4\n-3 -1 0 8\n0\n", expectedOutput: "2" },
        { stdin: "3\n5 5 5\n6\n", expectedOutput: "0" },
      ];
    case "maxSubarray":
      return [
        { stdin: "9\n-2 1 -3 4 -1 2 1 -5 4\n", expectedOutput: "6" },
        { stdin: "5\n5 -2 3 -1 2\n", expectedOutput: "7" },
        { stdin: "4\n-8 -3 -6 -2\n", expectedOutput: "-2" },
        { stdin: `6\n${line([offset, -1, 4, -2, 3, -5])}\n`, expectedOutput: String(maxSubarray([offset, -1, 4, -2, 3, -5])) },
      ];
    case "rotateRight":
      return [
        { stdin: "5\n1 2 3 4 5\n2\n", expectedOutput: "4 5 1 2 3" },
        { stdin: "4\n10 20 30 40\n1\n", expectedOutput: "40 10 20 30" },
        { stdin: "3\n7 8 9\n3\n", expectedOutput: "7 8 9" },
        { stdin: `5\n${line(base)}\n${variant}\n`, expectedOutput: line(rotateRight(base, variant)) },
      ];
    case "prefixRange":
      return [
        { stdin: "5\n1 2 3 4 5\n3\n0 2\n1 3\n2 4\n", expectedOutput: "6 9 12" },
        { stdin: "4\n5 -2 7 1\n2\n0 3\n1 2\n", expectedOutput: "11 5" },
        { stdin: "3\n10 20 30\n1\n2 2\n", expectedOutput: "30" },
        { stdin: "6\n2 4 6 8 10 12\n2\n0 5\n3 5\n", expectedOutput: "42 30" },
      ];
    case "productExceptSelf":
      return [
        { stdin: "4\n1 2 3 4\n", expectedOutput: "24 12 8 6" },
        { stdin: "5\n2 3 4 5 6\n", expectedOutput: "360 240 180 144 120" },
        { stdin: "3\n-1 1 0\n", expectedOutput: "0 0 -1" },
        { stdin: `4\n${line([variant, 2, 3, 5])}\n`, expectedOutput: line(productExceptSelf([variant, 2, 3, 5])) },
      ];
    case "palindrome":
      return [
        { stdin: "race car\n", expectedOutput: "true" },
        { stdin: "hello\n", expectedOutput: "false" },
        { stdin: "Never odd or even\n", expectedOutput: "true" },
        { stdin: "code doc\n", expectedOutput: "false" },
      ];
    case "firstUnique":
      return [
        { stdin: "leetcode\n", expectedOutput: "0" },
        { stdin: "aabbc\n", expectedOutput: "4" },
        { stdin: "aabb\n", expectedOutput: "-1" },
        { stdin: "zentric\n", expectedOutput: "0" },
      ];
    case "anagram":
      return [
        { stdin: "listen silent\n", expectedOutput: "true" },
        { stdin: "rat car\n", expectedOutput: "false" },
        { stdin: "triangle integral\n", expectedOutput: "true" },
        { stdin: "binary brainy\n", expectedOutput: "true" },
      ];
    case "longestNoRepeat":
      return [
        { stdin: "abcabcbb\n", expectedOutput: "3" },
        { stdin: "bbbbb\n", expectedOutput: "1" },
        { stdin: "pwwkew\n", expectedOutput: "3" },
        { stdin: "zentric\n", expectedOutput: String(longestNoRepeat("zentric")) },
      ];
    case "reverseWords":
      return [
        { stdin: "ai builds focus\n", expectedOutput: "focus builds ai" },
        { stdin: "hello world\n", expectedOutput: "world hello" },
        { stdin: "one\n", expectedOutput: "one" },
        { stdin: "data structures matter\n", expectedOutput: "matter structures data" },
      ];
    case "reverseSequence":
      return [
        { stdin: "5\n1 2 3 4 5\n", expectedOutput: "5 4 3 2 1" },
        { stdin: "3\n9 8 7\n", expectedOutput: "7 8 9" },
        { stdin: "1\n42\n", expectedOutput: "42" },
        { stdin: `5\n${line(base)}\n`, expectedOutput: line([...base].reverse()) },
      ];
    case "mergeSorted":
      return [
        { stdin: "3\n1 3 5\n3\n2 4 6\n", expectedOutput: "1 2 3 4 5 6" },
        { stdin: "2\n1 10\n4\n2 3 4 5\n", expectedOutput: "1 2 3 4 5 10" },
        { stdin: "0\n\n3\n7 8 9\n", expectedOutput: "7 8 9" },
        { stdin: "3\n-3 0 4\n2\n-2 8\n", expectedOutput: "-3 -2 0 4 8" },
      ];
    case "removeNth":
      return [
        { stdin: "5\n1 2 3 4 5\n2\n", expectedOutput: "1 2 3 5" },
        { stdin: "1\n1\n1\n", expectedOutput: "" },
        { stdin: "3\n1 2 3\n3\n", expectedOutput: "2 3" },
        { stdin: "4\n7 8 9 10\n1\n", expectedOutput: "7 8 9" },
      ];
    case "middleValue":
      return [
        { stdin: "5\n1 2 3 4 5\n", expectedOutput: "3" },
        { stdin: "6\n1 2 3 4 5 6\n", expectedOutput: "4" },
        { stdin: "1\n9\n", expectedOutput: "9" },
        { stdin: "4\n10 20 30 40\n", expectedOutput: "30" },
      ];
    case "detectCycle":
      return [
        { stdin: "5\n1\n", expectedOutput: "true" },
        { stdin: "3\n-1\n", expectedOutput: "false" },
        { stdin: "1\n0\n", expectedOutput: "true" },
        { stdin: "4\n3\n", expectedOutput: "true" },
      ];
    case "validBrackets":
      return [
        { stdin: "()[]{}\n", expectedOutput: "true" },
        { stdin: "([)]\n", expectedOutput: "false" },
        { stdin: "({[]})\n", expectedOutput: "true" },
        { stdin: "((()\n", expectedOutput: "false" },
      ];
    case "removeAdjacentDuplicates":
      return [
        { stdin: "abbaca\n", expectedOutput: "ca" },
        { stdin: "azxxzy\n", expectedOutput: "ay" },
        { stdin: "aaaa\n", expectedOutput: "" },
        { stdin: "abccba\n", expectedOutput: "" },
      ];
    case "nextGreater":
      return [
        { stdin: "4\n2 1 2 4\n", expectedOutput: "4 2 4 -1" },
        { stdin: "3\n3 2 1\n", expectedOutput: "-1 -1 -1" },
        { stdin: "5\n1 3 2 5 4\n", expectedOutput: "3 5 5 -1 -1" },
        { stdin: `5\n${line(base)}\n`, expectedOutput: line(nextGreater(base)) },
      ];
    case "evaluateRpn":
      return [
        { stdin: "5\n2 1 + 3 *\n", expectedOutput: "9" },
        { stdin: "3\n4 13 5 / +\n", expectedOutput: "6" },
        { stdin: "5\n5 2 - 3 *\n", expectedOutput: "9" },
        { stdin: "5\n10 6 9 3 / - +\n", expectedOutput: "13" },
      ];
    case "baseballGame":
      return [
        { stdin: "5\n5 2 C D +\n", expectedOutput: "30" },
        { stdin: "8\n5 -2 4 C D 9 + +\n", expectedOutput: "27" },
        { stdin: "1\n1\n", expectedOutput: "1" },
        { stdin: "4\n3 4 + D\n", expectedOutput: "21" },
      ];
    case "treeHeight":
      return [
        { stdin: "7\n1 2 3 4 5 -1 6\n", expectedOutput: "3" },
        { stdin: "1\n10\n", expectedOutput: "1" },
        { stdin: "0\n\n", expectedOutput: "0" },
        { stdin: "7\n1 2 -1 3 -1 -1 -1\n", expectedOutput: "3" },
      ];
    case "countLeaves":
      return [
        { stdin: "7\n1 2 3 4 5 -1 6\n", expectedOutput: "3" },
        { stdin: "3\n1 2 3\n", expectedOutput: "2" },
        { stdin: "1\n8\n", expectedOutput: "1" },
        { stdin: "7\n1 2 -1 3 -1 -1 -1\n", expectedOutput: String(countLeaves([1, 2, -1, 3, -1, -1, -1])) },
      ];
    case "levelOrderSum":
      return [
        { stdin: "7\n1 2 3 4 5 6 7\n2\n", expectedOutput: "22" },
        { stdin: "3\n10 4 6\n1\n", expectedOutput: "10" },
        { stdin: "7\n5 3 8 -1 4 -1 9\n2\n", expectedOutput: "13" },
        { stdin: "1\n42\n0\n", expectedOutput: String(levelSum([42], 0)) },
      ];
    case "binarySearch":
      return [
        { stdin: "5\n1 3 5 7 9\n7\n", expectedOutput: "3" },
        { stdin: "4\n2 4 6 8\n5\n", expectedOutput: "-1" },
        { stdin: "1\n10\n10\n", expectedOutput: "0" },
        { stdin: "6\n-5 -2 0 4 9 11\n-2\n", expectedOutput: "1" },
      ];
    case "searchInsert":
      return [
        { stdin: "4\n1 3 5 6\n5\n", expectedOutput: "2" },
        { stdin: "4\n1 3 5 6\n2\n", expectedOutput: "1" },
        { stdin: "4\n1 3 5 6\n7\n", expectedOutput: "4" },
        { stdin: "4\n1 3 5 6\n0\n", expectedOutput: "0" },
      ];
    case "floorSqrt":
      return [
        { stdin: "8\n", expectedOutput: "2" },
        { stdin: "16\n", expectedOutput: "4" },
        { stdin: "1\n", expectedOutput: "1" },
        { stdin: "99\n", expectedOutput: "9" },
      ];
    case "firstBadVersion":
      return [
        { stdin: "5 4\n", expectedOutput: "4" },
        { stdin: "1 1\n", expectedOutput: "1" },
        { stdin: "10 7\n", expectedOutput: "7" },
        { stdin: "100 42\n", expectedOutput: "42" },
      ];
    case "climbStairs":
      return [
        { stdin: "2\n", expectedOutput: "2" },
        { stdin: "3\n", expectedOutput: "3" },
        { stdin: "5\n", expectedOutput: "8" },
        { stdin: "7\n", expectedOutput: "21" },
      ];
    case "houseRobber":
      return [
        { stdin: "4\n1 2 3 1\n", expectedOutput: "4" },
        { stdin: "5\n2 7 9 3 1\n", expectedOutput: "12" },
        { stdin: "3\n2 1 1\n", expectedOutput: "3" },
        { stdin: `5\n${line(base)}\n`, expectedOutput: String(houseRobber(base)) },
      ];
    case "coinChange":
      return [
        { stdin: "3\n1 2 5\n11\n", expectedOutput: "3" },
        { stdin: "1\n2\n3\n", expectedOutput: "-1" },
        { stdin: "3\n1 3 4\n6\n", expectedOutput: "2" },
        { stdin: "4\n1 5 10 25\n30\n", expectedOutput: String(coinChange([1, 5, 10, 25], 30)) },
      ];
    case "lisLength":
      return [
        { stdin: "8\n10 9 2 5 3 7 101 18\n", expectedOutput: "4" },
        { stdin: "6\n0 1 0 3 2 3\n", expectedOutput: "4" },
        { stdin: "4\n7 7 7 7\n", expectedOutput: "1" },
        { stdin: `5\n${line(base)}\n`, expectedOutput: String(lisLength(base)) },
      ];
    case "gridPaths":
      return [
        { stdin: "3 7\n", expectedOutput: "28" },
        { stdin: "3 2\n", expectedOutput: "3" },
        { stdin: "1 5\n", expectedOutput: "1" },
        { stdin: "4 4\n", expectedOutput: "20" },
      ];
    case "components":
      return [
        { stdin: "5 3\n0 1\n1 2\n3 4\n", expectedOutput: "2" },
        { stdin: "4 0\n", expectedOutput: "4" },
        { stdin: "3 2\n0 1\n1 2\n", expectedOutput: "1" },
        { stdin: "6 3\n0 1\n2 3\n4 5\n", expectedOutput: String(connectedComponents(6, [[0, 1], [2, 3], [4, 5]])) },
      ];
    case "shortestPath":
      return [
        { stdin: "5 4\n0 1\n1 2\n2 3\n3 4\n0 4\n", expectedOutput: "4" },
        { stdin: "4 2\n0 1\n2 3\n0 3\n", expectedOutput: "-1" },
        { stdin: "3 3\n0 1\n1 2\n0 2\n0 2\n", expectedOutput: "1" },
        { stdin: "6 5\n0 1\n1 2\n2 5\n0 3\n3 4\n0 5\n", expectedOutput: "3" },
      ];
    case "hasCycleUndirected":
      return [
        { stdin: "3 3\n0 1\n1 2\n2 0\n", expectedOutput: "true" },
        { stdin: "4 3\n0 1\n1 2\n2 3\n", expectedOutput: "false" },
        { stdin: "5 4\n0 1\n1 2\n2 3\n3 1\n", expectedOutput: "true" },
        { stdin: "2 1\n0 1\n", expectedOutput: "false" },
      ];
    case "bipartite":
      return [
        { stdin: "4 4\n0 1\n0 3\n2 1\n2 3\n", expectedOutput: "true" },
        { stdin: "3 3\n0 1\n1 2\n2 0\n", expectedOutput: "false" },
        { stdin: "2 1\n0 1\n", expectedOutput: "true" },
        { stdin: "5 4\n0 1\n1 2\n2 3\n3 4\n", expectedOutput: "true" },
      ];
    case "islands":
      return [
        { stdin: "4 5\n11110\n11010\n11000\n00000\n", expectedOutput: "1" },
        { stdin: "4 5\n11000\n11000\n00100\n00011\n", expectedOutput: "3" },
        { stdin: "2 2\n00\n00\n", expectedOutput: "0" },
        { stdin: "3 3\n101\n010\n101\n", expectedOutput: String(islands(["101", "010", "101"])) },
      ];
    case "sortNumbers":
      return [
        { stdin: "5\n5 2 3 1 4\n", expectedOutput: "1 2 3 4 5" },
        { stdin: "4\n-1 3 0 -2\n", expectedOutput: "-2 -1 0 3" },
        { stdin: "3\n7 7 1\n", expectedOutput: "1 7 7" },
        { stdin: `5\n${line(base)}\n`, expectedOutput: line([...base].sort((a, b) => a - b)) },
      ];
    case "mergeIntervals":
      return [
        { stdin: "4\n1 3\n2 6\n8 10\n15 18\n", expectedOutput: "3" },
        { stdin: "2\n1 4\n4 5\n", expectedOutput: "1" },
        { stdin: "3\n1 2\n3 4\n5 6\n", expectedOutput: "3" },
        { stdin: "3\n1 10\n2 3\n4 8\n", expectedOutput: "1" },
      ];
    case "kthLargest":
      return [
        { stdin: "6\n3 2 1 5 6 4\n2\n", expectedOutput: "5" },
        { stdin: "5\n7 7 4 3 9\n1\n", expectedOutput: "9" },
        { stdin: "4\n1 2 3 4\n4\n", expectedOutput: "1" },
        { stdin: `5\n${line(base)}\n3\n`, expectedOutput: String([...base].sort((a, b) => b - a)[2]) },
      ];
    case "sortByFrequency":
      return [
        { stdin: "6\n1 1 2 2 2 3\n", expectedOutput: "2 2 2 1 1 3" },
        { stdin: "5\n4 4 6 6 6\n", expectedOutput: "6 6 6 4 4" },
        { stdin: "4\n3 1 2 1\n", expectedOutput: "1 1 2 3" },
        { stdin: "3\n9 8 9\n", expectedOutput: "9 9 8" },
      ];
    case "inversionCount":
      return [
        { stdin: "5\n2 4 1 3 5\n", expectedOutput: "3" },
        { stdin: "5\n5 4 3 2 1\n", expectedOutput: "10" },
        { stdin: "3\n1 2 3\n", expectedOutput: "0" },
        { stdin: `5\n${line(base)}\n`, expectedOutput: String(inversionCount(base)) },
      ];
    case "subsetsCount":
      return [
        { stdin: "3\n", expectedOutput: "8" },
        { stdin: "0\n", expectedOutput: "1" },
        { stdin: "5\n", expectedOutput: "32" },
        { stdin: `${variant + 2}\n`, expectedOutput: String(2 ** (variant + 2)) },
      ];
    case "permutationsCount":
      return [
        { stdin: "3\n", expectedOutput: "6" },
        { stdin: "4\n", expectedOutput: "24" },
        { stdin: "1\n", expectedOutput: "1" },
        { stdin: `${variant + 2}\n`, expectedOutput: String(factorial(variant + 2)) },
      ];
    case "combinationSumCount":
      return [
        { stdin: "1\n", expectedOutput: "1" },
        { stdin: "2\n", expectedOutput: "2" },
        { stdin: "3\n", expectedOutput: "5" },
        { stdin: `${Math.min(5, variant + 1)}\n`, expectedOutput: String(catalan(Math.min(5, variant + 1))) },
      ];
    case "nQueensCount":
      return [
        { stdin: "1\n", expectedOutput: "1" },
        { stdin: "4\n", expectedOutput: "2" },
        { stdin: "2\n", expectedOutput: "0" },
        { stdin: "5\n", expectedOutput: "10" },
      ];
    case "wordBreakBoolean":
      return [
        { stdin: "leetcode\n2\nleet code\n", expectedOutput: "true" },
        { stdin: "applepenapple\n2\napple pen\n", expectedOutput: "true" },
        { stdin: "catsandog\n5\ncats dog sand and cat\n", expectedOutput: "false" },
        { stdin: "zentricai\n3\nzentric ai zen\n", expectedOutput: "true" },
      ];
    case "connectRopes":
      return [
        { stdin: "4\n4 3 2 6\n", expectedOutput: "29" },
        { stdin: "3\n1 2 3\n", expectedOutput: "9" },
        { stdin: "1\n5\n", expectedOutput: "0" },
        { stdin: "5\n1 2 5 10 35\n", expectedOutput: "74" },
      ];
    case "lastStoneWeight":
      return [
        { stdin: "6\n2 7 4 1 8 1\n", expectedOutput: "1" },
        { stdin: "2\n1 1\n", expectedOutput: "0" },
        { stdin: "1\n10\n", expectedOutput: "10" },
        { stdin: "4\n9 3 2 10\n", expectedOutput: "0" },
      ];
    case "topKFrequent":
      return [
        { stdin: "6\n1 1 1 2 2 3\n2\n", expectedOutput: "1 2" },
        { stdin: "4\n1 2 2 3\n1\n", expectedOutput: "2" },
        { stdin: "5\n4 4 6 6 7\n2\n", expectedOutput: "4 6" },
        { stdin: "7\n5 5 5 2 2 1 1\n2\n", expectedOutput: "5 1" },
      ];
    case "twoSumExists":
    case "pairTargetSorted":
      return [
        { stdin: "5\n1 2 4 6 10\n8\n", expectedOutput: "true" },
        { stdin: "4\n1 3 5 9\n20\n", expectedOutput: "false" },
        { stdin: "5\n-3 -1 0 2 5\n1\n", expectedOutput: "true" },
        { stdin: `5\n${line(base)}\n${base[0]! + base[3]!}\n`, expectedOutput: "true" },
      ];
    case "countDistinct":
      return [
        { stdin: "6\n1 2 2 3 3 3\n", expectedOutput: "3" },
        { stdin: "4\n5 5 5 5\n", expectedOutput: "1" },
        { stdin: "5\n-1 0 -1 2 0\n", expectedOutput: "3" },
        { stdin: `5\n${line(base)}\n`, expectedOutput: String(new Set(base).size) },
      ];
    case "mostFrequent":
      return [
        { stdin: "6\n1 2 2 3 3 3\n", expectedOutput: "3" },
        { stdin: "4\n5 5 2 2\n", expectedOutput: "2" },
        { stdin: "5\n9 1 9 2 9\n", expectedOutput: "9" },
        { stdin: "3\n4 5 6\n", expectedOutput: "4" },
      ];
    case "firstNonRepeating":
      return [
        { stdin: "5\n2 3 2 4 3\n", expectedOutput: "4" },
        { stdin: "4\n1 1 2 2\n", expectedOutput: "-1" },
        { stdin: "3\n7 8 7\n", expectedOutput: "8" },
        { stdin: "5\n9 1 2 1 2\n", expectedOutput: "9" },
      ];
    case "subarraySumEqualsK":
      return [
        { stdin: "3\n1 1 1\n2\n", expectedOutput: "2" },
        { stdin: "3\n1 2 3\n3\n", expectedOutput: "2" },
        { stdin: "4\n1 -1 0 2\n0\n", expectedOutput: "3" },
        { stdin: "5\n3 4 7 2 -3\n7\n", expectedOutput: "2" },
      ];
    case "prefixCount":
      return [
        { stdin: "4\napple app ape bat\napp\n", expectedOutput: "2" },
        { stdin: "3\ncar cat dog\nca\n", expectedOutput: "2" },
        { stdin: "2\nhello world\nz\n", expectedOutput: "0" },
        { stdin: "5\nzen zentric zero ai aim\nze\n", expectedOutput: "3" },
      ];
    case "exactWordSearch":
      return [
        { stdin: "3\ncat car dog\ncar\n", expectedOutput: "true" },
        { stdin: "3\ncat car dog\nca\n", expectedOutput: "false" },
        { stdin: "2\nhello world\nworld\n", expectedOutput: "true" },
        { stdin: "4\nai ml ds web\ncloud\n", expectedOutput: "false" },
      ];
    case "trieStartsWith":
      return [
        { stdin: "3\ncat car dog\nca\n", expectedOutput: "true" },
        { stdin: "3\ncat car dog\ndo\n", expectedOutput: "true" },
        { stdin: "2\nhello world\nza\n", expectedOutput: "false" },
        { stdin: "4\nstudy stack string skill\nski\n", expectedOutput: "true" },
      ];
    case "longestCommonPrefix":
      return [
        { stdin: "3\nflower flow flight\n", expectedOutput: "fl" },
        { stdin: "3\ndog racecar car\n", expectedOutput: "" },
        { stdin: "2\ninterview internet\n", expectedOutput: "inter" },
        { stdin: "4\ncode coder coding codex\n", expectedOutput: "cod" },
      ];
    case "maxWindowSum":
      return [
        { stdin: "5\n2 1 5 1 3\n3\n", expectedOutput: "9" },
        { stdin: "4\n1 2 3 4\n2\n", expectedOutput: "7" },
        { stdin: "3\n-1 -2 -3\n2\n", expectedOutput: "-3" },
        { stdin: "6\n5 2 7 1 4 3\n3\n", expectedOutput: "14" },
      ];
    case "minSubarrayLen":
      return [
        { stdin: "6\n2 3 1 2 4 3\n7\n", expectedOutput: "2" },
        { stdin: "3\n1 1 1\n5\n", expectedOutput: "0" },
        { stdin: "5\n1 2 3 4 5\n11\n", expectedOutput: "3" },
        { stdin: "4\n5 1 3 5\n8\n", expectedOutput: "2" },
      ];
    case "characterReplacement":
      return [
        { stdin: "ABAB\n2\n", expectedOutput: "4" },
        { stdin: "AABABBA\n1\n", expectedOutput: "4" },
        { stdin: "AAAA\n0\n", expectedOutput: "4" },
        { stdin: "ABCDE\n1\n", expectedOutput: "2" },
      ];
    case "maxConsecutiveOnes":
      return [
        { stdin: "11\n1 1 1 0 0 0 1 1 1 1 0\n2\n", expectedOutput: "6" },
        { stdin: "5\n1 0 1 0 1\n1\n", expectedOutput: "3" },
        { stdin: "3\n0 0 0\n2\n", expectedOutput: "2" },
        { stdin: "4\n1 1 1 1\n0\n", expectedOutput: "4" },
      ];
    case "containerWater":
      return [
        { stdin: "9\n1 8 6 2 5 4 8 3 7\n", expectedOutput: "49" },
        { stdin: "2\n1 1\n", expectedOutput: "1" },
        { stdin: "5\n1 2 3 4 5\n", expectedOutput: "6" },
        { stdin: "4\n4 3 2 1\n", expectedOutput: "4" },
      ];
    case "removeDuplicatesSorted":
      return [
        { stdin: "6\n1 1 2 2 3 3\n", expectedOutput: "1 2 3" },
        { stdin: "4\n1 1 1 1\n", expectedOutput: "1" },
        { stdin: "5\n-1 0 0 2 2\n", expectedOutput: "-1 0 2" },
        { stdin: "3\n4 5 6\n", expectedOutput: "4 5 6" },
      ];
    default:
      return [
        { stdin: "3\n1 2 3\n", expectedOutput: "3" },
        { stdin: "1\n5\n", expectedOutput: "5" },
        { stdin: "0\n\n", expectedOutput: "0" },
        { stdin: "4\n1 1 1 1\n", expectedOutput: "4" },
      ];
  }
}

function ioFor(kind: ProblemKind) {
  const common = {
    inputFormat: "Read the values exactly as described in the problem statement.",
    outputFormat: "Print the required answer only.",
  };

  const formats: Partial<Record<ProblemKind, typeof common>> = {
    anagram: { inputFormat: "One line with two strings: s t.", outputFormat: "Print true or false." },
    binarySearch: { inputFormat: "Line 1: n. Line 2: n sorted integers. Line 3: target.", outputFormat: "Print the index or -1." },
    components: { inputFormat: "Line 1: n m. Next m lines: undirected edges u v.", outputFormat: "Print the component count." },
    islands: { inputFormat: "Line 1: rows cols. Next rows lines: a 0/1 grid string.", outputFormat: "Print the island count." },
    prefixRange: { inputFormat: "Line 1: n. Line 2: n integers. Line 3: q. Next q lines: l r inclusive.", outputFormat: "Print query answers separated by spaces." },
    validBrackets: { inputFormat: "One line containing only bracket characters.", outputFormat: "Print true or false." },
  };

  return formats[kind] ?? common;
}

function constraintsFor(kind: ProblemKind, topic: string) {
  const extras: Partial<Record<ProblemKind, string[]>> = {
    binarySearch: ["The input array is sorted in non-decreasing order.", "Aim for O(log n) time."],
    maxSubarray: ["The array may contain negative numbers.", "Aim for O(n) time."],
    prefixRange: ["Query indexes are zero-based and inclusive.", "Use prefix sums for efficient queries."],
    components: ["Nodes are numbered from 0 to n - 1.", "Use DFS, BFS, or DSU."],
    islands: ["Land is represented by 1 and water by 0.", "Only four-directional connections count."],
    validBrackets: ["Every closing bracket must match the latest unmatched opening bracket."],
  };

  return [
    `Topic: ${topic}.`,
    "Use standard input and standard output.",
    "Return exactly the requested output format.",
    ...(extras[kind] ?? ["Choose an efficient approach for the given pattern."]),
  ];
}

export function normalizePracticeTopic(topic: string) {
  const trimmed = topic.trim();
  const alias = topicAliases[trimmed.toLowerCase()];
  if (alias) return alias;
  return supportedTopics.find((item) => item.toLowerCase() === trimmed.toLowerCase()) ?? (trimmed || "Arrays");
}

export function practiceQuestionId(topic: string, index: number) {
  return `${slugify(normalizePracticeTopic(topic))}-${String(index).padStart(2, "0")}`;
}

export function getPracticeQuestion(topic: string, questionId: string) {
  return getPracticeQuestions(topic).find((question) => question.id === questionId) ?? null;
}

export function getPracticeQuestions(topic: string): PracticeQuestion[] {
  const normalizedTopic = normalizePracticeTopic(topic);
  const families = topicFamilies[normalizedTopic] ?? topicFamilies.Arrays!;

  return Array.from({ length: 25 }, (_, offset) => {
    const number = offset + 1;
    const family = families[offset % families.length]!;
    const variant = Math.floor(offset / families.length) + 1;
    const difficulty: PracticeDifficulty = number <= 8 ? "Easy" : number <= 18 ? "Medium" : "Hard";
    const tests = testsFor(family.kind, variant);
    const io = ioFor(family.kind);
    const title = `${family.title} ${roman[variant - 1] ?? variant}`;

    return {
      id: practiceQuestionId(normalizedTopic, number),
      title,
      topic: normalizedTopic,
      difficulty,
      description: descriptionFor(family.kind, normalizedTopic, family.concept),
      examples: [
        {
          input: tests[0]?.stdin.trimEnd() ?? "",
          output: tests[0]?.expectedOutput ?? "",
        },
      ],
      constraints: constraintsFor(family.kind, normalizedTopic),
      functionName: `${titleCaseSlug(normalizedTopic)}${titleCaseSlug(family.title)}${variant}`,
      starterCode: "",
      inputFormat: io.inputFormat,
      outputFormat: io.outputFormat,
      tests,
      hint: family.hint,
      estimatedMinutes: difficulty === "Easy" ? 18 : difficulty === "Medium" ? 28 : 40,
    };
  });
}
