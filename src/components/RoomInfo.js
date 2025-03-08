import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Notification from './Notification';

const RoomInfo = () => {
  const { user, setUser } = useContext(AuthContext);
  const [roomData, setRoomData] = useState(null);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/auth/room/${user.roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoomData(data.room);
      } catch (err) {
        setNotification('Lỗi khi tải thông tin phòng');
      }
    };
    if (user?.roomId) fetchRoomInfo();
  }, [user]);

  const handleLeaveRoom = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn rời phòng?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/leave-room`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({ ...user, roomId: null });
      setNotification('Rời phòng thành công');
      return <Navigate to="/room-selection" />;
    } catch (err) {
      setNotification('Lỗi khi rời phòng');
    }
  };

  if (!user?.roomId) return <Navigate to="/room-selection" />;

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800">Thông tin phòng</h1>
      {roomData ? (
        <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
          <p className="text-lg mb-4 text-gray-700"><strong className="text-gray-800">Tên phòng:</strong> {roomData.name}</p>
          <p className="text-lg mb-4 text-gray-700"><strong className="text-gray-800">ID phòng:</strong> {roomData._id}</p>
          <p className="text-lg mb-6 text-gray-700"><strong className="text-gray-800">Thành viên:</strong> {roomData.members.join(', ')}</p>
          <button
            onClick={handleLeaveRoom}
            className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium transition-all duration-200 transform hover:scale-105"
          >
            Rời phòng
          </button>
        </div>
      ) : (
        <p className="text-gray-500 text-center">Đang tải thông tin phòng...</p>
      )}
      <Notification newNotification={notification} />
    </div>
  );
};

export default RoomInfo;