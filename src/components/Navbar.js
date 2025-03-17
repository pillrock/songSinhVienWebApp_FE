import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Navbar = () => {
  const { user, setUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isUtilitiesOpen, setIsUtilitiesOpen] = useState(false);
  const [roomName, setRoomName] = useState('Sống Sinh Viên'); // Thêm lại state roomName

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const fetchRoomName = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/room/${user.roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoomName(res.data.room.name || 'Sống Sinh Viên');
      } catch (err) {
        console.error('Error fetching room name:', err);
        setRoomName('Sống Sinh Viên');
      }
    };
    fetchRoomName();
  }, [user]);

  const isActive = (path) => location.pathname === path;

  if (loading) return (
    <div className="bg-white p-4 text-gray-700 text-center font-medium shadow-sm">
      Loading...
    </div>
  );

  return (
    <>
      <nav className="bg-white p-4 text-gray-800 shadow-md fixed w-full top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link 
            to="/" 
            className="text-2xl font-semibold text-amber-600 hover:text-amber-500 transition-colors duration-200"
          >
            {roomName}
          </Link>
          
          <button 
            onClick={toggleMenu} 
            className="text-gray-600 hover:text-gray-800 focus:outline-none md:hidden transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                {/* Menu Tiện ích (Dropdown) */}
                <div 
                  className="relative group"
                  onMouseEnter={() => setIsUtilitiesOpen(true)}
                  onMouseLeave={() => setIsUtilitiesOpen(false)}
                >
                  <span 
                    className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200 cursor-pointer flex items-center"
                  >
                    Tiện ích
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                  <div 
                    className={`absolute left-0 top-3 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 transform transition-all duration-200 ${
                      isUtilitiesOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div className="py-2">
                      <Link 
                        to="/shopping" 
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200 ${
                          isActive('/shopping') ? 'bg-amber-50 text-amber-600 font-semibold' : ''
                        }`}
                      >
                        Nhật ký mua sắm
                      </Link>
                      <Link 
                        to="/scoreboard" 
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200 ${
                          isActive('/scoreboard') ? 'bg-amber-50 text-amber-600 font-semibold' : ''
                        }`}
                      >
                        Tỉ số
                      </Link>
                      {/* Thêm các mục khác ở đây nếu cần */}
                    </div>
                  </div>
                </div>

                <Link 
                  to="/create-room" 
                  className={`text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 relative ${
                    isActive('/create-room') ? 'after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-amber-600' : ''
                  }`}
                >
                  Tạo phòng
                </Link>
                <Link 
                  to="/room-info" 
                  className={`text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 relative ${
                    isActive('/room-info') ? 'after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-amber-600' : ''
                  }`}
                >
                  Thông tin phòng
                </Link>
                <Link 
                  to="/profile" 
                  className={`text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 relative ${
                    isActive('/profile') ? 'after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-amber-600' : ''
                  }`}
                >
                  Thông tin người dùng
                </Link>
                <span className="text-gray-500 font-medium">
                  Xin chào, {user.username} 
                  <span className="text-gray-400"> ({user.role})</span>
                </span>
                {user.role === 'admin' && (
                  <Link 
                    to="/register" 
                    className={`text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 relative ${
                      isActive('/register') ? 'after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-amber-600' : ''
                    }`}
                  >
                    Đăng ký tài khoản
                  </Link>
                )}
                <button 
                  onClick={handleLogout} 
                  className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className={`text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 relative ${
                  isActive('/login') ? 'after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-amber-600' : ''
                }`}
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Menu mobile */}
      <div
        className={`fixed top-0 left-0 h-full bg-white text-gray-800 w-72 transform transition-transform duration-300 ease-in-out z-20 shadow-lg ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Link 
              to="/" 
              className="text-xl font-semibold text-amber-600 hover:text-amber-500 transition-colors duration-200"
              onClick={toggleMenu}
            >
              {roomName}
            </Link>
            <button 
              onClick={toggleMenu} 
              className="text-gray-600 hover:text-gray-800 focus:outline-none transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {user ? (
            <ul className="space-y-6">
              <li>
                <span className="text-gray-600 font-medium text-lg">Tiện ích</span>
                <ul className="mt-2 space-y-2 pl-4">
                  <li>
                    <Link 
                      to="/shopping" 
                      onClick={toggleMenu} 
                      className={`text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 relative ${
                        isActive('/shopping') ? 'before:absolute before:left-[-12px] before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-5 before:bg-amber-600' : ''
                      }`}
                    >
                      Nhật ký mua sắm
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/scoreboard" 
                      onClick={toggleMenu} 
                      className={`text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 relative ${
                        isActive('/scoreboard') ? 'before:absolute before:left-[-12px] before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-5 before:bg-amber-600' : ''
                      }`}
                    >
                      Tỉ số
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link 
                  to="/create-room" 
                  onClick={toggleMenu} 
                  className={`text-gray-600 hover:text-gray-800 font-medium text-lg transition-colors duration-200 relative ${
                    isActive('/create-room') ? 'before:absolute before:left-[-12px] before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-5 before:bg-amber-600' : ''
                  }`}
                >
                  Tạo phòng
                </Link>
              </li>
              <li>
                <Link 
                  to="/room-info" 
                  onClick={toggleMenu} 
                  className={`text-gray-600 hover:text-gray-800 font-medium text-lg transition-colors duration-200 relative ${
                    isActive('/room-info') ? 'before:absolute before:left-[-12px] before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-5 before:bg-amber-600' : ''
                  }`}
                >
                  Thông tin phòng
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  onClick={toggleMenu} 
                  className={`text-gray-600 hover:text-gray-800 font-medium text-lg transition-colors duration-200 relative ${
                    isActive('/profile') ? 'before:absolute before:left-[-12px] before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-5 before:bg-amber-600' : ''
                  }`}
                >
                  Thông tin người dùng
                </Link>
              </li>
              {user.role === 'admin' && (
                <li>
                  <Link 
                    to="/register" 
                    onClick={toggleMenu} 
                    className={`text-gray-600 hover:text-gray-800 font-medium text-lg transition-colors duration-200 relative ${
                      isActive('/register') ? 'before:absolute before:left-[-12px] before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-5 before:bg-amber-600' : ''
                    }`}
                  >
                    Đăng ký người dùng
                  </Link>
                </li>
              )}
              <li>
                <button 
                  onClick={() => { handleLogout(); toggleMenu(); }} 
                  className="bg-amber-600 w-full text-white px-4 py-2 rounded-md hover:bg-amber-700 font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Đăng xuất
                </button>
              </li>
              <li className="text-gray-500 font-medium">
                Xin chào, {user.username} 
                <span className="text-gray-400"> ({user.role})</span>
              </li>
            </ul>
          ) : (
            <Link 
              to="/login" 
              onClick={toggleMenu} 
              className={`text-gray-600 hover:text-gray-800 font-medium text-lg transition-colors duration-200 relative ${
                isActive('/login') ? 'before:absolute before:left-[-12px] before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-5 before:bg-amber-600' : ''
              }`}
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {isOpen && (
        <div 
          onClick={toggleMenu} 
          className="fixed inset-0 bg-gray-800 opacity-40 md:hidden z-10 transition-opacity duration-300"
        />
      )}
    </>
  );
};

export default Navbar;