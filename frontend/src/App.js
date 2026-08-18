import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import RequestDemo from './pages/RequestDemo';
import Login from './pages/Login';
import Ceo from './pages/Ceo';
import Hr from './pages/Hr';
import Employee from './pages/Employee';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Landing />} />
            <Route path="/request-demo" element={<RequestDemo />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/ceo" 
              element={
                <ProtectedRoute allowedRoles={['ceo']}>
                  <Ceo />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hr" 
              element={
                <ProtectedRoute allowedRoles={['hr']}>
                  <Hr />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employee" 
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <Employee />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
