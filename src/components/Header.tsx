import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Menu, 
  X, 
  Home, 
  BarChart2, 
  Users, 
  Award, 
  User,
  LogOut
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currentUser } from '../data/mockData';
import SearchBar from './SearchBar';
import { supabase } from "../services/supabaseClient"; 

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  // Handle clicking outside avatar menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 mr-2 text-blue-600">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span className="text-xl font-bold">PulseTrack</span>
          </Link>
        </div>

        {/* Middle: Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <nav>
            <ul className="flex space-x-6">
              <li><Link to="/" className={`${isActive('/') ? 'text-gray-800 font-medium' : 'text-gray-500'} hover:text-blue-600`}>Dashboard</Link></li>
              <li><Link to="/workouts" className={`${isActive('/workouts') ? 'text-gray-800 font-medium' : 'text-gray-500'} hover:text-blue-600`}>My Workouts</Link></li>
              <li><Link to="/challenges" className={`${isActive('/challenges') ? 'text-gray-800 font-medium' : 'text-gray-500'} hover:text-blue-600`}>Challenges</Link></li>
              <li><Link to="/friends" className={`${isActive('/friends') ? 'text-gray-800 font-medium' : 'text-gray-500'} hover:text-blue-600`}>Friends</Link></li>
            </ul>
          </nav>
        </div>

        {/* Right: Avatar, Notifications, etc. */}
        <div className="flex items-center space-x-4">
          <div className="relative w-64 hidden md:block"><SearchBar /></div>
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"><Bell size={20} /></button>
          
          {/* Avatar and Dropdown */}
          <div className="relative" ref={avatarRef}>
            <button onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}>
              <Avatar className="h-8 w-8 border border-gray-200 cursor-pointer">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.charAt(0)}{currentUser.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
              </Avatar>
            </button>
            {avatarMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-50">
                <button 
                  onClick={handleLogout} 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>

          <button 
            className="md:hidden p-2 text-gray-500 hover:text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="p-4"><SearchBar /></div>
          <nav className="px-4 py-3">
            <ul className="space-y-3">
              <li className="flex items-center py-2"><Home size={18} className={`mr-3 ${isActive('/') ? 'text-blue-600' : 'text-gray-500'}`} /><Link to="/" className={`${isActive('/') ? 'text-gray-800 font-medium' : 'text-gray-700'}`}>Dashboard</Link></li>
              <li className="flex items-center py-2"><BarChart2 size={18} className={`mr-3 ${isActive('/workouts') ? 'text-blue-600' : 'text-gray-500'}`} /><Link to="/workouts" className={`${isActive('/workouts') ? 'text-gray-800 font-medium' : 'text-gray-700'}`}>My Workouts</Link></li>
              <li className="flex items-center py-2"><Award size={18} className={`mr-3 ${isActive('/challenges') ? 'text-blue-600' : 'text-gray-500'}`} /><Link to="/challenges" className={`${isActive('/challenges') ? 'text-gray-800 font-medium' : 'text-gray-700'}`}>Challenges</Link></li>
              <li className="flex items-center py-2"><Users size={18} className={`mr-3 ${isActive('/friends') ? 'text-blue-600' : 'text-gray-500'}`} /><Link to="/friends" className={`${isActive('/friends') ? 'text-gray-800 font-medium' : 'text-gray-700'}`}>Friends</Link></li>
              <li className="border-t border-gray-100 mt-2 pt-2 flex items-center py-2"><User size={18} className="mr-3 text-gray-500" /><Link to="/profile" className="text-gray-700">Profile</Link></li>
              <li className="flex items-center py-2"><LogOut size={18} className="mr-3 text-gray-500" /><button onClick={handleLogout} className="text-gray-700">Logout</button></li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
