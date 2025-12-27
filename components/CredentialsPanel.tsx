'use client';

import { useState, FormEvent } from 'react';
import { AWSCredentials, AWSCredentialsSchema } from '@/lib/schemas';

interface CredentialsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (credentials: AWSCredentials) => Promise<void>;
}

export function CredentialsPanel({ isOpen, onClose, onSubmit }: CredentialsPanelProps) {
  const [formData, setFormData] = useState<AWSCredentials>({
    accessKeyId: '',
    secretAccessKey: '',
    sessionToken: '',
    region: 'us-east-1',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (field: keyof AWSCredentials, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError(null);

    const result = AWSCredentialsSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(result.data);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to save credentials');
    } finally {
      setIsSubmitting(false);
    }
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
            <h2 className="text-lg text-foreground">Configure AWS Credentials</h2>
            <button
              onClick={onClose}
              className="hover:opacity-70 transition-opacity text-muted"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto">
            {submitError && (
              <div className="mb-4 p-3 border rounded-lg text-sm bg-error-bg border-error-border text-error">
                {submitError}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label htmlFor="accessKeyId" className="block text-sm mb-2 text-foreground">
                  Access Key ID
                </label>
                <input
                  type="text"
                  id="accessKeyId"
                  value={formData.accessKeyId}
                  onChange={(e) => handleChange('accessKeyId', e.target.value)}
                  className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none transition-all
                             bg-surface text-foreground
                             ${errors.accessKeyId ? 'border-error-border' : 'border-border'}`}
                  placeholder="Enter AWS access key id"
                />
                {errors.accessKeyId && (
                  <p className="mt-1.5 text-sm text-error">{errors.accessKeyId}</p>
                )}
              </div>

              <div>
                <label htmlFor="secretAccessKey" className="block text-sm mb-2 text-foreground">
                  Secret Access Key
                </label>
                <input
                  type="password"
                  id="secretAccessKey"
                  value={formData.secretAccessKey}
                  onChange={(e) => handleChange('secretAccessKey', e.target.value)}
                  className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none transition-all
                             bg-surface text-foreground
                             ${errors.secretAccessKey ? 'border-error-border' : 'border-border'}`}
                  placeholder="Enter AWS access key"
                />
                {errors.secretAccessKey && (
                  <p className="mt-1.5 text-sm text-error">{errors.secretAccessKey}</p>
                )}
              </div>

              <div>
                <label htmlFor="sessionToken" className="block text-sm mb-2 text-foreground">
                  Session Token (Optional)
                </label>
                <input
                  type="password"
                  id="sessionToken"
                  value={formData.sessionToken}
                  onChange={(e) => handleChange('sessionToken', e.target.value)}
                  className="w-full border border-border rounded-lg px-4 py-2.5 focus:outline-none transition-all
                             bg-surface text-foreground"
                  placeholder="Enter session token"
                />
              </div>

              <div>
                <label htmlFor="region" className="block text-sm mb-2 text-foreground">
                  Region
                </label>
                <input
                  type="text"
                  id="region"
                  value={formData.region}
                  onChange={(e) => handleChange('region', e.target.value)}
                  className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none transition-all
                             bg-surface text-foreground
                             ${errors.region ? 'border-error-border' : 'border-border'}`}
                  placeholder="us-east-1"
                />
                {errors.region && (
                  <p className="mt-1.5 text-sm text-error">{errors.region}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-lg transition-all 
                           disabled:cursor-not-allowed disabled:opacity-40
                           bg-accent text-white hover:bg-accent-hover"
              >
                {isSubmitting ? 'Saving...' : 'Save Credentials'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
