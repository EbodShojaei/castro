'use client';

import { useEffect, useState, type ReactNode } from 'react';
import styles from '@/styles/utils.module.css';

export default function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <div className={mounted ? styles.visibleMount : styles.hiddenMount}>
      {children}
    </div>
  );
}
