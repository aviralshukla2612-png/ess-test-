/**
 * EMPEROR SMART SOLUTIONS - EMPLOYEE ASSESSMENT QUESTIONS
 * 
 * Total Questions: 15
 * Section 1: Mathematics (Questions 1 - 5)
 * Section 2: Logical Reasoning (Questions 6 - 10)
 * Section 3: Developer / Technical (Questions 11 - 15)
 * Duration: 60s per question (15 minutes total)
 */

export const SECTIONS = {
  MATHEMATICS: "Mathematics",
  LOGICAL_REASONING: "Logical Reasoning",
  DEVELOPER_TECHNICAL: "Developer / Technical"
};

export const ASSESSMENT_QUESTIONS = [
  // ==========================================
  // SECTION 1: MATHEMATICS (Questions 1 - 5)
  // ==========================================
  {
    id: 1,
    section: SECTIONS.MATHEMATICS,
    sectionIndex: 1,
    topic: "Arithmetic Operations",
    question: "What is the value of (12 × 5) + 8 ÷ 2 ?",
    options: [
      { id: "A", text: "52" },
      { id: "B", text: "56" },
      { id: "C", text: "64" },
      { id: "D", text: "48" }
    ],
    correctAnswer: "C" // (12 * 5) = 60; 8 / 2 = 4; 60 + 4 = 64
  },
  {
    id: 2,
    section: SECTIONS.MATHEMATICS,
    sectionIndex: 1,
    topic: "Percentages",
    question: "A digital product originally priced at $200 receives a 20% markup, followed by a 10% promotional discount. What is its final price?",
    options: [
      { id: "A", text: "$216" },
      { id: "B", text: "$220" },
      { id: "C", text: "$210" },
      { id: "D", text: "$224" }
    ],
    correctAnswer: "A" // $200 * 1.20 = $240; $240 * 0.90 = $216
  },
  {
    id: 3,
    section: SECTIONS.MATHEMATICS,
    sectionIndex: 1,
    topic: "Ratios & Proportions",
    question: "The ratio of Frontend to Backend engineers in a development sprint is 3 : 5. If the total engineering team has 40 members, how many Backend engineers are there?",
    options: [
      { id: "A", text: "15" },
      { id: "B", text: "25" },
      { id: "C", text: "20" },
      { id: "D", text: "30" }
    ],
    correctAnswer: "B" // 5 / (3 + 5) * 40 = 25
  },
  {
    id: 4,
    section: SECTIONS.MATHEMATICS,
    sectionIndex: 1,
    topic: "Time and Work",
    question: "Worker A completes a database indexing job in 6 hours, while Worker B completes the same job in 3 hours. Working together, how many hours will they take to complete the job?",
    options: [
      { id: "A", text: "1.5 hours" },
      { id: "B", text: "2.0 hours" },
      { id: "C", text: "2.5 hours" },
      { id: "D", text: "4.5 hours" }
    ],
    correctAnswer: "B" // 1/6 + 1/3 = 3/6 = 1/2 -> 2 hours
  },
  {
    id: 5,
    section: SECTIONS.MATHEMATICS,
    sectionIndex: 1,
    topic: "Basic Algebra",
    question: "If 3x + 15 = 45, what is the value of 2x - 5 ?",
    options: [
      { id: "A", text: "10" },
      { id: "B", text: "12" },
      { id: "C", text: "15" },
      { id: "D", text: "20" }
    ],
    correctAnswer: "C" // 3x = 30 -> x = 10; 2(10) - 5 = 15
  },

  // ==========================================
  // SECTION 2: LOGICAL REASONING (Questions 6 - 10)
  // ==========================================
  {
    id: 6,
    section: SECTIONS.LOGICAL_REASONING,
    sectionIndex: 2,
    topic: "Number Sequences",
    question: "Identify the next number in the sequence: 2, 6, 12, 20, 30, ___",
    options: [
      { id: "A", text: "38" },
      { id: "B", text: "40" },
      { id: "C", text: "42" },
      { id: "D", text: "48" }
    ],
    correctAnswer: "C" // Differences are +4, +6, +8, +10, +12 -> 30 + 12 = 42
  },
  {
    id: 7,
    section: SECTIONS.LOGICAL_REASONING,
    sectionIndex: 2,
    topic: "Coding-Decoding",
    question: "In a certain cybersecurity cipher, 'CLOUD' is encoded as 'DMPVE'. Following the exact same rule, how is 'PILOT' encoded?",
    options: [
      { id: "A", text: "QJMPU" },
      { id: "B", text: "QKMPU" },
      { id: "C", text: "QJNPV" },
      { id: "D", text: "RHNQU" }
    ],
    correctAnswer: "A" // P->Q, I->J, L->M, O->P, T->U (+1 each)
  },
  {
    id: 8,
    section: SECTIONS.LOGICAL_REASONING,
    sectionIndex: 2,
    topic: "Logical Deductions",
    question: "Statements:\n1. All software engineers use version control.\n2. Some software engineers write Python code.\n\nWhich conclusion logically follows?",
    options: [
      { id: "A", text: "All Python coders use version control." },
      { id: "B", text: "Some version control users write Python code." },
      { id: "C", text: "No Python coders use version control." },
      { id: "D", text: "All software engineers write Python code." }
    ],
    correctAnswer: "B"
  },
  {
    id: 9,
    section: SECTIONS.LOGICAL_REASONING,
    sectionIndex: 2,
    topic: "Direction & Spatial Sense",
    question: "An engineer walks 20 meters North, turns right and walks 15 meters East, then turns right again and walks 20 meters South. How far and in which direction is the engineer from the initial point?",
    options: [
      { id: "A", text: "15 meters West" },
      { id: "B", text: "20 meters East" },
      { id: "C", text: "15 meters East" },
      { id: "D", text: "35 meters North" }
    ],
    correctAnswer: "C"
  },
  {
    id: 10,
    section: SECTIONS.LOGICAL_REASONING,
    sectionIndex: 2,
    topic: "Analytical Relations",
    question: "Alex looks at a team photo and says: 'Her brother is the only son of my father.' How is the person in the photo related to Alex (assuming Alex is male)?",
    options: [
      { id: "A", text: "Sister" },
      { id: "B", text: "Mother" },
      { id: "C", text: "Daughter" },
      { id: "D", text: "Cousin" }
    ],
    correctAnswer: "A" // The only son of Alex's father is Alex himself. Thus, her brother is Alex -> she is Alex's sister.
  },

  // ==========================================
  // SECTION 3: DEVELOPER / TECHNICAL (Questions 11 - 15)
  // ==========================================
  {
    id: 11,
    section: SECTIONS.DEVELOPER_TECHNICAL,
    sectionIndex: 3,
    topic: "JavaScript / Asynchronous",
    question: "In modern JavaScript, what happens when Promise.all([p1, p2, p3]) is executed and p2 rejects with an error?",
    options: [
      { id: "A", text: "It waits for all promises to settle and returns an array of results and errors." },
      { id: "B", text: "It immediately rejects with the reason of the first rejected promise." },
      { id: "C", text: "It ignores the rejection and resolves only the successful promises." },
      { id: "D", text: "It re-executes the rejected promise up to 3 retry attempts." }
    ],
    correctAnswer: "B"
  },
  {
    id: 12,
    section: SECTIONS.DEVELOPER_TECHNICAL,
    sectionIndex: 3,
    topic: "React Architecture",
    question: "Why is direct state mutation (e.g., state.count = 5) considered an anti-pattern in React?",
    options: [
      { id: "A", text: "It triggers infinite render loops immediately." },
      { id: "B", text: "React relies on shallow reference equality; direct mutation bypasses re-rendering triggers." },
      { id: "C", text: "JavaScript engines cannot garbage collect mutated objects." },
      { id: "D", text: "Direct mutation is strictly forbidden by the browser's JavaScript V8 compiler." }
    ],
    correctAnswer: "B"
  },
  {
    id: 13,
    section: SECTIONS.DEVELOPER_TECHNICAL,
    sectionIndex: 3,
    topic: "HTTP & REST APIs",
    question: "Which HTTP request method is strictly idempotent and designed to replace an entire resource at the target URI?",
    options: [
      { id: "A", text: "POST" },
      { id: "B", text: "PATCH" },
      { id: "C", text: "PUT" },
      { id: "D", text: "CONNECT" }
    ],
    correctAnswer: "C"
  },
  {
    id: 14,
    section: SECTIONS.DEVELOPER_TECHNICAL,
    sectionIndex: 3,
    topic: "Git Version Control",
    question: "What is the primary operational difference between 'git merge' and 'git rebase' when integrating branch changes?",
    options: [
      { id: "A", text: "Merge preserves non-linear history with a merge commit; rebase creates a clean linear history by replaying commits." },
      { id: "B", text: "Merge deletes the source branch; rebase keeps both branches intact." },
      { id: "C", text: "Rebase can only be used on remote repositories, while merge is local only." },
      { id: "D", text: "Merge is synchronous while rebase performs asynchronous network polling." }
    ],
    correctAnswer: "A"
  },
  {
    id: 15,
    section: SECTIONS.DEVELOPER_TECHNICAL,
    sectionIndex: 3,
    topic: "Frontend & CSS",
    question: "What layout calculation effect does the CSS rule 'box-sizing: border-box;' have on HTML elements?",
    options: [
      { id: "A", text: "It adds 10px default margin outside the element's perimeter." },
      { id: "B", text: "It includes padding and border within the specified width and height." },
      { id: "C", text: "It locks the element into a 12-column CSS Grid container." },
      { id: "D", text: "It prevents flex child elements from shrinking below zero." }
    ],
    correctAnswer: "B"
  }
];

export const SECTION_METADATA = [
  {
    id: 1,
    name: SECTIONS.MATHEMATICS,
    shortName: "Mathematics",
    range: "1 – 5",
    startIndex: 0,
    endIndex: 4,
    count: 5,
    icon: "Calculator"
  },
  {
    id: 2,
    name: SECTIONS.LOGICAL_REASONING,
    shortName: "Reasoning",
    range: "6 – 10",
    startIndex: 5,
    endIndex: 9,
    count: 5,
    icon: "Brain"
  },
  {
    id: 3,
    name: SECTIONS.DEVELOPER_TECHNICAL,
    shortName: "Developer / Technical",
    range: "11 – 15",
    startIndex: 10,
    endIndex: 14,
    count: 5,
    icon: "Code2"
  }
];
