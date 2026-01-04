'use client';

import { useState, useEffect } from 'react';
import { AWSCredentials } from '@/lib/schemas';
import { MODEL, MODEL_NAME } from '@/lib/utils';
import { bedrockService, BedrockModel } from '@/lib/bedrock-service';
import { modelService } from '@/lib/model-service';

interface ModelPanelProps {
  isOpen: boolean;
  onClose: () => void;
  credentials: AWSCredentials | null;
  currentModelId: string;
  onModelChange: (modelId: string) => void;
}

export function ModelPanel({ isOpen, onClose, credentials, currentModelId, onModelChange }: ModelPanelProps) {
  const [availableModels, setAvailableModels] = useState<BedrockModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelsError, setModelsError] = useState<string | null>(null);
  const [selectedModelId, setSelectedModelId] = useState(currentModelId);

  const fetchAvailableModels = async () => {
    if (!credentials) {
      setAvailableModels([]);
      return;
    }

    setIsLoadingModels(true);
    setModelsError(null);

    try {
      const models = await bedrockService.getAvailableModels(credentials);
      setAvailableModels(models);
      setModelsError(null);
    } catch (error) {
      console.error('Failed to fetch models:', error);
      setModelsError(error instanceof Error ? error.message : 'Failed to fetch models');
      setAvailableModels([]);
    } finally {
      setIsLoadingModels(false);
    }
  };

  // Fetch models when credentials change
  useEffect(() => {
    if (credentials && isOpen) {
      fetchAvailableModels();
    }
  }, [credentials, isOpen]);

  // Update selected model when current model changes
  useEffect(() => {
    setSelectedModelId(currentModelId);
  }, [currentModelId]);

  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId);
    modelService.updateModelId(modelId);
    onModelChange(modelId);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 transition-opacity bg-black/30"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-96 shadow-2xl z-50 transform transition-transform border-l bg-background border-border">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg text-foreground">Select Model</h2>
            <button
              onClick={onClose}
              className="hover:opacity-70 transition-opacity text-muted"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {!credentials ? (
              <div className="text-center py-8">
                <div className="mb-4">
                  <svg className="w-12 h-12 mx-auto text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No Credentials Configured</h3>
                <p className="text-sm text-muted mb-4">
                  Configure your AWS credentials to see available models for your account.
                </p>
                <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Default Model</span>
                    <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{MODEL_NAME}</p>
                  <p className="text-xs text-muted mt-1">Most capable model for complex reasoning and analysis</p>
                </div>
              </div>
            ) : (
              // Model selection interface
              <div className="space-y-4">
                {/* Status and refresh */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {availableModels.length > 0 && (
                      <span className="text-xs text-green-600">✓ {availableModels.length} models available</span>
                    )}
                    {modelsError && (
                      <span className="text-xs text-red-600">Failed to load models</span>
                    )}
                  </div>
                  
                  <button
                    onClick={fetchAvailableModels}
                    disabled={isLoadingModels}
                    className="text-xs px-2 py-1 bg-accent/10 text-accent rounded hover:bg-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingModels ? 'Loading...' : 'Refresh'}
                  </button>
                </div>

                {modelsError && (
                  <div className="p-3 bg-error-bg border border-error-border rounded text-sm text-error">
                    <div className="flex items-center justify-between">
                      <span>{modelsError}</span>
                      <button
                        onClick={fetchAvailableModels}
                        disabled={isLoadingModels}
                        className="ml-2 text-accent hover:underline"
                      >
                        Retry
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-muted">Using default model: {MODEL_NAME}</p>
                  </div>
                )}

                {/* Model list */}
                <div className="space-y-2">
                  {/* Default model option */}
                  {availableModels.length === 0 && (
                    <div
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedModelId === MODEL
                          ? 'border-accent bg-accent/5'
                          : 'border-border hover:border-accent/50'
                      }`}
                      onClick={() => handleModelSelect(MODEL)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{MODEL_NAME}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full">
                            Default
                          </span>
                          {selectedModelId === MODEL && (
                            <div className="w-2 h-2 bg-accent rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted">Most capable model for complex reasoning and analysis</p>
                      <p className="text-xs text-muted mt-1">Provider: Anthropic</p>
                    </div>
                  )}

                  {/* Dynamic models */}
                  {bedrockService.categorizeModels(availableModels).map((category) => (
                    <div key={category.name}>
                      <h3 className="text-sm font-medium text-foreground mb-2 px-2">
                        {category.name} Models
                      </h3>
                      {category.models.map((model) => (
                        <div
                          key={model.modelId}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedModelId === model.modelId
                              ? 'border-accent bg-accent/5'
                              : 'border-border hover:border-accent/50'
                          }`}
                          onClick={() => handleModelSelect(model.modelId)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-foreground">
                              {bedrockService.getModelDisplayName(model)}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full">
                                {model.providerName}
                              </span>
                              {selectedModelId === model.modelId && (
                                <div className="w-2 h-2 bg-accent rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-muted">{bedrockService.getModelDescription(model)}</p>
                          <p className="text-xs text-muted mt-1">Model ID: {model.modelId}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs px-1.5 py-0.5 bg-surface rounded text-muted">
                              {model.type}
                            </span>
                            <span className="text-xs px-1.5 py-0.5 bg-surface rounded text-muted">
                              {model.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}