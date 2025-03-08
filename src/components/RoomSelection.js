import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

const RoomSelection = () => {
  const { user, setUser } = useContext(AuthContext);
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/join-room`,
        { roomId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser({ ...user, roomId: data.room._id });
      navigate('/shopping');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi tham gia phòng');
    }
  };

  if (!user) return <Navigate to="/login" />;
  if (user.roomId) return <Navigate to="/shopping" />;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleJoinRoom} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md transform transition-all duration-300 hover:shadow-xl">
        <h2 className="text-3xl font-semibold mb-8 text-gray-800 text-center">Welcome</h2>
        {error && (
          <p className="text-red-600 bg-red-50 p-3 rounded-md mb-6 text-center font-medium">{error}</p>
        )}
        <input
          type="text"
          placeholder="Nhập ID phòng (VD: room1)"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all duration-200"
        />
        <button
          type="submit"
          className="w-full bg-amber-600 text-white p-3 mt-6 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium transition-all duration-200 transform hover:scale-105"
        >
          Tham gia phòng
        </button>
      </form>
    </div>
  );
};

export default RoomSelection;