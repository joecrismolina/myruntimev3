import React, { Component } from 'react';
import { connect } from 'react-redux';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Spinner from '../../../ui/Spinner/Spinner';
import Modal from '../../../ui/Modal/Modal';
import ResultsCard from '../../../ui/ResultsCard/ResultsCard';
import BottomNav from '../../../ui/BottomNav/BottomNav';
import FloatingNav from '../../../ui/FloatingNav/FloatingNav';
import Avatar from '../../../assets/images/myruntime-avatar-240x240.png';
import UserDetails from './UserDetails/UserDetails';
import ProgressiveImage from '../../../ui/ProgressiveImage/ProgressiveImage'
import FBPhoto from '../../../ui/FBPhoto/FBPhoto';
import styles from './User.css';
import * as userViews from './UserViews';
import serverReq from '../../../http/serverAxios';
import * as utils from '../../../utils/utils';
import * as actionTypes from '../../../store/actions';

class User extends Component {

  state ={
    loading: false,
    view : '',
    bottomNavLinks : [],
    showModal : false,
    modalTitle : '',
    modalMessage : '',
    user : null,
    userRaces : [],
    userPhotos : [],
    userProfilePhoto : Avatar,
    userProfilePhotoPreview : Avatar,
    userRacesPageNum : 1,
    userPhotosPageNum : 1,
    authenticatedUserOwnPage: false
  }

  componentDidMount () {
    const navLinks = [
      { item: userViews.USER_RACES, active: true },
      { item: userViews.USER_PHOTOS, active: false },
      { item: userViews.USER_DETAILS, active: false }
    ];
    
    let user = null;
    let userId = '';
    if(this.props.location.pathname === '/me' && this.props.authenticatedUser) {
      user = this.props.authenticatedUser;
      this.setState({bottomNavLinks: navLinks, view: userViews.USER_RACES.view, user: user, authenticatedUserOwnPage: true, loading: false});
      this.getUserProfilePhoto(user);
      this.getUserRaces(user._id, 1);
      this.getUserPhotos(user._id, 1);
    }
    else {
      const query = new URLSearchParams(this.props.location.search);
      for (let param of query.entries()) {
        if(param[0] === 'id') userId = param[1];
      }
      if(userId !== '') {
        this.getUser(userId, navLinks);
      }
      else {
        this.props.history.replace('/');
      }
    }

    this.throttleTimer = null;
    this.throttleDelay = 100;
    window.addEventListener('scroll', this.scrollHandler);
  }

