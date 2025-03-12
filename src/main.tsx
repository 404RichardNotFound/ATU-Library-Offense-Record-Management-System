import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <BrowserRouter>
        <Theme>
          <App />
        </Theme>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
