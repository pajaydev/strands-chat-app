# Strands Chat App

A Next.js chat interface that suggests intelligent follow-up questions using [Strands SDK]((https://strandsagents.com/latest/)).

## Features

- 🤖 AI-powered chat using [AWS Bedrock](https://aws.amazon.com/bedrock) and [Strands agent](https://strandsagents.com/latest/)
- 💡 Intelligent follow-up question suggestions (4 per response)
- 🎨 Dark theme UI inspired by v0.app
- 🔒 Secure credential storage (sessionStorage)
- ⚡ Built with Next.js 15, TypeScript, and Tailwind CSS

## Prerequisites

- Node.js 18+ 
- AWS Account with Bedrock access
- AWS credentials (Access Key ID, Secret Access Key, optional Session Token)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/strands-guided-chat.git
   cd strands-guided-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000)

5. **Configure AWS credentials**
   Click "Configure AWS credentials" in the sidebar and enter your AWS credentials

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main chat page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles & Tailwind config
├── components/            # React components
│   ├── MessageBubble.tsx  # Message display with markdown
│   ├── MessageThread.tsx  # Chat message list
│   ├── InputField.tsx     # Message input
│   ├── QuestionCards.tsx  # Follow-up question cards
│   ├── CredentialsPanel.tsx # AWS credentials form
│   └── CredentialsBanner.tsx # Warning banner
├── lib/                   # Utilities
│   ├── schemas.ts         # Zod schemas & types
│   ├── credentials-service.ts # Credential storage
│   └── utils.ts           # Constants & helpers
└── package.json
```

## Security Notes

- AWS credentials are stored in **sessionStorage** (cleared on tab close)
- No credentials are sent to any server except AWS Bedrock
- All credential inputs are validated with Zod schemas
- Credentials are never logged or persisted to disk

## Issues

Free feel to create an issue if you face any issues

## Contributing

Contributions welcome! Please open an issue or submit a pull request.
