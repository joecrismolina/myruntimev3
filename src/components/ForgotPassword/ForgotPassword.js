import React, { Component } from 'react';
import styles from './ForgotPassword.css';

class ForgotPassword extends Component {

  state = {
    loading : false,
    email : '',
    validForm : false,
  }

  checkFormValidity = (newState) => {
    let isValid = true;
    isValid = newState.email.trim() !== '' && this.validateEmail(newState.email);
    return isValid;
  }

  validateEmail = (email) => {
    var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
    return pattern.test(email);
  }

  inputChangedHandler = (event, input) => {
    let newState = { ...this.state };
    newState[input] = event.target.value;
    const isValidForm = this.checkFormValidity(newState);
    newState.validForm = isValidForm;
    this.setState({...newState});
  }

  render () {
    return (
      <div className={styles.ForgotPasswordContainer}>
        <div className={styles.ForgotPasswordLabel}>Password reset request</div>
        <input className={styles.ForgotPasswordInput} type="email" placeholder="email" value={this.state.email} onChange={(event) => this.inputChangedHandler(event, 'email')}/>
        <button className={styles.ForgotPasswordSubmitButton} disabled={!this.state.validForm} onClick={() => this.props.onSubmit(this.state.email)}>SUBMIT</button>
      </div>
    );
  }
};

export default ForgotPassword;