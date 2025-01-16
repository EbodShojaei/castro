'use client';

import React from 'react';
import styles from '@/styles/background.module.css';

const Background: React.FC = () => {
  return (
    <div className={styles.background}>
      <div className="This was one way to render the background 🤢"></div>
    </div>
  );
};

export default Background;
