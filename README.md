# 📈 Startup Advisor - AI-Powered Chatbot

An intelligent chatbot designed to provide expert guidance on startup strategy, fundraising, product development, and scaling. Built with React, Vite, and OpenAI's GPT models.

## 🎯 What This Is

**Startup Advisor** is a purpose-built chatbot that acts as a knowledgeable business consultant specifically trained to help entrepreneurs navigate the challenges of building and scaling startups. Unlike generic chatbots, this tool is designed with startup founders in mind, offering practical, actionable advice on topics like:

- 💰 Fundraising strategies (seed rounds, Series A/B, venture capital)
- 🎯 Finding and validating product-market fit
- 👥 Building founding teams and organizational culture
- 📊 Key metrics and analytics to track
- 🚀 Growth strategies and scaling techniques
- 🏢 Business models and revenue optimization
- ⚠️ Common startup pitfalls and how to avoid them

## 🤔 Why This Project?

Many startup founders struggle to get expert advice without expensive consultants or mentors. This chatbot democratizes access to startup wisdom by providing:

1. **24/7 Availability** - Get advice whenever you need it
2. **Conversational Context** - The chatbot remembers your conversation history for better advice
3. **Professional Quality** - Responses are grounded in proven startup methodologies
4. **Thoughtful UX** - Empty states, loading indicators, and error handling show real frontend thinking
5. **Modern Design** - A sleek dark theme that reflects the startup/tech aesthetic

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/startup-advisor-bot.git
cd startup-advisor-bot

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your OpenAI API key to .env.local
# OPENAI_API_KEY=your-key-here
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

### Build

```bash
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Architecture

```
startup-advisor-bot/
├── src/
│   ├── App.tsx              # Main app component with chat logic
│   ├── App.css              # Main app styling
│   ├── components/
│   │   ├── ChatMessage.tsx  # Message display component
│   │   ├── ChatInput.tsx    # Input field with send button
│   │   ├── LoadingSpinner.tsx # Loading animation
│   │   └── ErrorMessage.tsx # Error toast notification
│   ├── index.css            # Global styles
│   └── main.tsx
├── api/
│   └── chat.ts              # Vercel serverless function (OpenAI integration)
├── vercel.json              # Vercel configuration
└── package.json
```

## 🎨 Frontend Thinking

This project demonstrates several UX considerations:

### States Handled

1. **Empty State** - Welcoming interface with suggested prompts when no conversation exists
2. **Loading State** - Animated spinner with "Thinking..." message while waiting for AI response
3. **Error State** - Dismissible toast notifications for error messages
4. **Success State** - Clean message bubbles with timestamps

### Design Details

- **Color Scheme**: Dark theme with cyan/blue accents reflecting tech/startup vibes
- **Message Bubbles**: Distinct styling for user (blue gradient) vs assistant (semi-transparent blue)
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Smooth Scrolling**: Auto-scroll to latest message with smooth behavior
- **Accessibility**: Semantic HTML, proper keyboard handling (Shift+Enter for new lines)

## 🔌 API Integration

The chatbot uses OpenAI's GPT-4 API through a Vercel serverless function:

```typescript
// Example API request
POST /api/chat
{
  "message": "How do I prepare for a seed round?",
  "conversationHistory": [
    { "role": "user", "content": "What metrics should I track?" },
    { "role": "assistant", "content": "..." }
  ]
}
```

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect to Vercel via vercel.com
3. Add `OPENAI_API_KEY` as an environment variable in Vercel
4. Deploy!

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

## 🔒 Environment Variables

Create a `.env.local` file in the project root:

```
OPENAI_API_KEY=your-api-key-here
```

Never commit `.env.local` to version control.

## 📝 Technologies Used

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: CSS3 with custom properties
- **API**: OpenAI GPT-4 via Vercel serverless functions
- **Deployment**: Vercel
- **Build Tool**: Vite (fast, modern bundler)

## ⚙️ Configuration

### Model Selection

The default model is `gpt-4-turbo`. To change it, edit `api/chat.ts` line 59:

```typescript
model: 'gpt-4-turbo', // Change to 'gpt-3.5-turbo' for faster/cheaper responses
```

### System Prompt

The startup advisor behavior is controlled by the system prompt in `api/chat.ts`. Modify it to adjust the chatbot's personality and expertise.

## 🤝 Contributing

Contributions welcome! Feel free to submit issues or pull requests.

## 📄 License

MIT

## 📞 Support

For issues, questions, or feedback, please open an GitHub issue.

---

**Built with ❤️ for startup founders everywhere**

import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
