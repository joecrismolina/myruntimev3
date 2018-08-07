import React, { Component } from 'react';
import { connect } from 'react-redux';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Spinner from '../../../ui/Spinner/Spinner';
import Modal from '../../../ui/Modal/Modal';
import ConfirmModal from '../../../ui/ConfirmModal/ConfirmModal';
import FloatingNav from '../../../ui/FloatingNav/FloatingNav';
import BottomNav from '../../../ui/BottomNav/BottomNav';
import Metrics from './Metrics/Metrics';
import FBPhoto from '../../../ui/FBPhoto/FBPhoto';
import ConnectRace from '../../../components/ConnectRace/ConnectRace';
import Avatar from '../../../assets/images/myruntime-avatar-240x240.png';
import FBShareButton from '../../../assets/images/fb-share-button.jpg';
import DownloadButton from '../../../assets/images/download-button.jpg';
import ProgressiveImage from '../../../ui/ProgressiveImage/ProgressiveImage';
import * as analysisViews from './AnalysisViews';
import styles from './Analysis.css';
import serverReq from '../../../http/serverAxios';
import * as utils from '../../../utils/utils'; 

class Analysis extends Component {

  state = {
    loading: false,
    showModal: false,
    modalTitle : '',
    modalMessage: '',
    showActionConfirmModal: false,
    showConnectModal: false,
    bottomNavLinks: [],
    race: null,
    runnerAnalysis: null,
    raceAnalysis: null,
    results: null,
    profilePic : Avatar,
    userProfilePhotoPreview : Avatar,
    userProfilePhoto : Avatar,
    photos: [],
    photosPageNum: 1,
    userConnectedRace: false,
    currentUserResult: false,
    bibnumber: '',
    raceNick : '',
    userId: '',
    showLoginMessageModal : false,
    eCertShareEnabled : false,
    eCertDownloadEnabled : false,
    showECertModal : false
  }

  componentDidMount () {
    this.initialize();
  }

  componentDidUpdate (prevProps, prevState) { }

  initialize = () => {
    let bibnumber = '';
    let raceNick = '';
    let view = '';
    const query = new URLSearchParams(this.props.location.search);
    for (let param of query.entries()) {
      if(param[0] === 'bibnumber') bibnumber = param[1];
      if(param[0] === 'raceNick') raceNick = param[1];
      if(param[0] === 'view') view = param[1];
    }
    if(bibnumber === '' && raceNick === '') this.props.history.replace('/');
    else {
      let navLinks = [];
      navLinks.push({ item: analysisViews.ANALYSIS_RESULTS, active: false });
      navLinks.push({ item: analysisViews.ANALYSIS_PHOTOS, active: false });
      navLinks.forEach(link => {
        if (link.item.view === view) link.active = true;
      })
      this.setState({bottomNavLinks: navLinks, bibnumber: bibnumber, raceNick: raceNick, view: view});
      this.getRace(raceNick, bibnumber);
    }
  }

  getRace = (raceNick, bibnumber) => {
    this.setState({loading: true});
    serverReq.get('/api/race?raceNick=' + raceNick)
      .then( resp => {
        const race = resp.data.data;
        this.setState({race: race, loading: false});
        this.getResults(race._id, bibnumber);
        this.getRaceAnalysis(race);
        this.getRunnerAnalysis(race, bibnumber);
        this.getPhotos(raceNick, bibnumber, 1);
      })
      .catch( err => {
        this.setState({loading: false, showModal: true, modalTitle: 'Ooops', modalMessage: 'Error getting race'});
      });
  }

  getRaceAnalysis = (race) => {
    this.setState({loading: true});
    const raceId = race._id;
    serverReq.get('/api/analytics/race?id=' + raceId)
      .then( resp => {
        const raceAnalysis = resp.data.data;
        this.setState({raceAnalysis: raceAnalysis, loading: false});
      })
      .catch( err => {
        this.setState({loading: false, showModal: true, modalTitle: 'Ooops', modalMessage: 'Error getting race analysis'});
      });
  }

  getRunnerAnalysis = (race, bibnumber) => {
    this.setState({loading: true});
    const raceId = race._id;
    serverReq.get('/api/analytics/user?bibnumber=' + bibnumber + '&raceId=' + raceId)
      .then( resp => {
        if(resp.data.data){
          const runnerAnalysis = resp.data.data;
          const thisWave = race.waves.filter( w => { return (w.waveId === runnerAnalysis.waveId) })[0];
          const navLinks = [...this.state.bottomNavLinks];
          if(thisWave.eCertDownloadEnabled || thisWave.eCertShareEnabled) {
            navLinks.push({ item: analysisViews.ANALYSIS_CERTIFICATE, active: false });
          }
          this.setState({runnerAnalysis: runnerAnalysis, bottomNavLinks: navLinks, eCertShareEnabled: thisWave.eCertShareEnabled, eCertDownloadEnabled: thisWave.eCertDownloadEnabled, loading: false});
        }
        else {
          this.setState({loading: false});
        }
      })
      .catch( err => {
        this.setState({loading: false, showModal: true, modalTitle: 'Ooops', modalMessage: 'Error getting runner analysis'});
      });
  }

