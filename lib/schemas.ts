import { z } from 'zod';

export const AWSCredentialsSchema = z.object({
  accessKeyId: z.string().min(1, 'Access Key ID is required'),
  secretAccessKey: z.string().min(1, 'Secret Access Key is required'),
  sessionToken: z.string().optional(),
  region: z.string().optional(),
});

export type AWSCredentials = z.infer<typeof AWSCredentialsSchema>;

export const MessageSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['user', 'assistant']),
  content: z.string().min(1),
  timestamp: z.date(),
  followUpQuestions: z.array(z.string()).max(4).optional(),
});

export type Message = z.infer<typeof MessageSchema>;

// Chat Response Schema
export const ChatResponseSchema = z.object({
  content: z.string(),
  followUpQuestions: z.array(z.string()).max(4),
});

export type ChatResponse = z.infer<typeof ChatResponseSchema>;

// Strands Configuration Schema
export const StrandsConfigSchema = z.object({
  credentials: AWSCredentialsSchema,
  modelId: z.string(),
  maxTokens: z.number().positive().optional(),
  temperature: z.number().min(0).max(1).optional(),
});

export type StrandsConfig = z.infer<typeof StrandsConfigSchema>;

// Chat State Schema
export const ChatStateSchema = z.object({
  messages: z.array(MessageSchema),
  isLoading: z.boolean(),
  error: z.string().nullable(),
  isInitialized: z.boolean(),
});

export type ChatState = z.infer<typeof ChatStateSchema>;

// Error State Schema
export const ErrorStateSchema = z.object({
  message: z.string(),
  type: z.enum(['network', 'validation', 'state']),
  retryable: z.boolean(),
});

export type ErrorState = z.infer<typeof ErrorStateSchema>;
