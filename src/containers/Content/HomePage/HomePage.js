import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './HomePage.css';
import Carousel from '../../../ui/Carousel/Carousel';
import Footer from '../../../components/Footer/Footer';
import OneActionCard from '../../../ui/Card/OneActionCard/OneActionCard';
import TwoActionCard from '../../../ui/Card/TwoActionCard/TwoActionCard';
import SearchBar from '../../../ui/SearchBar/SearchBar';
import Modal from '../../../ui/Modal/Modal';
import Spinner from '../../../ui/Spinner/Spinner';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import serverReq from '../../../http/serverAxios';
import * as appUrls from '../../../http/endpointUrls';
import * as utils from '../../../utils/utils';
import {Helmet} from "react-helmet"; 

class HomePage extends Component {

  state = {
    upcomingRaces : [],
    recentRaces : [],
    loading: true,
    showModal : false
  }
  
  componentDidMount () {
    serverReq.get('/api/homepage/races/')
      .then( resp => {
        let upcomingRaces = [];
        let recentRaces = [];
        resp.data.data.forEach(el => {
          if(!el.published){
            upcomingRaces.push(el);
          }
          else{
            recentRaces.push(el);
          }
        });
        this.setState({upcomingRaces: upcomingRaces, recentRaces: recentRaces, loading: false});
      })
      .catch( err => {
        this.setState({loading: false, showModal: true});
      });
  }

  goToRacesPage = () => {
    this.props.history.push('/races/all');
  }

  searchRaces = (searchParam) => {
    this.props.history.push('/races/all?search=' + searchParam);
  }

  goToRaceDetailsPage = (raceNick) => {
    this.props.history.push({
      pathname : '/race',
      search: '?raceNick=' + raceNick + '&view=details'
    })
  }

  goToRaceRegistrationPage = (raceNick) => {
    this.props.history.push({
      pathname : '/race',
      search: '?raceNick=' + raceNick + '&view=registration'
    })
  }

  goToRaceResultsPage = (raceNick) => {
    this.props.history.push({
      pathname : '/race',
      search: '?raceNick=' + raceNick + '&view=results'
    })
  }

  goToRacePhotosPage = (raceNick) => {
    this.props.history.push({
      pathname : '/race',
      search: '?raceNick=' + raceNick + '&view=photos'
    })
  }

  goToRacesHandler = () => {
    this.props.history.push('/upcoming-races');
  }

  goToResultsHandler = () => {
    this.props.history.push('/recent-races');
  }

  goToMyProfileHandler = () => {
    this.props.history.push('/me');
  }

  goToLoginHandler = () => {
    this.props.history.push('/login');
  }

  hideModal = () => {
    this.setState({showModal: false});
  }

