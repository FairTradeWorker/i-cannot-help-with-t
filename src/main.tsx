import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import App from './App.tsx'

import "./styles/theme.css"
import "./index.css"

const resizeObserverErrorHandler = (e: ErrorEvent) => {
  if (e.message === 'ResizeObserver loop completed with undelivered notifications.' || 
      e.message.includes('ResizeObserver loop limit exceeded')) {
    e.stopImmediatePropagation();
    return;
  }
};

window.addEventListener('error', resizeObserverErrorHandler);

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-destructive mb-2">Something went wrong</h2>
        <p className="text-sm text-muted-foreground mb-4">
          An error occurred while rendering the application.
        </p>
        <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-40">
          {error.message}
        </pre>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
  </ErrorBoundary>
)
