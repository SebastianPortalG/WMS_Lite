import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './components/UserContext'; 
import NavBar from './components/common/NavBar'; 
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import ProductsPage from './components/ProductsPage';
import LocationsPage from './components/LocationPage';
import ReceptionPage from './components/ReceptionPage';
import StartReceptionPage from './components/reception/StartReceptionPage';
import StoreReceptionBatches from './components/reception/StoreReceptionBatches';
import QRScanner from './components/common/QRScanner';
import './index.css';
import BatchStoragePage from './components/reception/BatchStoragePage';



function App() {
  return (
    <UserProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products/:page/:size" element={<ProductsPage />} />
          <Route path="/locations/:page/:size" element={<LocationsPage />} />
          <Route path="/reception" element={<ReceptionPage />} />
          <Route path="/start-reception" element={<StartReceptionPage />} />
          <Route path="/store-reception-batch" element={<StoreReceptionBatches />} />
          <Route path="/batch-storage/:receptionId" element={<BatchStoragePage />} />
          <Route path="/batch-storage/:receptionId/:locationId" element={<BatchStoragePage />} />

        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
