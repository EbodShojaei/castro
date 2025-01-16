'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import WalletButton from '../WalletButton';

const Navbar: React.FC = () => {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push('/');
  };

  return (
    <nav className="nav w-full bg-gray-800 p-4 flex justify-between items-center">
      <div className="ml-10">
        <div className="cursor-pointer" onClick={handleHomeClick}>
          <img
            src="/android-chrome-192x192.png"
            alt="Castro Chat Icon"
            className="h-12 w-12 object-contain"
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <WalletButton />
      </div>
    </nav>
  );
};

export default Navbar;
