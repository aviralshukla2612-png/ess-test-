const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const INITIAL_QUESTIONS = [
  // SECTION 1: MATHEMATICS (5 Questions)
  {
    section: 'MATHEMATICS',
    topic: 'Arithmetic Operations',
    question: 'What is the value of (12 × 5) + 8 ÷ 2 ?',
    optionsJson: JSON.stringify([
      { id: 'A', text: '52' },
      { id: 'B', text: '56' },
      { id: 'C', text: '64' },
      { id: 'D', text: '48' }
    ]),
    correctAnswer: 'C',
    difficulty: 'EASY',
    timeLimit: 60,
    isActive: true
  },
  {
    section: 'MATHEMATICS',
    topic: 'Percentages',
    question: 'A digital product originally priced at $200 receives a 20% markup, followed by a 10% promotional discount. What is its final price?',
    optionsJson: JSON.stringify([
      { id: 'A', text: '$216' },
      { id: 'B', text: '$220' },
      { id: 'C', text: '$210' },
      { id: 'D', text: '$224' }
    ]),
    correctAnswer: 'A',
    difficulty: 'MEDIUM',
    timeLimit: 60,
    isActive: true
  },
  {
    section: 'MATHEMATICS',
    topic: 'Ratios & Proportions',
    question: 'The ratio of Frontend to Backend engineers in a development sprint is 3 : 5. If the total engineering team has 40 members, how many Backend engineers are there?',
    optionsJson: JSON.stringify([
      { id: 'A', text: '15' },
      { id: 'B', text: '25' },
      { id: 'C', text: '20' },
      { id: 'D', text: '30' }
    ]),
    correctAnswer: 'B',
    difficulty: 'EASY',
    timeLimit: 60,
    isActive: true
  },
  {
    section: 'MATHEMATICS',
    topic: 'Time and Work',
    question: 'Worker A completes a database indexing job in 6 hours, while Worker B completes the same job in 3 hours. Working together, how many hours will they take to complete the job?',
    optionsJson: JSON.stringify([
      { id: 'A', text: '1.5 hours' },
      { id: 'B', text: '2.0 hours' },
      { id: 'C', text: '2.5 hours' },
      { id: 'D', text: '4.5 hours' }
    ]),
    correctAnswer: 'B',
    difficulty: 'MEDIUM',
    timeLimit: 60,
    isActive: true
  },
  {
    section: 'MATHEMATICS',
    topic: 'Basic Algebra',
    question: 'If 3x + 15 = 45, what is the value of 2x - 5 ?',
    optionsJson: JSON.stringify([
      { id: 'A', text: '10' },
      { id: 'B', text: '12' },
      { id: 'C', text: '15' },
      { id: 'D', text: '20' }
    ]),
    correctAnswer: 'C',
    difficulty: 'EASY',
    timeLimit: 60,
    isActive: true
  },

  // SECTION 2: LOGICAL REASONING (5 Questions)
  {
    section: 'LOGICAL_REASONING',
    topic: 'Number Sequences',
    question: 'Identify the next number in the sequence: 2, 6, 12, 20, 30, ___',
    optionsJson: JSON.stringify([
      { id: 'A', text: '38' },
      { id: 'B', text: '40' },
      { id: 'C', text: '42' },
      { id: 'D', text: '48' }
    ]),
    correctAnswer: 'C',
    difficulty: 'MEDIUM',
    timeLimit: 60,
    isActive: true
  },
  {
    section: 'LOGICAL_REASONING',
    topic: 'Coding-Decoding',
    question: 'In a certain cybersecurity cipher, "CLOUD" is encoded as "DMPVE". Following the exact same rule, how is "PILOT" encoded?',
    optionsJson: JSON.stringify([
      { id: 'A', text: 'QJMPU' },
      { id: 'B', text: 'QKMPU' },
      { id: 'C', text: 'QJNPV' },
      { id: 'D', text: 'RHNQU' }
    ]),
    correctAnswer: 'A',
    difficulty: 'EASY',
    timeLimit: 60,
    isActive: true
  },
  {
    section: 'LOGICAL_REASONING',
    topic: 'Logical Deductions',
    question: 'Statements:\n1. All software engineers use version control.\n2. Some software engineers write Python code.\n\nWhich conclusion logically follows?',
    optionsJson: JSON.stringify([
      { id: 'A', text: 'All Python coders use version control.' },
      { id: 'B', text: 'Some version control users write Python code.' },
      { id: 'C', text: 'No Python coders use version control.' },
      { id: 'D', text: 'All software engineers write Python code.' }
    ]),
    correctAnswer: 'B',
    difficulty: 'MEDIUM',
    timeLimit: 60,
    isActive: true
  },
  {
    section: 'LOGICAL_REASONING',
    topic: 'Direction & Spatial Sense',
    question: 'An engineer walks 20 meters North, turns right and walks 15 meters East, then turns right again and walks 20 meters South. How far and in which direction is the engineer from the initial point?',
    optionsJson: JSON.stringify([
      { id: 'A', text: '15 meters West' },
      { id: 'B', text: '20 meters East' },
      { id: 'C', text: '15 meters East' },
      { id: 'D', text: '35 meters North' }
    ]),
    correctAnswer: 'C',
    difficulty: 'EASY',
    timeLimit: 60,
    isActive: true
  },
  {
    section: 'LOGICAL_REASONING',
    topic: 'Analytical Relations',
    question: 'Alex looks at a team photo and says: "Her brother is the only son of my father." How is the person in the photo related to Alex (assuming Alex is male)?',
    optionsJson: JSON.stringify([
      { id: 'A', text: 'Sister' },
      { id: 'B', text: 'Mother' },
      { id: 'C', text: 'Daughter' },
      { id: 'D', text: 'Cousin' }
    ]),
    correctAnswer: 'A',
    difficulty: 'MEDIUM',
    timeLimit: 60,
    isActive: true
  },

  // SECTION 3: DEVELOPER / TECHNICAL (5 Questions)
  {
    section: 'DEVELOPER_TECHNICAL',
    topic: 'JavaScript / Asynchronous',
    question: 'In modern JavaScript, what happens when Promise.all([p1, p2, p3]) is executed and p2 rejects with an error?',
    optionsJson: JSON.stringify([
      { id: 'A', text: 'It waits for all promises to settle and returns an array of results and errors.' },
      { id: 'B', text: 'It immediately rejects with the reason of the first rejected promise.' },
      { id: 'C', text: 'It ignores the rejection and resolves only the successful promises.' },
      { id: 'D', text: 'It re-executes the rejected promise up to 3 retry attempts.' }
    ]),
    correctAnswer: 'B',
    difficulty: 'MEDIUM',
    timeLimit: 60,
    isActive: true
  },
  {
    section: 'DEVELOPER_TECHNICAL',
    topic: 'React Architecture',
    question: 'Why is direct state mutation (e.g., state.count = 5) considered an anti-pattern in React?',
    optionsJson: JSON.stringify([
      { id: 'A', text: 'It triggers infinite render loops immediately.' },
      { id: 'B', text: 'React relies on shallow reference equality; direct mutation bypasses re-rendering triggers.' },
      { id: 'C', text: 'JavaScript engines cannot garbage collect mutated objects.' },
      { id: 'D', text: 'Direct mutation is strictly forbidden by the browser\'s JavaScript V8 compiler.' }
    ]),
    correctAnswer: 'B',
    difficulty: 'EASY',
    timeLimit: 60,
    isActive: true
  },
  {
    section: 'DEVELOPER_TECHNICAL',
    topic: 'HTTP & REST APIs',
    question: 'Which HTTP request method is strictly idempotent and designed to replace an entire resource at the target URI?',
    optionsJson: JSON.stringify([
      { id: 'A', text: 'POST' },
      { id: 'B', text: 'PATCH' },
      { id: 'C', text: 'PUT' },
      { id: 'D', text: 'CONNECT' }
    ]),
    correctAnswer: 'C',
    difficulty: 'EASY',
    timeLimit: 60,
    isActive: true
  },
  {
    section: 'DEVELOPER_TECHNICAL',
    topic: 'Git Version Control',
    question: 'What is the primary operational difference between "git merge" and "git rebase" when integrating branch changes?',
    optionsJson: JSON.stringify([
      { id: 'A', text: 'Merge preserves non-linear history with a merge commit; rebase creates a clean linear history by replaying commits.' },
      { id: 'B', text: 'Merge deletes the source branch; rebase keeps both branches intact.' },
      { id: 'C', text: 'Rebase can only be used on remote repositories, while merge is local only.' },
      { id: 'D', text: 'Merge is synchronous while rebase performs asynchronous network polling.' }
    ]),
    correctAnswer: 'A',
    difficulty: 'MEDIUM',
    timeLimit: 60,
    isActive: true
  },
  {
    section: 'DEVELOPER_TECHNICAL',
    topic: 'Frontend & CSS',
    question: 'What layout calculation effect does the CSS rule "box-sizing: border-box;" have on HTML elements?',
    optionsJson: JSON.stringify([
      { id: 'A', text: 'It adds 10px default margin outside the element\'s perimeter.' },
      { id: 'B', text: 'It includes padding and border within the specified width and height.' },
      { id: 'C', text: 'It locks the element into a 12-column CSS Grid container.' },
      { id: 'D', text: 'It prevents flex child elements from shrinking below zero.' }
    ]),
    correctAnswer: 'B',
    difficulty: 'EASY',
    timeLimit: 60,
    isActive: true
  }
];

