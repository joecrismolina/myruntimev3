import React from 'react';
import styles from './Spinner.css';

const spinner = (props) => {
  let spinner = null; 
  if(props.loading){
    spinner = (
      <div className={styles.LoaderContainer}>
        <div className={styles.Loader}>Loading...</div>
      </div>
    );
  }

  return (
    spinner
  );
};

export default spinner;