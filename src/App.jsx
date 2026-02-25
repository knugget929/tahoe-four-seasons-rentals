import './App.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Suspense, lazy } from 'react'

import Landing from './pages/Landing'

const Itinerary = lazy(() => import('./pages/Itinerary'))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/itinerary"
          element={
            <Suspense
              fallback={
                <div className="page" style={{ padding: 40 }}>
                  <p className="muted">Loading itinerary…</p>
                </div>
              }
            >
              <Itinerary />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
