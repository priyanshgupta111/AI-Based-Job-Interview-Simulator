
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { InterviewProvider } from './contexts/InterviewContext'

createRoot(document.getElementById("root")!).render(
  <InterviewProvider>
    <App />
  </InterviewProvider>
);
