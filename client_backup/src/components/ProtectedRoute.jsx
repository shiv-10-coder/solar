import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '40vh' }}><div className="neon-spinner" style={{ width: 40, height: 40 }} /></div>;
  return user ? children : <Navigate to="/login" />;
}
