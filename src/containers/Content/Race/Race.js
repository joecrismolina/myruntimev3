import React, { Component } from 'react';
import { connect } from 'react-redux';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import BottomNav from '../../../ui/BottomNav/BottomNav';
import FloatingNav from '../../../ui/FloatingNav/FloatingNav';
import Spinner from '../../../ui/Spinner/Spinner';
import Modal from '../../../ui/Modal/Modal';
import ConnectRace from '../../../components/ConnectRace/ConnectRace';
import RaceFeedback from '../../../components/RaceFeedback/RaceFeedback';
import Details from './Details/Details';
import Registration from './Registration/Registration';
import Results from './Results/Results';
import Photos from './Photos/Photos';
import {Helmet} from 'react-helmet';
import * as raceViews from './RaceViews';
import serverReq from '../../../http/serverAxios';
import styles from './Race.css';

class Race extends Component {
  
  state = {
    race : { raceNick: '' },
    loading : true,
    view : '',
    bottomNavLinks : [],
    showModal : false,
    modalTitle : '',
    modalMessage : '',
    showConnectModal : false,
    showRaceFeedback : false,
    showMessage : false,
    showLoginMessageModal : false
  }

  componentDidMount () {

    let raceNick = '';
    let view = '';
    const query = new URLSearchParams(this.props.location.search);
    for (let param of query.entries()) {
      if(param[0] === 'raceNick') raceNick = param[1];
      if(param[0] === 'view') view = param[1];
    }

    serverReq.get('/api/race?raceNick=' + raceNick)
      .then( resp => {
        const race = resp.data.data;
        let navLinks = [];

        if(race.raceDetailsTabEnabled) { navLinks.push({item: raceViews.RACE_DETAILS, active: false}); }
        if(race.published) {
          if(race.resultsAvailable){ navLinks.push({item: raceViews.RACE_RESULTS, active: false}); }
          if(race.racePhotosTabEnabled && race.racePhotos.length > 0){ navLinks.push({item: raceViews.RACE_PHOTOS, active: false}); }
        }
        else {
          if(race.myruntimeRegistrationEnabled){ navLinks.push({item: raceViews.RACE_REGISTRATION, active: false}); }
        }
        navLinks.push({item: raceViews.RACE_CONNECT, active: false});
        navLinks.push({item: raceViews.RACE_FEEDBACK, active: false}); 

        navLinks.forEach( link => {
          if(link.item.view === view) link.active = true;
        });

        this.setState({race: race, bottomNavLinks: navLinks, loading: false, view: view});

      })
      .catch( err => {
        this.setState({loading: false, showModal: true, modalTitle: 'Ooops', modalMessage: 'Error getting race data'});
      });
  }

  componentDidUpdate () { }

  bottomNavClickedHandler = (identifier) => {

    if(identifier === this.state.view) return;

    let updatedNavLinks = [].concat(this.state.bottomNavLinks);;

    updatedNavLinks.forEach( link => {
      if(link.item.view === identifier) link.active = true;
      else link.active = false;
    });

    if(identifier === raceViews.RACE_CONNECT.view) {
      if(this.props.authenticatedUser){
        this.setState({bottomNavLinks: updatedNavLinks, view: identifier, showConnectModal : true, showRaceFeedback : false});
      }
      else{
        this.setState({bottomNavLinks: updatedNavLinks, view: raceViews.RACE_DETAILS.view, showConnectModal : false, showLoginMessageModal: true, showRaceFeedback : false});
      }
    }
    else {
      this.setState({bottomNavLinks: updatedNavLinks, view: identifier, showConnectModal : false, showRaceFeedback : (identifier === raceViews.RACE_FEEDBACK.view)});
    }
  }

  cancelConnect = () => {
    this.setState({showConnectModal: false});
    this.bottomNavClickedHandler(raceViews.RACE_DETAILS.view);
  }