  getResults = (raceId, bibnumber) => {
    console.log('bibnumber');
    console.log(bibnumber);
    if(this.props.authenticatedUser) {
      this.setState({loading: true});
      serverReq.get('/api/results/race/user?bibnumber=' + bibnumber + '&raceId=' + raceId)
        .then( resp => {
          if(resp.data.data) {
            const results = resp.data.data;
            if(results.activated) {
              if(results.userId._id === this.props.authenticatedUser._id) {
                let navLinks = this.state.bottomNavLinks.concat([{ item: analysisViews.ANALYSIS_ME, active: false }, { item: analysisViews.ANALYSIS_DISCONNECT, active: false }]);
                this.setState({results: results, loading: false, bottomNavLinks: navLinks});
              }
              else {
                let navLinks = this.state.bottomNavLinks.concat({ item: analysisViews.ANALYSIS_USER_PROFILE, active: false });
                this.setState({results: results, loading: false, bottomNavLinks: navLinks});
              }
            }
            else {
              let isUserRace = this.props.authenticatedUser.races.filter( race => { return (race._id === raceId) })
              if(isUserRace.length === 0) {
                let navLinks = this.state.bottomNavLinks.concat({ item: analysisViews.ANALYSIS_CONNECT, active: false });
                this.setState({results: results, loading: false, bottomNavLinks: navLinks});
              }
              else {
                this.setState({results: results, loading: false});
              }
            }
            this.getUserProfilePhoto(results.userId)
          }
          else{
            this.setState({loading: false});
          }
        })
        .catch( err => {
          this.setState({loading: false, showModal: true, modalTitle: 'Ooops', modalMessage: 'Error getting results'});
        });
      }
      else {
        this.setState({loading: false, showLoginMessageModal: true});
      }
  }

  getUserProfilePhoto = (user) => {
    let profilePic = Avatar;
    let previewProfilePic = Avatar;
    utils.getProfileImageSrc(user).then( resp => {
      profilePic = resp;
      previewProfilePic = utils.getProfileImagePreviewSrc(user);
      this.setState({userProfilePhoto:profilePic , userProfilePhotoPreview: previewProfilePic});
    });
  }

  getPhotos = (raceNick, bibnumber, pageNum) => {
    this.setState({loading: true});
    serverReq.get('/api/photos/race?raceNick=' + raceNick + '&bibnumber=' + bibnumber + '&page=' + pageNum)
      .then( resp => {
        const photos = resp.data.data;
        this.setState({photos: photos, photosPageNum: pageNum, loading: false});
      })
      .catch( err => {
        this.setState({loading: false, showModal: true});
      });
  }

  loadMorePhotos = () => { }

  bottomNavClickedHandler = (identifier) => {
    if(identifier === this.state.view) return;

    let updatedNavLinks = [].concat(this.state.bottomNavLinks);

    updatedNavLinks.forEach( link => {
      if(link.item.view === identifier) link.active = true;
      else link.active = false;
    });

    if(identifier === analysisViews.ANALYSIS_ME.view){
      this.props.history.push('/me'); 
    }
    else if (identifier === analysisViews.ANALYSIS_USER_PROFILE.view){
      this.props.history.push('/user?id=' + this.state.results.userId._id);
    }
    else if (identifier === analysisViews.ANALYSIS_CERTIFICATE.view){
      this.setState({bottomNavLinks: updatedNavLinks, view: identifier, showECertModal: true});
    }
    else {
      this.setState({bottomNavLinks: updatedNavLinks, view: identifier, showActionConfirmModal: (identifier === analysisViews.ANALYSIS_DISCONNECT.view), showConnectModal: (identifier === analysisViews.ANALYSIS_CONNECT.view) });
    }
  }

  hideModal = () => {
    this.setState({showModal: false, showActionConfirmModal: false, showConnectModal: false, showLoginMessageModal: false, showECertModal: false});
  }

  hideLoginMessageModal = () => {
    this.props.history.replace('/');
  }

  cancelDisconnect = () => {
    this.setState({showActionConfirmModal: false});
    this.bottomNavClickedHandler(analysisViews.ANALYSIS_RESULTS.view);
  }

