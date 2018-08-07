import React, { Component } from 'react';
import BottomNavItem from './BottomNavItem/BottomNavItem';
import styles from './BottomNav.css';

class BottomNav extends Component {

  render () {
    return (
      <div className={styles.BottomNav}>
        {
          this.props.items.map( el => {
            return (
              <BottomNavItem 
                key={el.item.label}
                active={el.active} 
                label={el.item.label} 
                icon={el.item.icon}
                view={el.item.view}
                clicked={this.props.clickedHandler}
              />
            )
          })
        }
      </div>
    );
  }
};

export default BottomNav;