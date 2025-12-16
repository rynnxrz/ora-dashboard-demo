import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import Contracts from './components/contracts/Contracts';
import Report from './components/report/Report';
import { LanguageProvider } from './contexts/LanguageContext';
import './index.css';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'contracts':
        return <Contracts />;
      case 'report':
        return <Report />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <LanguageProvider>
      <Layout activePage={activePage} onSwitchPage={setActivePage}>
        {renderPage()}
      </Layout>
    </LanguageProvider>
  );
}

export default App;