import React from 'react';
import styles from './MobileNavItem.css';
import { NavLink } from 'react-router-dom';

const mobileNavItem = (props) => {
  return (
    <li className={styles.MobileNavItem}>
      <NavLink 
        to={props.link}
        className={props.active ? styles.active : null}
      >{props.children}</NavLink>
    </li>
  );
};

export default mobileNavItem;