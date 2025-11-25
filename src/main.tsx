import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import "@github/spark/spark"

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'

import "./main.css"
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

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
   </ErrorBoundary>
)
