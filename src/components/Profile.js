import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Notification from './Notification';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ username: '', password: '', stk: '', bank: '', roomId: '' });
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({ username: user.username, password: '', stk: user.stk || '', bank: user.bank || '', roomId: user.roomId || '' });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const updatedUser = await axios.put(
        `${process.env.REACT_APP_API_URL}/auth/update`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(updatedUser.data.user);
      setNotification("Cập nhật thông tin thành công");
    } catch (err) {
      setNotification(err.response?.data?.message || 'Lỗi trong quá trình cập nhật');
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-8 text-gray-800">Thông tin người dùng</h2>
      {error && (
        <p className="text-red-600 bg-red-50 p-3 rounded-md mb-6 text-center font-medium">{error}</p>
      )}
      {success && (
        <p className="text-green-600 bg-green-50 p-3 rounded-md mb-6 text-center font-medium">{success}</p>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tên người dùng</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 text-gray-700 transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu mới <span className="text-red-500 text-xs">(Để trống nếu giữ nguyên)</span>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">STK</label>
            <input
              type="text"
              value={formData.stk}
              onChange={(e) => setFormData({ ...formData, stk: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all duration-200"
              placeholder="Nhập số tài khoản ngân hàng"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tên tài khoản ngân hàng</label>
            <input
              type="text"
              value={formData.bank}
              onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all duration-200"
              placeholder="Nhập tên ngân hàng (VD: MBBank)"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-amber-600 text-white p-3 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium transition-all duration-200 transform hover:scale-105"
          >
            Cập nhật
          </button>
        </div>
      </form>
      <Notification newNotification={notification} />
    </div>
  );
};

export default Profile;