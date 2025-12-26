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
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Detect user scrolling
  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

    // If user scrolls away from bottom, mark as user scrolling
    if (!isAtBottom) {
      setIsUserScrolling(true);
    } else {
      setIsUserScrolling(false);
    }

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Reset user scrolling flag after 1 second of no scrolling
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 1000);
  };

  // Auto-scroll to bottom when new messages arrive (unless user is scrolling)
  useEffect(() => {
    if (!isUserScrolling && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isUserScrolling]);

  // Cleanup timeout on unmount
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
      className="flex-1 overflow-y-auto p-8"
      style={{ backgroundColor: '#f5f1e8' }}
    >
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-lg font-light mb-2" style={{ color: '#1a1a1a' }}>
                Start a conversation
              </p>
              <p className="text-sm font-light" style={{ color: '#8b7355' }}>
                Ask me anything
              </p>
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
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: '#fff', borderColor: '#e5dcc8' }}>
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#d4a574', animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#d4a574', animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#d4a574', animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
