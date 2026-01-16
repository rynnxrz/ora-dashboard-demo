import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import Contracts from './components/contracts/Contracts';
import Report from './components/report/Report';
import { LanguageProvider } from './contexts/LanguageContext';
import './index.css';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/contracts" element={<Contracts />} />
            <Route path="/report" element={<Report />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </LanguageProvider>
  );
}

export default App;