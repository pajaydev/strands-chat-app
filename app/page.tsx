'use client';

import { useState, useEffect } from 'react';
import { MessageThread } from '@/components/MessageThread';
import { InputField } from '@/components/InputField';
import { CredentialsPanel } from '@/components/CredentialsPanel';
import { Message, AWSCredentials } from '@/lib/schemas';
import { credentialsService } from '@/lib/credentials-service';
import { Agent, BedrockModel } from '@strands-agents/sdk';
import { DEFAULT_REGION, MODEL, PROMPT } from '@/lib/utils';
import { CredentialsBanner } from '@/components/CredentialsBanner';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [credentials, setCredentials] = useState<AWSCredentials | null>();

  useEffect(() => {
    setMounted(true);
    const credentials = credentialsService.retrieve();
    setCredentials(credentials);
  }, []);

  const handleSubmit = async (query: string) => {
    if (!credentials) {
      setIsPanelOpen(true);
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { region, accessKeyId, secretAccessKey, sessionToken } = credentials;
      const bedrockModel = new BedrockModel({
        modelId: MODEL,
        region: region || DEFAULT_REGION,
        clientConfig: {
          credentials: {
            accessKeyId,
            secretAccessKey,
            sessionToken,
          },
        },
      });

      const agent = new Agent({
        model: bedrockModel,
        systemPrompt: PROMPT,
      });
      const response = await agent.invoke(query);

      const fullResponse = response.toString();
      console.log('full response', fullResponse);
      const separator = '---FOLLOW_UP_QUESTIONS---';

      let content: string;
      let followUpQuestions: string[] | undefined;

      if (fullResponse.includes(separator)) {
        const [answerPart, questionsPart] = fullResponse.split(separator);
        content = answerPart.trim();
        followUpQuestions = questionsPart
          .trim()
          .split('\n')
          .map((q) => q.trim())
          .filter((q) => q.length > 0)
          .slice(0, 4);
      } else {
        content = fullResponse;
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content,
        timestamp: new Date(),
        followUpQuestions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error(error);

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    handleSubmit(question);
  };

  const handleCredentialsSubmit = async (credentials: AWSCredentials) => {
    try {
      credentialsService.store(credentials);
      setCredentials(credentials);
      setIsPanelOpen(false);
    } catch (error) {
      throw new Error('Failed to save credentials');
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r flex flex-col bg-background border-border">
        <div className="p-4 border-b border-border">
          <h1 className="text-lg font-semibold text-foreground">Strands Chat App</h1>
        </div>
        <div className="p-3 border-t border-border">
          <button
            onClick={() => setIsPanelOpen(true)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                       text-foreground hover:bg-border
                       ${credentials ? 'bg-surface' : 'bg-border'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
            <span>{credentials ? 'Credentials configured' : 'Configure AWS credentials'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {!credentials && <CredentialsBanner setIsPanelOpen={setIsPanelOpen} />}
        <div className="flex-1 flex flex-col overflow-hidden">
          <MessageThread messages={messages} isLoading={isLoading} onQuestionClick={handleQuestionClick} />
          <InputField onSubmit={handleSubmit} disabled={isLoading} placeholder="Send a message..." />
        </div>
      </div>

      {/* Credentials Panel */}
      <CredentialsPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} onSubmit={handleCredentialsSubmit} />
    </div>
  );
}
