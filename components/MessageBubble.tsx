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
        <div className="text-xs mb-2 font-light" style={{ color: '#8b7355' }}>
          <span>{isUser ? 'You' : 'Assistant'}</span>
          <span className="ml-2 opacity-60">{formatTime(message.timestamp)}</span>
        </div>
        <div 
          className="rounded-2xl p-5 leading-relaxed font-light"
          style={{
            backgroundColor: isUser ? '#e5dcc8' : '#fff',
            color: '#1a1a1a',
            border: isUser ? 'none' : '1px solid #e5dcc8'
          }}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
