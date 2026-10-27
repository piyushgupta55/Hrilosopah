# 🚀 Client Project Handover & Deployment Guide

This comprehensive, step-by-step guide explains how to set up, deploy, and manage your Quiz Application from scratch. You will configure your own accounts for **GitHub**, **Supabase (Database)**, **Vercel (Hosting)**, **Namecheap (Domain)**, and **Stripe/PayPal (Payment Gateway)**.

---

## 📋 Quick Setup Checklist
- [ ] **Step 1:** Create GitHub account, create repository, and upload project files
- [ ] **Step 2:** Create Supabase account, create database, run `supabase_setup.sql`, and get `DATABASE_URL`
- [ ] **Step 3:** Create Vercel account, import project from GitHub, configure Environment Variables, and deploy
- [ ] **Step 4:** Connect custom domain from Namecheap to Vercel (DNS / CNAME / A Records)
- [ ] **Step 5:** Create Stripe/PayPal account and provide API credentials to developer for final integration

---

## 1️⃣ Step 1: GitHub Account & Repository Setup

### A. Create a GitHub Account (if you don't have one)
1. Visit **[github.com](https://github.com)** and sign up for a free account.
2. Verify your email address.

### B. Create a New Repository
1. On GitHub, click the **`+`** icon in the top right corner and select **"New repository"**.
2. Set a **Repository name** (e.g. `quiz-platform`).
3. Set the visibility to **Private** (recommended for commercial projects).
4. Do **NOT** check "Initialize with README", ".gitignore", or "License" (the project zip already contains these).
5. Click **"Create repository"**.

### C. Upload the Project Files to GitHub

#### Option 1: Using Git via Terminal / Command Prompt (Recommended)
1. Unzip the project zip file on your computer and open your terminal/command prompt inside the unzipped folder:
   ```bash
   cd path/to/project-folder
   ```
2. Initialize git and link it to your newly created repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Quiz Platform"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git
   git push -u origin main
   ```
   *(Replace with your actual GitHub username and repository name).*

#### Option 2: Uploading via GitHub Web UI
1. If you prefer not to use the terminal, on your empty GitHub repository page, click the link: **"uploading an existing file"**.
2. Drag and drop all the project files and folders (make sure `node_modules` is excluded) into the upload area.
3. Scroll down, type a commit message (e.g. `Initial commit`), and click **"Commit changes"**.

---

## 2️⃣ Step 2: Supabase (PostgreSQL Database) Setup

Supabase hosts your scalable PostgreSQL database and stores quizzes, questions, user progress, streaks, and analytics.

### A. Create a Supabase Account & Project
1. Visit **[supabase.com](https://supabase.com)** and sign up / log in with your GitHub account.
2. Click **"New Project"**.
3. Fill in the details:
   - **Name:** `quiz-db` (or any name you prefer)
   - **Database Password:** Enter a strong, secure password and **save it safely** (you will need it for the connection string).
   - **Region:** Select the region closest to your primary target audience (e.g. US East, EU Frankfurt, Singapore).
   - **Pricing Plan:** Select the **Free plan** to start.
4. Click **"Create new project"** and wait ~2 minutes for provisioning.

### B. Run Database SQL Schema & Initial Seed Data
1. In your Supabase project dashboard, click the **"SQL Editor"** icon in the left sidebar (looks like `>_`).
2. Click **"New query"** (or "+").
3. Open the file `supabase_setup.sql` (included in your project zip), copy all its contents, and paste them into the SQL editor box.
4. Click the green **"Run"** button in the bottom right.
5. You will see `Success. No rows returned`. All tables, indexes, constraints, default configurations, and starter quiz questions are now created!

### C. Get Your Database Connection String (`DATABASE_URL`)
1. In Supabase, go to **Project Settings** (gear icon at the bottom left) ➔ **Database**.
2. Scroll down to **"Connection string"**.
3. Select the **"URI"** tab and click **"Mode: Transaction"** (or "Session").
4. Copy the connection string. It will look like this:
   ```
   postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
   *(Or direct mode: `postgresql://postgres:[YOUR-PASSWORD]@db.[project-ref].supabase.co:5432/postgres`)*
5. Replace `[YOUR-PASSWORD]` with the actual database password you created in Step A.
6. Keep this URL ready. You will paste it into Vercel in Step 3.

---

## 3️⃣ Step 3: Vercel Hosting & Environment Variables

Vercel provides lightning-fast global serverless hosting with automatic SSL certificates and continuous deployment.

### A. Create a Vercel Account & Import Repository
1. Visit **[vercel.com](https://vercel.com)** and sign up / log in using your **GitHub** account.
2. In the Vercel dashboard, click **"Add New..."** ➔ **"Project"**.
3. Under "Import Git Repository", find your project repository and click **"Import"**.

### B. Configure Project Settings & Environment Variables
In the "Configure Project" screen:
- **Framework Preset:** `Next.js` (automatically detected).
- **Root Directory:** `./` (default).
- Expand the **"Environment Variables"** section and add the following keys:

| Variable Name | Description | Value Example |
|---|---|---|
| `DATABASE_URL` | Your Supabase PostgreSQL connection string | `postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres` |
| `NEXTAUTH_SECRET` | 32-character random string for secure user sessions | Any random string, e.g. `8d7a1b9c2e4f0a3d5b7c9e1f2a4b6c8d` |
| `NEXTAUTH_URL` | Your production website URL | `https://yourdomain.com` *(use your Vercel URL temporarily if domain is not ready)* |
| `NEXT_PUBLIC_APP_URL` | Same as your website URL | `https://yourdomain.com` |
| `AI_GATEWAY_API_KEY` | *(Optional)* AI key for generating dynamic questions in admin panel | Your OpenAI, Gemini, or Vercel AI Gateway key |

### C. Deploy
1. Click **"Deploy"**.
2. Vercel will install dependencies and build your project. Within 1–2 minutes, your website is live with a `*.vercel.app` temporary URL!

---

## 4️⃣ Step 4: Custom Domain Setup (Namecheap + Vercel)

Now link the domain you purchased on Namecheap to your live Vercel application.

### A. Add Your Domain in Vercel
1. In your Vercel Dashboard, select your project.
2. Go to **Settings** ➔ **Domains**.
3. Type your custom domain name (e.g., `yourdomain.com`) and click **"Add"**.
4. Choose the recommended option: add both `yourdomain.com` and `www.yourdomain.com`.
5. Vercel will display the exact DNS records needed:
   - **Type A Record:**
     - Name: `@`
     - Value: `76.76.21.21`
   - **Type CNAME Record:**
     - Name: `www`
     - Value: `cname.vercel-dns.com.`

### B. Add DNS Records in Namecheap
1. Log in to your **[Namecheap.com](https://www.namecheap.com)** account.
2. Go to **Domain List** in the left sidebar and click **"Manage"** next to your domain.
3. Click on the **"Advanced DNS"** tab.
4. Under **"Host Records"**, remove any default Parking / Redirect records and add:

| Type | Host | Value | TTL |
|---|---|---|---|
| **A Record** | `@` | `76.76.21.21` | Automatic (or 5 min) |
| **CNAME Record** | `www` | `cname.vercel-dns.com.` | Automatic (or 5 min) |

5. Click **"Save all changes"**.
6. Return to Vercel Domains page. Within 5–30 minutes, the status indicators will turn **green (Valid Configuration)**, and an automatic free SSL/HTTPS certificate will be generated.

---

## 5️⃣ Step 5: Payment Gateway Setup (Stripe / PayPal)

Payment gateway integration requires specialized server webhooks, checkout session routing, and state handling across multiple files. For security and stability, the developer will handle the code integration once your accounts are ready.

### A. If Using Stripe (Recommended)
1. Visit **[stripe.com](https://stripe.com)** and create an account.
2. Complete your business verification in the Stripe Dashboard to activate live payments.
3. Switch to **Developers** ➔ **API keys**:
   - Copy **Publishable key** (starts with `pk_test_...` or `pk_live_...`).
   - Copy **Secret key** (starts with `sk_test_...` or `sk_live_...`).
4. Under **Developers** ➔ **Webhooks**:
   - Once your domain is connected, add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select event: `checkout.session.completed`
   - Copy the **Signing secret** (starts with `whsec_...`).

### B. If Using PayPal
1. Visit **[developer.paypal.com](https://developer.paypal.com)** and log in with your PayPal business account.
2. Go to **Apps & Credentials** ➔ Create App.
3. Copy the **Client ID** and **Secret Key**.

### C. Hand Over Credentials to the Developer
Send the following details securely to the developer:
- Platform: Stripe or PayPal
- Publishable / Client ID
- Secret Key
- Webhook Secret
- Pricing per quiz / test package (e.g. $4.99 USD)

The developer will plug these in, configure the backend webhook listeners, and test live checkout transactions.

---

## 🔑 Default Admin Account Credentials

The initial database script sets up an administrator account:
- **Admin Login URL:** `https://yourdomain.com/admin/signin`
- **Email:** `admin@example.com`
- **Password:** `password123`

*(⚠️ Please log in immediately after setup to update the password for security).*

---

## 🛠 Support & Assistance
If you encounter any questions or error messages at any step of this guide, please share a screenshot with the developer, who will assist immediately.
