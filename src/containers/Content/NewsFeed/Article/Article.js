import React, { Component } from 'react';
import Aux from '../../../../hoc/Auxiliary/Auxiliary';
import ProgressiveImage from '../../../../ui/ProgressiveImage/ProgressiveImage';
import Spinner from '../../../../ui/Spinner/Spinner';
import Modal from '../../../../ui/Modal/Modal';
import styles from './Article.css';
import serverReq from '../../../../http/serverAxios';
import * as utils from '../../../../utils/utils';
import FBShareButton from '../../../../assets/images/fb-share-button.jpg';
import {Helmet} from "react-helmet";

class Article extends Component {

  state = {
    loading: true,
    article : {},
    showModal : false
  }

  componentDidMount () {
    let articleId = '';
    const query = new URLSearchParams(this.props.location.search);
    for (let param of query.entries()) {
      if(param[0] === 'id') articleId = param[1];
    }
    if(articleId !== ''){
      this.setState({loading: true});
      serverReq.get('/api/article?id=' + articleId)
        .then( resp => {
          this.setState({article: resp.data.data, loading: false});
        })
        .catch( err => {
          this.setState({loading: false, showModal: true});
        });
    }
  }

  hideModal = () => {
    this.setState({showModal: false});
  }

  shareViaPageFB = () => {
    const articleUrl = 'https%3A%2F%2Fmyrunti.me%2Fnews-feed%2Farticle%3Fid%3D' + encodeURIComponent(this.state.article._id);
    const fbShareUrl = "https://www.facebook.com/sharer/sharer.php?u=" + articleUrl;
    window.open(fbShareUrl);
  }

  generateSpotifyURI = (subURLStrings) => {
    var URIString = '';
    subURLStrings.forEach( (eachString, index) => {
      if (index !== subURLStrings.length - 1) {
        URIString = URIString + eachString + ':';
      }
      else {
        URIString = URIString + eachString;
      }
    });
    return URIString;
  };

  render () {
    let ogParams = {};
    if(this.state.article) {
      ogParams = {
        url : 'https://myrunti.me/news-feed/article?id=' + this.state.article._id,
        type : 'website',
        title : this.state.article.title,
        description : this.state.article.description,
        image : 'https://myrunti.me/images/' + this.state.article.image
      }
    }

    let externalArticleBody = null;
    if(this.state.article.type === 'external') {
      externalArticleBody = (
        <Aux>
          <div className={styles.ExternalArticleDigest} dangerouslySetInnerHTML={{ __html: this.state.article.digest }}></div>
          <a href={this.state.article.articleUrl}><div className={styles.ExternalArticleReadMore}>READ MORE</div></a>
        </Aux>
      );
    }

    let articleBody = null;
    if(this.state.article.articleHtml && this.state.article.articleHtml !== '') {
      const articleBodyElements = this.state.article.articleHtml.split('$ELEM');
      articleBody = articleBodyElements.map( el => {
        if (el.startsWith("$YOUTUBEVIDEO=")) {
          const url = el.split("$YOUTUBEVIDEO=")[1];
          return (<iframe src={url} style={{margin: '10px 0'}} frameborder='0' allowfullscreen title={url}></iframe>);
        }
        else {
          return (<div style={{margin: '10px 0'}} dangerouslySetInnerHTML={{ __html: el }}></div>)
        }
      })
    }

    let spotifyPlaylist = null;
    if(this.state.article.type === 'myruntimePlaylist') {
      const playlistSubURL = this.state.article.playlistUrl.split('.com/', 2)[1];
      const playlistSubURLStrings = playlistSubURL.split('/');
      const spotifyURI = 'https://embed.spotify.com/?uri=spotify:' + this.generateSpotifyURI(playlistSubURLStrings) + '&theme=white';
      spotifyPlaylist = (
        <Aux>
          <iframe src={spotifyURI} frameborder="0" allowtransparency="true" title="playlist"/>
          <div className={styles.ArticlePlaylistFootnote}>
            <p>You need to have Spotify to listen to this playlist</p>
            <p>Follow us on Spotify: <a href="https://open.spotify.com/user/myruntime">https://open.spotify.com/user/myruntime</a></p>
          </div>
        </Aux>
      );
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
        <Spinner loading={this.state.loading}/>
        <Modal title='Ooops' show={this.state.showModal} modalClosed={this.hideModal}>
          <h2 style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0'}}>Error loading article</h2>
        </Modal>
        <div className={styles.ArticleContainer}>
          <div className={styles.ArticleBanner}>
            <ProgressiveImage src={'https://myrunti.me/images/' + this.state.article.image} alt={this.state.article.title}/>
          </div>
          <div className={styles.ArticleShareButton} onClick={() => this.shareViaPageFB()}><img src={FBShareButton} alt='share'/></div>
          <div className={styles.ArticleTitle}>{this.state.article.title}</div>
          <div className={styles.ArticleAuthor}>BY : <strong>{this.state.article.sourceName}</strong> - {utils.formatDate(this.state.article.dateAdded)}</div>
          <div className={styles.ArticleBody}>
            {articleBody}
          </div>
          <div className={styles.ExternalArticleBody}>
            {externalArticleBody}
          </div>
          <div className={styles.ArticlePlaylist}>
            {spotifyPlaylist}
          </div>
        </div>
      </Aux>
    );
  }
};

export default Article;