import React, { useState, useEffect, useRef } from 'react';

const Notification = ({ newNotification }) => {
  const [notifications, setNotifications] = useState([]); // Danh sách thông báo trong localStorage
  const [toasts, setToasts] = useState([]); // Danh sách toast đang hiển thị
  const prevNotificationRef = useRef(null); // Theo dõi giá trị trước đó của newNotification

  // Load notifications từ localStorage khi component mount
  // useEffect(() => {
  //   const storedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
  //   setNotifications(storedNotifications);
  // }, []);

  // Xử lý khi có thông báo mới
  useEffect(() => {
    // Chỉ chạy nếu newNotification thay đổi và khác giá trị trước đó
    if (newNotification && newNotification !== prevNotificationRef.current) {
      const newToast = {
        id: Date.now(),
        message: newNotification,
        timestamp: new Date().toLocaleString(),
      };

      // Cập nhật danh sách notifications trong localStorage
      const newNotifications = [newToast, ...notifications].slice(0, 5);
      setNotifications(newNotifications);
      localStorage.setItem('notifications', JSON.stringify(newNotifications));

      // Thêm toast mới vào danh sách hiển thị
      setToasts((prevToasts) => [...prevToasts, newToast]);

      // Tự động xóa toast sau 3 giây
      const timer = setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== newToast.id));
      }, 3000);

      // Cập nhật giá trị trước đó
      prevNotificationRef.current = newNotification;

      // Cleanup timer khi component unmount
      return () => clearTimeout(timer);
    }
  }, [newNotification]); // Chỉ theo dõi newNotification

  const handleCloseToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <div className="relative">
      {/* Toast thông báo mờ giữa màn hình */}
      {toasts.length > 0 && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-50 pointer-events-none space-y-4">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-md w-full mx-4 animate-fade-in-out pointer-events-auto"
            >
              <div className="flex justify-between items-center">
                <span>{toast.message}</span>
                <button
                  onClick={() => handleCloseToast(toast.id)}
                  className="text-white hover:text-gray-300 ml-4"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Thêm keyframes cho hiệu ứng fade in/out
const styles = `
  @keyframes fade-in-out {
    0% { opacity: 0; transform: translateY(20px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(20px); }
  }
  .animate-fade-in-out {
    animation: fade-in-out 3s ease-in-out forwards;
  }
`;

// Thêm style vào document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default Notification;