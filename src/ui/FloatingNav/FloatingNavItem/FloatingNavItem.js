import React from 'react';

import styles from './FloatingNavItem.css';

const floatingNavItem = (props) => {
  let className = [styles.FloatingNavItem]
  
  if(props.active) {
    className.push(styles.Active);
  }

  return (
    <div className={className.join(' ')} onClick={() => props.clicked(props.view)}>
      {props.label}
    </div>
  );
};

export default floatingNavItem;