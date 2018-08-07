import React from 'react';
import ProgressiveImage from '../../../../ui/ProgressiveImage/ProgressiveImage';
import * as utils from '../../../../utils/utils'; 
import styles from './Details.css';
import ResponsiveTable from '../../../../ui/ResponsiveTable/ResponsiveTable';
import FBShareButton from '../../../../assets/images/fb-share-button.jpg';

const raceDetails = (props) => {

      const waveScheduleTableHeaders = ['Distance/Wave', 'Date', 'Gun Start'];
      let waveSchedule = [];

      const regFeeTableHeaders = ['Distance/Wave', 'Amount', 'Race Kit', 'Finisher Token'];
      let regFee = [];

      props.race.waves.forEach( wave => {
        let waveScheduleRow = [];
        waveScheduleRow.push({dataLabel: 'Distance/Wave', data: wave.waveName});
        let waveTimeStart = 'TBA';
        if(wave.waveDate && (utils.formatTime(wave.waveDate) !== '11:59:00 PM')) waveTimeStart = utils.formatTime(wave.waveDate);
        waveScheduleRow.push({dataLabel: 'Date', data: utils.formatDate(wave.waveDate)});
        waveScheduleRow.push({dataLabel: 'Gun Start', data: waveTimeStart});
        waveSchedule.push(waveScheduleRow);

        let regFeeRow = [];
        regFeeRow.push({dataLabel: 'Distance/Wave', data: wave.waveName});
        regFeeRow.push({dataLabel: 'Amount', data: wave.regFee});
        regFeeRow.push({dataLabel: 'Race Kit', data: wave.raceKit});
        regFeeRow.push({dataLabel: 'Finisher Token', data: wave.finisherToken});
        regFee.push(regFeeRow);
      });

      const regOptionsTableHeaders = ['Type', 'Location', 'Address', 'Duration'];
      let regOptions = [];

      props.race.registrations.forEach( reg => {
        let regOptionRow = [];
        let address = reg.address;
        if(reg.address.startsWith('http')) {
          address = (<a href={reg.address}>GO TO LINK</a>);
        }
        regOptionRow.push({dataLabel: 'Type', data: reg.type});
        regOptionRow.push({dataLabel: 'Location', data: reg.location});
        regOptionRow.push({dataLabel: 'Address', data: address});
        regOptionRow.push({dataLabel: 'Duration', data: reg.duration || '--'});
        regOptions.push(regOptionRow);
      });

  return (
    <div className={styles.RaceDetails}>
        <div className={styles.RaceBanner}>
          <ProgressiveImage src={'https://myrunti.me/images/' + props.race.racePhoto} alt='race banner'/>
        </div>

        <div className={styles.RaceDetailsContainer}>
          
          <div className={styles.RaceName}>{props.race.raceName}</div>
          <div className={styles.RaceOrganizer}>ORGANIZER: {props.race.raceOrganizer}</div>

          <div className={styles.RaceDate}>{utils.formatDate(props.race.raceDate)}</div>
          <div className={styles.RaceAddress}>{props.race.raceAddress}</div>
          <div className={styles.RaceShareButton} onClick={() => props.shareViaPageFB('details')}><img src={FBShareButton} alt='share'/></div>

          <div className={styles.TableLabel}>SCHEDULE AND DISTANCES</div>
          <ResponsiveTable headers={waveScheduleTableHeaders} rows={waveSchedule} />

          <div className={styles.TableLabel}>REGISTRATION FEES</div>
          <ResponsiveTable headers={regFeeTableHeaders} rows={regFee} />

          <div className={styles.TableLabel}>REGISTRATION OPTIONS</div>
          <ResponsiveTable headers={regOptionsTableHeaders} rows={regOptions} />

          <div className={styles.TableLabel}>RACE DESCRIPTION</div>
          <div className={styles.RaceDescription} dangerouslySetInnerHTML={{ __html: props.race.raceDescription }}></div>

          <div className={styles.TableLabel}>RACE WEBSITE</div>
          <div className={styles.RaceWebsite}>
            <a href={props.race.raceWebsite}>{props.race.raceName}</a>
          </div>

        </div>
      
    </div>
  );
};

export default raceDetails;