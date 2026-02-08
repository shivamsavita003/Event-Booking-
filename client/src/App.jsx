import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import AdminDashboard from './components/AdminDashboard';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/events" element={<EventList />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
