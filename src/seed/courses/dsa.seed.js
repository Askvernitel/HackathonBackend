module.exports = {
  course: {
    slug: 'dsa',
    title: 'Data Structures & Algorithms II',
    description: 'Dynamic programming, greedy algorithms, sorting, graph traversal, shortest paths, heaps, and BSTs.',
    coverColor: 'secondary',
  },
  chapters: [
    {
      order: 1,
      title: 'Algorithm Analysis & Review',
      description: 'How we measure algorithmic efficiency.',
      learningObjectives: [
        'Explain Big O notation in plain terms',
        'Identify the Big O of common operations (access, search, sort, binary search)',
        'Compare growth rates: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)',
        'Explain why constants and lower-order terms are dropped',
        'Analyse a simple recursive function with a recurrence relation',
      ],
      visualizations: [{ type: 'bigO', props: {} }],
      content: `# Algorithm Analysis & Review

## Why Analyse Algorithms?

An algorithm is a sequence of instructions that solves a problem. Two algorithms can solve the same problem correctly, yet one might be a thousand times faster on large inputs. Algorithm analysis gives you a language for comparing them before running a single line of code.

## Big O Notation

Big O describes the **worst-case growth rate** of an algorithm's resource usage as the input size \`n\` increases. The key word is *growth*: we don't care about the exact number of steps, only how that count scales.

\`O(f(n))\` means: for large enough \`n\`, the algorithm's step count grows no faster than some constant multiple of \`f(n)\`.

## Growth Rates Compared

| Notation | Name | Steps for n = 1,000 |
|---|---|---|
| O(1) | Constant | 1 |
| O(log n) | Logarithmic | ~10 |
| O(n) | Linear | 1,000 |
| O(n log n) | Linearithmic | ~10,000 |
| O(n²) | Quadratic | 1,000,000 |
| O(2ⁿ) | Exponential | astronomical |

The gap between O(n log n) and O(n²) becomes enormous quickly. An O(n²) algorithm on n = 10,000 inputs does 100 million operations; an O(n log n) algorithm does roughly 130,000.

## Why Drop Constants?

If an algorithm does \`3n + 100\` operations, we write O(n) — not O(3n + 100). Constants don't change the *shape* of growth. Whether you do 1 operation per element or 100, the algorithm still scales linearly. At large n, O(100n) is still vastly better than O(n²), so the constant stops mattering relative to the growth class.

Formally: O(c·f(n)) = O(f(n)) for any constant c > 0.

Consider this table:

\`\`\`
  n       3n + 100    n²
  10         130      100
  100        400    10 000
 1000      3 100  1 000 000   ← n² dominates; the 3 and 100 are noise
\`\`\`

## Common Operations

\`\`\`
Array access by index:          O(1)      — direct memory address
Linear scan of unsorted array:  O(n)      — must check every element
Binary search on sorted array:  O(log n)  — halve the search space each step
Nested loops over same array:   O(n²)     — n choices × n choices
\`\`\`

Binary search for n = 1,000 needs ~10 steps. A linear scan needs up to 1,000 steps. That difference is why sorting first and then binary searching is often worthwhile.

## Recurrence Relations

Recursive algorithms are analysed with recurrence relations. For Merge Sort:

\`\`\`
T(n) = 2·T(n/2) + O(n)
\`\`\`

This says: split into 2 halves (cost: 2·T(n/2)), then merge (cost: O(n)). Solving gives T(n) = O(n log n). The Master Theorem provides shortcuts for recurrences of the form T(n) = a·T(n/b) + O(n^c).

## Practical Takeaways

- O(n log n) is the target for sorting and searching.
- O(n²) is acceptable only for small inputs (n < a few thousand).
- O(2ⁿ) is only usable for very small n (brute-force search).
- When you see a nested loop, start with O(n²) and verify it isn't worse.`,
    },
    {
      order: 2,
      title: 'Dynamic Programming Fundamentals',
      description: 'Breaking big problems into smaller ones and caching the results.',
      learningObjectives: [
        'Identify optimal substructure and overlapping subproblems',
        'Define a DP state and write a recurrence relation',
        'Distinguish memoization (top-down) from tabulation (bottom-up)',
        'Build and fill a 1D DP table (Fibonacci, Coin Change)',
        'Read a solution off a completed table',
      ],
      visualizations: [{ type: 'dpTable', props: {} }],
      content: `# Dynamic Programming Fundamentals

## The Core Insight

Dynamic Programming (DP) solves problems by breaking them into **overlapping subproblems** and storing results so they are never recomputed. It applies when a problem has two properties:

1. **Optimal substructure**: the optimal solution to the whole problem is built from optimal solutions to its subproblems.
2. **Overlapping subproblems**: the same subproblems recur many times.

Without property 2, divide-and-conquer (like Merge Sort) is sufficient. DP is for when you would recompute the same things repeatedly without caching.

## The Classic Example: Fibonacci

Naïve recursion for \`fib(5)\` computes \`fib(3)\` twice and \`fib(2)\` three times. The call tree has exponential size O(2ⁿ). With memoization, each value is computed exactly once — O(n) instead.

\`\`\`
            fib(5)
          /        \\
       fib(4)      fib(3)  ← same as left subtree!
      /      \\
   fib(3)   fib(2)         ← computed again without cache
\`\`\`

With memoization, \`fib(3)\` is computed once. On every subsequent call, the cached result is returned instantly.

## Two Styles

**Memoization (top-down):** Write the recursive solution, add a cache. Call fib(n) → check cache → compute if missing → store → return.

**Tabulation (bottom-up):** Fill an array from the smallest subproblem up. No recursion, no call stack overhead.

\`\`\`python
# Tabulation for Fibonacci
dp[0] = 0
dp[1] = 1
for i in range(2, n+1):
    dp[i] = dp[i-1] + dp[i-2]
\`\`\`

Both styles yield the same time complexity. Tabulation is usually preferred for its simplicity and lack of stack overflow risk.

## Defining State

The hardest part of DP is choosing your **state** — what information you need to describe a subproblem. For 1D problems, state is usually the current index \`i\`. For 2D problems (grid paths), state is \`(row, col)\`.

Rule of thumb: the state should be the minimum information needed to compute the answer for a subproblem without knowing how you got there.

## The Coin Change Problem

Given coins = [1, 3, 4] and a target = 6, find the minimum number of coins.

**State**: \`dp[i]\` = minimum coins to make amount \`i\`.
**Base case**: \`dp[0] = 0\` (zero coins for amount zero).
**Recurrence**: for each coin \`c\`, if \`i >= c\`: \`dp[i] = min(dp[i], dp[i - c] + 1)\`.

\`\`\`
index:  0   1   2   3   4   5   6
dp:     0   1   2   1   1   2   2
                    ↑
    dp[3] = min(dp[2]+1, dp[0]+1) = min(3, 1) = 1   (use coin 3)
    dp[6] = min(dp[5]+1, dp[3]+1, dp[2]+1) = min(3, 2, 3) = 2   (3+3)
\`\`\`

## Reading the Answer

After filling the table, \`dp[target]\` is your answer. For path reconstruction (which specific coins), trace back through the table following which transitions produced each minimum value.

## Summary

DP = recursion + caching. The two styles (memoization, tabulation) solve the same problems with the same complexity. Master state definition and recurrence construction, and most DP problems become manageable.`,
    },
    {
      order: 3,
      title: 'Advanced DP & Greedy Algorithms',
      description: 'When greedy works and when it doesn\'t.',
      learningObjectives: [
        'Derive the Longest Increasing Subsequence (LIS) recurrence relation',
        'State the greedy choice property',
        'Apply greedy selection to the Activity Selection problem',
        'Decide whether a given problem requires DP or permits a greedy solution',
      ],
      visualizations: [{ type: 'activitySelection', props: {} }],
      content: `# Advanced DP & Greedy Algorithms

## Longest Increasing Subsequence (LIS)

Given an array, find the length of the longest subsequence of elements that are strictly increasing. The elements do not need to be adjacent.

For \`[3, 1, 4, 1, 5, 9, 2, 6]\`, one LIS is \`[1, 4, 5, 9]\`, length 4.

**State**: \`dp[i]\` = length of the LIS ending at index \`i\`.
**Recurrence**: \`dp[i] = 1 + max(dp[j])\` for all \`j < i\` where \`arr[j] < arr[i]\`.
**Base case**: every element alone is an LIS of length 1.

\`\`\`
Array: [3, 1, 4, 1, 5, 9, 2, 6]
dp:    [1, 1, 2, 1, 3, 4, 2, 4]
                         ↑
       dp[4]=3: arr[4]=5 > arr[2]=4, so dp[4] = dp[2]+1 = 3
\`\`\`

Complexity: O(n²) with this approach. An O(n log n) binary-search variant exists.

## When to Use Greedy

A greedy algorithm makes the locally optimal choice at each step, never reconsidering past decisions. Greedy works when the problem has the **greedy choice property**: a locally optimal choice is always part of some globally optimal solution. This property must be *proved*, not assumed.

## The Activity Selection Problem

Given activities with start times and finish times, select the maximum number of non-overlapping activities.

**Greedy strategy**: always pick the activity that **finishes earliest** — it leaves the most room for future activities.

\`\`\`
Activities: A(1,4)  B(3,7)  C(5,8)  D(7,10)

Sort by end time: A, B, C, D
Pick A (ends at 4).
B starts at 3 < 4 → overlaps A, skip.
C starts at 5 ≥ 4 → pick C (ends at 8).
D starts at 7 < 8 → overlaps C, skip.

Selected: A, C  (maximum possible for this set)
\`\`\`

The greedy proof: if any optimal solution doesn't include the earliest-finishing activity, we can always swap it in without reducing the total count.

## Greedy Fails Without the Property

Coin change with coins [1, 3, 4], target 6:

\`\`\`
Greedy (pick largest first):  4 → 1 → 1 = 3 coins  ✗
Optimal:                       3 → 3     = 2 coins  ✓
\`\`\`

Picking 4 leaves a remainder of 2, which requires two more coins. Greedy fails here because local optimality does not imply global optimality. DP is required.

## Greedy vs DP Decision Guide

| Use greedy when | Use DP when |
|---|---|
| You can prove the greedy choice property | Early choices affect later options |
| A natural "best first" ordering exists | You need to consider all subproblems |
| Activity Selection, Huffman, Dijkstra | Coin Change, LIS, Knapsack |

When unsure: try to construct a counter-example for greedy. If you find one, use DP.`,
    },
    {
      order: 4,
      title: 'Sorting & Divide-and-Conquer',
      description: 'How Quicksort works and why randomisation saves it.',
      learningObjectives: [
        'Explain the divide-and-conquer paradigm',
        'Trace the partition step of Quicksort on a given array',
        'Derive average-case O(n log n) and worst-case O(n²) complexities',
        'Explain why Randomised Quicksort avoids the worst case in practice',
        'Compare Quicksort, Merge Sort, and Insertion Sort by time and space',
      ],
      visualizations: [{ type: 'sorting', props: {} }],
      content: `# Sorting & Divide-and-Conquer

## The Divide-and-Conquer Paradigm

Divide-and-conquer algorithms work in three phases:
1. **Divide**: split the problem into smaller subproblems.
2. **Conquer**: solve each subproblem recursively.
3. **Combine**: merge the results.

Merge Sort splits the array in half and merges. Quicksort partitions around a chosen pivot element.

## The Partition Step

Partition is the heart of Quicksort. Choose a pivot, then rearrange the array so:
- All elements **less than** the pivot appear before it.
- All elements **greater than** the pivot appear after it.
- The pivot is in its **final sorted position**.

\`\`\`
Before: [3, 6, 8, 10, 1, 2, 1]   pivot = last element (1)

Lomuto partition:
- i starts before index 0.
- j scans from 0 to n-2.
- When arr[j] <= pivot: i++, swap arr[i] with arr[j].
- Finally: swap arr[i+1] with pivot.

After: [1, | 3, 6, 8, 10, 2, 1]   pivot lands at index 0.
\`\`\`

Partition runs in O(n) — a single pass through the array.

## Complexity Analysis

After partition, Quicksort recurses on the left and right subarrays.

**Average case**: if the pivot splits the array roughly in half, we get log n levels of recursion, each doing O(n) work → **O(n log n)**.

**Worst case**: if the pivot is always the minimum or maximum (e.g., sorted input with last-element pivot), one subarray is empty and the other has n−1 elements. Recursion depth becomes n → **O(n²)**.

\`\`\`
Sorted input [1,2,3,4,5], pivot = last:   Random pivot, balanced:

[1,2,3,4,5]                               [1,2,3,4,5]
 └─ [] + [2,3,4,5]                          └─ [1,2] + [4,5]
           └─ [] + [3,4,5]
depth = n → O(n²)                         depth = log n → O(n log n)
\`\`\`

## Randomised Quicksort

Choose the pivot **uniformly at random** instead of always using the last element. The probability of consistently bad splits is astronomically low. Expected running time: **O(n log n) for any input**, not just random inputs.

This eliminates the adversarial worst case — a crucial interview point.

## Comparison Table

| Algorithm | Best | Average | Worst | Space | Stable? |
|---|---|---|---|---|---|
| Insertion sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Merge sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quicksort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |

Quicksort's average-case constant factors are small — it's faster in practice than Merge Sort for most inputs despite the same O(n log n) average. Most standard library sorts use a Quicksort variant (introsort).`,
    },
    {
      order: 5,
      title: 'Graph Theory & Traversal',
      description: 'BFS and DFS — finding your way through connected data.',
      learningObjectives: [
        'Define graph, vertex, edge, degree, path, and adjacency',
        'Convert between adjacency matrix and adjacency list representations',
        'Trace BFS and determine visit order and shortest path in an unweighted graph',
        'Trace DFS and identify discovery/finish times and cycle detection',
        'Choose BFS vs DFS for a described problem',
      ],
      visualizations: [{ type: 'graphBFSDFS', props: {} }],
      content: `# Graph Theory & Traversal

## Definitions

A **graph** G = (V, E) consists of:
- **Vertices** (nodes) V: the entities.
- **Edges** E: connections between pairs of vertices.

Key terms:
- **Degree** of a vertex: number of edges incident to it.
- **Path**: sequence of vertices where each adjacent pair is connected by an edge.
- **Adjacency**: two vertices are adjacent if an edge connects them directly.
- **Connected graph**: every pair of vertices has a path between them.

## Representations

**Adjacency Matrix**: a V×V matrix. \`M[u][v] = 1\` if edge (u,v) exists. O(1) edge lookup, O(V²) space — best for dense graphs.

**Adjacency List**: each vertex stores a list of its neighbours. O(V+E) space — best for sparse graphs (most real-world graphs).

\`\`\`
Graph: A—B, A—C, B—D

Matrix:        List:
     A  B  C  D    A → [B, C]
  A[ 0  1  1  0 ]  B → [A, D]
  B[ 1  0  0  1 ]  C → [A]
  C[ 1  0  0  0 ]  D → [B]
  D[ 0  1  0  0 ]
\`\`\`

## Breadth-First Search (BFS)

BFS explores a graph layer by layer using a **queue**.

\`\`\`
Start at A.
Queue: [A]       visited: {A}
Dequeue A → enqueue B, C.
Queue: [B, C]    visited: {A, B, C}
Dequeue B → enqueue D.
Queue: [C, D]    visited: {A, B, C, D}
Dequeue C → no new neighbours.
Dequeue D → done.
Visit order: A, B, C, D
\`\`\`

BFS finds the **shortest path in unweighted graphs** — the first time a vertex is reached is via the shortest route. Complexity: O(V + E).

## Depth-First Search (DFS)

DFS explores as deep as possible before backtracking, using a **stack** (or recursion).

\`\`\`
Start at A.
Visit A. Explore B. Explore D. Backtrack to B. Backtrack to A. Explore C.
Visit order: A, B, D, C

Discovery/finish times:
A(1/8) → B(2/5) → D(3/4), then C(6/7)
\`\`\`

DFS detects **cycles**: if DFS encounters a back-edge (an edge to an already-visited ancestor), a cycle exists. Complexity: O(V + E).

## BFS vs DFS

| Use BFS when | Use DFS when |
|---|---|
| Shortest path in unweighted graph | Detecting cycles |
| Level-by-level exploration | Topological sort |
| Connected component detection | Maze solving / exhaustive path search |

Rule of thumb: **shortest path → BFS. Structure / connectivity → DFS.**`,
    },
    {
      order: 6,
      title: 'Shortest Paths',
      description: 'Finding the cheapest route — Dijkstra\'s algorithm.',
      learningObjectives: [
        'Explain edge relaxation',
        'Trace Dijkstra\'s algorithm on a small weighted graph',
        'Build the shortest-path tree from the output',
        'Explain why Dijkstra fails on negative-weight edges',
        'Compare O(V²) vs O((V+E) log V) implementations',
      ],
      visualizations: [{ type: 'dijkstra', props: {} }],
      content: `# Shortest Paths

## The Problem

Given a **weighted directed graph**, find the minimum-cost path from a source vertex \`s\` to every other vertex. This is the **Single Source Shortest Path (SSSP)** problem.

## Edge Relaxation

The core operation in shortest-path algorithms is **relaxation**. For an edge (u, v) with weight w:

\`\`\`
if dist[u] + w < dist[v]:
    dist[v] = dist[u] + w   // improve the known distance to v
    prev[v] = u              // record the predecessor
\`\`\`

"Can we improve the known distance to v by going through u?" Repeating relaxation over all edges until no improvement is possible yields shortest paths.

## Dijkstra's Algorithm

Dijkstra greedily visits the **unvisited vertex with the smallest known distance**, then relaxes all its outgoing edges.

\`\`\`
Graph: A→B (4), A→C (2), C→D (1), D→B (1)

Init:   dist = {A:0, B:∞, C:∞, D:∞}
Visit A: dist[B] = 4, dist[C] = 2
Visit C (smallest unvisited, dist=2): dist[D] = 2+1 = 3
Visit D (dist=3): dist[B] = min(4, 3+1) = 4  (no improvement)
Visit B (dist=4): done.

Shortest paths from A: A→B=4, A→C=2, A→C→D=3, A→B=4
\`\`\`

Complexity: **O(V²)** with a simple array; **O((V+E) log V)** with a min-heap priority queue.

## Building the Shortest-Path Tree

Track \`prev[v]\` (the predecessor of v on the shortest path). After the algorithm completes, trace back from any destination: \`D → prev[D] → prev[prev[D]] → … → s\`.

## Why Dijkstra Fails on Negative Weights

Dijkstra assumes: once a vertex is visited, its distance is final. With negative-weight edges, a later path through a "heavy" edge might improve an already-finalised distance — breaking the invariant.

\`\`\`
A →2→ B →(−5)→ C
A ————4————→ C

Dijkstra: visits A, then C (dist=4), then B — but never re-examines C.
Reality:  A→B→C costs 2 + (−5) = −3 < 4.  Dijkstra gives the wrong answer.
\`\`\`

Use **Bellman-Ford** for graphs with negative edges (O(VE)).

## Complexity Comparison

| Implementation | Time | Best for |
|---|---|---|
| Simple array | O(V²) | Dense graphs (E ≈ V²) |
| Binary min-heap | O((V+E) log V) | Sparse graphs |
| Fibonacci heap | O(E + V log V) | Theoretical optimum |

For most practical problems, the binary min-heap version is the one to know and implement.`,
    },
    {
      order: 7,
      title: 'Heaps & Binary Search Trees',
      description: 'Efficient ordered structures for priority and search.',
      learningObjectives: [
        'Describe the heap property and its array representation',
        'Trace heapify, insert, and extract-max/min operations',
        'Explain why build-heap runs in O(n)',
        'Define the BST property and trace search, insert, and delete',
        'Explain how an unbalanced BST degrades to O(n) and its connection to Quicksort worst case',
      ],
      visualizations: [{ type: 'heap', props: {} }, { type: 'bst', props: {} }],
      content: `# Heaps & Binary Search Trees

## Heaps

A **heap** is a complete binary tree satisfying the **heap property**:
- **Max-heap**: every node's value ≥ its children's values. Root = maximum element.
- **Min-heap**: every node's value ≤ its children's values. Root = minimum element.

Heaps are stored as arrays — no pointers needed:
\`\`\`
Parent of index i:   floor((i−1) / 2)
Left child of i:     2i + 1
Right child of i:    2i + 2

Tree:           Array:
      9          [9, 4, 7, 2, 3, 5, 1]
    /   \\          0  1  2  3  4  5  6
   4     7
  / \\   / \\
 2   3 5   1
\`\`\`

## Heap Operations

**Heapify (sift-down)**: fix a violation by swapping a node downward until the property holds. O(log n).

**Insert**: add the element at the end of the array, then sift it **up** (swap with parent while larger than parent). O(log n).

**Extract-max**: swap root with the last element, remove the last, sift-down the new root. O(log n).

\`\`\`
Extract 9 from [9, 4, 7, 2, 3, 5, 1]:
Step 1 — put last element at root: [1, 4, 7, 2, 3, 5]
Step 2 — sift-down 1:
  1 < 7 (right child) → swap: [7, 4, 1, 2, 3, 5]
  1 < 5 (right child) → swap: [7, 4, 5, 2, 3, 1]
Result: [7, 4, 5, 2, 3, 1]
\`\`\`

**Build-heap**: call heapify on all non-leaf nodes bottom-up. This is **O(n)** — most nodes are near the leaves and sift down only a short distance. The O(n) proof requires summing a geometric series; the intuition is that few nodes sift far.

Heaps are the data structure behind priority queues and Heap Sort (O(n log n), in-place).

## Binary Search Trees

A **BST** stores values such that for every node N:
- All values in N's **left** subtree < N's value.
- All values in N's **right** subtree > N's value.

**Search**: start at root; go left if target < node, right if target > node. O(h) where h = height.

**Insert**: follow the search path until null; create the new node there. O(h).

**Delete** — three cases:
1. Leaf node: remove directly.
2. One child: replace the node with its child.
3. Two children: replace with the **in-order successor** (leftmost node of the right subtree), then delete the successor.

\`\`\`
Delete 5 (two children):
      5                 6
     / \\      →        / \\
    3   7             3   7
       /
      6  ← in-order successor of 5; copy 6 up, delete original 6
\`\`\`

## Imbalance and Worst Case

Inserting already-sorted values (1, 2, 3, 4, …) creates a right-skewed tree — effectively a linked list. Height = O(n), so all operations degrade to O(n).

This mirrors **Quicksort's worst case**: if the pivot is always the minimum, partitions are maximally unbalanced and recursion depth hits O(n). Both problems share the same root cause — a structure that should be balanced becoming linear.

Self-balancing BSTs (AVL, Red-Black) maintain O(log n) height automatically.

| Operation | Balanced BST | Sorted Array |
|---|---|---|
| Search | O(log n) | O(log n) binary search |
| Insert | O(log n) | O(n) — must shift elements |
| Delete | O(log n) | O(n) — must shift elements |

BSTs dominate for dynamic collections with frequent insertions and deletions.`,
    },
  ],
};
