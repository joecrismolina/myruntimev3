import React, { Component } from 'react';
import styles from './ResultsCard.css';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import ConfirmModal from '../../ui/ConfirmModal/ConfirmModal';
import RunningIcon from '../../assets/images/running-icon-small.png';
import CyclingIcon from '../../assets/images/cycling-icon-small.png';
import SwimmingIcon from '../../assets/images/swimming-icon-small.png';
import MultiSportsIcon from '../../assets/images/multisports-icon-small.png';
import ObstacleIcon from '../../assets/images/obstacle-icon-small.png';

import * as utils from '../../utils/utils';

class ResultsCard extends Component {

  state = {
    loading : true,
    cardExpanded : false,
    showActionConfirmModal : false
  }

  componentDidMount () {
    
  }

  viewAnalysisHandler = () => {
    if(this.props.result.result && this.props.result.race){
      this.props.history.push('/results?view=analysis&raceNick=' + this.props.result.race.raceNick + '&bibnumber=' + this.props.result.result.bibnumber);
    }
    else{
      return;
    }
  }

  toggleCollapseCard = () => {
    const updatedCardExpanded = !this.state.cardExpanded;
    this.setState({cardExpanded: updatedCardExpanded});
  }

  cancelDisconnect = () => {
    this.setState({showActionConfirmModal: false});
  }

  confirmDisconnect = () => {
    this.setState({showActionConfirmModal: false});
    this.props.onDisconnectRace(this.props.result);
  }

  disconnectRaceHandler = () => {
    this.setState({showActionConfirmModal: true});
  }

  render () {

    let cardStyle = [styles.ExpandableArea, styles.HideMobile].join(' ');
    let buttonMessage = 'SHOW MORE';
    if(this.state.cardExpanded) {
      cardStyle = [styles.ExpandableArea, styles.ShowMobile].join(' ');
      buttonMessage = 'SHOW LESS';
    }

    let raceTypeIcon = <img src={RunningIcon} alt='running' />;
    if(this.props.result.race.raceType === 'cycling') raceTypeIcon = <img src={CyclingIcon} alt='cycling' />;
    if(this.props.result.race.raceType === 'swimming') raceTypeIcon = <img src={SwimmingIcon} alt='swimming' />;
    if(this.props.result.race.raceType === 'multisports') raceTypeIcon = <img src={MultiSportsIcon} alt='multisports' />;
    if(this.props.result.race.raceType === 'obstacle') raceTypeIcon = <img src={ObstacleIcon} alt='obstacle race' />;

    let disconnectButtonStyle = [styles.DisconnectRaceButton, styles.Hidden].join(' ');
    if(this.props.authenticatedUserOwnPage) disconnectButtonStyle = styles.DisconnectRaceButton;

    return (
      <Aux>
        <ConfirmModal 
          title='Confirm Race Disconnect' 
          message='Are you sure you want to remove this result from your list of races?' 
          onCancel={this.cancelDisconnect} 
          onConfirm={this.confirmDisconnect}
          showModal={this.state.showActionConfirmModal}
          modalClosed={this.cancelDisconnect}/>
        <div className={styles.CollapseCard}>
          <div className={styles.ResultsCard}>
            <div className={styles.RaceTypeContainer}>
              <div className={styles.RaceTypeIcon}>
                { raceTypeIcon }
              </div>
            </div>
            <div className={styles.RaceResultsContainer}>
              <h1>{this.props.result.race.raceName}</h1>
              <div className={cardStyle}>
                <button className={styles.ViewAnalysisButton} onClick={this.viewAnalysisHandler}>VIEW ANALYSIS</button>
                <div className={styles.ResultsParticularsContainer}>
                  <div className={styles.ResultsParticular}>
                    <h1>{utils.formatDistanceToKm((this.props.result.race.waves.filter( (w) => w.waveId === this.props.result.result.waveId))[0].waveDistance)}</h1>
                    <div className={styles.ResultsParticularLabel}><p>DISTANCE</p></div>
                  </div>
                  <div className={styles.ResultsParticular}>
                    <h1>{utils.secondsToTimeString(this.props.result.result.gunTime)}</h1>
                    <div className={styles.ResultsParticularLabel}><p>GUN TIME</p></div>
                  </div>
                  <div className={styles.ResultsParticular}>
                    <h1>{utils.secondsToTimeString(this.props.result.result.chipTime)}</h1>
                    <div className={styles.ResultsParticularLabel}><p>CHIP TIME</p></div>
                  </div>
                </div>
                <button className={disconnectButtonStyle} onClick={this.disconnectRaceHandler}>DISCONNECT</button>
              </div>
            </div>
            <div className={styles.RaceDateContainer}>
              <h1>{utils.formatMonthShort(this.props.result.race.raceDate)}</h1>
              <p>{(new Date(this.props.result.race.raceDate)).getDate()}, {(new Date(this.props.result.race.raceDate)).getFullYear()}</p>
            </div>
          </div>
          <button className={styles.ToggleCollapseButton} onClick={this.toggleCollapseCard}>{buttonMessage}</button>
        </div>
      </Aux>
    );
  }
};

export default ResultsCard;