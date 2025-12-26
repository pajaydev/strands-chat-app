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
    region: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (field: keyof AWSCredentials, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user types
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

    // Validate with Zod
    const result = AWSCredentialsSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(result.data);
      // Reset form on success
      setFormData({ accessKeyId: '', secretAccessKey: '', region: '' });
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
        className="fixed inset-0 z-40 transition-opacity"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-96 shadow-2xl z-50 transform transition-transform border-l" style={{ backgroundColor: '#f5f1e8', borderColor: '#e5dcc8' }}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#e5dcc8' }}>
            <h2 className="text-lg font-light" style={{ color: '#1a1a1a' }}>AWS Credentials</h2>
            <button
              onClick={onClose}
              className="hover:opacity-70 transition-opacity"
              style={{ color: '#8b7355' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto">
            <p className="text-sm font-light mb-6" style={{ color: '#8b7355' }}>
              Enter your AWS credentials.
            </p>

            {submitError && (
              <div className="mb-4 p-3 border rounded-lg text-sm font-light" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' }}>
                {submitError}
              </div>
            )}

            <div className="space-y-5">
              {/* Access Key ID */}
              <div>
                <label htmlFor="accessKeyId" className="block text-sm font-light mb-2" style={{ color: '#1a1a1a' }}>
                  Access Key ID
                </label>
                <input
                  type="text"
                  id="accessKeyId"
                  value={formData.accessKeyId}
                  onChange={(e) => handleChange('accessKeyId', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5 font-light focus:outline-none transition-all"
                  style={{
                    borderColor: errors.accessKeyId ? '#fca5a5' : '#e5dcc8',
                    backgroundColor: '#fff',
                    color: '#1a1a1a'
                  }}
                  placeholder="Enter AWS access key id"
                />
                {errors.accessKeyId && (
                  <p className="mt-1.5 text-sm font-light" style={{ color: '#dc2626' }}>{errors.accessKeyId}</p>
                )}
              </div>
              <div>
                <label htmlFor="secretAccessKey" className="block text-sm font-light mb-2" style={{ color: '#1a1a1a' }}>
                  Secret Access Key
                </label>
                <input
                  type="password"
                  id="secretAccessKey"
                  value={formData.secretAccessKey}
                  onChange={(e) => handleChange('secretAccessKey', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5 font-light focus:outline-none transition-all"
                  style={{
                    borderColor: errors.secretAccessKey ? '#fca5a5' : '#e5dcc8',
                    backgroundColor: '#fff',
                    color: '#1a1a1a'
                  }}
                  placeholder="Enter AWS access key"
                />
                {errors.secretAccessKey && (
                  <p className="mt-1.5 text-sm font-light" style={{ color: '#dc2626' }}>{errors.secretAccessKey}</p>
                )}
              </div>

              {/* Region */}
              <div>
                <label htmlFor="region" className="block text-sm font-light mb-2" style={{ color: '#1a1a1a' }}>
                  Region
                </label>
                <input
                  type="text"
                  id="region"
                  value={formData.region}
                  onChange={(e) => handleChange('region', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5 font-light focus:outline-none transition-all"
                  style={{
                    borderColor: errors.region ? '#fca5a5' : '#e5dcc8',
                    backgroundColor: '#fff',
                    color: '#1a1a1a'
                  }}
                  placeholder="us-east-1"
                />
                {errors.region && (
                  <p className="mt-1.5 text-sm font-light" style={{ color: '#dc2626' }}>{errors.region}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-lg disabled:cursor-not-allowed transition-all font-light disabled:opacity-40 hover:opacity-80"
                style={{
                  backgroundColor: '#d4a574',
                  color: '#fff'
                }}
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
