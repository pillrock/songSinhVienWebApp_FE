import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import RegisterPage from './pages/RegisterPage';
import RoomSelection from './components/RoomSelection';
import Dashboard from './pages/Dashboard';
import CreateRoom from './components/CreateRoom';
import RoomInfo from './components/RoomInfo'; // Thêm component mới
import PrivateRoute from './components/PrivateRoute';
import Profile from './components/Profile';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<PrivateRoute><RegisterPage /></PrivateRoute>} />
        <Route path="/room-selection" element={<PrivateRoute><RoomSelection /></PrivateRoute>} />
        <Route path="/shopping" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/create-room" element={<PrivateRoute><CreateRoom /></PrivateRoute>} />
        <Route path="/room-info" element={<PrivateRoute><RoomInfo /></PrivateRoute>} /> {/* Thêm route */}
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} /> {/* Thêm route */}
        <Route path="/" element={<PrivateRoute><RoomSelection /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default App;