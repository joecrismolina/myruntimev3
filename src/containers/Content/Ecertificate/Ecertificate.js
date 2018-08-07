import React, { Component } from 'react';
import styles from './Ecertificate.css';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import {Helmet} from "react-helmet";
import serverReq from '../../../http/serverAxios';

class Ecertificate extends Component {

  state = {
    raceNick : '',
    bibnumber : '',
    race : ''
  }

  componentDidMount () {
    let raceNick = '';
    let bibnumber = '';
    const query = new URLSearchParams(this.props.location.search);
    for (let param of query.entries()) {
      if(param[0] === 'raceNick') raceNick = param[1];
      if(param[0] === 'bibnumber') bibnumber = param[1];
    }
    this.getRace(raceNick);
    this.setState({raceNick: raceNick, bibnumber: bibnumber});
  }

  getRace = (raceNick) => {
    serverReq.get('/api/race?raceNick=' + raceNick)
      .then( resp => {
        const race = resp.data.data;
        this.setState({race: race});
      })
      .catch( err => {
        
      });
  }

  render () {

    let ecertlink = '';
    let ogParams = {};
    if(this.state.raceNick !== '' && this.state.bibnumber !== '' && this.state.race !== '') {
      ecertlink = 'https://myrunti.me/images/ecert/' + this.state.race.raceNick + '/' + this.state.bibnumber + '.jpg';
      ogParams = {
        url : "https://myrunti.me/ecert?raceNick=" + this.state.race.raceNick + '&bibnumber=' + this.state.bibnumber,
        type : 'website',
        title : this.state.race.raceName + ' E-Certificate',
        description : 'MyRunTime Race Results E-Certificate',
        image : ecertlink,
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
        <div className={styles.EcertificateContainer}>
          <img src={ecertlink} alt='ecertificate'/>
        </div>
      </Aux>
    );
  }
};

export default Ecertificate; 