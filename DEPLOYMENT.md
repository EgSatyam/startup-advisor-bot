# Deployment Guide - Startup Advisor Bot

## 🚀 Step-by-Step Deployment

### 1. Initialize Git Repository

```bash
cd startup-advisor-bot

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Startup Advisor chatbot with React + Vite + OpenAI"
```

### 2. Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository named `startup-advisor-bot`
3. Copy the commands to push your local repo:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/startup-advisor-bot.git
git push -u origin main
```

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
vercel

# Follow the prompts:
# - Link to existing project? (No)
# - Project name? (startup-advisor-bot)
# - Framework? (Vite)
# - Root directory? (.)
# - Override build settings? (No)
```

#### Option B: Using Vercel Web Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repo
4. Click "Deploy"
5. Skip the "Configure Project" step
6. In Project Settings, add environment variable:
   - Name: `OPENAI_API_KEY`
   - Value: Your OpenAI API key

### 4. Add Environment Variables to Vercel

**Important!** Your chatbot won't work without the OpenAI API key configured in Vercel.

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add new variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key (get from [platform.openai.com/api-keys](https://platform.openai.com/api-keys))
4. **DO NOT** push your API key to GitHub!

### 5. Redeploy After Adding Environment Variables

```bash
# If using CLI
vercel --prod

# Or trigger a redeploy from Vercel dashboard:
# Go to Deployments → Latest → Redeploy
```

## 🔑 Getting Your OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign in or create an account
3. Navigate to [API keys page](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy and save it somewhere safe
6. Add to Vercel environment variables

**Cost Note**: OpenAI charges per token used. Monitor your usage at [platform.openai.com/account/usage](https://platform.openai.com/account/usage).

## ✅ Testing Your Deployment

Once deployed:

1. Visit your Vercel URL (usually `https://startup-advisor-bot.vercel.app`)
2. See the empty state with suggested prompts
3. Click a suggestion or type a question
4. The chatbot should respond with advice

If you get an error:
- Check that `OPENAI_API_KEY` is set in Vercel
- Check Vercel deployment logs for API errors
- Verify your API key is valid

## 🔧 Troubleshooting

### "API configuration error"
- Environment variable not set in Vercel
- API key is invalid or expired
- Solution: Re-add your API key in Vercel settings

### Slow responses
- First request to cold serverless function is slower
- Subsequent requests are faster
- Consider upgrading OpenAI plan for faster rate limits

### "Method not allowed"
- You're hitting the API endpoint with wrong HTTP method
- Should be POST /api/chat
- Check browser network tab in DevTools

## 📊 Monitoring Usage

Log in to OpenAI Dashboard:
- Check usage: [platform.openai.com/account/usage](https://platform.openai.com/account/usage)
- Set spending limits in [Billing settings](https://platform.openai.com/account/billing/overview)
- View API keys: [API keys page](https://platform.openai.com/api-keys)

## 🎬 Recording Your Loom Walkthrough

Tips for a great 5-10 minute video:

1. **Show the Empty State** (30 seconds)
   - Start by showing the clean interface
   - Point out the design choices (dark theme, gradient, suggestion chips)

2. **Ask a Question** (2-3 minutes)
   - Type a question like "How do I prepare for a seed round?"
   - Narrate what you're looking for while waiting
   - Show the loading state
   - Show the response

3. **Test Another Scenario** (2-3 minutes)
   - Ask a follow-up question to show conversation history
   - Point out how the chatbot remembers context
   - Show how messages scroll smoothly

4. **Show Error Handling** (1 minute)
   - Optional: temporarily disable API to show error toast
   - Or just mention the error handling in code

5. **Show the Code** (2-3 minutes)
   - Open App.tsx to show the chat logic
   - Show one component (ChatMessage or ChatInput)
   - Briefly explain the state management

6. **Reflect on Frontend Thinking** (1 minute)
   - Talk about why you chose the design
   - Mention the empty state, loading state, error state
   - Explain responsive design approach

## ✨ Final Checklist

- [ ] GitHub repo created and code pushed
- [ ] Vercel deployment successful
- [ ] OPENAI_API_KEY environment variable set
- [ ] Chatbot responds to questions
- [ ] Deployed link is live and working
- [ ] README.md explains the project
- [ ] Loom video recorded (5-10 minutes)

You're all set! 🎉
