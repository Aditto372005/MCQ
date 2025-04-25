import React from 'react';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
  isAdmin?: boolean;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "উচ্চতর গনিত MCQ পরীক্ষা", 
  showLogo = true,
  isAdmin = false,
  onLogout
}) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {showLogo && (
            <BookOpen className="h-8 w-8 text-white" />
          )}
          
          <h1 className="text-xl font-bold">
            <Link to="/" className="hover:text-blue-100 transition-colors">
              {title}
            </Link>
          </h1>
        </div>
        
        {isAdmin && onLogout && (
          <div>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded bg-white text-blue-600 font-medium hover:bg-blue-50 transition-colors"
            >
              লগআউট
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
