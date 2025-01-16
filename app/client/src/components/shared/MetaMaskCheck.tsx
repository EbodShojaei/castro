'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/utils.module.css';

export default function MetaMaskCheck({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setIsMetaMaskInstalled(!!window.ethereum);
    }
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return <div className={styles.hiddenMount}>{children}</div>;
  }

  if (!isMetaMaskInstalled) {
    return (
      <div className={styles.loadingContainer}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">MetaMask Required</h1>
          <p className="mb-4">
            Please install MetaMask to use this application.
          </p>
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Install MetaMask
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
