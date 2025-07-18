
import { Link, useLocation } from 'react-router-dom';
import { PawPrint, Home } from 'lucide-react';

const AppSwitcher = () => {
  const location = useLocation();
  const isApp = location.pathname.startsWith('/app');

  const targetPath = isApp ? '/' : '/app';
  const buttonText = isApp ? '견종 백과로' : 'My 앱으로';
  const Icon = isApp ? Home : PawPrint;

  return (
    <Link
      to={targetPath}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-48 h-16 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 text-white font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-pink-300"
    >
      <Icon className="h-6 w-6 mr-3" />
      <span className="text-lg">{buttonText}</span>
    </Link>
  );
};

export default AppSwitcher;
