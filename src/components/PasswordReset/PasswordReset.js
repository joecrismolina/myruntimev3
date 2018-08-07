import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Spinner from '../../ui/Spinner/Spinner';
import Modal from '../../ui/Modal/Modal';
import serverReq from '../../http/serverAxios';
import styles from './PasswordReset.css';

class PasswordReset extends Component {

  state = {
    showPassword : false,
    password : '',
    confirmPassword : '',
    token : '',
    loading : false,
    showModal: false
  }

  componentDidMount () {
    const query = new URLSearchParams(this.props.location.search);
    let token = '';
    for (let param of query.entries()) {
      if(param[0] === 'token') token = param[1];
    }
    if(token === ''){
      this.props.history.replace('/');
    }
    else{
      this.setState({token: token});
    }
  }

  checkFormValidity = (newState) => {
    let isValid = true;
    isValid = newState.password.trim() !== '' && newState.confirmPassword.trim() !== '';
    isValid = isValid && (newState.password === newState.confirmPassword);
    return isValid;
  }

  inputChangedHandler = (event, input) => {
    let newState = { ...this.state };
    newState[input] = event.target.value;
    const isValidForm = this.checkFormValidity(newState);
    newState.validForm = isValidForm;
    this.setState({...newState});
  }

  togglePasswordView = () => {
    this.setState({showPassword: !this.state.showPassword});
  }

  formSubmitHandler = () => {
    this.setState({loading: true});
    const data = {...this.state};
    serverReq.post('/api/account/passwordreset', data, {
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
            showModal: true, modalTitle: 'Gotcha!', 
            modalMessage: 'Now try logging in using your new password',
            password : '',
            confirmPassword : '',
            showPassword : false,
            loading: false,
            token: ''
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

  render () {
    let passwordInputType = 'password'
    if (this.state.showPassword) passwordInputType = 'text';
    return (
      <Aux>
        <Spinner loading={this.state.loading} />
        <Modal title={this.state.modalTitle} show={this.state.showModal} modalClosed={this.hideModal}>
          <p style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0', fontSize: '1.2em'}}>{this.state.modalMessage}</p>
        </Modal>
        <div className={styles.PasswordResetContainer}>
          <div className={styles.PasswordResetContainerLabel}>Input New Password</div>
          <div className={styles.PasswordResetInputGroup}>
            <label>password</label>
            <input type={passwordInputType} value={this.state.password} onChange={(event) => this.inputChangedHandler(event, 'password')}/>
            <label className={styles.PasswordResetTogglePasswordLabel} onClick={this.togglePasswordView}>{this.state.showPassword ? 'hide' : 'show'}</label>
          </div>
          <div className={styles.PasswordResetInputGroup}>
            <label>re-type password</label>
            <input type={passwordInputType} value={this.state.confirmPassword} onChange={(event) => this.inputChangedHandler(event, 'confirmPassword')}/>
            <label className={styles.PasswordResetTogglePasswordLabel} onClick={this.togglePasswordView}>{this.state.showPassword ? 'hide' : 'show'}</label>
          </div>
          <button className={styles.PasswordResetSubmitButton} disabled={!this.state.validForm} onClick={this.formSubmitHandler}> Submit </button>
        </div>
      </Aux> 
    )
  }
};

export default PasswordReset;