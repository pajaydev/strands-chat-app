import { ModelConfigSchema, ModelConfig } from './schemas';
import { MODEL } from './utils';

const MODEL_CONFIG_KEY = 'model_config';

export class ModelService {
  /**
   * Store model configuration in sessionStorage
   */
  store(config: ModelConfig): void {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.setItem(MODEL_CONFIG_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to store model config:', error);
      throw new Error('Failed to store model configuration');
    }
  }

  /**
   * Retrieve model configuration from sessionStorage
   */
  retrieve(): ModelConfig | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = sessionStorage.getItem(MODEL_CONFIG_KEY);
      if (!stored) return { modelId: MODEL }; // Return default

      const parsed = JSON.parse(stored);
      const result = ModelConfigSchema.safeParse(parsed);
      
      return result.success ? result.data : { modelId: MODEL };
    } catch (error) {
      console.error('Failed to retrieve model config:', error);
      return { modelId: MODEL };
    }
  }

  /**
   * Clear stored model configuration from sessionStorage
   */
  clear(): void {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.removeItem(MODEL_CONFIG_KEY);
    } catch (error) {
      console.error('Failed to clear model config:', error);
    }
  }

  /**
   * Get current model ID or default
   */
  getCurrentModelId(): string {
    const config = this.retrieve();
    return config?.modelId || MODEL;
  }

  /**
   * Update just the model ID
   */
  updateModelId(modelId: string): void {
    this.store({ modelId });
  }
}

// Export singleton instance
export const modelService = new ModelService();