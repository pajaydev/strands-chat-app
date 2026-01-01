'use client';

import { useState } from 'react';
import { MessageThread } from '@/components/MessageThread';
import { InputField } from '@/components/InputField';
import { CredentialsPanel } from '@/components/CredentialsPanel';
import { Message, AWSCredentials } from '@/lib/schemas';
import { credentialsService } from '@/lib/credentials-service';
import { Agent, BedrockModel } from '@strands-agents/sdk';
import { DEFAULT_REGION, MODEL, PROMPT } from '@/lib/utils';
import { CredentialsBanner } from '@/components/CredentialsBanner';
import { StreamingStatus } from '@/lib/types';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingStatus, setStreamingStatus] = useState<StreamingStatus>('idle');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [credentials, setCredentials] = useState<AWSCredentials | null>(() => {
    if (typeof window !== 'undefined') {
      return credentialsService.retrieve();
    }
    return null;
  });

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
    setStreamingStatus('loading');

    // Create a placeholder message for streaming content
    const assistantMessageId = crypto.randomUUID();
    const initialAssistantMessage: Message = {
      id: assistantMessageId,
      type: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, initialAssistantMessage]);

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

      let accumulatedContent = '';

      // Iterate through streaming events
      for await (const event of agent.stream(query)) {
        console.log('Stream event type:', event.type);

        switch (event.type) {
          case 'modelContentBlockStartEvent':
            if (event.start?.type === 'toolUseStart') {
              console.log('Tool use started:', event.start.name, event.start.toolUseId);
            }
            break;

          case 'modelContentBlockDeltaEvent':
            // Handle different types of content deltas
            if (event.delta.type === 'textDelta') {
              // Accumulate text content as it streams in
              accumulatedContent += event.delta.text;
              
              // Update the message in real-time
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: accumulatedContent }
                    : msg
                )
              );
            } else if (event.delta.type === 'toolUseInputDelta') {
              console.log('Tool input delta:', event.delta.input);
            } else if (event.delta.type === 'reasoningContentDelta') {
              console.log('Reasoning delta:', event.delta.text);
            }
            break;

            case 'modelMessageStopEvent':
            console.log('Message stopped, reason:', event.stopReason);
            setStreamingStatus('complete');
            break;

          default:
            console.log('Unknown event type:', event.type, event);
        }
      }

      // Process the final content for follow-up questions
      const separator = '---FOLLOW_UP_QUESTIONS---';
      let finalContent: string;
      let followUpQuestions: string[] | undefined;

      if (accumulatedContent.includes(separator)) {
        const [answerPart, questionsPart] = accumulatedContent.split(separator);
        finalContent = answerPart.trim();
        followUpQuestions = questionsPart
          .trim()
          .split('\n')
          .map((q) => q.trim())
          .filter((q) => q.length > 0)
          .slice(0, 4);
      } else {
        finalContent = accumulatedContent;
      }

      // Update the final message with follow-up questions
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: finalContent, followUpQuestions }
            : msg
        )
      );

      setIsLoading(false);
      setStreamingStatus('idle');
    } catch (error) {
      console.error(error);

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
        timestamp: new Date(),
      };

      // Replace the placeholder message with error message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId ? errorMessage : msg
        )
      );
      setIsLoading(false);
      setStreamingStatus('idle');
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

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:flex w-64 border-r flex-col bg-background border-border">
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
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z"
              />
            </svg>
            <span>{credentials ? 'Credentials configured' : 'Configure AWS credentials'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background">
          <h1 className="text-lg font-semibold text-foreground">Strands Chat App</h1>
          <button
            onClick={() => setIsPanelOpen(true)}
            className="p-2 rounded-lg transition-colors text-foreground hover:bg-surface"
            aria-label="Configure credentials"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z"
              />
            </svg>
          </button>
        </div>

        {!credentials && <CredentialsBanner setIsPanelOpen={setIsPanelOpen} />}
        <div className="flex-1 flex flex-col overflow-hidden">
          <MessageThread 
            messages={messages} 
            isLoading={isLoading} 
            streamingStatus={streamingStatus}
            onQuestionClick={handleQuestionClick} 
          />
          <InputField onSubmit={handleSubmit} disabled={isLoading} placeholder="Send a message..." />
        </div>
      </div>

      {/* Credentials Panel */}
      <CredentialsPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} onSubmit={handleCredentialsSubmit} />
    </div>
  );
}
