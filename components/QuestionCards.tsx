interface QuestionCardsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
  disabled?: boolean;
}

export function QuestionCards({ questions, onQuestionClick, disabled = false }: QuestionCardsProps) {
  // Limit to maximum 4 cards
  const displayQuestions = questions.slice(0, 4);

  // Don't render anything if no questions
  if (displayQuestions.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-2 max-w-[80%]">
      <p className="text-xs font-light mb-3" style={{ color: '#8b7355' }}>
        Suggested questions
      </p>
      <div className="grid grid-cols-1 gap-2">
        {displayQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            disabled={disabled}
            className="
              group relative overflow-hidden
              rounded-xl border border-[#d4a574] bg-white p-4
              text-left text-sm font-light text-[#1a1a1a]
              shadow-sm transition-all
              hover:translate-x-1 hover:border-[#c89960] hover:bg-[#fefdfb]
              disabled:cursor-not-allowed disabled:opacity-40
            "
          >
            <span className="flex items-center gap-2">
              <svg 
                className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ color: '#d4a574' }}
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
