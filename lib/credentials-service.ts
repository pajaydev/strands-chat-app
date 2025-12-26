import { AWSCredentialsSchema, AWSCredentials } from './schemas';
import { z } from 'zod';

const CREDENTIALS_KEY = 'aws_credentials';

export class CredentialsService {
  /**
   * Store AWS credentials in sessionStorage
   */
  store(credentials: AWSCredentials): void {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
    } catch (error) {
      console.error('Failed to store credentials:', error);
      throw new Error('Failed to store credentials');
    }
  }

  /**
   * Retrieve AWS credentials from sessionStorage
   */
  retrieve(): AWSCredentials | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = sessionStorage.getItem(CREDENTIALS_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      const result = AWSCredentialsSchema.safeParse(parsed);
      
      return result.success ? result.data : null;
    } catch (error) {
      console.error('Failed to retrieve credentials:', error);
      return null;
    }
  }

  /**
   * Clear stored AWS credentials from sessionStorage
   */
  clear(): void {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.removeItem(CREDENTIALS_KEY);
    } catch (error) {
      console.error('Failed to clear credentials:', error);
    }
  }

  /**
   * Validate credentials using Zod schema
   */
  validate(credentials: unknown): z.SafeParseReturnType<unknown, AWSCredentials> {
    return AWSCredentialsSchema.safeParse(credentials);
  }
}

// Export singleton instance
export const credentialsService = new CredentialsService();
