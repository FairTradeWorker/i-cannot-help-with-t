import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import "@github/spark/spark"

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'

import "./main.css"
import "./styles/theme.css"
import "./index.css"
import "leaflet/dist/leaflet.css"

// Handle SPA redirect from 404.html (GitHub Pages)
// Validate path to prevent open redirect vulnerabilities
const redirectPath = sessionStorage.getItem('redirect_path');
if (redirectPath) {
  sessionStorage.removeItem('redirect_path');
  try {
    // Decode and validate to catch encoded malicious characters
    const decodedPath = decodeURIComponent(redirectPath);
    // Only allow relative paths starting with / (not just /) and no protocol/external URLs
    const isValidPath = decodedPath !== '/' &&
      decodedPath.startsWith('/') && 
      !decodedPath.includes('//') && 
      !decodedPath.includes(':') &&
      !/[<>"']/.test(decodedPath);
    if (isValidPath) {
      // Use original path to preserve legitimate URL encoding
      window.history.replaceState(null, '', redirectPath);
    }
  } catch {
    // If decoding fails, ignore the redirect path
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
   </ErrorBoundary>
)
