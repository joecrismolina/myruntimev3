import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Spinner from '../../ui/Spinner/Spinner';
import Modal from '../../ui/Modal/Modal';
import ProgressiveImage from '../ProgressiveImage/ProgressiveImage';
import Webcam from '../Webcam/Webcam';
import styles from './EditableImageCard.css';

class EditableImageCard extends Component {

  state = {
    loading : false,
    userImage : '',
    userImagePreview : '',
    imageFile : '',
    fileType: '',
    unsavedChanges : false,
    showWebcamModal : false,
    showMessageModal : false,
    modalTitle : '',
    modalMessage : ''
  }

  componentDidMount () {
    if(this.props.userImage) this.setState({userImage: this.props.userImage, userImagePreview: this.props.preview, imageToCrop: this.props.userImage})
  }

  componentDidUpdate (prevProps, prevState) {
    if(prevProps.userImage !== this.props.userImage) this.setState({userImage: this.props.userImage, imageToCrop: this.props.userImage});
    if(prevProps.userImagePreview !== this.props.userImagePreview) this.setState({userImagePreview: this.props.preview});
  }

  takePhoto = () => {
    this.setState({showWebcamModal: true });
  }

  onImageCaptured = (image) => {
    this.setState({showWebcamModal: false, userImage: image});
  }

  saveImageChanges = () => {
    this.props.onImageUpdate(this.state.imageFile, this.state.fileType);
  }

  hideWebcamModal = () => {
    this.setState({showWebcamModal: false });
  }

  hideMessageModal = () => {
    this.setState({showMessageModal: false });
  }

  onImageCapturedHandler = (imageSrc) => {
    if(imageSrc) {
      this.setState({userImage: imageSrc, unsavedChanges: true, imageFile: imageSrc, showWebcamModal: false, fileType: 'image'});
    }
  }

  handleChangeFile = (file) => {
    if(file){
      let reader = new FileReader();
      if(file.size > 500000) {
        this.setState({showMessageModal: true, modalTitle: 'Ooops', modalMessage: 'Max file size should be 500 KB'});
      }
      else if(file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/JPG' || file.type === 'image/JPEG' || file.type === 'image/png' || file.type === 'image/PNG') {
        reader.onload = (onLoadEvent) => {
        let buffer = onLoadEvent.target.result;
          this.setState({userImage: buffer, unsavedChanges: true, imageFile: file, fileType: 'file'});
        }
        reader.readAsDataURL(file);
      }
      else {
        this.setState({showMessageModal: true, modalTitle: 'Ooops', modalMessage: 'File should be of type JPEG or PNG'});
      }
    }
    else{ return; }
  }

  render () {

    let webcammodal = null;
    if(this.state.showWebcamModal) {
      webcammodal = (
        <Webcam onImageCaptured={this.onImageCapturedHandler} onClose={this.hideWebcamModal}/>
      );
    }

    let editControls = null;
    if(this.props.editable) {
      editControls = (
          <div className={styles.ImageActionButtonsContainer}>
            <button className={styles.TakePhotoButton} onClick={this.takePhoto}>
              <i className="material-icons">camera_alt</i>
              <div> TAKE PHOTO</div> 
            </button>
            <button className={styles.UploadImageButton} onClick={(e) => this.upload.click() }>
              <i className="material-icons">photo</i>
              <div> UPLOAD IMAGE</div> 
            </button>
            <button className={styles.SaveImageChangesButton} disabled={!this.state.unsavedChanges} onClick={this.saveImageChanges}>
              <i className="material-icons">save</i> 
              <div> SAVE CHANGES</div>
            </button>
          </div>
      );
    }

    return (
      <Aux>
        <Spinner loading={this.state.loading} />
        <Modal title={this.state.modalTitle} show={this.state.showMessageModal} modalClosed={this.hideMessageModal}>
          <p style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0', fontFamily:'inherit', fontSize:'1.0em'}}>{this.state.modalMessage}</p>
        </Modal>
        <Modal title='Take Photo' show={this.state.showWebcamModal} modalClosed={this.hideWebcamModal}>
          {webcammodal}
        </Modal>
        <input type="file" ref={(ref) => this.upload = ref} style={{ display: 'none' }} onChange={ (e) => this.handleChangeFile(e.target.files[0]) } accept=".jpg,.jpeg,.JPG,.JPEG,.png,.PNG"/>
        <div className={styles.EditableImageContainer}>
          <div className={styles.DisplayImageContainer}>
            <ProgressiveImage src={this.state.userImage} preview={this.state.userImagePreview} alt='user'/>
          </div>

          {editControls}

        </div>
      </Aux>
    );
  }
};

export default EditableImageCard;