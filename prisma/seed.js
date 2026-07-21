const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Upsert the AI Awareness quiz
  const quiz = await prisma.quiz.upsert({
    where: { slug: 'ai-awareness' },
    update: {},
    create: {
      slug: 'ai-awareness',
      category: 'ai',
      isActive: true,
    },
  })

  // Sample static questions
  const questions = [
    {
      text: 'What does "AI" stand for?',
      options: JSON.stringify(['Automated Intelligence', 'Artificial Intelligence', 'Algorithmic Integration', 'Advanced Iteration']),
      correctOptionIndex: 1,
      explanation: 'AI stands for Artificial Intelligence, which is the simulation of human intelligence processes by machines.',
    },
    {
      text: 'Which of the following is considered a subset of AI?',
      options: JSON.stringify(['Cloud Computing', 'Machine Learning', 'Blockchain', 'Quantum Computing']),
      correctOptionIndex: 1,
      explanation: 'Machine Learning is a subset of AI that focuses on building systems that learn from data.',
    },
    {
      text: 'What is a "Large Language Model" (LLM)?',
      options: JSON.stringify(['A model that translates languages perfectly', 'A huge database of words', 'An AI model trained on vast amounts of text to understand and generate human language', 'A programming language for AI']),
      correctOptionIndex: 2,
      explanation: 'LLMs like GPT-4 are trained on massive text datasets to predict and generate natural language.',
    },
    {
      text: 'Which test was proposed by Alan Turing to evaluate a machine\'s capability to exhibit intelligent behavior?',
      options: JSON.stringify(['The Turing Test', 'The AI Benchmark', 'The Intelligence Quotient (IQ) Test', 'The Machine Learning Exam']),
      correctOptionIndex: 0,
      explanation: 'The Turing Test is a classic measure of a machine\'s ability to converse indistinguishably from a human.',
    },
    {
      text: 'What does "NLP" stand for in the context of AI?',
      options: JSON.stringify(['Neural Language Programming', 'Natural Language Processing', 'New Learning Protocol', 'Non-Linear Processing']),
      correctOptionIndex: 1,
      explanation: 'Natural Language Processing helps computers understand, interpret, and manipulate human language.',
    },
    {
      text: 'What is an "algorithm" in computer science?',
      options: JSON.stringify(['A type of computer hardware', 'A programming language', 'A set of instructions designed to perform a specific task', 'A specific brand of AI']),
      correctOptionIndex: 2,
      explanation: 'Algorithms are step-by-step procedures or formulas for solving problems, forming the basis of all software, including AI.',
    },
    {
      text: 'What does "Generative AI" primarily do?',
      options: JSON.stringify(['Sorts large databases', 'Generates new content, such as text, images, or audio', 'Repairs broken computer code automatically', 'Translates text into binary code']),
      correctOptionIndex: 1,
      explanation: 'Generative AI refers to algorithms (like ChatGPT or Midjourney) that can create new content based on learned patterns.',
    },
    {
      text: 'What is a common ethical concern regarding AI?',
      options: JSON.stringify(['It uses too much internet bandwidth', 'AI systems might exhibit bias learned from their training data', 'AI will forget how to speak human languages', 'AI cannot be turned off']),
      correctOptionIndex: 1,
      explanation: 'AI models can inherit and amplify human biases present in the data they were trained on, leading to unfair outcomes.',
    },
    {
      text: 'What is "Computer Vision"?',
      options: JSON.stringify(['A monitor with very high resolution', 'A field of AI that enables computers to derive meaning from digital images and videos', 'A virtual reality headset', 'A type of graphics card']),
      correctOptionIndex: 1,
      explanation: 'Computer vision allows AI to "see" and interpret visual data, used in facial recognition, self-driving cars, etc.',
    },
    {
      text: 'Which of the following is NOT typically considered an application of AI today?',
      options: JSON.stringify(['Self-driving cars', 'Spam email filters', 'Basic mechanical clocks', 'Voice assistants like Siri or Alexa']),
      correctOptionIndex: 2,
      explanation: 'Basic mechanical clocks operate purely on mechanical physics without any learning, data processing, or AI.',
    }
  ]

  // After creating quiz, add English translation for quiz
  await prisma.quizTranslation.create({
    data: {
      locale: 'en',
      title: 'AI Awareness Quiz',
      description: 'Test your knowledge about AI concepts.',
      quizId: quiz.id,
    },
  })

  // Insert translations for each static question (English)
  for (const q of questions) {
    const created = await prisma.question.create({
      data: {
        quizId: quiz.id,
        source: 'static',
        status: 'approved',
        difficulty: 'beginner',
        text: q.text,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
        explanation: q.explanation,
      },
    })
    await prisma.questionTranslation.create({
      data: {
        locale: 'en',
        text: q.text,
        options: q.options,
        explanation: q.explanation,
        questionId: created.id,
      },
    })
  }

  // Upsert the Cryptocurrency quiz
  const cryptoQuiz = await prisma.quiz.upsert({
    where: { slug: 'crypto-blockchain' },
    update: {},
    create: {
      slug: 'crypto-blockchain',
      category: 'crypto',
      isActive: true,
    },
  })

  // Add English translation for crypto quiz
  await prisma.quizTranslation.create({
    data: {
      locale: 'en',
      title: 'Cryptocurrency & Blockchain Quiz',
      description: 'Test your knowledge about cryptocurrency and blockchain technology.',
      quizId: cryptoQuiz.id,
    },
  })

  const cryptoQuestions = [
    {
      text: 'What is Bitcoin?',
      options: JSON.stringify(['A type of cryptocurrency', 'A programming language', 'A social media platform', 'A cloud service provider']),
      correctOptionIndex: 0,
      explanation: 'Bitcoin is the first decentralized cryptocurrency.',
    },
    {
      text: 'What does "DAO" stand for?',
      options: JSON.stringify(['Digital Asset Organization', 'Decentralized Autonomous Organization', 'Data Access Object', 'Distributed Application Operator']),
      correctOptionIndex: 1,
      explanation: 'DAO refers to Decentralized Autonomous Organization, a governance model on blockchain.',
    },
  ]

  for (const q of cryptoQuestions) {
    const created = await prisma.question.create({
      data: {
        quizId: cryptoQuiz.id,
        source: 'static',
        status: 'approved',
        difficulty: 'beginner',
        text: q.text,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
        explanation: q.explanation,
      },
    })
    await prisma.questionTranslation.create({
      data: {
        locale: 'en',
        text: q.text,
        options: q.options,
        explanation: q.explanation,
        questionId: created.id,
      },
    })
  }

  // Create default admin user if not exists
  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@example.com'
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'password123'
  const bcrypt = require('bcryptjs')
  const hashed = await bcrypt.hash(adminPassword, 10)
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, password: hashed },
  })

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
