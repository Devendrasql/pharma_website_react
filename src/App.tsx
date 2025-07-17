import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { MedicinePage } from './pages/MedicinePage';
import { OrdersPage } from './pages/OrdersPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { MedicineRemindersPage } from './pages/MedicineRemindersPage';
import { HomePage } from './pages/HomePage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/medicine/:id" element={<MedicinePage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/track-order" element={<TrackOrderPage />} />
        <Route path="/reminders" element={<MedicineRemindersPage />} />
      </Routes>
    </Router>
  );
}

export default App;