import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Debug CSS loading
console.log('🎨 Loading CSS and Tailwind...');

// Test if Tailwind is working
const testElement = document.createElement('div');
testElement.className = 'bg-blue-500 text-white p-4';
testElement.style.display = 'none';
document.body.appendChild(testElement);

const computedStyle = window.getComputedStyle(testElement);
const bgColor = computedStyle.backgroundColor;

if (bgColor === 'rgb(59, 130, 246)' || bgColor.includes('59, 130, 246')) {
  console.log('✅ Tailwind CSS is working correctly!');
} else {
  console.warn('⚠️ Tailwind CSS may not be loading properly. Background color:', bgColor);
}

document.body.removeChild(testElement);

// Add error boundary for better debugging
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-4">
              The application encountered an error. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">Error Details</summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