  confirmDisconnect = () => {
    if(this.state.race && this.state.results){
      this.setState({loading: true});
      serverReq.post('/api/results/disconnect?bibnumber=' + this.state.results.bibnumber + '&raceNick=' + this.state.race.raceNick)
        .then( resp => {
          this.setState({loading: false, showConnectModal: false});
          this.bottomNavClickedHandler(analysisViews.ANALYSIS_RESULTS.view);
          if(resp.data.status === 'error') {
            this.setState({showModal: true, modalTitle: 'Ooops', modalMessage: 'Error disconnecting race results'});
          }
          else{
            this.props.history.replace('/me');
          }
        })
        .catch( err => {
          this.setState({loading: false, showModal: true, modalTitle: 'Ooops', modalMessage: 'Error disconnecting race results'});
        });
    }
    else {
        this.setState({showModal: true, modalTitle: 'Ooops', modalMessage: 'Error disconnecting race results'});
    }
  }

  cancelConnect = () => {
    this.setState({showConnectModal: false});
    this.bottomNavClickedHandler(analysisViews.ANALYSIS_RESULTS.view);
  }

  confirmConnect = (bibnumber, code) => {
    if(bibnumber && code && this.state.race){
      this.setState({loading: true});
      serverReq.post('/api/results/connect?bibnumber=' + bibnumber + '&raceNick=' + this.state.race.raceNick + '&activationCode=' + code)
        .then( resp => {
          this.setState({loading: false, showConnectModal: false});
          this.bottomNavClickedHandler(analysisViews.ANALYSIS_RESULTS.view);
          if(resp.data.status === 'error') {
            this.setState({showModal: true, modalTitle: 'Ooops', modalMessage: 'Error connecting race results'});
          }
          else{
            this.props.history.push('/me');
          }
        })
        .catch( err => {
          this.setState({loading: false, showModal: true, modalTitle: 'Ooops', modalMessage: 'Error connecting race results'});
        });
      }
      else{
        this.setState({showModal: true, modalTitle: 'Ooops', modalMessage: 'Error connecting race results'});
      }
  }

  shareEcertViaFB = () => {
    this.hideModal();
    const raceNick = this.state.raceNick;
    const bibnumber = this.state.bibnumber;
    const eCertUrl = encodeURI('https://myrunti.me/ecert?raceNick=') + encodeURIComponent(raceNick) + '%26bibnumber=' + encodeURIComponent(bibnumber);
    const fbShareUrl = "https://www.facebook.com/sharer/sharer.php?u=" + eCertUrl;
    window.open(fbShareUrl); 
  }

  downloadEcert = () => { }

