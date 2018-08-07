import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spinner from '../../ui/Spinner/Spinner';
import Modal from '../../ui/Modal/Modal';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import serverReq from '../../http/serverAxios';
import * as actionTypes from '../../store/actions';

class AccountActivate extends Component {

  state = {
    loading : true,
    showModal : false
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
      serverReq.post('/api/account/activate?token=' + token)
      .then( resp => {
        if(resp.data.status === 'error') {
          this.setState({showModal: true, modalTitle: 'Ooops', modalMessage: resp.data.error, loading: false});
        }
        else{
          this.verifyUserSession()
        }
      })
      .catch( err => {
        this.setState({loading: false});
      });
    }
  }

  verifyUserSession = () => {
    this.setState({loading: true});
    serverReq.get('/api/user')
      .then( resp => {
        if(resp.data.status === 'ok'){
          this.props.onLogin(resp.data.data);
        }
        else{ }
        this.props.history.replace('/');
      })
      .catch (resp => {
        this.props.history.replace('/');
      });
  }

  hideModal = () => {
    this.props.history.replace('/');
  }

  render () {
    return(
      <Aux>
        <Spinner loading={this.state.loading} />
        <Modal title='Ooops' show={this.state.showModal} modalClosed={this.hideModal}>
          <p style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0', fontFamily:'inherit', fontSize:'1.0em'}}>Error occured while activating your account, please email feedback@myruntime.com</p>
        </Modal>
      </Aux>
    )
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountActivate);