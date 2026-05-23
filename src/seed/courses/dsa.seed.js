module.exports = {
  course: {
    slug: 'dsa',
    title: 'Data Structures & Algorithms',
    description: 'Core algorithms and data structures: complexity analysis, sorting, and hierarchical data.',
    coverColor: 'secondary',
  },
  chapters: [
    {
      order: 1,
      title: 'Big O Notation',
      description: 'Measuring how algorithms scale.',
      learningObjectives: [
        'Define Big O notation in plain language',
        'Identify the Big O of common operations (array access, search, sort)',
        'Compare growth rates across O(1), O(n), O(n²), O(log n)',
        'Explain why constants are dropped',
      ],
      visualizations: [{ type: 'bigO', props: {} }],
      content: `# Big O Notation

## What Is Big O?

When you write an algorithm, you want to know: *how does it perform as the input grows?* Big O notation is a mathematical shorthand for describing the **worst-case growth rate** of an algorithm's time or space requirements as the input size \`n\` increases.

Big O doesn't tell you the exact running time in seconds—that depends on hardware, compiler optimizations, and many other factors. Instead, it tells you the *shape* of growth: linear, quadratic, logarithmic, etc.

## Why Worst Case?

We care about worst case because it sets expectations. If you guarantee your algorithm is at most O(n²), users know it won't surprise them with something worse. Average-case analysis is useful but harder to compute; worst case is a safe, pessimistic bound.

## Common Complexity Classes

| Notation | Name | Example |
|---|---|---|
| O(1) | Constant | Array access by index |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Linear scan of array |
| O(n log n) | Linearithmic | Merge sort, heap sort |
| O(n²) | Quadratic | Bubble sort, nested loops |
| O(2^n) | Exponential | Recursive Fibonacci (naïve) |

Growth rate comparison for n = 1,000:
- O(1) = 1 operation
- O(log n) ≈ 10 operations
- O(n) = 1,000 operations
- O(n log n) ≈ 10,000 operations
- O(n²) = 1,000,000 operations

## Why Drop Constants?

You might wonder: why do we write O(n) instead of O(2n) or O(3n)? The reason is that constants don't change the *shape* of growth. Whether your algorithm does 2 operations per element or 100 operations per element, it still scales *linearly*. At large n, the constant factor matters less and less compared to the growth class.

Example: O(100n) is far, far faster than O(n²) for large n, even though the constant 100 seems big.

## Reading Common Operations

\`\`\`
Array access:        arr[5]           → O(1)
Array search:        find x in arr    → O(n) unsorted, O(log n) sorted+binary
Nested loops:        for i... for j.. → O(n²) if both scale with n
Divide and conquer:  halving problem  → O(log n) or O(n log n)
\`\`\`

## Practical Guidance

For interview problems and production code, aim for O(n log n) or better when n could be large. O(n²) becomes painful around n = 10,000. O(2^n) is only acceptable for very small inputs.

Big O is a thinking tool, not just exam notation. Whenever you write a loop, ask: "How many times does this run as n grows?" That habit will make you a faster, clearer problem solver.`,
    },
    {
      order: 2,
      title: 'Sorting Algorithms',
      description: 'Three sorting techniques and when to use them.',
      learningObjectives: [
        'Explain bubble sort step-by-step',
        'Explain insertion sort step-by-step',
        'Compare time complexities of bubble, insertion, and merge sort',
        'Describe stable vs unstable sorts',
      ],
      visualizations: [{ type: 'sorting', props: {} }],
      content: `# Sorting Algorithms

## Why Sorting Matters

Sorting is one of the most studied problems in computer science, not because sorting itself is the goal, but because a sorted collection enables dramatically faster algorithms. Binary search, for example, requires sorted input. Database indexes and efficient joins rely on sorted data.

Understanding sorting algorithms also trains your thinking about loop invariants, recursion, and algorithm design patterns.

## Bubble Sort

**Idea**: repeatedly pass through the array, swapping adjacent elements that are out of order. Larger elements "bubble" to the end.

\`\`\`python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
\`\`\`

After each outer iteration, the largest unsorted element is in its final position. The inner loop shrinks by one each round.

**Complexity**: O(n²) average and worst case. O(n) best case if optimized with an early-exit flag.

## Insertion Sort

**Idea**: build a sorted portion one element at a time, inserting each new element into its correct position in the sorted portion—like sorting a hand of playing cards.

\`\`\`python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
\`\`\`

**Complexity**: O(n²) average/worst, **O(n) best case** (already sorted). Excellent for small arrays or nearly-sorted data.

## Merge Sort

**Idea**: divide the array in half, recursively sort each half, then merge the two sorted halves. A classic *divide and conquer* algorithm.

\`\`\`python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)
\`\`\`

**Complexity**: O(n log n) in all cases. The log n comes from splitting the array in half log₂n times; the n comes from the merge step at each level.

## Complexity Comparison

| Algorithm | Best | Average | Worst | Space |
|---|---|---|---|---|
| Bubble sort | O(n) | O(n²) | O(n²) | O(1) |
| Insertion sort | O(n) | O(n²) | O(n²) | O(1) |
| Merge sort | O(n log n) | O(n log n) | O(n log n) | O(n) |

## Stable vs Unstable Sorts

A **stable sort** preserves the relative order of equal elements. If two items compare as equal, they appear in the output in the same order they appeared in the input.

- **Stable**: Merge sort, Insertion sort, Bubble sort
- **Unstable**: Heap sort, Quick sort (typical implementations)

Stability matters when you sort records by multiple keys—e.g., sort by last name, then by first name. If the second sort is stable, ties in first name will preserve the already-sorted last-name order.

## When to Use Which

- **Insertion sort**: < ~20 elements, or nearly sorted data
- **Merge sort**: need guaranteed O(n log n), need stability, don't mind O(n) extra space
- **Built-in sort**: in practice, always prefer your language's standard sort (usually Timsort—a hybrid of merge + insertion)`,
    },
    {
      order: 3,
      title: 'Binary Search Trees',
      description: 'Hierarchical structure for fast lookup.',
      learningObjectives: [
        'Define a BST and its ordering invariant',
        'Describe insert, search, and delete operations',
        'Explain why BSTs can become unbalanced',
        'Compare BST to sorted array for search',
      ],
      visualizations: [{ type: 'bst', props: {} }],
      content: `# Binary Search Trees

## What Is a BST?

A **Binary Search Tree (BST)** is a hierarchical data structure where each node holds a value and has at most two children: a **left child** and a **right child**. The defining rule—called the **ordering invariant**—is:

> For any node N, every value in N's *left* subtree is **less than** N's value, and every value in N's *right* subtree is **greater than** N's value.

This invariant is what makes BSTs powerful for lookup: at each node, you can immediately discard half the remaining tree.

## Search

To find a value \`x\`:

1. Start at the root.
2. If \`x == node.value\`: found it.
3. If \`x < node.value\`: go left.
4. If \`x > node.value\`: go right.
5. If you reach null: x is not in the tree.

\`\`\`python
def search(node, x):
    if node is None or node.value == x:
        return node
    if x < node.value:
        return search(node.left, x)
    return search(node.right, x)
\`\`\`

**Complexity**: O(h), where h is the tree height. For a balanced tree, h = O(log n).

## Insert

Insert follows the same path as search, but instead of returning when you hit null, you create a new node there.

\`\`\`python
def insert(node, x):
    if node is None:
        return Node(x)
    if x < node.value:
        node.left = insert(node.left, x)
    elif x > node.value:
        node.right = insert(node.right, x)
    return node
\`\`\`

## Delete

Delete is the trickiest operation because removing a node may break the tree's structure. Three cases:

1. **Leaf node** (no children): just remove it.
2. **One child**: replace node with its child.
3. **Two children**: find the node's *in-order successor* (smallest value in right subtree), copy that value up, then delete the successor.

## Why BSTs Can Become Unbalanced

If you insert values in sorted order (1, 2, 3, 4, 5...), each new node goes to the right, creating a tree that looks like a linked list. Height becomes O(n), and all the BST's advantages disappear—search degrades to O(n).

This is why **self-balancing BSTs** exist: AVL trees and Red-Black trees automatically restructure after insertions and deletions to keep height O(log n). Python's \`sortedcontainers\` and Java's \`TreeMap\` use such structures internally.

## BST vs Sorted Array for Search

| Operation | Sorted Array | BST (balanced) |
|---|---|---|
| Search | O(log n) binary search | O(log n) |
| Insert | O(n) — must shift elements | O(log n) |
| Delete | O(n) — must shift elements | O(log n) |

BSTs win decisively for dynamic collections where you insert and delete frequently. Sorted arrays are preferable for static data where you only need fast lookups and can afford an O(n log n) sort upfront.

## Summary

BSTs encode a *sorted order* in tree form, enabling O(log n) search, insert, and delete—as long as the tree stays balanced. Understanding BSTs is a stepping stone to heaps, B-trees, and the internal structures of databases and language runtimes.`,
    },
  ],
};
