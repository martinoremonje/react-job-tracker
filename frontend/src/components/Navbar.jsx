import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const Navbar = () => {
  const { isSignedIn, signOut } = useAuth();

  return (
    <nav className="bg-gray-800 py-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-white text-xl font-bold">
          JobTracker
        </Link>

        {/* Links */}
        <div className="space-x-4">
          <Link to="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          {!isSignedIn && (
            <>
              <Link to="/register" className="text-gray-300 hover:text-white">
                Register
              </Link>
              <Link to="/login" className="text-gray-300 hover:text-white">
                Login
              </Link>
            </>
          )}
          {isSignedIn && (
              
              <>
              <Link to="/form" className="text-gray-300 hover:text-white">
                Form
              </Link>
            <button
              onClick={() => signOut(() => '/')} // Redirige a la home después de cerrar sesión
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign Out
            </button>
              </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;