import React, { Component } from 'react';

class GoogleAds extends Component {

  componentDidMount () {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }

  render () {
    return (
      <div style={{minWidth: '100%'}}>      
        <ins className="adsbygoogle" style={{display:'block'}} data-ad-client={this.props.dataAdClient} data-ad-slot={this.props.dataAdSlot} data-ad-format="auto"></ins>
      </div>
    );
  }
};

export default GoogleAds;