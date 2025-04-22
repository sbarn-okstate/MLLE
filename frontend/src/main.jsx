/* SandboxTest.jsx
  *
  * AUTHOR(S): Mark Taylor
  *
  * PURPOSE: Root of frontend. Creates routes for URL.
  * 
  * NOTES: I think StrictMode should be removed for shipping builds.
  */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router";
import Welcome from './Welcome.jsx'
import Sandbox from './sandbox/Sandbox.jsx';
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/sandbox" element={<Sandbox />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
