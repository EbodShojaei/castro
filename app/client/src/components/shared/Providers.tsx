'use client';

import { ReactNode, useEffect, useState } from 'react';
import MetaMaskCheck from '@/components/shared/MetaMaskCheck';
import styles from '@/styles/utils.module.css';

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <div className={mounted ? styles.visibleMount : styles.hiddenMount}>
      <MetaMaskCheck>{children}</MetaMaskCheck>
    </div>
  );
}
