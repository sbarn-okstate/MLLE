import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router";
import App from './App.jsx'
import Welcome from './Welcome.jsx'
import SandboxTest from './sandbox/SandboxTest.jsx';
import './index.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/sandbox" element={<SandboxTest />} />
    </Routes>
  </BrowserRouter>,
)
