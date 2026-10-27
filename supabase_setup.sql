-- ==========================================================
-- SUPABASE DATABASE SETUP SCRIPT FOR QUIZ APPLICATION
-- ==========================================================
-- How to run:
-- 1. Log in to your Supabase Dashboard (https://supabase.com).
-- 2. Open your project.
-- 3. In the left sidebar, click "SQL Editor".
-- 4. Click "New query", paste this entire script, and click "Run".
-- ==========================================================

-- 1. Create Schema
CREATE SCHEMA IF NOT EXISTS "public";

-- 2. Create Enums
DO $$ BEGIN
    CREATE TYPE "QuestionSource" AS ENUM ('static', 'ai_generated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "QuestionStatus" AS ENUM ('pending_review', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "Locale" AS ENUM ('en', 'ru', 'hi', 'pl', 'lt', 'es', 'fr', 'it', 'ro', 'he', 'zh', 'ar', 'ur');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Create Tables
CREATE TABLE IF NOT EXISTS "Quiz" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'beginner',
    "quizType" TEXT NOT NULL DEFAULT 'Build-Up/Leveled',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Question" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "source" "QuestionSource" NOT NULL DEFAULT 'static',
    "status" "QuestionStatus" NOT NULL DEFAULT 'approved',
    "difficulty" TEXT NOT NULL DEFAULT 'beginner',
    "questionType" TEXT NOT NULL DEFAULT 'single-choice',
    "order" INTEGER NOT NULL DEFAULT 0,
    "text" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "correctOptionIndex" INTEGER NOT NULL,
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Attempt" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "score" INTEGER,
    "totalQuestions" INTEGER,
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "email" TEXT,

    CONSTRAINT "Attempt_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Payment" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ActivityLog" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "QuizTranslation" (
    "id" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "quizId" TEXT NOT NULL,

    CONSTRAINT "QuizTranslation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "QuestionTranslation" (
    "id" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "text" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "explanation" TEXT,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "QuestionTranslation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "interests" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "dailyTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "phone" TEXT,
    "username" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "language" TEXT NOT NULL DEFAULT 'English',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Achievement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '🏆',
    "conditionType" TEXT NOT NULL DEFAULT 'quiz_count',
    "thresholdValue" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "XpConfig" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "baseXpPerCorrect" INTEGER NOT NULL DEFAULT 10,
    "speedBonusMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.5,
    "accuracyBonus100" INTEGER NOT NULL DEFAULT 50,
    "streakMultiplierPerDay" DOUBLE PRECISION NOT NULL DEFAULT 1.1,
    "streakCapDays" INTEGER NOT NULL DEFAULT 30,
    "dailyChallengeBonusXp" INTEGER NOT NULL DEFAULT 100,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "XpConfig_pkey" PRIMARY KEY ("id")
);

-- 4. Create Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "Quiz_slug_key" ON "Quiz"("slug");
CREATE INDEX IF NOT EXISTS "Attempt_sessionId_idx" ON "Attempt"("sessionId");
CREATE INDEX IF NOT EXISTS "Attempt_paymentStatus_idx" ON "Attempt"("paymentStatus");
CREATE UNIQUE INDEX IF NOT EXISTS "Payment_attemptId_key" ON "Payment"("attemptId");
CREATE UNIQUE INDEX IF NOT EXISTS "Payment_stripeSessionId_key" ON "Payment"("stripeSessionId");
CREATE UNIQUE INDEX IF NOT EXISTS "AdminUser_email_key" ON "AdminUser"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- 5. Foreign Key Constraints (Safe checks)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Question_quizId_fkey') THEN
        ALTER TABLE "Question" ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Attempt_quizId_fkey') THEN
        ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Attempt_userId_fkey') THEN
        ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Payment_attemptId_fkey') THEN
        ALTER TABLE "Payment" ADD CONSTRAINT "Payment_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "Attempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ActivityLog_adminId_fkey') THEN
        ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'QuizTranslation_quizId_fkey') THEN
        ALTER TABLE "QuizTranslation" ADD CONSTRAINT "QuizTranslation_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'QuestionTranslation_questionId_fkey') THEN
        ALTER TABLE "QuestionTranslation" ADD CONSTRAINT "QuestionTranslation_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

-- ==========================================================
-- 6. INITIAL SEED DATA
-- ==========================================================