  render () {
    const banners = [
      {
        image: 'https://myrunti.me/images/HomeBannerImg_1483419302193Celebrate%20Progress%202017.jpg',
        previewImage : 'https://myrunti.me/images/HomeBannerImg_1483419302193Celebrate%20Progress%202017-preview.jpg',
        label: 'Celebrate progress'
      },
      {
        image: 'https://myrunti.me/images/HomeBannerImg_1483425899971Never%20Lose%20Sight%20of%20Goals%202017.JPG',
        previewImage: 'https://myrunti.me/images/HomeBannerImg_1483425899971Never%20Lose%20Sight%20of%20Goals%202017-preview.jpg',
        label: 'Never lose sight of goals'
      },
      {
        image: 'https://myrunti.me/images/HomeBannerImg_1483425958843ImmortalizeRunningExperience2017.jpg',
        previewImage: 'https://myrunti.me/images/HomeBannerImg_1483425958843ImmortalizeRunningExperience2017-preview.jpg',
        label: 'Immmortalize your running experience'
      },
      {
        image: 'https://myrunti.me/images/HomeBannerImg_1483426075918ConnectWithRunners2017.JPG',
        previewImage: 'https://myrunti.me/images/HomeBannerImg_1483426075918ConnectWithRunners2017-preview.jpg',
        label: 'Connect with runners'
      },
      {
        image: 'https://myrunti.me/images/HomeBannerImg_1483426334943Racecation2017.JPG',
        previewImage: 'https://myrunti.me/images/HomeBannerImg_1483426334943Racecation2017-preview.jpg',
        label: 'Run in a different city'
      }
    ];

    const mobileBanners = [
      {
        image: 'https://myrunti.me/images/MRT3-MB1.jpg',
        previewImage : 'https://myrunti.me/images/MRT3-MB1-preview.jpg',
        label: 'mobile banner 1'
      },
      {
        image: 'https://myrunti.me/images/MRT3-MB2.jpg',
        previewImage: 'https://myrunti.me/images/MRT3-MB2-preview.jpg',
        label: 'mobile banner 2'
      },
      {
        image: 'https://myrunti.me/images/MRT3-MB3.jpg',
        previewImage: 'https://myrunti.me/images/MRT3-MB3-preview.jpg',
        label: 'mobile banner 3'
      }      
    ];

    let featureButtons = null;
    let mobileFeatureButtons = null;
    if(this.props.authenticatedUser) {
      featureButtons = (
        <div className={styles.FeatureButtonsContainer}>
          <button onClick={this.goToRacesHandler} className={styles.FeatureButton}>Explore Races</button>
          <button onClick={this.goToMyProfileHandler} className={styles.FeatureButtonActive}>My Profile</button>
          <button onClick={this.goToResultsHandler} className={styles.FeatureButton}>See Results</button>
        </div>
      );
      mobileFeatureButtons = (
        <div className={styles.MobileFeatureButtonsContainer}>
          <button onClick={this.goToRacesHandler} className={styles.FeatureButton}>Explore Races</button>
          <button onClick={this.goToMyProfileHandler} className={styles.FeatureButtonActive}>My Profile</button>
          <button onClick={this.goToResultsHandler} className={styles.FeatureButton}>See Results</button>
        </div>
      );
    }
    else{
      featureButtons = (
        <div className={styles.FeatureButtonsContainer}>
          <button onClick={this.goToRacesHandler} className={styles.FeatureButton}>Explore Races</button>
          <button onClick={this.goToLoginHandler} className={styles.FeatureButtonActive}>Sign In</button>
          <button onClick={this.goToResultsHandler} className={styles.FeatureButton}>See Results</button>
        </div>
      );
      mobileFeatureButtons = (
        <div className={styles.MobileFeatureButtonsContainer}>
          <button onClick={this.goToRacesHandler} className={styles.FeatureButton}>Explore Races</button>
          <button onClick={this.goToLoginHandler} className={styles.FeatureButtonActive}>Sign In</button>
          <button onClick={this.goToResultsHandler} className={styles.FeatureButton}>See Results</button>
        </div>
      );
    }

    return (
      <Aux>
        <Helmet>
          <meta property="og:url" content={appUrls.appDomain + '/'} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="MyRunTime" />
          <meta property="og:description" content="Social Powered Race Timing" />
          <meta property="og:image" content={appUrls.appDomainNonSsl + "/images/myruntime-banner.jpeg"} />
          <meta property="og:image:secure_url" content={appUrls.appDomain + "/images/myruntime-banner.jpeg"} />
          <meta property="og:image:type" content="image/jpeg" />
        </Helmet>
        <Spinner loading={this.state.loading}/>
        <Modal title='Ooops' show={this.state.showModal} modalClosed={this.hideModal}>
          <h2 style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0'}}>Error loading races in home page</h2>
        </Modal>
        <div className={styles.HomePage}>
          <div className={styles.CarouselContainer}>
            <div className={styles.DesktopCarousel}>
              <Carousel items={banners}/>
            </div>
            <div className={styles.MobileCarousel}>
              <Carousel items={mobileBanners}/>
            </div>
            {featureButtons}
          </div>
          <div className={styles.RaceSection}>
            <h1>Recent Races</h1>
              <div className={styles.RacesContainer}>
                {
                  this.state.recentRaces.map( el => {
                    if(el.racePhotosTabEnabled && el.resultsAvailable){
                      return(
                        <TwoActionCard
                          key={el._id} 
                          cardImage={'https://myrunti.me/images/' + el.racePhoto } 
                          title={el.raceName} 
                          heading1={utils.formatDate(el.raceDate)} 
                          heading2={el.raceAddress}
                          leftActionLabel="RESULTS"
                          leftActionClicked={() => this.goToRaceResultsPage(el.raceNick) }
                          rightActionLabel="PHOTOS"
                          rightActionClicked={() => this.goToRacePhotosPage(el.raceNick)} />
                      );
                    }
                    else if(!el.racePhotosTabEnabled && el.resultsAvailable){
                      return(
                        <OneActionCard
                          key={el._id} 
                          cardImage={'https://myrunti.me/images/' + el.racePhoto } 
                          title={el.raceName} 
                          heading1={utils.formatDate(el.raceDate)} 
                          heading2={el.raceAddress}
                          actionLabel='RESULTS'
                          actionClicked={() => this.goToRaceResultsPage(el.raceNick)} />
                      );
                    }
                    else {
                      return(
                        <OneActionCard
                          key={el._id} 
                          cardImage={'https://myrunti.me/images/' + el.racePhoto } 
                          title={el.raceName} 
                          heading1={utils.formatDate(el.raceDate)} 
                          heading2={el.raceAddress}
                          actionLabel='PHOTOS'
                          actionClicked={() => this.goToRacePhotosPage(el.raceNick)} />
                      );
                    }
                  })
                }
              </div>
          </div>
          <div className={styles.RaceSection}>
            <h1>Upcoming Races</h1>
            <div className={styles.RacesContainer}>
                {
                  this.state.upcomingRaces.map( el => {
                    if(el.myruntimeRegistrationEnabled){
                      return(
                        <TwoActionCard
                          key={el._id} 
                          cardImage={'https://myrunti.me/images/' + el.racePhoto } 
                          title={el.raceName} 
                          heading1={utils.formatDate(el.raceDate)} 
                          heading2={el.raceAddress}
                          leftActionLabel="DETAILS"
                          leftActionClicked={() => this.goToRaceDetailsPage(el.raceNick) }
                          rightActionLabel="REGISTER"
                          rightActionClicked={() => this.goToRaceRegistrationPage(el.raceNick)} />
                      );
                    }
                    else{
                      return(
                        <OneActionCard
                          key={el._id} 
                          cardImage={'https://myrunti.me/images/' + el.racePhoto } 
                          title={el.raceName} 
                          heading1={utils.formatDate(el.raceDate)} 
                          heading2={el.raceAddress}
                          actionLabel='DETAILS'
                          actionClicked={() => this.goToRaceDetailsPage(el.raceNick)} />
                      );
                    }
                  })
                }
              </div>
          </div>
          <div style={{width: '100%', textAlign:'center', marginBottom: '180px'}}>
            <button className={styles.Button} onClick={this.goToRacesPage}>MORE RACES</button>
          </div>
          <div className={styles.MobileFeatureButtonGroup}>
            {mobileFeatureButtons}
          </div>
          <div className={styles.MobileSearchGroup}>
            <SearchBar placeholder='search races' searchHandler={this.searchRaces} minInputLength='3'/>
          </div>
          <div className={styles.FooterGroup}>
            <Footer />
          </div>
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
  return { };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);