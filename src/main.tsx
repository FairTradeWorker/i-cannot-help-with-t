import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import "@github/spark/spark"

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

// Handle SPA redirect from 404.html (GitHub Pages)
const redirectPath = sessionStorage.getItem('redirect_path');
if (redirectPath) {
  sessionStorage.removeItem('redirect_path');
  window.history.replaceState(null, '', redirectPath);
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
   </ErrorBoundary>
)
