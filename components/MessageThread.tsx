'use client';

import { useEffect, useRef, useState } from 'react';
import { Message } from '@/lib/schemas';
import { MessageBubble } from './MessageBubble';
import { QuestionCards } from './QuestionCards';

interface MessageThreadProps {
  messages: Message[];
  isLoading: boolean;
  onQuestionClick: (question: string) => void;
}

export function MessageThread({ messages, isLoading, onQuestionClick }: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>(undefined);

  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

    if (!isAtBottom) {
      setIsUserScrolling(true);
    } else {
      setIsUserScrolling(false);
    }

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 1000);
  };

  useEffect(() => {
    if (!isUserScrolling && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isUserScrolling]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-8 bg-background"
    >
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-lg mb-2 text-foreground">Start a conversation</p>
              <p className="text-sm text-muted">Ask me anything</p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id}>
            <MessageBubble message={message} />
            {message.type === 'assistant' && message.followUpQuestions && (
              <QuestionCards
                questions={message.followUpQuestions}
                onQuestionClick={onQuestionClick}
                disabled={isLoading}
              />
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start mb-6">
            <div className="rounded-2xl p-5 border bg-surface border-border">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 rounded-full animate-bounce bg-accent" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full animate-bounce bg-accent" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full animate-bounce bg-accent" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
