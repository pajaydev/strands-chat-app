interface QuestionCardsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
  disabled?: boolean;
}

export function QuestionCards({ questions, onQuestionClick, disabled = false }: QuestionCardsProps) {
  const displayQuestions = questions.slice(0, 4);

  if (displayQuestions.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-2 max-w-[80%]">
      <p className="text-xs mb-3 text-muted">Suggested questions</p>
      <div className="grid grid-cols-2 gap-2">
        {displayQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            disabled={disabled}
            className="group relative overflow-hidden rounded-xl p-4 text-left text-sm transition-all 
                       disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer
                       bg-surface border border-border text-foreground
                       hover:bg-surface-hover hover:border-accent"
          >
            <span className="flex items-center gap-2">
              <svg 
                className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1 text-accent" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>{question}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
