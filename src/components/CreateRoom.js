import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';

const CreateRoom = () => {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (user?.roomId) {
      setNotification('Đã có phòng rồi');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/create-room`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser({ ...user, roomId: data.room._id });
      setNotification('Tạo phòng thành công! Bạn đã được thêm vào phòng.');
      setTimeout(() => navigate('/shopping'), 2000);
    } catch (err) {
      setNotification(err.response?.data?.message || 'Lỗi khi tạo phòng');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleCreateRoom} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md transform transition-all duration-300 hover:shadow-xl">
        <h2 className="text-3xl font-semibold mb-8 text-gray-800 text-center">Tạo phòng mới</h2>
        <div className="space-y-6">
          <input
            type="text"
            placeholder="Tên phòng"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all duration-200"
            required
          />
          <button
            type="submit"
            className="w-full bg-amber-600 text-white p-3 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium transition-all duration-200 transform hover:scale-105"
          >
            Tạo phòng
          </button>
        </div>
      </form>
      <Notification newNotification={notification} />
    </div>
  );
};

export default CreateRoom;