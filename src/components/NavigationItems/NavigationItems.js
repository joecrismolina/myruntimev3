import React from 'react';
import styles from './NavigationItems.css'
import NavigationItem from './NavigationItem/NavigationItem'

const navigationItems = (props) => (
    <ul className={styles.NavigationItems}>
      {
        props.navLinks.map(el => {
          return (
            <NavigationItem
              key={el.label}
              closed={props.closed}
              link={el.link}
              active={el.active}>
              {el.label}
            </NavigationItem>
          );
        })
      }
    </ul>
);

export default navigationItems;