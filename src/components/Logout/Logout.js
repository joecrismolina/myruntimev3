import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spinner from '../../ui/Spinner/Spinner';
import styles from './Logout.css';
import * as actionTypes from '../../store/actions';
import serverReq from '../../http/serverAxios';

class Logout extends Component {

  state = {
    loading: true
  }

  componentDidMount () {
    if(this.props.user) {
      serverReq.post('/api/logout?redirect=false')
        .then( resp => {
          if(resp.data.status === 'ok'){
            this.props.onLogout();
            this.props.history.replace('/');
          }
          else{ }
        })
        .catch (resp => {

        });
    }
    else{
      this.props.history.replace('/');
    }
  }

  componentWillUnmount () {

  }

  componentDidUpdate () { }

  render () {
    return (
      <div className={styles.Logout}>
        <Spinner loading={this.state.loading} />
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
    onLogout : () => dispatch({type: actionTypes.USER_LOGOUT})
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);