import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './Login.css';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Spinner from '../../ui/Spinner/Spinner';
import Modal from '../../ui/Modal/Modal';
import fbLoginButton from '../../assets/images/facebookLogin.png';
import Footer from '../Footer/Footer';
import ForgotPassword from '../../components/ForgotPassword/ForgotPassword';
import * as actionTypes from '../../store/actions';
import serverReq from '../../http/serverAxios';
import * as endpointUrls from '../../http/endpointUrls';

class Login extends Component {

  state = {
    username : '',
    password : '',
    validForm : false,
    showPassword: false,
    loading: true,
    showModal : false,
    modalTitle : '',
    modalMessage : '',
    redirectedFrom : '',
    showForgotPasswordModal : false
  }

  componentWillMount () { }

  componentDidMount () {
    let redirectedFrom = '';
    const query = new URLSearchParams(this.props.location.search);
    for (let param of query.entries()) {
      if(param[0] === 'redirectedFrom') redirectedFrom = param[1];
    }
    this.setState({redirectedFrom: redirectedFrom});
    if(this.props.user){
      this.props.history.replace('/me');
    }
    else{
      this.setState({loading: true});
      serverReq.get('/api/user')
        .then( resp => {
          this.setState({loading: false});
          if(resp.data.status === 'ok'){
            this.props.onLogin(resp.data.data);
          }
          else{ }
        })
        .catch (resp => {
          this.setState({loading: false});
        });
    }
  }

  componentDidUpdate () {
    if(this.props.user) {
      this.props.history.replace('/me');
    }
  }

  toggleShowPassword = () => {
    this.setState({showPassword: !this.state.showPassword});
  }

  getUserDetails = () => {
    this.setState({loading: true});
    serverReq.get('/api/user')
      .then( resp => {
        this.setState({loading: false});
        if(resp.data.status === 'ok'){
          this.props.onLogin(resp.data.data);
          if(this.state.redirectedFrom !== ''){
            //window.location.href = this.state.redirectedFrom;
            this.props.history.push(this.state.redirectedFrom);
          }
          else this.props.history.replace('/me');
        }
        else{ }
      })
      .catch (resp => {
        this.setState({loading: false});
      });
  }

  loginHandler = () => {
    this.setState({loading: true});
    const data = {
      email : this.state.username,
      password : this.state.password 
    }
    serverReq.post('/api/login', data, {
        headers : { 
          "Content-Type": "application/json"
        }
      })
      .then( resp => {
        this.setState({loading: false});
        if(resp.data.status === 'error') {
          this.setState({showModal: true, modalTitle: 'Ooops', modalMessage: 'Login Failed. Invalid email and/or password.'});
        }
        else{
          this.getUserDetails();
        }
      })
      .catch( err => {
        this.setState({loading: false});
      });
  }

  loginWithFacebook = () => {
    window.FB.login(function(response){
      if(response.status === 'connected') {
        this.props.history.push('/me');
      }
    }, {scope: 'email,publish_actions,user_friends'});
  }

  forgotPasswordHandler = () => {
    this.setState({showForgotPasswordModal: true});
  }

  signupHandler = () => {
    this.props.history.push('/signup');
  }

  checkInputs = () => {
    return (this.state.username.trim() !== '' && this.state.password.trim() !== '');
  }

  inputChangedHandler = (event, input) => {
    if(input === 'username'){
      this.setState({username: event.target.value, validForm: this.checkInputs()});
    }
    else {
      this.setState({password: event.target.value, validForm: this.checkInputs()});
    }
  }

  hideModal = () => {
    this.setState({showModal: false});
  }

  hideForgotPasswordModal = () => {
    this.setState({showForgotPasswordModal: false});
  }

  requestPasswordReset = (email) => {
    this.setState({loading: true, showForgotPasswordModal: false});
    const data = {
      email : email
    }
    serverReq.post('/api/account/passwordresetrequest', data, {
        headers : { 
          "Content-Type": "application/json"
        }
      })
      .then( resp => {
        this.setState({loading: false});
        if(resp.data.status === 'error') {
          this.setState({showModal: true, modalTitle: 'Ooops', modalMessage: 'Request Failed. Invalid email.'});
        }
        else{
          this.setState({showModal: true, modalTitle: 'Gotcha!', modalMessage: 'Check your email for the password reset link and instructions.'});
        }
      })
      .catch( err => {
        this.setState({loading: false});
      });
  }

  render () {

    let passwordInput = (
      <Aux>
        <input type="password" onChange={(event) => this.inputChangedHandler(event, 'password')}/>
        <div style={{textAlign: 'right', width: '100%'}}>
          <label className={styles.TogglePasswordLabel} onClick={this.toggleShowPassword}>show</label>
        </div>
      </Aux>
    );

    if(this.state.showPassword) {
      passwordInput = (
        <Aux>
          <input type="text" onChange={(event) => this.inputChangedHandler(event, 'password')}/>
          <div className={styles.TogglePasswordLabel} style={{textAlign: 'right', width: '100%'}}>
            <label className={styles.TogglePasswordLabel} onClick={this.toggleShowPassword}>hide</label>
          </div>
        </Aux>
      );
    }

    return (
      <div className={styles.Login}>
        <Spinner loading={this.state.loading} />
        <Modal title={this.state.modalTitle} show={this.state.showModal} modalClosed={this.hideModal}>
          <p style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0', fontSize: '1.2em'}}>{this.state.modalMessage}</p>
        </Modal>
        <Modal title='' show={this.state.showForgotPasswordModal} modalClosed={this.hideForgotPasswordModal}>
          <ForgotPassword onSubmit={this.requestPasswordReset}/>
        </Modal>
        <div className={styles.LoginPageContainer}>
          <div className={styles.SignUpContainer} onClick={this.signupHandler}>No MyRunTime account yet? Sign up here!</div>
          <a href={endpointUrls.fbSignInUrl + '&state=' + this.state.redirectedFrom}>
            <img className={styles.FbLoginButton} src={fbLoginButton}  alt='facebook login button'/>
          </a>
          <div className={styles.InputGroup}>
            <label>email</label>
            <input type="email" value={this.state.username} onChange={(event) => this.inputChangedHandler(event, 'username')}/>
          </div>
          <div className={styles.InputGroup}>
            <label>password</label>
            { passwordInput }
          </div>
          <button className={styles.SubmitButton} disabled={!this.state.validForm || this.state.loading} onClick={this.loginHandler}> Login </button>
          <div style={{margin:'20px 0'}} className={styles.SignUpContainer} onClick={this.forgotPasswordHandler}>Forgot your password?</div>
          <Footer />
        </div>
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    user : state.user
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onLogin : (user) => dispatch({type: actionTypes.USER_LOGIN, user: user}),
    //onLogin : (user) => dispatch({type: actionTypes.USER_LOGIN, user: user}),
    onLogout : () => dispatch({type: actionTypes.USER_LOGOUT})
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);