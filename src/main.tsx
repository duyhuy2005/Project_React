import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root');

console.log("🔴 main.tsx: Starting...");
console.log("🔴 Root element:", rootElement);

if (!rootElement) {
  console.error("❌ ERROR: Root element not found!");
  document.body.innerHTML = '<div style="padding: 20px; color: red; font-family: monospace;">ERROR: Root element not found in index.html</div>';
} else {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
    console.log("🟢 main.tsx: Render complete!");
  } catch (error) {
    console.error("❌ ERROR during render:", error);
    rootElement.innerHTML = `<div style="padding: 20px; color: red; font-family: monospace;">ERROR: ${error}</div>`;
  }
}
