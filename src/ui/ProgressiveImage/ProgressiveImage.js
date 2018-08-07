import React, { Component } from 'react';
import styles from './ProgressiveImage.css';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import RaceImageHolder from '../../assets/images/race-image-holder.jpg';

class ProgressiveImage extends Component {

  state = {
    imageLoaded : false,
    image : null,
  }

  componentDidMount () { }

  componentDidUpdate () { }

  imageLoaded = () => {
    this.setState({imageLoaded: true});
  }

  render () {

    let defaultImageClass = styles.Hidden;
    let actualImageClass = styles.Hidden;
    if(this.state.imageLoaded) {
      actualImageClass = styles.Loaded;
    }
    else {
      defaultImageClass = styles.Loaded
    }

    let preview = (<img src={RaceImageHolder} className={defaultImageClass} alt={this.props.alt}/>);
    if(this.props.preview) preview = (<img src={this.props.preview} className={[defaultImageClass, styles.PreviewImageClass].join(' ')} alt={this.props.alt}/>);

    return (
      <Aux>
        {preview}
        <img src={this.props.src} onLoad={this.imageLoaded} className={actualImageClass} alt={this.props.alt}/> 
      </Aux>
    );
  }
}

export default ProgressiveImage;