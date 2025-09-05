import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HelmetProvider as HelmetProviderBase } from "react-helmet-async";

const HelmetProvider = HelmetProviderBase as unknown as React.FC<
  React.PropsWithChildren<any>
>;
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>

  </React.StrictMode>,
)
