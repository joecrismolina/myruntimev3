import React from 'react';
import styles from './NavigationItem.css'
import { NavLink } from 'react-router-dom';

const navigationItem = (props) => (
  <li className={styles.NavigationItem}>
    <NavLink 
      to={props.link}
      onClick={props.closed}
      className={props.active ? styles.active : null}
    >{props.children}</NavLink>
  </li>
);

export default navigationItem;