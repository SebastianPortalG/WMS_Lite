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
import BatchStoragePage from './components/reception/BatchStoragePage';
import BatchMovePage from './components/storage/BatchMovePage';
import StoragePage from './components/storage/StoragePage';
import DispatchPage from './components/DispatchPage';
import StartDispatchPage from './components/dispatch/StartDispatchPage';
import CreateDispatchMaster from './components/dispatch/CreateDispatchMaster';
import DispatchDetailPage from './components/dispatch/DispatchDetailPage';
import SelectBatchPage from './components/dispatch/SelectBatchPage'; 
import ScanStoragePage from './components/dispatch/ScanStoragePage'; 
import QRScanner from './components/common/QRScanner';
import './index.css';



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
          <Route path="/storage" element={<StoragePage />} />
          <Route path="/storage/:sourceLocationId" element={<StoragePage />} />
          <Route path="/storage/:sourceLocationId/:targetLocationId" element={<StoragePage />} />
          <Route path="/batch-move/:locationId" element={<BatchMovePage />} />
          <Route path="/dispatch" element={<DispatchPage />} />
          <Route path="/start-dispatch" element={<StartDispatchPage />} />
          <Route path="/create-dispatch" element={<CreateDispatchMaster />} />
          <Route path="/dispatch-storage/:dispatchMasterId/:pickingOrderId" element={<DispatchDetailPage />} /> 
          <Route path="/select-batch/:dispatchMasterId/:pickingOrderId/:productId" element={<SelectBatchPage />} /> 
          <Route path="/scan-storage/:dispatchMasterId/:pickingOrderId/:productId" element={<ScanStoragePage />} />
          <Route path="/scan-storage/:dispatchMasterId/:pickingOrderId/:productId/:locationId" element={<ScanStoragePage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
