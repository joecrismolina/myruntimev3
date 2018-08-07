import React, { Component } from 'react';
import Webcam from 'react-webcam';
import styles from './Webcam.css';

class ThisWebcam extends Component {

  setRef = (webcam) => {
    this.webcam = webcam;
  }

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.props.onImageCaptured(imageSrc);
  };

  render () {
    return (
      <div className={styles.WebcamContainer}>
        <Webcam
          audio={false}
          height={200}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={200}
        />
        <button className={styles.CaptureImageButton} onClick={this.capture}>Capture photo</button>
        <button className={styles.CloseWebcamButton} onClick={this.props.onClose}>Close</button>
      </div>
    );
  }
};

export default ThisWebcam;