import React from 'react';
import styles from './MobileNavs.css';
import MobileNavItem from './MobileNavItem/MobileNavItem';

const mobileNav  = (props) => {
  return (
    <div className={styles.MobileNav}>
      <nav>
        <ul>
          {
            props.items.map(el => {
              return (
                <MobileNavItem
                  key={el.label} 
                  link={el.link}
                  active={el.active}>
                  {el.label}
                </MobileNavItem>
              );
            })
          }
        </ul>
      </nav>
    </div>
  );
}

export default mobileNav;