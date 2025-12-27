import { Message } from '@/lib/schemas';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.type === 'user';

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`max-w-[80%] ${isUser ? 'ml-auto' : 'mr-auto'}`}>
        <div className="text-xs mb-2 text-muted">
          <span>{isUser ? 'You' : 'Assistant'}</span>
          <span className="ml-2 opacity-60">{formatTime(message.timestamp)}</span>
        </div>
        <div 
          className={`rounded-2xl p-5 leading-relaxed text-foreground
            ${isUser ? 'bg-accent' : 'bg-surface border border-border'}`}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
