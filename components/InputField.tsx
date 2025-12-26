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
    <form onSubmit={handleSubmit} className="border-t p-6" style={{ borderColor: '#e5dcc8', backgroundColor: '#f5f1e8' }}>
      <div className="flex gap-3 max-w-4xl mx-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className="flex-1 w-full border rounded-xl px-5 py-3 focus:outline-none font-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            borderColor: '#e5dcc8',
            backgroundColor: '#fff',
            color: '#1a1a1a'
          }}
        />
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="px-8 py-3 rounded-xl disabled:cursor-not-allowed transition-all font-light disabled:opacity-40 hover:opacity-70"
          style={{
            backgroundColor: '#d4a574',
            color: '#fff'
          }}
        >
          Send
        </button>
      </div>
    </form>
  );
}
