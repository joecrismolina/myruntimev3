import React from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Backdrop from '../../ui/Backdrop/Backdrop'
import styles from './MobileFilter.css';

const mobileFilters = (props) => {

  let attachedClasses = [styles.MobileFilter, styles.Close];
  if (props.open) {
    attachedClasses = [styles.MobileFilter, styles.Open];
  }

  return (
    <Aux>
      <Backdrop clicked={props.closed} show={props.open}/>
      <div className={attachedClasses.join(' ')}>
        {props.children}
      </div>
    </Aux>
  );
};

export default mobileFilters;