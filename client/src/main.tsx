import { TooltipProvider } from '@/components/ui/tooltip';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TooltipProvider delay={0}>
      <App />
    </TooltipProvider>
  </React.StrictMode>,
);
