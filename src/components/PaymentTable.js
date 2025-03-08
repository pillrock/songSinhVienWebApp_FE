import React, { useState } from 'react';
import ImageModal from './ImageModal';

const PaymentTable = ({ payments, currentUser, onDelete }) => { // Thêm currentUser và onDelete vào props
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const handleImageClick = (proofUrl) => {
    setSelectedImage(proofUrl);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImage('');
  };

  const handleDelete = (paymentId) => {
    if (window.confirm('Bạn có chắc muốn xóa khoản thanh toán này?')) {
      onDelete(paymentId); // Gọi hàm onDelete từ props
    }
  };

  const getCategoryLabel = (categoryValue) => {
    const categories = {
      snacks: 'Đồ ăn vặt',
      vegetables: 'Rau',
      meat: 'Thịt',
      household: 'Đồ gia dụng',
      drinks: 'Đồ uống',
      fruits: 'Trái cây',
      electronics: 'Đồ điện tử',
      others: 'Khác',
    };
    return categories[categoryValue] || categoryValue;
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return 'Không có';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatParticipants = (participants) => {
    if (!participants || participants.length === 0) return 'Không có';
    return participants.join(', ');
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl shadow-lg">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Thời gian cập nhật</th>
            <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Thời gian mua hàng</th>
            <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Danh mục (Ghi chú)</th>
            <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Tổng tiền</th>
            <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Ảnh bằng chứng</th>
            <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Người mua</th>
            <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Chia tiền thanh toán với</th>
            <th className="p-4 text-left font-semibold text-sm uppercase tracking-wide">Hành động</th> {/* Cột mới */}
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => {
            const filename = payment.proof ? payment.proof.split('/').pop() : null;
            const proofUrl = filename
              ? `${process.env.REACT_APP_API_URL}/payments/uploads/${filename}`
              : null;

            const isOwner = currentUser === payment.payer; // Kiểm tra người dùng hiện tại có phải payer không

            return (
              <tr
                key={payment._id}
                className="border-b border-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <td className="p-4 text-gray-600 text-sm">{new Date(payment.updateTime).toLocaleString()}</td>
                <td className="p-4 text-gray-600 text-sm">{new Date(payment.eventTime).toLocaleString()}</td>
                <td className="p-4 text-gray-800">
                  <div>
                    <span className="font-medium">{getCategoryLabel(payment.itemCategory)}</span>
                    {payment.note && (
                      <span className="block text-gray-500 text-xs mt-1">({payment.note})</span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-gray-800 font-medium">{formatNumber(payment.amount)}</td>
                <td className="p-4">
                  {proofUrl ? (
                    <img
                      src={proofUrl}
                      alt="Payment Proof"
                      className="w-24 h-24 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity duration-200 shadow-sm"
                      onClick={() => handleImageClick(proofUrl)}
                      onError={(e) => console.log('Error loading image:', proofUrl)}
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">Không có</span>
                  )}
                </td>
                <td className="p-4 text-gray-800 font-medium">{payment.payer}</td>
                <td className="p-4 text-gray-600 text-sm">{formatParticipants(payment.participants)}</td>
                <td className="p-4">
                  {isOwner && (
                    <button
                      onClick={() => handleDelete(payment._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors duration-200"
                    >
                      Xóa
                    </button>
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

export default PaymentTable;