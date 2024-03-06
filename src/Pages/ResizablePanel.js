import React from 'react';
import { PanelResizeHandle } from 'react-resizable-panels';
import styles from './styles.module.css';

export default function ResizeHandle({ className = '', id }) {
  return (
    <PanelResizeHandle
      className={[styles.ResizeHandleOuter, className].join(' ')}
      id={id}
      style={{ backgroundColor: 'rgba(169, 169, 169, 0.2)', marginLeft: '10px', marginRight: '10px' }}    
      >
      <div className={styles.ResizeHandleInner}>
        <svg className={styles.Icon} viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M21,9L17,5V8H10V10H17V13M7,11L3,15L7,19V16H14V14H7V11Z"/>
        </svg>
      </div>
    </PanelResizeHandle>
  );
}