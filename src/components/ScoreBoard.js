import React, { useState, useEffect, useRef } from 'react';

const Scoreboard = () => {
  const [player1, setPlayer1] = useState({ name: 'Người chơi 1', score: 0 });
  const [player2, setPlayer2] = useState({ name: 'Người chơi 2', score: 0 });
  const [targetScore, setTargetScore] = useState(10);
  const [isEditing, setIsEditing] = useState(false);
  const [tempNames, setTempNames] = useState({ player1: '', player2: '' });
  const [winner, setWinner] = useState(null);
  const [showControls, setShowControls] = useState(true); // Toggle hiển thị nút tăng/giảm
  const prevScores = useRef({ player1: 0, player2: 0 });

  useEffect(() => {
    if (player1.score >= targetScore) {
      setWinner(player1.name);
      setShowControls(false); // Ẩn controls khi có người thắng
    } else if (player2.score >= targetScore) {
      setWinner(player2.name);
      setShowControls(false);
    } else {
      setWinner(null);
    }
    prevScores.current = { player1: player1.score, player2: player2.score };
  }, [player1.score, player2.score, targetScore]);

  const handleScoreChange = (player, increment) => {
    if (winner) return;
    if (player === 'player1') {
      setPlayer1((prev) => ({ ...prev, score: Math.max(0, prev.score + increment) }));
    } else {
      setPlayer2((prev) => ({ ...prev, score: Math.max(0, prev.score + increment) }));
    }
  };

  const handleEditNames = () => {
    if (isEditing) {
      setPlayer1((prev) => ({ ...prev, name: tempNames.player1 || prev.name }));
      setPlayer2((prev) => ({ ...prev, name: tempNames.player2 || prev.name }));
    } else {
      setTempNames({ player1: player1.name, player2: player2.name });
    }
    setIsEditing(!isEditing);
  };

  const resetGame = () => {
    setPlayer1((prev) => ({ ...prev, score: 0 }));
    setPlayer2((prev) => ({ ...prev, score: 0 }));
    setWinner(null);
    setShowControls(true); // Hiện lại controls khi reset
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Tỉ số Billiards</h1>

      {/* Form chỉnh sửa (thu nhỏ và toggle) */}
      <div
        className={`w-full max-w-md bg-white p-4 rounded-xl shadow-lg mb-4 transition-all duration-300 ${
          isEditing ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'
        }`}
      >
        <div className="space-y-3">
          <input
            type="text"
            value={tempNames.player1}
            onChange={(e) => setTempNames({ ...tempNames, player1: e.target.value })}
            placeholder="Tên người chơi 1"
            className="w-full p-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 text-gray-700"
          />
          <input
            type="text"
            value={tempNames.player2}
            onChange={(e) => setTempNames({ ...tempNames, player2: e.target.value })}
            placeholder="Tên người chơi 2"
            className="w-full p-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 text-gray-700"
          />
          <input
            type="number"
            value={targetScore}
            onChange={(e) => setTargetScore(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            className="w-full p-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 text-gray-700"
            placeholder="Tỉ số chạm"
          />
          <button
            onClick={handleEditNames}
            className="w-full bg-amber-600 text-white p-2 text-sm rounded-md hover:bg-amber-700 transition-all duration-200"
          >
            Lưu
          </button>
        </div>
      </div>

      {!isEditing && (
        <button
          onClick={handleEditNames}
          className="bg-amber-600 text-white px-3 py-1 text-sm rounded-md hover:bg-amber-700 mb-4 transition-all duration-200"
        >
          Chỉnh sửa
        </button>
      )}

      {/* Bảng tỉ số */}
      <div className="w-full max-w-4xl flex justify-between items-center gap-6">
        {/* Player 1 */}
        <div className="flex-1 bg-white p-4 rounded-xl shadow-lg text-center transition-all duration-300 hover:shadow-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{player1.name}</h2>
          <div className="relative h-32 flex items-center justify-center overflow-hidden">
            <span
              key={player1.score}
              className="text-8xl font-bold text-amber-600 animate-slide-up"
            >
              {player1.score}
            </span>
          </div>
          {showControls && (
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleScoreChange('player1', 1)}
                className="bg-green-600 text-white px-3 py-1 text-sm rounded-md hover:bg-green-700 transition-all duration-200"
              >
                +1
              </button>
              <button
                onClick={() => handleScoreChange('player1', -1)}
                className="bg-red-600 text-white px-3 py-1 text-sm rounded-md hover:bg-red-700 transition-all duration-200"
              >
                -1
              </button>
            </div>
          )}
        </div>

        {/* Tỉ số chạm */}
        <div className="flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-500">/</span>
          <span className="text-xl font-medium text-gray-600 ml-2">{targetScore}</span>
        </div>

        {/* Player 2 */}
        <div className="flex-1 bg-white p-4 rounded-xl shadow-lg text-center transition-all duration-300 hover:shadow-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{player2.name}</h2>
          <div className="relative h-32 flex items-center justify-center overflow-hidden">
            <span
              key={player2.score}
              className="text-8xl font-bold text-amber-600 animate-slide-up"
            >
              {player2.score}
            </span>
          </div>
          {showControls && (
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleScoreChange('player2', 1)}
                className="bg-green-600 text-white px-3 py-1 text-sm rounded-md hover:bg-green-700 transition-all duration-200"
              >
                +1
              </button>
              <button
                onClick={() => handleScoreChange('player2', -1)}
                className="bg-red-600 text-white px-3 py-1 text-sm rounded-md hover:bg-red-700 transition-all duration-200"
              >
                -1
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Thông báo người thắng */}
      {winner && (
        <div className="mt-6 bg-green-100 p-3 rounded-xl shadow-md animate-fade-in">
          <p className="text-lg font-semibold text-green-800">
            {winner} đã chiến thắng với {targetScore} điểm!
          </p>
        </div>
      )}

      {/* Nút Reset */}
      <button
        onClick={resetGame}
        className="mt-4 bg-gray-600 text-white px-4 py-2 text-sm rounded-md hover:bg-gray-700 transition-all duration-200"
      >
        Chơi lại
      </button>
    </div>
  );
};

// Thêm keyframes cho hiệu ứng
const styles = `
  @keyframes slide-up {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  .animate-slide-up {
    animation: slide-up 0.3s ease-out forwards;
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default Scoreboard;