  componentDidUpdate (prevProps, prevState) { }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.scrollHandler);
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

  scrollHandler = (event) => {
    clearTimeout(this.throttleTimer);
    this.throttleTimer = setTimeout( () => {
      const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
      const body = document.body;
      const html = document.documentElement;
      const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
      const windowBottom = windowHeight + window.pageYOffset;
      if (windowBottom >= docHeight) {
        if(this.state.view === userViews.USER_RACES.view) this.loadMoreRaces();
        else if(this.state.view === userViews.USER_PHOTOS.view) this.loadMorePhotos();
        else return;
      }
    }, this.throttleDelay);
  }

  loadMoreRaces = () => {
    if(this.state.loading || this.state.view !== userViews.USER_RACES.view || this.state.user === null || this.state.user.races.length === this.state.userRaces.length) return;
    const nextPage = this.state.userRacesPageNum + 1;
    this.getUserRaces(this.state.user._id, nextPage);
  }

  loadMorePhotos = () => {
    if(this.state.loading || this.state.view !== userViews.USER_PHOTOS.view || this.state.user === null) return;
    const nextPage = this.state.userPhotosPageNum + 1;
    this.getUserPhotos(this.state.user._id, nextPage);
  }

  getUser = (userId, navLinks) => {
    this.setState({loading: true});
    serverReq.get('/api/user/another?id=' + userId)
      .then( resp => {
        if(resp.data.status === 'ok'){
          const user = resp.data.data;
          this.setState({bottomNavLinks: navLinks, view: userViews.USER_RACES.view, user: user, loading: false});
          this.getUserProfilePhoto(user);
          this.getUserRaces(user._id, 1);
          this.getUserPhotos(user._id, 1);
        }
        else{
          this.props.history.push('/');
        }
      })
      .catch (err => {
        this.props.history.push('/');
      });
  }

  getUserRaces = (userId, pageNum) => {
    this.setState({loading: true});
    serverReq.get('/api/results?id=' + userId + '&page=' + pageNum)
      .then( resp => {
        if(resp.data.status === 'ok'){
          const updatedRaces = this.state.userRaces.concat(resp.data.data);
          this.setState({userRaces: updatedRaces, loading: false, userRacesPageNum: pageNum});
        }
        else{
          this.setState({loading: false});
        }
      })
      .catch (err => {
        this.setState({loading: false, showModal: true, modalTitle: 'Ooops', modalMessage: 'Error loading user races'});
      });
  }

  getUserPhotos = (userId, pageNum) => {
    this.setState({loading: true});
    serverReq.get('/api/photos/all?id=' + userId + '&page=' + pageNum)
      .then( resp => {
        if(resp.data.status === 'ok' && resp.data.data.length > 0){
          const updatedPhotos = this.state.userPhotos.concat(resp.data.data);
          this.setState({userPhotos: updatedPhotos, loading: false, userPhotosPageNum: pageNum});
        }
        else{
          this.setState({loading: false});
        }
      })
      .catch (err => {
        this.setState({loading: false, showModal: true, modalTitle: 'Ooops', modalMessage: 'Error loading user photos'});
      });
  }

  bottomNavClickedHandler = (identifier) => {
    if(identifier === this.state.view) return;

    let updatedNavLinks = [].concat(this.state.bottomNavLinks);

    updatedNavLinks.forEach( link => {
      if(link.item.view === identifier) link.active = true;
      else link.active = false;
    });

    this.setState({bottomNavLinks: updatedNavLinks, view: identifier});
  }

  hideModal = () => {
    this.setState({showModal: false});
  }

  updateUserImageHandler = (imageFile, type) => {
    this.setState({loading: true});
    if(type === 'file'){
      let formData = new FormData()
      formData.append('file', imageFile);
      formData.append('user', JSON.stringify(this.props.authenticatedUser));
      serverReq.post('/api/user/profileimage/update/file', formData, {
          headers : { 
            "Content-Type": "multipart/form-data"
          }
        })
        .then(resp => {
          this.setState({loading: false});
          this.verifyUserSession();
        })
        .catch(err => {
          this.setState({loading: false});
        })
      }
      else {
        const data = {
          image : imageFile,
          user : this.props.authenticatedUser
        };
        serverReq.post('/api/user/profileimage/update/photo', data, {
            headers : { 
              "Content-Type": "application/json"
            }
          })
          .then(resp => {
            this.setState({loading: false});
            this.verifyUserSession();
          })
          .catch(err => {
            this.setState({loading: false});
          })
      }
  }

  saveUserDetailChangesHandler = (updatedUser) => {
    if(updatedUser){
      this.setState({loading: true});
      var data = { user : updatedUser }
      serverReq.post('/api/user/edit', data, {
        headers : { 
          "Content-Type": "application/json"
        }
      })
      .then( resp => {
        this.setState({loading: false});
        if(resp.data.status === 'ok'){
          this.verifyUserSession();
        }
        else{ }
      })
      .catch (resp => {
        this.setState({loading: false});
        this.props.history.replace('/');
      });
    }
  }

  verifyUserSession = () => {
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
        this.props.history.replace('/');
      });
  }

  disconnectRaceHandler = (result) => {
    if(result.race && result.result){
      this.setState({loading: true});
      serverReq.post('/api/results/disconnect?bibnumber=' + result.result.bibnumber + '&raceNick=' + result.race.raceNick)
        .then( resp => {
          this.setState({loading: false});
          this.bottomNavClickedHandler(userViews.USER_RACES.view);
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

  render () {
    let currentView = null;
    let profileContainer = null;
    if(this.state.user) {
      profileContainer = (
            <div className={styles.ProfileContainer}>
              <div className={styles.NameGenderContainer}>
                <div className={styles.NameContainer}>
                  {this.state.user.firstName} {this.state.user.lastName}
                </div>
                <div className={styles.OthersContainer}>
                  {utils.formatGender(this.state.user.gender)}
                </div>
              </div>
              <div className={styles.ProfileImageContainer}>
                <ProgressiveImage src={this.state.userProfilePhoto} preview={this.state.userProfilePhotoPreview} alt='user' className={styles.ProfileImage}/>
              </div>
              <div className={styles.RaceCountContainer}>
                <div className={styles.RaceCount}>
                  {this.state.user.races.length}
                </div>
                <div className={styles.RaceCountLabel}>
                  RACES
                </div>
              </div>
            </div>
      );
    }
    if( this.state.view === 'races' ) {
      currentView = (
        this.state.userRaces.map( r => {
          return (
            <ResultsCard
              key={r.raceId._id} 
              result={{
                race : r.raceId,
                result : r
              }}
              onDisconnectRace={this.disconnectRaceHandler}
              history={this.props.history}
              authenticatedUserOwnPage={this.state.authenticatedUserOwnPage}
            />
          )
        })
      );    
    }
    else if ( this.state.view === 'photos' ) {
      currentView = (
        <Aux>
          {
            this.state.userPhotos.map( photo => {
              return(
                <FBPhoto key={photo.iframeHref} src={photo.iframeHref} />
              )
            })
          }
        </Aux>
      );
    }
    else {
      if(this.state.user) {
        currentView = (
          <Aux>
            <UserDetails 
              user={this.state.user} 
              editable={this.state.authenticatedUserOwnPage} 
              onSaveChanges={this.saveUserDetailChangesHandler} 
              onImageUpdate={this.updateUserImageHandler} />
          </Aux>
        );
      }
      profileContainer = null;
    }

    let userContent = null;
    if(this.state.user) {
        userContent = (
          <div className={styles.UserPageContainer}>
            {profileContainer}
            <div style={{width:'50%', marginLeft:'25%', display: 'block'}}>
              <FloatingNav items={this.state.bottomNavLinks} clickedHandler={this.bottomNavClickedHandler}/>
            </div>
            <div className={styles.ViewContainer}>
              { currentView }
            </div>
            <BottomNav items={this.state.bottomNavLinks} clickedHandler={this.bottomNavClickedHandler}/>
          </div>
        );
    }

    return (
      <Aux>
        <Spinner loading={this.state.loading} />
        <Modal title={this.state.modalTitle} show={this.state.showModal} modalClosed={this.hideModal}>
          <h2 style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0'}}>{this.state.modalMessage}</h2>
        </Modal>
        {userContent}
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
    onLogin : (user) => dispatch({type: actionTypes.USER_LOGIN, user: user}),
    onLogout : () => dispatch({type: actionTypes.USER_LOGOUT})
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(User);