  render () {
  
    let currentView = null;

    if(this.state.view === 'photos') {
      if(this.state.photos) {
        currentView = (
          <Aux>
            <div className={styles.RacePhotoContainer}>
              {
                this.state.photos.map( photo => {
                  return(
                    <FBPhoto key={photo.iframeHref} src={photo.iframeHref} />
                  )
                })
              }
            </div>
          </Aux>
        );
      }
    }
    else {
      currentView = (
        <Aux>
          <div>
            <Metrics raceAnalysis={this.state.raceAnalysis} results={this.state.results} runnerAnalysis={this.state.runnerAnalysis}/>
          </div>
        </Aux>
      );
    }

    let runnerName = '';
    let runnerGender = 'M';
    let gunTime = null;
    let chipTime = null;
    let rank = null;
    let waveName = '';
    if(this.state.results && this.state.runnerAnalysis && this.state.raceAnalysis && this.state.race) {
      if(this.state.results.activated){
        runnerName = this.state.results.userId.firstName + ' ' + this.state.results.userId.lastName;
        runnerGender = this.state.results.userId.gender;
      }
      else{
        runnerName = this.state.results.firstName + ' ' + this.state.results.lastName;
        runnerGender = this.state.results.gender;
      }
      gunTime = utils.secondsToTimeString(this.state.runnerAnalysis.gunTime);
      chipTime = utils.secondsToTimeString(this.state.runnerAnalysis.chipTime);
      let totalRunners = 0;
      this.state.raceAnalysis.forEach( wave => {
        if(wave.waveId === this.state.runnerAnalysis.waveId) totalRunners = wave.femaleRunners + wave.maleRunners;
      })
      rank = this.state.runnerAnalysis.overallByGunTime.rank + ' / ' + totalRunners;
      waveName = this.state.race.waves.filter(w => {
        return (w.waveId === this.state.runnerAnalysis.waveId)
      })[0].waveName;
    }

    let raceName = '';
    let isMyruntimeEvent = false;
    if(this.state.race) {
      raceName = this.state.race.raceName;
      isMyruntimeEvent = this.state.race.isMyruntimeEvent;
    }

    let eCertControls = null;
    if(this.state.eCertShareEnabled && !this.state.eCertDownloadEnabled) { 
      eCertControls = (
        <Aux>
          <div className={styles.ECertShareButton} onClick={this.shareEcertViaFB}><img src={FBShareButton} alt='share'/></div>
        </Aux>
      ); 
    }
    else if (!this.state.eCertShareEnabled && this.state.eCertDownloadEnabled) {
      let eCertLink = '';
      if(this.state.race && this.state.results) {
        eCertLink = 'http://image.myrunti.me/images/ecert/' + this.state.race.raceNick + '/' + this.state.results.bibnumber + '.jpg'; 
      }
      eCertControls = (
        <Aux>
          <div className={styles.ECertDownloadButton} onClick={this.downloadEcert}>
            <a target="_self" href={eCertLink} download>
             <img src={DownloadButton} alt='download'/>
            </a>
          </div>
        </Aux>
      );
    }
    else if (this.state.eCertShareEnabled && this.state.eCertDownloadEnabled) {
      let eCertLink = '';
      if(this.state.race && this.state.results) {
        eCertLink = 'http://image.myrunti.me/images/ecert/' + this.state.race.raceNick + '/' + this.state.results.bibnumber + '.jpg'; 
      }
      eCertControls = (
        <Aux>
          <div className={styles.ECertShareButton} onClick={this.shareEcertViaFB}><img src={FBShareButton} alt='share'/></div>
          <div className={styles.ECertDownloadButton} onClick={this.downloadEcert}>
            <a target="_self" href={eCertLink} download>
             <img src={DownloadButton} alt='download'/>
            </a>
          </div>
        </Aux>
      );
    }
    else { eCertControls = null; }

    return (
      <Aux>
        <Spinner loading={this.state.loading} />
        <Modal title={this.state.modalTitle} show={this.state.showModal} modalClosed={this.hideModal}>
          <h2 style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0'}}>{this.state.modalMessage}</h2>
        </Modal>
        <Modal title='CONNECT RESULTS' show={this.state.showConnectModal} modalClosed={this.hideModal}>
          <ConnectRace raceName={raceName} isMyruntimeEvent={isMyruntimeEvent} bibnumber={this.state.bibnumber} onConnect={this.confirmConnect} onCancel={this.cancelConnect} />
        </Modal>
        <Modal title='Ooops' show={this.state.showLoginMessageModal} modalClosed={this.hideLoginMessageModal}>
          <p style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0', fontSize: '1.2em'}}>
            <a href='/login' style={{color:'#428bca', textDecoration:'none'}}> Login </a> or <a href='/signup' style={{color:'#428bca', textDecoration:'none'}}> Signup </a> to add this race to your list of races
          </p>
        </Modal>
        <Modal title='E Certificate' show={this.state.showECertModal} modalClosed={this.hideModal}>
          {eCertControls}
        </Modal>
        <ConfirmModal 
          title='Confirm Race Disconnect' 
          message='Are you sure you want to remove this result from your list of races?' 
          onCancel={this.cancelDisconnect} 
          onConfirm={this.confirmDisconnect}
          showModal={this.state.showActionConfirmModal}
          modalClosed={this.cancelDisconnect}/>
        <div className={styles.AnalysisContainer}>
          <div style={{width:'80%', marginLeft:'10%'}}>
            <FloatingNav items={this.state.bottomNavLinks} clickedHandler={this.bottomNavClickedHandler}/>
          </div>
          <div className={styles.ResultsProfileContainer}>
            <div className={styles.ProfileImageContainer}>
              {/*<ProgressiveImage src={profilePic} alt='user' style={{width: '100%'}}/>*/}
              <ProgressiveImage src={this.state.userProfilePhoto} preview={this.state.userProfilePhotoPreview} alt='user' style={{width: '100%'}}/>
            </div>
            <div className={styles.ProfileNameContainer}>{runnerName}</div>
            <div className={styles.ProfileGenderContainer}>{utils.formatGender(runnerGender)}</div>
            <div className={styles.ProfileRaceNameContainer}>{raceName}</div>
            <div className={styles.ProfileWaveNameContainer}>{waveName}</div>
            <div className={styles.ResultsOverview}>
              <div className={styles.ResultBox}>
                <div className={styles.ResultBoxValue}>{gunTime}</div>
                <div className={styles.ResultBoxLabel}>GUN TIME</div>
              </div>
              <div className={styles.ResultBox}>
                <div className={styles.ResultBoxValue}>{chipTime}</div>
                <div className={styles.ResultBoxLabel}>CHIP TIME</div>
              </div>
              <div className={styles.ResultBox}>
                <div className={styles.ResultBoxValue}>{rank}</div>
                <div className={styles.ResultBoxLabel}>RANK</div>
              </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Analysis);