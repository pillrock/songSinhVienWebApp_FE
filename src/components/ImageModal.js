import React from 'react';

const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-2xl max-w-4xl w-full mx-4 transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200"
        >
          <span className="text-2xl font-medium">×</span>
        </button>
        <img
          src={imageUrl}
          alt="Enlarged Proof"
          className="w-full max-h-[80vh] object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

export default ImageModal;