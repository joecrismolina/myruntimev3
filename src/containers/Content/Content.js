import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import styles from './Content.css';
import Card from '../../ui/Card/Card';

class Content extends Component {

  state = {
    authenticatedUser : null
  }

  componentDidMount () {

  }

  render () {

    const cardImage = 'https://3058b00f7de5d80b2563-aab1b1665c18d03bbbf5846be888e985.ssl.cf4.rackcdn.com/images/UnderPantsRun20181519549830076Century%20Tuna%20Superbods%20-%20banner.JPG';
    const title = 'Century Tuna: The Underpants Run 2018';
    const heading1 = 'April 8, 2018';
    const heading2 = 'Filinvest City - Muntinlupa City, Metro Manila';

    return (
      <Aux>
        <div className={styles.Content}>
          <Card cardImage={cardImage} title={title} heading1={heading1} heading2={heading2}/>
          <Card cardImage={cardImage} title={title} heading1={heading1} heading2={heading2}/>
          <Card cardImage={cardImage} title={title} heading1={heading1} heading2={heading2}/>
          <Card cardImage={cardImage} title={title} heading1={heading1} heading2={heading2}/>
          <Card cardImage={cardImage} title={title} heading1={heading1} heading2={heading2}/>
          <Card cardImage={cardImage} title={title} heading1={heading1} heading2={heading2}/>
        </div>
      </Aux>
    );
  }
};

export default Content;