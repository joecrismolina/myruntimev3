import React, { Component } from 'react';
import Spinner from '../../ui/Spinner/Spinner';
import Modal from '../../ui/Modal/Modal';
import styles from './Signup.css';
import serverReq from '../../http/serverAxios';

class Signup extends Component {
  
  state = {
    validForm : false,
    loading : false,
    firstName : '',
    lastName : '',
    email : '',
    birthdate : '',
    password : '',
    confirmPassword : '',
    gender : 'MALE',
    showModal : false,
    modalTitle : '',
    modalMessage : '',
    eulaAccepted : true,
    showPassword : false
  }

  checkFormValidity = (newState) => {
    let isValid = true;

    isValid = isValid && newState.lastName.trim() !== '' && newState.firstName.trim() !== ''
              && newState.email.trim() !== '' && newState.password.trim() !== '' && newState.confirmPassword.trim() !== '';
    isValid = isValid && (newState.birthdate !== null);
    isValid = isValid && (newState.password === newState.confirmPassword);
    isValid = isValid && this.validateEmail(newState.email);

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

  formSubmitHandler = () => {
    this.setState({loading: true});
    const data = {...this.state};
    serverReq.post('/api/account/signup', data, {
        headers : { 
          "Content-Type": "application/json"
        }
      })
      .then( resp => {
        this.setState({loading: false});
        if(resp.data.status === 'error') {
          this.setState({showModal: true, modalTitle: 'Ooops', modalMessage: resp.data.error});
        }
        else{
          this.setState({
            showModal: true, modalTitle: 'Thanks!', 
            modalMessage: 'Check your email to verify and activate your MyRunTime account',
            firstName : '',
            lastName : '',
            email : '',
            birthdate : '',
            password : '',
            confirmPassword : '',
            gender : 'MALE',
            showPassword : false
          });
        }
      })
      .catch( err => {
        this.setState({loading: false});
      });
  }

  hideModal = () => {
    this.setState({showModal: false});
  }

  togglePasswordView = () => {
    this.setState({showPassword: !this.state.showPassword});
  }

  render () {
    let passwordInputType = 'password'
    if (this.state.showPassword) passwordInputType = 'text';
    return (
      <div className={styles.Signup}>
        <Spinner loading={this.state.loading} />
        <Modal title={this.state.modalTitle} show={this.state.showModal} modalClosed={this.hideModal}>
          <p style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0', fontFamily:'inherit', fontSize:'1.0em'}}>{this.state.modalMessage}</p>
        </Modal>
        <div className={styles.InputGroup}>
          <label>first name</label>
          <input type="text" value={this.state.firstName} onChange={(event) => this.inputChangedHandler(event, 'firstName')}/>
        </div>
        <div className={styles.InputGroup}>
          <label>last name</label>
          <input type="text" value={this.state.lastName} onChange={(event) => this.inputChangedHandler(event, 'lastName')}/>
        </div>
        <div className={styles.InputGroup}>
          <label>gender</label>
          <select className={styles.InputSelect} value={this.state.gender} onChange={(event) => this.inputChangedHandler(event, 'gender')}>
            <option value='MALE'>MALE</option>
            <option value='FEMALE'>FEMALE</option>
          </select>
        </div>
        <div className={styles.InputGroup}>
          <label>email</label>
          <input type="email" value={this.state.email} onChange={(event) => this.inputChangedHandler(event, 'email')}/>
        </div>
        <div className={styles.InputGroup}>
          <label>birthdate</label>
          <input type="date" value={this.state.birthdate} onChange={(event) => this.inputChangedHandler(event, 'birthdate')}/>
        </div>
        <div className={styles.InputGroup}>
          <label>password</label>
          <input type={passwordInputType} value={this.state.password} onChange={(event) => this.inputChangedHandler(event, 'password')}/>
          <label className={styles.TogglePasswordView} onClick={this.togglePasswordView}>{this.state.showPassword ? 'hide' : 'show'}</label>
        </div>
        <div className={styles.InputGroup}>
          <label>re-type password</label>
          <input type={passwordInputType} value={this.state.confirmPassword} onChange={(event) => this.inputChangedHandler(event, 'confirmPassword')}/>
          <label className={styles.TogglePasswordView} onClick={this.togglePasswordView}>{this.state.showPassword ? 'hide' : 'show'}</label>
        </div>
        <button className={styles.SubmitButton} disabled={!this.state.validForm} onClick={this.formSubmitHandler}> Submit </button>
        <div className={styles.Eula}>
          By signing up, you agree to the <a href='/tos'>Terms of Service</a> and <a href='/tos'>Privacy Policy</a>, including <a href='/tos'>Cookie Use</a>.
        </div>
      </div>
    );
  }
};

export default Signup;