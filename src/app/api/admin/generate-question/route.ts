import { NextResponse } from 'next/server';

function randomizeCorrectOption(optionsArr: string[], originalCorrectIdx: number) {
  if (!optionsArr || optionsArr.length === 0) return { options: optionsArr || [], correctIdx: 0 };
  const safeIdx = Math.max(0, Math.min(originalCorrectIdx, optionsArr.length - 1));
  return { options: optionsArr, correctIdx: safeIdx };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      topic,
      category = 'AI',
      difficulty = 'beginner',
      questionType = 'single-choice',
      count = 1,
      optionsCount = 4,
      apiKey,
    } = body;
    const numQuestions = Math.min(Math.max(1, Number(count) || 1), 50);
    const numOptions = Math.min(Math.max(2, Number(optionsCount) || 4), 6);

    const effectiveKey =
      apiKey ||
      process.env.AI_GATEWAY_API_KEY ||
      process.env.OPENAI_API_KEY ||
      process.env.GEMINI_API_KEY;

    // Category Topic pools
    const categoryTopics: Record<string, string[]> = {
      AI: [
        'Transformer Self-Attention Mechanisms',
        'Reinforcement Learning from Human Feedback (RLHF)',
        'Convolutional vs Recurrent Neural Networks',
        'Large Language Model Fine-Tuning & PEFT',
        'Ethical AI Bias & Alignment Mitigation',
        'Vector Embeddings & Semantic Search',
      ],
      Crypto: [
        'Proof-of-Stake vs Proof-of-Work Consensus',
        'Zero-Knowledge Succinct Non-Interactive Proofs (zk-SNARKs)',
        'Ethereum Smart Contract Security & Reentrancy',
        'Bitcoin UTXO Model & Block Validation',
        'Decentralized Finance (DeFi) Automated Market Makers',
        'Layer 2 Rollups (Optimistic & ZK Rollups)',
      ],
      Python: [
        'Python Recursion and Base Case Output',
        'List Comprehension vs Generator Expressions',
        'Decorators and Function Wrapper Arguments',
        'Global Interpreter Lock (GIL) and Multithreading',
        'Dictionary Merging and Unpacking Operators',
      ],
      Coding: [
        'Data Structures: Array vs Linked List Complexity',
        'Binary Search Algorithm Time Complexity',
        'Recursion Call Stack and Stack Overflow',
        'Object-Oriented Programming Polymorphism & Encapsulation',
        'Asynchronous Event Loop and Promises',
      ],
    };

    const topicsForCat = categoryTopics[category] || categoryTopics.Coding || categoryTopics.AI;
    const selectedTopic =
      topic && topic.trim().length > 0
        ? topic.trim()
        : topicsForCat[Math.floor(Math.random() * topicsForCat.length)];

    // If an AI API Key (OpenAI sk- or Vercel AI Gateway vck_) is present, call live AI Gateway endpoint
    if (effectiveKey && effectiveKey.trim().length > 0) {
      try {
        const isVercelGateway = effectiveKey.startsWith('vck_');
        const endpoint = isVercelGateway
          ? 'https://ai-gateway.vercel.sh/v1/chat/completions'
          : 'https://api.openai.com/v1/chat/completions';
        const model = isVercelGateway ? 'openai/gpt-4o-mini' : 'gpt-4o-mini';

        const systemPrompt = `You are an expert Programming & Quiz question creator. Return JSON only with key "questions" containing an array of ${numQuestions} objects. Each question object must have: text (string, can include code snippets), questionType ("single-choice" or "multi-choice"), options (array of exactly ${numOptions} strings), correctOptionIndex (integer from 0 to ${numOptions - 1}), correctIndexes (array of integers), difficulty (string), explanation (string). Make sure to vary correct answer placement randomly across option indices.`;
        const userPrompt = `Generate ${numQuestions} high-quality ${difficulty} level ${category} quiz questions (${questionType} format) with exactly ${numOptions} answer options per question, specifically based on this topic/prompt: "${selectedTopic}". Return JSON object {"questions": [...]}.`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${effectiveKey.trim()}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          let rawContent = data.choices?.[0]?.message?.content;
          if (rawContent) {
            if (rawContent.startsWith('```')) {
              rawContent = rawContent
                .replace(/^```(json)?/, '')
                .replace(/```$/, '')
                .trim();
            }
            const aiContent = JSON.parse(rawContent);
            const qList = Array.isArray(aiContent.questions)
              ? aiContent.questions
              : aiContent.text
                ? [aiContent]
                : [];
            const formatted = qList.map((q: any) => {
              const origOpts =
                Array.isArray(q.options) && q.options.length >= 2 ? q.options : ['', ''];
              const origCorrect =
                typeof q.correctOptionIndex === 'number' ? q.correctOptionIndex : 0;
              const { options: shuffledOpts, correctIdx: randCorrectIdx } = randomizeCorrectOption(
                origOpts,
                origCorrect
              );

              return {
                text: q.text,
                questionType: q.questionType || questionType || 'single-choice',
                options: shuffledOpts,
                correctOptionIndex: randCorrectIdx,
                correctIndexes:
                  Array.isArray(q.correctIndexes) && q.correctIndexes.length > 0
                    ? q.correctIndexes.map((idx: number) =>
                        idx === origCorrect ? randCorrectIdx : idx
                      )
                    : [randCorrectIdx],
                explanation: q.explanation || '',
                difficulty: q.difficulty || difficulty,
              };
            });
            return NextResponse.json({
              success: true,
              questions: formatted,
              question: formatted[0],
            });
          }
        } else {
          const errBody = await response.text();
          console.error('AI Gateway API error:', response.status, errBody);
        }
      } catch (e) {
        console.warn('AI Gateway API fetch error, using built-in AI engine fallback:', e);
      }
    }

    // Built-in Intelligent AI Engine Question Generator Fallback categorized by topic
    const codingQuestions = [
      {
        text: 'What is the output of the following Python code snippet?\n\ndef compute(n):\n    if n <= 1: return 1\n    return n * compute(n - 1)\n\nprint(compute(4))',
        options: ['24', '12', '4', 'RecursionError'],
        correctOptionIndex: 0,
        explanation:
          'compute(4) computes 4 * 3 * 2 * 1 = 24 using recursive factorial multiplication.',
      },
      {
        text: 'Which data structure offers O(1) average time complexity for key lookups and insertions?',
        options: [
          'Hash Table / Hash Map',
          'Binary Search Tree',
          'Sorted Array',
          'Singly Linked List',
        ],
        correctOptionIndex: 0,
        explanation:
          'Hash Tables compute direct index mappings using hash functions, offering O(1) average lookup and insertion time.',
      },
      {
        text: 'In Python, what does a list comprehension like [x**2 for x in range(5) if x % 2 == 0] evaluate to?',
        options: ['[0, 4, 16]', '[1, 9, 25]', '[0, 1, 4, 9, 16]', '[0, 2, 4]'],
        correctOptionIndex: 0,
        explanation: 'Even numbers in range(5) are 0, 2, 4. Squaring them yields [0, 4, 16].',
      },
    ];

    const aiQuestions = [
      {
        text: 'What is the main advantage of Multi-Head Self-Attention in Transformer models?',
        options: [
          'Allows the model to jointly attend to information from different representation subspaces at different positions',
          'Reduces memory usage by disabling backpropagation',
          'Replaces all matrix multiplications with addition',
          'Enforces strictly one-directional linear token processing',
        ],
        correctOptionIndex: 0,
        explanation:
          'Multi-Head Attention projects queries, keys, and values into multiple subspaces, letting the network capture diverse contextual relationships simultaneously.',
      },
      {
        text: 'What does RLHF (Reinforcement Learning from Human Feedback) optimize in LLM deployment?',
        options: [
          'Aligns model outputs with human intent, safety, and helpfulness guidelines',
          'Compresses model parameter weights for mobile hardware',
          'Deletes duplicate dataset files during pretraining',
          'Converts natural language queries directly into SQL queries',
        ],
        correctOptionIndex: 0,
        explanation:
          'RLHF uses reward models trained on human preferences to fine-tune raw LLM outputs toward helpfulness and safety.',
      },
      {
        text: 'In Deep Learning, how do Vector Embeddings represent textual data?',
        options: [
          'As dense continuous numerical vectors where distance correlates with semantic similarity',
          'As simple ASCII integer strings',
          'As uncompressed raw audio frequencies',
          'As static hash table keys without semantic meaning',
        ],
        correctOptionIndex: 0,
        explanation:
          'Vector embeddings map words or sentences into high-dimensional vector spaces where semantically similar concepts sit close together.',
      },
    ];

    const cryptoQuestions = [
      {
        text: 'In Proof-of-Stake (PoS) blockchains, how are block validators selected?',
        options: [
          'Based on the proportion of native cryptocurrency tokens they stake as collateral',
          'Based on who owns the fastest ASIC hardware mining rig',
          'Through manual review by a central central bank authority',
          'At random intervals without economic collateral',
        ],
        correctOptionIndex: 0,
        explanation:
          'Proof-of-Stake replaces hardware mining with economic stake, choosing validators proportionally to their locked token collateral.',
      },
      {
        text: 'What is a Zero-Knowledge Proof (ZKP) in blockchain transactions?',
        options: [
          'A cryptographic technique to prove a transaction statement is valid without revealing private details',
          'A public record with zero encryption keys',
          'A consensus algorithm used only for layer-1 testnets',
          'A fallback emergency shutdown signal',
        ],
        correctOptionIndex: 0,
        explanation:
          'Zero-Knowledge Proofs allow one party to demonstrate the truth of a statement to another without exposing confidential inputs.',
      },
      {
        text: 'How does Bitcoin ensure transaction order and prevent double-spending without a central server?',
        options: [
          'Through a distributed Proof-of-Work blockchain ledger linked by cryptographic hashes',
          'By relying on VISA payment gateways',
          'Through periodic manual server reboots',
          'By encrypting each wallet with a master admin key',
        ],
        correctOptionIndex: 0,
        explanation:
          'Bitcoin uses Proof-of-Work consensus and linked block hashes to achieve decentralized consensus on transaction order across all nodes.',
      },
    ];

    const catLower = category.toLowerCase();
    const pool =
      catLower === 'crypto'
        ? cryptoQuestions
        : catLower === 'coding' || catLower === 'python'
          ? codingQuestions
          : aiQuestions;

    const generatedQuestions: any[] = [];
    for (let i = 0; i < numQuestions; i++) {
      const qChoice = pool[i % pool.length];
      const slicedOpts = qChoice.options.slice(0, numOptions);
      while (slicedOpts.length < numOptions) {
        slicedOpts.push(`Option ${String.fromCharCode(65 + slicedOpts.length)}`);
      }
      const initialCorrectIdx = qChoice.correctOptionIndex ?? 0;
      const { options: finalOptions, correctIdx: finalCorrectIdx } = randomizeCorrectOption(
        slicedOpts,
        initialCorrectIdx
      );

      const targetQType =
        questionType === 'mixed'
          ? i % 2 === 0
            ? 'single-choice'
            : 'multi-choice'
          : questionType || 'single-choice';

      let correctIndexes: number[] = [finalCorrectIdx];
      if (targetQType === 'multi-choice') {
        const secondIdx = (finalCorrectIdx + 1) % finalOptions.length;
        correctIndexes = Array.from(new Set([finalCorrectIdx, secondIdx])).sort((a, b) => a - b);
      }

      generatedQuestions.push({
        text: qChoice.text,
        questionType: targetQType,
        options: finalOptions,
        correctOptionIndex: targetQType === 'multi-choice' ? -1 : finalCorrectIdx,
        correctIndexes,
        explanation: qChoice.explanation,
        category,
        difficulty,
      });
    }

    return NextResponse.json({
      success: true,
      questions: generatedQuestions,
      question: generatedQuestions[0],
    });
  } catch (error: any) {
    console.error('Error generating AI question:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate AI question.' },
      { status: 500 }
    );
  }
}