async function main() {
  console.log('--- Seeding Emperor Assessment Database ---');

  // 1. Seed Admin User
  const adminEmail = 'admin@emperorsmartsolutions.com';
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash: hashedPassword },
    create: {
      email: adminEmail,
      fullName: 'System Administrator',
      passwordHash: hashedPassword,
      role: 'SUPER_ADMIN',
      isActive: true
    }
  });
  console.log(`✓ Admin seeded: ${admin.email} (Password: Admin@123)`);

  // 2. Seed Initial 15 Questions
  const createdQuestions = [];
  for (const q of INITIAL_QUESTIONS) {
    const created = await prisma.question.create({
      data: q
    });
    createdQuestions.push(created);
  }
  console.log(`✓ Seeded ${createdQuestions.length} standard assessment questions.`);

  // 3. Create Assessment Configuration (5 Math, 5 Reasoning, 5 Tech)
  const mathIds = createdQuestions.filter((q) => q.section === 'MATHEMATICS').map((q) => q.id);
  const reasoningIds = createdQuestions.filter((q) => q.section === 'LOGICAL_REASONING').map((q) => q.id);
  const devIds = createdQuestions.filter((q) => q.section === 'DEVELOPER_TECHNICAL').map((q) => q.id);

  const config = await prisma.assessmentConfiguration.upsert({
    where: { version: 1 },
    update: {
      mathQuestionIds: JSON.stringify(mathIds),
      reasoningQuestionIds: JSON.stringify(reasoningIds),
      developerQuestionIds: JSON.stringify(devIds),
      totalQuestions: 15,
      isActive: true
    },
    create: {
      version: 1,
      name: 'Emperor Pre-Employment Evaluation (Standard)',
      mathQuestionIds: JSON.stringify(mathIds),
      reasoningQuestionIds: JSON.stringify(reasoningIds),
      developerQuestionIds: JSON.stringify(devIds),
      totalQuestions: 15,
      isActive: true
    }
  });

  console.log(`✓ Active Assessment Configuration created (Version ${config.version}: 15 Questions [5 Math + 5 Reasoning + 5 Dev])`);

  // 4. Create Initial Audit Log
  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      action: 'SYSTEM_INITIALIZATION',
      entityType: 'System',
      metadata: JSON.stringify({ seededAt: new Date().toISOString(), questionsCount: createdQuestions.length })
    }
  });

  console.log('✓ Initial Audit Log recorded.');
  console.log('--- Database Seeding Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
