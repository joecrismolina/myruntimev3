import React from 'react';
import FloatingNavItem from './FloatingNavItem/FloatingNavItem';
import styles from './FloatingNav.css';

const floatingNav = (props) => {
  return (
    <div className={styles.FloatingNav}>
      {
          props.items.map( el => {
            return (
              <FloatingNavItem 
                key={el.item.label}
                active={el.active} 
                label={el.item.label} 
                view={el.item.view}
                clicked={props.clickedHandler}
              />
            )
          })
        }
    </div>
  );
};

export default floatingNav;