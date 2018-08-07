import React from 'react';
import styles from './PageNotFound.css'
import Footer from '../../components/Footer/Footer';
import Aux from '../../hoc/Auxiliary/Auxiliary';

const pageNotFound = (props) => {
  return (
    <Aux>
      <div className={styles.PageNotFound}>
        <p>404 : Page not found</p>
      </div>
      <Footer />
    </Aux>
  );
};

export default pageNotFound;