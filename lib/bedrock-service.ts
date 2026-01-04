import { BedrockClient, ListInferenceProfilesCommand } from '@aws-sdk/client-bedrock';
import { AWSCredentials } from './schemas';

export interface BedrockModel {
  modelId: string;
  modelName: string;
  providerName: string;
  description?: string;
  status: string;
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ModelCategory {
  name: string;
  models: BedrockModel[];
}

export class BedrockService {
  private createClient(credentials: AWSCredentials): BedrockClient {
    return new BedrockClient({
      region: credentials.region || 'us-east-1',
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        sessionToken: credentials.sessionToken,
      },
    });
  }

  async getAvailableModels(credentials: AWSCredentials): Promise<BedrockModel[]> {
    try {
      const client = this.createClient(credentials);
      const command = new ListInferenceProfilesCommand({
        maxResults: 100, // Get up to 100 inference profiles
      });

      const response = await client.send(command);
      
      if (!response.inferenceProfileSummaries) {
        return [];
      }

      return response.inferenceProfileSummaries
        .filter((profile) => 
          // Filter for active inference profiles
          profile.status === 'ACTIVE' &&
          profile.type === 'SYSTEM_DEFINED' // Focus on system-defined profiles
        )
        .map((profile) => ({
          modelId: profile.inferenceProfileId || '',
          modelName: profile.inferenceProfileName || profile.inferenceProfileId || '',
          providerName: this.extractProviderFromId(profile.inferenceProfileId || ''),
          description: profile.description,
          status: profile.status || 'UNKNOWN',
          type: profile.type || 'UNKNOWN',
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
        }))
        .sort((a, b) => {
          if (a.providerName !== b.providerName) {
            return a.providerName.localeCompare(b.providerName);
          }
          return a.modelName.localeCompare(b.modelName);
        });
    } catch (error) {
      console.error('Failed to fetch Bedrock inference profiles:', error);
      throw new Error(`Failed to fetch available models: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private extractProviderFromId(inferenceProfileId: string): string {
    const parts = inferenceProfileId.split('.');
    if (parts.length >= 2) {
      const provider = parts[1];
      return provider.charAt(0).toUpperCase() + provider.slice(1);
    }
    return 'Unknown';
  }

  categorizeModels(models: BedrockModel[]): ModelCategory[] {
    const categories: Record<string, BedrockModel[]> = {};
    const textModels = models.filter(model => !model.modelName.toLowerCase().includes('image')
         && !model.modelName.toLowerCase().includes('embed')
         && !model.modelName.toLowerCase().includes('canvas'));

    textModels.forEach((model) => {
      const provider = model.providerName;
      if (!categories[provider]) {
        categories[provider] = [];
      }
      categories[provider].push(model);
    });

    return Object.entries(categories).map(([name, models]) => ({
      name,
      models: models.sort((a, b) => a.modelName.localeCompare(b.modelName)),
    }));
  }

  getModelDisplayName(model: BedrockModel): string {
    let displayName = model.modelName;
    
    if (displayName.toLowerCase().startsWith(model.providerName.toLowerCase())) {
      displayName = displayName.substring(model.providerName.length).trim();
    }
    
    // Capitalize first letter
    displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
    
    return displayName;
  }

  getModelDescription(model: BedrockModel): string {
    if (model.description) {
      return model.description;
    }
    
    return `${model.providerName} inference model`;
  }
}

export const bedrockService = new BedrockService();