-- Insert Default XP Configuration
INSERT INTO "XpConfig" ("id", "baseXpPerCorrect", "speedBonusMultiplier", "accuracyBonus100", "streakMultiplierPerDay", "streakCapDays", "dailyChallengeBonusXp", "updatedAt")
VALUES ('global', 10, 1.5, 50, 1.1, 30, 100, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Insert Default Admin User (Email: admin@example.com, Password: password123)
-- bcrypt hash for 'password123': $2b$10$xHlUH1x6K8rGWM9xHRW2o.H/Rt2avaFLwjFovIP7SZ99BjkBxNoRS
INSERT INTO "AdminUser" ("id", "email", "password", "createdAt")
VALUES ('admin-default-id', 'admin@example.com', '$2b$10$xHlUH1x6K8rGWM9xHRW2o.H/Rt2avaFLwjFovIP7SZ99BjkBxNoRS', CURRENT_TIMESTAMP)
ON CONFLICT ("email") DO NOTHING;

-- Insert Sample AI Quiz
INSERT INTO "Quiz" ("id", "slug", "category", "difficulty", "quizType", "isActive", "createdAt", "updatedAt")
VALUES ('quiz-ai-001', 'ai-awareness', 'ai', 'beginner', 'Build-Up/Leveled', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "QuizTranslation" ("id", "locale", "title", "description", "quizId")
VALUES ('quiz-trans-ai-001', 'en', 'AI Awareness Quiz', 'Test your knowledge about AI concepts.', 'quiz-ai-001')
ON CONFLICT DO NOTHING;

-- Insert AI Questions & Translations
INSERT INTO "Question" ("id", "quizId", "source", "status", "difficulty", "questionType", "order", "text", "options", "correctOptionIndex", "explanation", "createdAt", "updatedAt")
VALUES 
('q-ai-01', 'quiz-ai-001', 'static', 'approved', 'beginner', 'single-choice', 0, 'What does "AI" stand for?', '["Automated Intelligence","Artificial Intelligence","Algorithmic Integration","Advanced Iteration"]', 1, 'AI stands for Artificial Intelligence, which is the simulation of human intelligence processes by machines.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('q-ai-02', 'quiz-ai-001', 'static', 'approved', 'beginner', 'single-choice', 1, 'Which of the following is considered a subset of AI?', '["Cloud Computing","Machine Learning","Blockchain","Quantum Computing"]', 1, 'Machine Learning is a subset of AI that focuses on building systems that learn from data.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('q-ai-03', 'quiz-ai-001', 'static', 'approved', 'beginner', 'single-choice', 2, 'What is a "Large Language Model" (LLM)?', '["A model that translates languages perfectly","A huge database of words","An AI model trained on vast amounts of text to understand and generate human language","A programming language for AI"]', 2, 'LLMs like GPT-4 are trained on massive text datasets to predict and generate natural language.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "QuestionTranslation" ("id", "locale", "text", "options", "explanation", "questionId")
VALUES
('qt-ai-01', 'en', 'What does "AI" stand for?', '["Automated Intelligence","Artificial Intelligence","Algorithmic Integration","Advanced Iteration"]', 'AI stands for Artificial Intelligence, which is the simulation of human intelligence processes by machines.', 'q-ai-01'),
('qt-ai-02', 'en', 'Which of the following is considered a subset of AI?', '["Cloud Computing","Machine Learning","Blockchain","Quantum Computing"]', 'Machine Learning is a subset of AI that focuses on building systems that learn from data.', 'q-ai-02'),
('qt-ai-03', 'en', 'What is a "Large Language Model" (LLM)?', '["A model that translates languages perfectly","A huge database of words","An AI model trained on vast amounts of text to understand and generate human language","A programming language for AI"]', 'LLMs like GPT-4 are trained on massive text datasets to predict and generate natural language.', 'q-ai-03')
ON CONFLICT DO NOTHING;

-- Insert Crypto Quiz
INSERT INTO "Quiz" ("id", "slug", "category", "difficulty", "quizType", "isActive", "createdAt", "updatedAt")
VALUES ('quiz-crypto-001', 'crypto-blockchain', 'crypto', 'beginner', 'Build-Up/Leveled', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "QuizTranslation" ("id", "locale", "title", "description", "quizId")
VALUES ('quiz-trans-crypto-001', 'en', 'Cryptocurrency & Blockchain Quiz', 'Test your knowledge about cryptocurrency and blockchain technology.', 'quiz-crypto-001')
ON CONFLICT DO NOTHING;

INSERT INTO "Question" ("id", "quizId", "source", "status", "difficulty", "questionType", "order", "text", "options", "correctOptionIndex", "explanation", "createdAt", "updatedAt")
VALUES 
('q-cr-01', 'quiz-crypto-001', 'static', 'approved', 'beginner', 'single-choice', 0, 'What is Bitcoin?', '["A type of cryptocurrency","A programming language","A social media platform","A cloud service provider"]', 0, 'Bitcoin is the first decentralized cryptocurrency.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('q-cr-02', 'quiz-crypto-001', 'static', 'approved', 'beginner', 'single-choice', 1, 'What does "DAO" stand for?', '["Digital Asset Organization","Decentralized Autonomous Organization","Data Access Object","Distributed Application Operator"]', 1, 'DAO refers to Decentralized Autonomous Organization, a governance model on blockchain.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "QuestionTranslation" ("id", "locale", "text", "options", "explanation", "questionId")
VALUES
('qt-cr-01', 'en', 'What is Bitcoin?', '["A type of cryptocurrency","A programming language","A social media platform","A cloud service provider"]', 'Bitcoin is the first decentralized cryptocurrency.', 'q-cr-01'),
('qt-cr-02', 'en', 'What does "DAO" stand for?', '["Digital Asset Organization","Decentralized Autonomous Organization","Data Access Object","Distributed Application Operator"]', 'DAO refers to Decentralized Autonomous Organization, a governance model on blockchain.', 'q-cr-02')
ON CONFLICT DO NOTHING;
