import React from 'react';
import styles from './BreadScrumb.module.scss'
export default function BreadScrumb({list=[]}) {
  return <div className={styles.container}>
      <li>Trang chủ</li>
      {list.map(e=><li key={e.id}>{e.name}</li>)}
  </div>;
}
