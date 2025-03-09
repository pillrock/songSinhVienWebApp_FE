import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentForm = ({ fetchData, setActivity, setNotification }) => {
  // Hàm để định dạng ngày hôm nay thành định dạng datetime-local
  const getTodayDateTime = () => {
    const today = new Date();
    return (
      today.getFullYear() +
      '-' +
      String(today.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(today.getDate()).padStart(2, '0') +
      'T' +
      String(today.getHours()).padStart(2, '0') +
      ':' +
      String(today.getMinutes()).padStart(2, '0')
    );
  };

  const [formData, setFormData] = useState({
    eventTime: getTodayDateTime(), // Đặt mặc định là hôm nay
    itemCategory: '',
    note: '',
    amount: '',
    proof: null,
    participants: 'all',
  });
  const [rawAmount, setRawAmount] = useState('');
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [roomUsers, setRoomUsers] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  useEffect(() => {
    const fetchRoomUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/room/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoomUsers(res.data.members || []);
      } catch (err) {
        console.error('Error fetching room users:', err);
        setError('Không thể tải danh sách người dùng trong phòng');
      }
    };
    fetchRoomUsers();
  }, []);

  const itemCategories = [
    { value: '', label: 'Chọn danh mục' },
    { value: 'snacks', label: 'Đồ ăn vặt' },
    { value: 'vegetables', label: 'Rau' },
    { value: 'meat', label: 'Thịt' },
    { value: 'household', label: 'Đồ gia dụng' },
    { value: 'drinks', label: 'Đồ uống' },
    { value: 'fruits', label: 'Trái cây' },
    { value: 'electronics', label: 'Đồ điện tử' },
    { value: 'others', label: 'Khác' },
  ];

  const units = [
    { label: '', multiplier: 1 },
    { label: '', multiplier: 1000 },
    { label: '', multiplier: 10000 },
    { label: '', multiplier: 100000 },
    { label: '', multiplier: 1000000 },
    { label: '', multiplier: 10000000 },
    { label: '', multiplier: 100000000 },
  ];

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/,/g, '');
    if (!isNaN(value) && value !== '') {
      setRawAmount(value);
      const num = parseInt(value, 10);
      const newSuggestions = units.map((unit) => ({
        label: `${formatNumber(num * unit.multiplier)} ${unit.label}`,
        value: num * unit.multiplier,
      }));
      setSuggestions(newSuggestions);
      setFormData({ ...formData, amount: formatNumber(value) });
    } else {
      setRawAmount('');
      setSuggestions([]);
      setFormData({ ...formData, amount: '' });
    }
  };

  const handleSuggestionClick = (value) => {
    setRawAmount(value.toString());
    setFormData({ ...formData, amount: formatNumber(value) });
    setSuggestions([]);
  };

  const setQuickDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const formattedDate =
      date.getFullYear() +
      '-' +
      String(date.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(date.getDate()).padStart(2, '0') +
      'T' +
      String(date.getHours()).padStart(2, '0') +
      ':' +
      String(date.getMinutes()).padStart(2, '0');
    setFormData({ ...formData, eventTime: formattedDate });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, proof: file });
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleParticipantChange = (username) => {
    setSelectedParticipants((prev) =>
      prev.includes(username)
        ? prev.filter((u) => u !== username)
        : [...prev, username]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('eventTime', formData.eventTime);
    form.append('itemCategory', formData.itemCategory);
    form.append('note', formData.note);
    form.append('amount', rawAmount);
    if (formData.proof) form.append('proof', formData.proof);
    form.append(
      'participants',
      formData.participants === 'all' ? 'all' : JSON.stringify(selectedParticipants)
    );

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/payments`, form, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setFormData({ eventTime: getTodayDateTime(), itemCategory: '', note: '', amount: '', proof: null, participants: 'all' }); // Reset về hôm nay
      setRawAmount('');
      setPreviewUrl(null);
      setSuggestions([]);
      setSelectedParticipants([]);
      fetchData();
      // setActivity(`Added payment: ${formData.itemCategory}`);
      setNotification('Thêm khoản thanh toán thành công');
    } catch (err) {
      setError('Error adding payment');
      setNotification('Lỗi khi thêm');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">Thêm khoản tiền</h3>
      {error && (
        <p className="text-red-600 bg-red-50 p-3 rounded-md mb-6 text-center font-medium">{error}</p>
      )}
      <div className="space-y-6 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Thời gian sự kiện</label>
          <input
            type="datetime-local"
            value={formData.eventTime}
            onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 text-gray-700 transition-all duration-200"
            required
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {[
              { label: 'Hôm nay', days: 0 },
              { label: '1 ngày trước', days: 1 },
              { label: '2 ngày trước', days: 2 },
              { label: '3 ngày trước', days: 3 },
            ].map(({ label, days }) => (
              <button
                key={days}
                type="button"
                onClick={() => setQuickDate(days)}
                className="px-3 py-1 bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors duration-200 text-sm font-medium"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Danh mục</label>
          <select
            value={formData.itemCategory}
            onChange={(e) => setFormData({ ...formData, itemCategory: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 text-gray-700 transition-all duration-200"
            required
          >
            {itemCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {formData.itemCategory && (
            <div className="animate-slide-down">
              <label className="block text-sm font-medium text-gray-700 mt-3">Ghi chú</label>
              <textarea
                placeholder="Nhập ghi chú (nếu có)"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 text-gray-700 transition-all duration-200 resize-none"
                rows="3"
              />
            </div>
          )}
        </div>

        <div className="space-y-3 relative">
          <label className="block text-sm font-medium text-gray-700">Tổng tiền (VND)</label>
          <input
            type="text"
            placeholder="Nhập số tiền"
            value={formData.amount}
            onChange={handleAmountChange}
            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all duration-200"
            required
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.value)}
                  className="p-2 hover:bg-amber-50 cursor-pointer text-gray-700 text-sm transition-colors duration-200"
                >
                  {suggestion.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Ảnh bằng chứng</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-200 rounded-md text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 transition-all duration-200"
          />
          {previewUrl && (
            <div className="mt-2">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-md shadow-sm"
              />
            </div>
          )}
        </div>

        <div className="space-y-3 sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Chia thanh toán cho</label>
          <select
            value={formData.participants}
            onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
            className="w-full sm:w-1/2 p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 text-gray-700 transition-all duration-200"
          >
            <option value="all">Mọi người</option>
            <option value="custom">Tùy chọn</option>
          </select>
          {formData.participants === 'custom' && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {roomUsers.map((user) => (
                <label key={user} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedParticipants.includes(user)}
                    onChange={() => handleParticipantChange(user)}
                    className="h-4 w-4 text-amber-600 border-gray-200 rounded focus:ring-amber-500"
                  />
                  <span className="text-gray-700 text-sm">{user}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 mt-6 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium transition-all duration-200 transform hover:scale-105"
      >
        Thêm
      </button>
    </form>
  );
};

const styles = `
  @keyframes slide-down {
    0% { opacity: 0; transform: translateY(-10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-slide-down {
    animation: slide-down 0.3s ease-out forwards;
  }
  @media (max-width: 640px) {
    .sm\\:grid-cols-2 {
      grid-template-columns: 1fr;
    }
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default PaymentForm;