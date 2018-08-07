import React, { Component } from 'react';
import { connect } from 'react-redux';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Spinner from '../../../ui/Spinner/Spinner';
import SearchBar from '../../../ui/SearchBar/SearchBar';
import OneActionCard from '../../../ui/Card/OneActionCard/OneActionCard';
import Modal from '../../../ui/Modal/Modal';
import Footer from '../../../components/Footer/Footer';
import ConnectRace from '../../../components/ConnectRace/ConnectRace';
import styles from './MainConnect.css';
import serverReq from '../../../http/serverAxios';
import * as utils from '../../../utils/utils';

class MainConnect extends Component {

  state = {
    raceNick: '',
    activationCode: '',
    bibNumber: '',
    loading: false,
    searchParam: '',
    displayPage: 1,
    allRaces: [],
    showLoginModal : false,
    showConnectModal : false,
    raceToConnect : {
      raceName: '',
      isMyruntimeEvent: false
    },
    showModal: false,
    modalTitle: '',
    modalMessage: ''
  }

  componentDidMount () {
    let raceNick = '';
    let searchParam = '';
    const query = new URLSearchParams(this.props.location.search);
    for (let param of query.entries()) {
      if(param[0] === 'raceNick') raceNick = param[1];
    }
    this.setState({raceNick: raceNick, loading: true});
    if(raceNick === ''){
      serverReq.get('/api/races/search?page=1&raceName=' + searchParam)
        .then( resp => {
          let allRaces = resp.data.data.concat();
          this.throttleTimer = null;
          this.throttleDelay = 100;
          window.addEventListener('scroll', this.scrollHandler);
          this.setState({allRaces: allRaces, loading: false, searchParam: searchParam});
        })
        .catch( err => {
          this.setState({loading: false, showModal: true, searchParam: searchParam});
        });
    }
    else{
      serverReq.get('/api/race?raceNick=' + raceNick)
        .then( resp => {
          const race = resp.data.data;
          let allRaces = [];
          if(race) allRaces = [].concat([race]);
          this.throttleTimer = null;
          this.throttleDelay = 100;
          window.addEventListener('scroll', this.scrollHandler);
          this.setState({allRaces: allRaces, loading: false, searchParam: raceNick});
        })
        .catch( err => {
          this.setState({loading: false, showModal: true, searchParam: raceNick});
        });
    }
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.scrollHandler);
  }

  scrollHandler = (event) => {
    clearTimeout(this.throttleTimer);
    this.throttleTimer = setTimeout( () => {
      const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
      const body = document.body;
      const html = document.documentElement;
      const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
      const windowBottom = windowHeight + window.pageYOffset;
      if (windowBottom >= docHeight) {
        this.loadMore();
      }
    }, this.throttleDelay);
  }

  searchRaces = (searchParam) => {
    if(this.state.loading) return;
    this.setState({loading: true});
    serverReq.get('/api/races/search?page=1&raceName=' + searchParam)
      .then( resp => {
        if(resp.data.data && resp.data.data.length === 0){
          this.setState({loading: false, displayPage: 1, searchParam: searchParam});
        }
        else{
          let fetchedRaces = resp.data.data.concat();
          this.setState({allRaces: fetchedRaces, loading: false, displayPage: 1, searchParam: searchParam});
        }
      })
      .catch( err => {
        this.setState({loading: false, showModal: true});
      });
  }

  loadMore = () => {
    if(this.state.loading || this.state.raceNick !== '') return;
    const nextPage = this.state.displayPage + 1;
    this.setState({loading: true});
    serverReq.get('/api/races/search?page=' + nextPage + '&raceName=' + this.state.searchParam)
      .then( resp => {
        if(resp.data.data && resp.data.data.length === 0){
          this.setState({loading: false, displayPage: nextPage - 1});
        }
        else{
          let fetchedRaces = this.state.allRaces.concat(resp.data.data);
          this.setState({allRaces: fetchedRaces, loading: false, displayPage: nextPage});
        }
      })
      .catch( err => {
        this.setState({loading: false, showModal: true});
      });
  }

  showConnectModal = (race) => {
    if(this.props.authenticatedUser) {
      this.setState({raceToConnect: race, showConnectModal: true});
    }
    else{
      this.setState({showLoginModal: true});
      return;
    }
  }

  confirmConnect = (bibnumber, code) => {
    if(bibnumber && code && this.state.raceToConnect){
      this.setState({loading: true});
      serverReq.post('/api/results/connect?bibnumber=' + bibnumber + '&raceNick=' + this.state.raceToConnect.raceNick + '&activationCode=' + code)
        .then( resp => {
          this.setState({loading: false, showConnectModal: false});
          if(resp.data.status === 'error') {
            this.setState({showModal: true, modalTitle: 'Ooops', modalMessage: 'Error connecting race results'});
          }
          else{
            this.setState({showModal: true, modalTitle: 'Gotcha', modalMessage: 'Race results connected to your account'});
          }
        })
        .catch( err => {
          this.setState({loading: false});
        });
      }
      else{
        this.setState({showModal: true, modalTitle: 'Ooops', modalMessage: 'Error connecting race results'});
      }
  }

  cancelConnect = () => {
    this.setState({showConnectModal: false, raceToConnect: {
      raceName: '',
      isMyruntimeEvent: false
    }});
  }

  hideModal = () => {
    this.setState({showLoginModal: false, showConnectModal: false, showModal: false});
  }

  render () {

    let allRacesView = (<h2 style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0'}}>Error getting race details</h2>);
    if(this.state.allRaces.length > 0) {
      allRacesView = this.state.allRaces.map( el => {
                  return(
                        <OneActionCard
                          key={el._id} 
                          cardImage={'https://myrunti.me/images/' + el.racePhoto } 
                          title={el.raceName} 
                          heading1={utils.formatDate(el.raceDate)} 
                          heading2={el.raceAddress}
                          actionLabel="CONNECT"
                          actionClicked={() => this.showConnectModal(el) } />
                      );
                })
    }

    return (
      <Aux>
        <Spinner loading={this.state.loading} />
        <Modal title={this.state.modalTitle} show={this.state.showModal} modalClosed={this.hideModal}>
          <h2 style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0'}}>{this.state.modalMessage}</h2>
        </Modal>
        <Modal title='Ooops' show={this.state.showLoginModal} modalClosed={this.hideModal}>
          <p style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0', fontSize: '1.2em'}}>
            <a href={'/login?redirectedFrom=' + encodeURIComponent('connect?raceNick=' + this.state.raceNick)} style={{color:'#428bca', textDecoration:'none'}}> Login </a> or <a href='/signup' style={{color:'#428bca', textDecoration:'none'}}> Signup </a> to start connecting races
          </p>
        </Modal>
        <Modal title='CONNECT RACE' show={this.state.showConnectModal} modalClosed={this.cancelConnect}>
          <ConnectRace raceName={this.state.raceToConnect.raceName} isMyruntimeEvent={this.state.raceToConnect.isMyruntimeEvent} onConnect={this.confirmConnect} onCancel={this.cancelConnect} />
        </Modal>
        <div className={styles.MainConnectContainer}>
          <div className={styles.MainConnect}>
            {
              this.state.raceNick === '' ? (<SearchBar placeholder='search races to connect' searchHandler={this.searchRaces} minInputLength='3'/>) : null
            }
            <div className={styles.RacesContainer}>
              {
                allRacesView
              }
            </div>
          </div>
          <Footer />
        </div>
      </Aux>
    )
  }

};

const mapStateToProps = state => {
  return {
    authenticatedUser : state.user
  };
}

const mapDispatchToProps = dispatch => {
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainConnect);