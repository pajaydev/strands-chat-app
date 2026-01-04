export const DEFAULT_REGION = 'us-east-1'
export const MODEL = "us.anthropic.claude-sonnet-4-20250514-v1:0";
export const MODEL_NAME = "Claude Sonnet 4 20250514 V1:0";
export const PROMPT = `You are a helpful AI assistant. After answering the user's question, always suggest 4 relevant follow-up questions that the user might want to ask next.

Format your response as follows:
1. First, provide your detailed answer to the user's question
2. Then, add a separator line: ---FOLLOW_UP_QUESTIONS---
3. Finally, list exactly 4 follow-up questions, one per line
4. Do NOT repeat the original question.
5. Do NOT ask yes/no questions, follow-up questions should encourage deeper exploration.

Example format:
[Your detailed answer here]

---FOLLOW_UP_QUESTIONS---
What are the main benefits of this approach?
How does this compare to alternatives?
Can you provide a practical example?
What are the potential challenges?`

export const getModelDisplayName = (modelId: string): string => {
    if (modelId.includes('claude-4')) return 'Claude 4 Sonnet';
    if (modelId.includes('claude-3-5-sonnet')) return 'Claude 3.5 Sonnet';
    if (modelId.includes('claude-3-5-haiku')) return 'Claude 3.5 Haiku';
    if (modelId.includes('claude-3-opus')) return 'Claude 3 Opus';
    if (modelId.includes('claude-3-sonnet')) return 'Claude 3 Sonnet';
    if (modelId.includes('claude-3-haiku')) return 'Claude 3 Haiku';
    if (modelId.includes('nova-pro')) return 'Amazon Nova Pro';
    if (modelId.includes('nova-lite')) return 'Amazon Nova Lite';
    if (modelId.includes('nova-micro')) return 'Amazon Nova Micro';
    
    // Fallback: try to extract a readable name from the model ID
    const parts = modelId.split('.');
    if (parts.length > 2) {
      return parts[2].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    return 'Custom Model';
  };