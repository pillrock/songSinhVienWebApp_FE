import React, { useState } from 'react';
import ImageModal from './ImageModal';

const SummaryTable = ({ settlements }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  if (!settlements || !Array.isArray(settlements)) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-lg">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Tháng</th>
              <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Người thanh toán</th>
              <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Tổng số tiền</th>
              <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Chi tiết thanh toán</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500 text-sm">
                Chưa có sẵn
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  const handleImageClick = (proofUrl) => {
    setSelectedImage(proofUrl);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImage('');
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    const integerNum = Math.floor(Number(num));
    return integerNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl shadow-lg">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Tháng</th>
            <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Người thanh toán</th>
            <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Tổng số tiền</th>
            <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Chi tiết thanh toán</th>
          </tr>
        </thead>
        <tbody>
        {settlements.map((settlement) => {
          const debtors = settlement.participants.filter(
            (participant) => participant.username !== settlement.payer && participant.amountOwed > 0
          );

          return (
            <tr key={settlement._id} className="border-b border-gray-100 hover:bg-gray-200 transition-colors duration-200">
              <td className="p-4 text-gray-800 font-medium">{settlement.month}</td>
              <td className="p-4 text-gray-800 font-medium">{settlement.payer}</td>
              <td className="p-4 text-gray-800 font-medium">{formatNumber(settlement.totalAmount)}</td>
              <td className="p-4">
                {debtors.length > 0 ? (
                  debtors.map((participant) => (
                    <div key={participant.username} className="flex items-center space-x-3 mb-3">
                      <span
                        className={`text-sm font-medium ${
                          participant.paid ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {participant.username} nợ {formatNumber(participant.amountOwed)} VND
                        {participant.paid ? ' (Đã thanh toán)' : ' (Chưa thanh toán)'}
                      </span>
                      {/* ... hiển thị proof nếu có ... */}
                    </div>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">Không có người nợ</span>
                )}
              </td>
            </tr>
          );
        })}
        </tbody>
      </table>
      {modalOpen && <ImageModal imageUrl={selectedImage} onClose={handleCloseModal} />}
    </div>
  );
};

export default SummaryTable;