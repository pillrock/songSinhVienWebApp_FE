import React, { useContext, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PaymentTable from '../components/PaymentTable';
import SummaryTable from '../components/SummaryTable';
import PaymentForm from '../components/PaymentForm';
import SettlementForm from '../components/SettlementForm';
import RecentActivity from '../components/RecentActivity';
import Notification from '../components/Notification';
import { AuthContext } from '../context/AuthContext';
import Profile from '../components/Profile';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [activity, setActivity] = React.useState('');
  const [notification, setNotification] = React.useState('');

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/payments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  };

  const { data, error: queryError, refetch } = useQuery({
    queryKey: ['payments'],
    queryFn: fetchData,
  });

  useEffect(() => {
    if (queryError) {
      setNotification(`Lỗi tải dữ liệu: ${queryError.response?.data?.message || 'Unknown error'}`);
    }
  }, [queryError]);

  if (!user?.roomId) return <Navigate to="/room-selection" />;

  const payments = data?.payments || [];
  const settlements = data?.settlements || [];

  const handleDelete = async (paymentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotification('Xóa khoản thanh toán thành công');
      refetch(); // Tải lại danh sách payments
    } catch (err) {
      setNotification(`Lỗi khi xóa: ${err.response?.data?.message || 'Unknown error'}`);
    }
  };

  const handleReset = async () => {
    if (user.role !== 'admin') {
      setNotification('Chỉ admin mới có quyền reset dữ liệu');
      return;
    }
    if (!window.confirm('Bạn có chắc chắn muốn reset dữ liệu tháng này?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/reset/reset`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivity('Đã reset dữ liệu tháng');
      setNotification('Reset dữ liệu thành công');
      refetch();
    } catch (err) {
      setNotification('Không thể reset dữ liệu');
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Thêm khoản chi tiêu</h2>
          <PaymentForm fetchData={refetch} setActivity={setActivity} setNotification={setNotification} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Thanh toán tháng</h2>
          <SettlementForm
            settlements={settlements}
            fetchData={refetch}
            user={user}
            setActivity={setActivity}
            setNotification={setNotification}
          />
        </section>

        <section className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Chi tiết khoản mua</h2>
          <PaymentTable
            payments={payments}
            currentUser={user.username} // Truyền username từ AuthContext
            onDelete={handleDelete} // Truyền hàm xóa
          />
        </section>

        <section className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Tổng kết tháng</h2>
          <SummaryTable settlements={settlements} />
        </section>

        {user?.role === 'admin' && (
          <section className="md:col-span-2">
            <button
              onClick={handleReset}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
            >
              Reset Data
            </button>
          </section>
        )}
      </div>
      <Notification newNotification={notification} />
    </div>
  );
};

export default Dashboard;