  confirmConnect = (bibnumber, code) => {
    if(bibnumber && code && this.state.race){
      this.setState({loading: true});
      serverReq.post('/api/results/connect?bibnumber=' + bibnumber + '&raceNick=' + this.state.race.raceNick + '&activationCode=' + code)
        .then( resp => {
          this.setState({loading: false, showConnectModal: false, view: raceViews.RACE_DETAILS.view});
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

  cancelRaceFeedback = () => {
    this.setState({showRaceFeedback: false});
    this.bottomNavClickedHandler(raceViews.RACE_DETAILS.view);
  }

  submitRaceFeedback = (form) => {
    this.setState({loading: true});
    const data = {...form};
    serverReq.post('/api/inquiry/race', data, {
        headers : { 
          "Content-Type": "application/json"
        }
      })
      .then( resp => {
        this.setState({loading: false, view: raceViews.RACE_DETAILS.view});
        if(resp.data.status === 'error') {
          this.setState({showModal: true, showRaceFeedback: false, modalTitle: 'Ooops', modalMessage: 'Error submitting race feedback'});
        }
        else{
          this.setState({showMessage: true, showRaceFeedback: false, modalTitle: 'Gotcha', modalMessage: 'Race feedbach submitted'});
        }
      })
      .catch( err => {
        this.setState({loading: false});
      });
  }

  hideModal = () => {
    this.setState({showModal: false, showConnectModal: false, showRaceFeedback: false, showMessage: false, showLoginMessageModal: false});
  }

  hideMessage = () => {
    this.setState({showMessage: false});
  }

  shareEcertViaFB = (view) => {
    const raceNick = this.state.race.raceNick;
    const eCertUrl = 'https%3A%2F%2Fmyrunti.me%2Frace%3FraceNick%3D' + encodeURIComponent(raceNick) + '%26view%3D' + view;
    const fbShareUrl = "https://www.facebook.com/sharer/sharer.php?u=" + eCertUrl;
    window.open(fbShareUrl); 
  }

  render () {

    let currentView = null;

    if(this.state.race && this.state.view === raceViews.RACE_DETAILS.view){
      currentView = (
        <Details race={this.state.race} shareViaPageFB={this.shareEcertViaFB}/>
      );
    }
    else if(this.state.race && this.state.view === raceViews.RACE_REGISTRATION.view){
      currentView = (
        <Registration race={this.state.race} />
      );
    }
    else if(this.state.race && this.state.view === raceViews.RACE_RESULTS.view){
      currentView = (
        <Results race={this.state.race} authenticatedUser={this.props.authenticatedUser} history={this.props.history}  shareViaPageFB={this.shareEcertViaFB}/>
      );
    }
    else if(this.state.race && this.state.view === raceViews.RACE_PHOTOS.view){
      currentView = (
        <Photos race={this.state.race} authenticatedUser={this.props.authenticatedUser} history={this.props.history} shareViaPageFB={this.shareEcertViaFB} />
      );
    }
    else { }

    let raceName = '';
    let isMyruntimeEvent = false;
    let ogParams = {};
    if(this.state.race) {
      raceName = this.state.race.raceName;
      isMyruntimeEvent = this.state.race.isMyruntimeEvent;
      ogParams = {
        url : 'https://myrunti.me/race?raceNick=' + this.state.race.raceNick + '&view=details',
        type : 'website',
        title : this.state.race.raceName,
        description : 'Event Details, Results and Photos',
        image : 'https://myrunti.me/images/' + this.state.race.racePhoto,
        imageType : 'image/jpeg'
      }
    }

    return (
      <Aux>
        <Helmet>
          <meta property="og:url" content={ogParams.url} />
          <meta property="og:type" content={ogParams.type} />
          <meta property="og:title" content={ogParams.title} />
          <meta property="og:description" content={ogParams.description} />
          <meta property="og:image" content={ogParams.image} />
        </Helmet>
        <Spinner loading={this.state.loading} />
        <Modal title={this.state.modalTitle} show={this.state.showModal} modalClosed={this.hideModal}>
          <h2 style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0'}}>{this.state.modalMessage}</h2>
        </Modal>
        <Modal title='CONNECT RACE' show={this.state.showConnectModal} modalClosed={this.cancelConnect}>
          <ConnectRace raceName={raceName} isMyruntimeEvent={isMyruntimeEvent} onConnect={this.confirmConnect} onCancel={this.cancelConnect} />
        </Modal>
        <Modal title='Ooops' show={this.state.showLoginMessageModal} modalClosed={this.hideModal}>
          <p style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0', fontSize: '1.2em'}}>
            <a href={'/login?redirectedFrom=connect?raceNick=' + encodeURIComponent(this.state.race.raceNick)} style={{color:'#428bca', textDecoration:'none'}}> Login </a> or <a href='/signup' style={{color:'#428bca', textDecoration:'none'}}> Signup </a> to add this race to your list of races
          </p>
        </Modal>
        <Modal title='Thanks!' show={this.state.showMessage} modalClosed={this.hideMessage}>
          <p style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0', fontFamily:'inherit', fontSize:'1.0em'}}> Your problem has been received. Our customer service team is now working to rectify your concerns. </p>
          <p style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0', fontFamily:'inherit', fontSize:'1.0em'}}> For INCORRECT NAMES, please ensure that you have sent us the bib numbers and the corresponding correct names.</p> 
          <p style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0', fontFamily:'inherit', fontSize:'1.0em'}}> Alternatively, you may connect your MyRunTime account to correct your name.</p>
          <p style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0', fontFamily:'inherit', fontSize:'1.0em'}}> For MISSING TIMES, it will be very helpful if you could send us an estimate of your finish time, or the bib numbers of the running buddies you finished with. 
</p>
          <p style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0', fontFamily:'inherit', fontSize:'1.0em'}}> Thank you for running with MyRunTime. =)</p>
        </Modal>
        <Modal title='RACE FEEDBACK' show={this.state.showRaceFeedback} modalClosed={this.cancelRaceFeedback}>
          <RaceFeedback raceName={raceName} onSubmit={this.submitRaceFeedback} onCancel={this.cancelRaceFeedback} />
        </Modal>
        <div className={styles.Race}>
          <div style={{width:'50%', marginLeft:'25%'}}>
            <FloatingNav items={this.state.bottomNavLinks} clickedHandler={this.bottomNavClickedHandler}/>
          </div>
          { currentView }
          <BottomNav items={this.state.bottomNavLinks} clickedHandler={this.bottomNavClickedHandler}/>
        </div>
      </Aux>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(Race);