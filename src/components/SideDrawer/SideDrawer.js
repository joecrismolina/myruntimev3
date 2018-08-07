import React from 'react';
import NavigationItems from '../NavigationItems/NavigationItems';
import styles from './SideDrawer.css'
import Backdrop from '../../ui/Backdrop/Backdrop'
import Aux from '../../hoc/Auxiliary/Auxiliary';

const sideDrawer = (props) => {

  let attachedClasses = [styles.SideDrawer, styles.Close];
  if (props.open) {
    attachedClasses = [styles.SideDrawer, styles.Open];
  }

  return (
    <Aux>
      <Backdrop clicked={props.closed} show={props.open}/>
      <div className={attachedClasses.join(' ')}>
        <nav>
          <NavigationItems navLinks={props.navLinks} closed={props.closed}/>
        </nav>
        <div className={styles.Footer}>
          <p>MYRUNTIME (c) 2018</p>
        </div>
      </div>
    </Aux>
  );
};

export default sideDrawer;