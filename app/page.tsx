'use client';

import { useState, useEffect } from 'react';
import { MessageThread } from '@/components/MessageThread';
import { InputField } from '@/components/InputField';
import { CredentialsPanel } from '@/components/CredentialsPanel';
import { Message, AWSCredentials } from '@/lib/schemas';
import { credentialsService } from '@/lib/credentials-service';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [hasCredentials, setHasCredentials] = useState(false);

  useEffect(() => {
    setMounted(true);
    const credentials = credentialsService.retrieve();
    setHasCredentials(!!credentials);
  }, []);

  const handleSubmit = (query: string) => {
    if (!hasCredentials) {
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

    setTimeout(() => {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: `This is a demo response to: "${query}". The Strands SDK integration will be added later.`,
        timestamp: new Date(),
        followUpQuestions: [
          'Can you tell me more about that?',
          'What are the key benefits?',
          'How does this compare to alternatives?',
          'What are the next steps?',
        ],
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuestionClick = (question: string) => {
    handleSubmit(question);
  };

  const handleCredentialsSubmit = async (credentials: AWSCredentials) => {
    try {
      credentialsService.store(credentials);
      setHasCredentials(true);
      setIsPanelOpen(false);
      alert('Credentials saved successfully!');
    } catch (error) {
      throw new Error('Failed to save credentials');
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#f5f1e8' }}>
        <div style={{ color: '#8b7355' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: '#f5f1e8' }}>
      <header className="border-b px-6 py-5 flex items-center justify-between" style={{ borderColor: '#e5dcc8', backgroundColor: '#f5f1e8' }}>
        <h1 className="text-2xl font-light tracking-wide" style={{ color: '#1a1a1a' }}>
          Chat
        </h1>
        <button
          onClick={() => setIsPanelOpen(true)}
          className="p-2 hover:opacity-70 transition-opacity"
          style={{ color: '#8b7355' }}
          title="Configure AWS Credentials"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z"
            />
          </svg>
        </button>
      </header>

      {!hasCredentials && (
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{
            backgroundColor: '#fff3e0',
            borderColor: '#d4a574',
          }}
        >
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: '#d4a574' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <p className="text-sm font-light" style={{ color: '#1a1a1a' }}>
                AWS credentials not configured
              </p>
              <p className="text-xs font-light mt-0.5" style={{ color: '#8b7355' }}>
                Please configure your AWS Bedrock credentials to start chatting
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPanelOpen(true)}
            className="px-4 py-2 rounded-lg text-sm font-light hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: '#d4a574',
              color: '#fff',
            }}
          >
            Configure
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <MessageThread messages={messages} isLoading={isLoading} onQuestionClick={handleQuestionClick} />
        <InputField onSubmit={handleSubmit} disabled={isLoading} placeholder="Ask a question..." />
      </div>

      <CredentialsPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} onSubmit={handleCredentialsSubmit} />
    </div>
  );
}
