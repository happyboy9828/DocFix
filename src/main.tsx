import {createRoot} from 'react-dom/client';
import {Analytics} from '@vercel/analytics/react';
import App from './App.tsx';
import './index.css';
import {initClarity} from './utils/clarity.ts';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element. Ensure index.html contains <div id="root"></div>.');
}

initClarity();

createRoot(rootElement).render(
  <>
    <App />
    <Analytics />
  </>
);