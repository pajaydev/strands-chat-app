'use client';

import { useState, FormEvent } from 'react';

interface InputFieldProps {
  onSubmit: (query: string) => void;
  disabled: boolean;
  placeholder?: string;
}

export function InputField({ onSubmit, disabled, placeholder = 'Ask a question...' }: InputFieldProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const trimmedInput = input.trim();
    if (trimmedInput && !disabled) {
      onSubmit(trimmedInput);
      setInput('');
    }
  };

  const isSubmitDisabled = disabled || !input.trim();

  return (
    <form onSubmit={handleSubmit} className="border-t border-border p-6 bg-background">
      <div className="flex gap-3 max-w-4xl mx-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className="flex-1 w-full border border-border rounded-xl px-5 py-3 
                     focus:outline-none transition-all 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     bg-surface text-foreground"
        />
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="px-8 py-3 rounded-xl transition-all 
                     disabled:cursor-not-allowed disabled:opacity-40
                     bg-accent text-white hover:bg-accent-hover"
        >
          Send
        </button>
      </div>
    </form>
  );
}
