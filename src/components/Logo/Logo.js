import React from 'react';
import logoImg from '../../assets/images/MyRunTime_headerlogo.png';
import styles from './Logo.css';

const logo = (props) => (
  <div className={styles.Logo}>
    <img src={logoImg} alt="myruntime"/>
  </div>
);

export default logo;