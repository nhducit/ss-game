import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import { pullFromConvex } from './games/convex-sync'
import './index.css'

// Pull latest data from Convex on startup (non-blocking)
pullFromConvex()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
