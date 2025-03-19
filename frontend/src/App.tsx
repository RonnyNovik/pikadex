import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/routing';
import { QueryProvider, AuthProvider } from './providers';
import { AuthPage, MainPage } from './pages';
import './App.css'

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<ProtectedRoute />}>
              <Route path="/main" element={<MainPage />} />
              <Route path="/" element={<Navigate to="/main" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryProvider>
  )
}

export default App
