import React from 'react';
import styles from './BottomNavItem.css';

const bottomNavItem = (props) => {
  let className = [styles.Item]
  
  if(props.active) {
    className.push(styles.Active);
  }

  return (
    <div className={className.join(' ')} onClick={() => props.clicked(props.view)}>
      <i className="material-icons">{props.icon}</i>
      <p>{props.label}</p>
    </div>
  );
};

export default bottomNavItem;