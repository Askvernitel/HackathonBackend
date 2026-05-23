module.exports = {
  course: {
    slug: 'intro-cs',
    title: 'Introduction to Computer Science',
    description: 'Foundations of computing: how computers store data, represent numbers, and execute logic.',
    coverColor: 'primary',
  },
  chapters: [
    {
      order: 1,
      title: 'Variables & Memory',
      description: 'How computers store data and what variables really are.',
      learningObjectives: [
        'Explain what a variable is and why we use them',
        'Describe how memory holds variable values',
        'Distinguish between value reassignment and copying',
        'Identify different primitive data types',
      ],
      visualizations: [{ type: 'memoryBox', props: {} }],
      content: `# Variables & Memory

## What Is a Variable?

Imagine your computer's memory as a giant set of labeled boxes sitting on a shelf. Each box can hold one piece of information. A **variable** is simply a name you give to one of those boxes so you can find and use its contents later.

When you write \`age = 25\` in Python, you're telling the computer: "Find a free box, write the number 25 inside it, and stick a label on it that says 'age'." From that point forward, whenever you refer to \`age\`, the computer fetches the box with that label and reads what's inside.

## How Memory Actually Works

Computer memory (RAM) is a long sequence of tiny storage locations, each with a unique address—think of street addresses for tiny houses. When you create a variable, the operating system finds a free address, stores your value there, and your variable name becomes an alias for that address.

You don't need to know the address directly; the language runtime handles that. But understanding that every variable refers to a location in physical memory explains many behaviors, especially around copying and reassignment.

## Assignment vs Reassignment

**Assignment** is the first time you put a value in a box:
\`\`\`python
score = 100
\`\`\`

**Reassignment** is overwriting that box with new content:
\`\`\`python
score = 200  # old value (100) is gone from this variable
\`\`\`

The old value doesn't vanish from the universe—the operating system just marks that slot as available again. Your variable now points to the new value.

## Copying Values

When you write \`backup = score\`, you're copying the *value* into a new box called \`backup\`. The two boxes are now independent. Changing \`score\` later does not change \`backup\`, and vice versa—at least for *primitive* types like numbers and text.

\`\`\`python
score = 200
backup = score   # backup = 200
score = 300      # backup is still 200
\`\`\`

## Primitive Data Types

Different kinds of data need differently shaped boxes:

- **Integer (int)**: Whole numbers — \`42\`, \`-7\`, \`0\`
- **Float**: Decimal numbers — \`3.14\`, \`-0.001\`
- **Boolean (bool)**: True or False — just one bit of meaning
- **String (str)**: Text — a sequence of characters like \`"hello"\`

Each type tells the computer how many bytes to reserve and how to interpret the bits stored in those bytes. The number \`65\` as an integer means sixty-five; as a character (ASCII), it means the letter 'A'.

## Why This Matters

Understanding variables and memory helps you predict what a program will do, avoid bugs caused by unexpected mutations, and write code that is easier to reason about. Every advanced concept in programming—functions, objects, data structures—builds on this foundation.`,
    },
    {
      order: 2,
      title: 'Binary & Number Systems',
      description: 'Why computers use 0s and 1s, and how to read them.',
      learningObjectives: [
        'Convert between decimal and binary',
        'Explain why computers use binary',
        'Read an 8-bit number',
        'Describe how text becomes binary (ASCII basics)',
      ],
      visualizations: [{ type: 'binaryRep', props: {} }],
      content: `# Binary & Number Systems

## Why Binary?

At their core, computers are built from billions of tiny electronic switches called **transistors**. Each transistor is either *on* (conducting electricity) or *off* (not conducting). Because a switch can only be in one of two states, it naturally represents **1** (on) and **0** (off).

Designing circuits around two states is dramatically simpler, cheaper, and more reliable than circuits with ten states (one per digit). This is why computers think in binary—base 2—rather than decimal—base 10.

## Base-10 vs Base-2

In **decimal** (base 10), each column represents a power of 10:

\`\`\`
  hundreds  tens  ones
     1        3     7   = 100 + 30 + 7 = 137
\`\`\`

In **binary** (base 2), each column represents a power of 2:

\`\`\`
  128  64  32  16  8  4  2  1
   1    0   0   0  1  0  0  1  = 128 + 8 + 1 = 137
\`\`\`

## Converting Decimal to Binary

**Method: repeated division by 2**

Divide the number by 2, record the remainder, repeat with the quotient until you reach 0. Read remainders from bottom to top.

Example — convert 13:
\`\`\`
13 ÷ 2 = 6 remainder 1
 6 ÷ 2 = 3 remainder 0
 3 ÷ 2 = 1 remainder 1
 1 ÷ 2 = 0 remainder 1
\`\`\`
Read remainders upward: **1101** → 13 in binary.

## Reading an 8-Bit Number

A **bit** is a single 0 or 1. Eight bits form a **byte**. An 8-bit number can represent values from **0** (00000000) to **255** (11111111).

Position values for an 8-bit number:
| Bit position | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
|---|---|---|---|---|---|---|---|---|
| Value        |128|64 |32 |16 | 8 | 4 | 2 | 1 |

To read 10110100:
128×1 + 64×0 + 32×1 + 16×1 + 8×0 + 4×1 + 2×0 + 1×0 = **180**

## Text as Binary: ASCII

Computers don't natively store letters—they store numbers. **ASCII** (American Standard Code for Information Interchange) is a mapping from numbers to characters.

| Character | ASCII Decimal | Binary |
|---|---|---|
| A | 65 | 01000001 |
| B | 66 | 01000010 |
| a | 97 | 01100001 |
| Space | 32 | 00100000 |

The string \`"Hi"\` is stored as the two bytes: 72 (H) and 105 (i). Modern systems use Unicode (UTF-8) to handle all the world's languages, but ASCII remains the foundation.

## Why This Matters

Every photo, song, video, and document on your computer is ultimately a sequence of 0s and 1s. Understanding binary demystifies how computers store and process any kind of information, and forms the basis for understanding data types, memory sizes, and file formats.`,
    },
    {
      order: 3,
      title: 'Control Flow',
      description: 'How programs make decisions and repeat actions.',
      learningObjectives: [
        'Explain conditional execution (if/else)',
        'Describe loop semantics (for, while)',
        'Trace execution through nested control flow',
        'Identify infinite loops and how to avoid them',
      ],
      visualizations: [{ type: 'controlFlow', props: {} }],
      content: `# Control Flow

## What Is Control Flow?

By default, a program runs each line from top to bottom, one after another. **Control flow** statements let you change this: skip lines, repeat them, or choose between alternatives based on conditions. Without control flow, programs could only execute fixed scripts with no flexibility.

## Conditionals: if / else

A conditional asks a yes/no question and executes different code depending on the answer.

\`\`\`python
temperature = 30

if temperature > 25:
    print("It's hot outside")
else:
    print("It's comfortable")
\`\`\`

The \`if\` block runs when the condition is **True**. The \`else\` block runs when it's **False**. You can chain multiple conditions with \`elif\`:

\`\`\`python
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"
\`\`\`

Python evaluates each condition in order and runs only the *first* matching block.

## Loops: for and while

**Loops** execute a block of code repeatedly.

A \`for\` loop iterates over a sequence—a list, a range, a string:

\`\`\`python
for i in range(5):    # i = 0, 1, 2, 3, 4
    print(i)
\`\`\`

A \`while\` loop runs as long as a condition stays true:

\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1
\`\`\`

Use \`for\` when you know how many iterations you need; use \`while\` when you're waiting for a condition to change.

## Nested Control Flow

You can nest any combination of conditions and loops inside each other. Execution traces through the outer block first, then enters the inner block when reached.

\`\`\`python
for row in range(3):
    for col in range(3):
        if row == col:
            print("*", end=" ")
        else:
            print(".", end=" ")
    print()  # newline after each row
\`\`\`

To trace nested code: mentally step through the outer loop once, then mentally step through the entire inner loop, then return to the outer loop's next iteration.

## Infinite Loops

An infinite loop runs forever because its exit condition is never reached. This is almost always a bug.

\`\`\`python
# BUG: count never changes, loop never exits
count = 0
while count < 5:
    print("looping")
    # forgot: count += 1
\`\`\`

**How to avoid them:**
1. Make sure every \`while\` loop modifies a variable that the condition checks.
2. Use a safety counter (max iterations) for uncertain loops.
3. Most languages let you press Ctrl+C to break an infinite loop during development.

## Why This Matters

Control flow is the mechanism that makes programs intelligent. Without it, a program could only compute a single predetermined result. With conditionals and loops, a single program can handle an unlimited variety of inputs and situations.`,
    },
  ],
};
