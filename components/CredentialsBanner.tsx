'use client';

interface CredentialsBannerProps {
    setIsPanelOpen: (isOpen: boolean) => void
}

export function CredentialsBanner({ setIsPanelOpen }: CredentialsBannerProps) {
    return (
        <div className="px-6 py-3 border-b flex items-center justify-between bg-warning-bg border-border">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 flex-shrink-0 text-warning"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <p className="text-sm text-foreground">Credentials required</p>
                <p className="text-xs text-muted">Configure your AWS credentials to start chatting</p>
              </div>
            </div>
            <button
              onClick={() => setIsPanelOpen(true)}
              className="px-4 py-1.5 rounded-md text-sm font-medium transition-colors
                         bg-accent text-white hover:bg-accent-hover"
            >
              Configure
            </button>
          </div>
    )
}