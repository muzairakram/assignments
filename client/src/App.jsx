import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ClientDetail from './pages/ClientDetail';
import ActionsHub from './pages/ActionsHub';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/actions" element={<ActionsHub />} />
          </Routes>
        </Layout>
      </AppProvider>
    </BrowserRouter>
  );
}
