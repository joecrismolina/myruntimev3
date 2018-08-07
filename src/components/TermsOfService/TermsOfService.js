import React from 'react';
import styles from './TermsOfService.css';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Footer from '../Footer/Footer';

const TermsOfService = (props) => {
  return(
    <Aux>
      <div className={styles.TosMainContainer}>
        <div className={styles.TosContainer} style={{margin: '50px 0'}}>
          <h1>MyRunTime Terms of Service</h1>
          <p>These Terms of Service ("Terms") govern your access to and use of MyRunTime services.</p>
          <p>These services may include but are not limited to websites, APIs, photos, emails and SMS notifications, commerce services and applications.</p>
          <p>By using these services you agree to be bound by these Terms.</p>
        </div>
        <div className={styles.TosContainer}>
          <h2>Who may use MyRunTime and its services?</h2>
          <p>You may use the services only if you agree to form a binding contract with MyRunTime and are not a person barred from receiving services under the laws of the applicable jurisdiction.</p>
          <p>In addition, you must be at least 18 years old to create a MyRunTime personal account.</p>
          <p>By creating a MyRunTime account, you confirm that you are at least 18 years old.</p>
        </div>
        <div className={styles.TosContainer}>
          <h2>Privacy policy</h2>
          <p>MyRunTime information such as race results, race details and race photos are publicly viewable.</p>
          <p>All information you share with us by creating a MyRunTime account will not be shared to third-party affiliates without your consent.</p>
        </div>
        <div className={styles.TosContainer}>  
          <h2>Ending these terms</h2>
          <p>You may terminate your legal agreement with MyRunTime by deleting your account any time and discontinuing your use of MyRunTime services.</p>
          <p>If you wish to do so, inform MyRunTime by sending an email to <b>feedback@myruntime.com</b> experessing your intent to delete your account.</p>
          <p>Upon successful deletion of your account, all information you have shared and published with MyRunTime will be permanently deleted.</p>
        </div>
        <div className={styles.TosContainer}>
          <h2>MyRunTime terms of cookie use</h2>
          <p>MyRunTime services uses cookies and other similar technologies such as local storage to help provide users with a better and safer experience.</p>
          <p>Some of the ways our services use cookies are logging you in, usage in APIs and providing a way to show users more relevant ads.</p>
        </div>
        <div className={styles.TosContainer}>
          <h2>General</h2>
          <p>MyRunTime reserves the right to revise these terms of services from time to time.</p>
          <p>Revisions and updates to these terms of services will be communicated to the users via email notifications and website notifications.</p>
          <p>By continuing to access MyRunTime and its services, you agree to be bound by the revised terms of services.</p>
        </div>
      </div>
      <Footer />
    </Aux>
  )
};

export default TermsOfService;