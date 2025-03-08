import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SettlementForm = ({ settlements, fetchData, user, setActivity, setNotification }) => {
  const [selectedSettlement, setSelectedSettlement] = useState('');
  const [proof, setProof] = useState(null);
  const [error, setError] = useState('');
  const [payerInfo, setPayerInfo] = useState({ stk: '', bank: '' });

  useEffect(() => {
    if (selectedSettlement) {
      const settlement = settlements.find((s) => s._id === selectedSettlement);
      if (settlement) {
        fetchPayerInfo(settlement.payer);
      }
    }
  }, [selectedSettlement, settlements]);

  const fetchPayerInfo = async (username) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayerInfo({ stk: response.data.user.stk || '', bank: response.data.user.bank || '' });
    } catch (err) {
      setError('Lỗi khi lấy thông tin người thanh toán');
      setNotification('Không thể lấy thông tin người thanh toán');
    }
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    const integerNum = Math.floor(Number(num));
    return integerNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSettlement) {
      setError('Vui lòng chọn một khoản thanh toán');
      setNotification('Không thể xác nhận thanh toán: Chưa chọn khoản nào');
      return;
    }

    const form = new FormData();
    if (proof) form.append('proof', proof);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/payments/${selectedSettlement}/pay`,
        form,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      setProof(null);
      setSelectedSettlement('');
      fetchData();
      setActivity(`Đã xác nhận thanh toán cho ID: ${selectedSettlement}`);
      setNotification('Xác nhận thanh toán thành công');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi gửi thanh toán';
      setError(errorMessage);
      setNotification(`Không thể xác nhận thanh toán: ${errorMessage}`);
    }
  };

  const filteredSettlements = settlements.filter((settlement) => {
    if (settlement.payer === user.username) return false;
    const participant = settlement.participants.find((p) => p.username === user.username);
    return participant && !participant.paid && participant.amountOwed > 0;
  });

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
      {error && (
        <p className="text-red-600 bg-red-50 p-3 rounded-md mb-6 text-center font-medium">{error}</p>
      )}
      <div className="space-y-6">
        <select
          value={selectedSettlement}
          onChange={(e) => setSelectedSettlement(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 text-gray-700 transition-all duration-200"
        >
          <option value="">Chọn khoản thanh toán</option>
          {filteredSettlements.length > 0 ? (
            filteredSettlements.map((settlement) => {
              const participant = settlement.participants.find((p) => p.username === user.username);
              return (
                <option key={settlement._id} value={settlement._id}>
                  {settlement.month} - Thanh toán cho {settlement.payer} ({formatNumber(participant.amountOwed)} VND)
                </option>
              );
            })
          ) : (
            <option value="" disabled>Không có khoản thanh toán cần xác nhận</option>
          )}
        </select>
        {selectedSettlement && (
          <div className="p-4 bg-gray-50 rounded-md shadow-sm">
            <p className="text-gray-800 font-medium mb-2">
              Thông tin tài khoản ngân hàng của {settlements.find((s) => s._id === selectedSettlement)?.payer}:
            </p>
            <p className="text-gray-600 text-sm">STK: {payerInfo.stk || 'Chưa cập nhật'}</p>
            <p className="text-gray-600 text-sm">Bank: {payerInfo.bank || 'Chưa cập nhật'}</p>
            <p className="text-gray-600 text-sm mt-2">
              Số tiền cần thanh toán:{' '}
              <span className="font-medium">
                {formatNumber(
                  settlements
                    .find((s) => s._id === selectedSettlement)
                    ?.participants.find((p) => p.username === user.username)?.amountOwed
                )}{' '}
                VND
              </span>
            </p>
          </div>
        )}
        <input
          type="file"
          onChange={(e) => setProof(e.target.files[0])}
          className="w-full p-3 border border-gray-200 rounded-md text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 transition-all duration-200"
        />
        <button
          type="submit"
          className="w-full bg-amber-600 text-white p-3 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium transition-all duration-200 transform hover:scale-105"
        >
          Xác nhận rằng tôi đã thanh toán
        </button>
      </div>
    </form>
  );
};

export default SettlementForm;