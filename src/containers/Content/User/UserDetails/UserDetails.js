import React, { Component } from 'react';
import Aux from '../../../../hoc/Auxiliary/Auxiliary';
import EditableInfoCard from '../../../../ui/EditableInfoCard/EditableInfoCard';
import EditableImageCard from '../../../../ui/EditableImageCard/EditableImageCard';
import Avatar from '../../../../assets/images/myruntime-avatar-240x240.png';
import * as utils from '../../../../utils/utils';
import styles from './UserDetails.css';

class UserDetails extends Component  {

  state = {
    editable : false,
    userImage : Avatar,
    userImagePreview : Avatar
  }

  componentDidMount () {
    if(this.props.user) {
      this.setState({updatedUser: {...this.props.user} });
      this.getUserProfilePhoto(this.props.user);
    }
  }

  getUserProfilePhoto = (user) => {
    let profilePic = Avatar;
    let previewProfilePic = Avatar;
    utils.getProfileImageSrc(user).then( resp => {
      profilePic = resp;
      previewProfilePic = utils.getProfileImagePreviewSrc(user);
      this.setState({userImage:profilePic , userImagePreview: previewProfilePic});
    });
  }

  saveUserDetailsChanges = (updatedValue, identifier) => {
    let updatedUser = {...this.state.updatedUser};
    updatedUser[identifier] = updatedValue;
    this.props.onSaveChanges(updatedUser);
  }

  render () {
    let userDetailsToShow = null;
    if(this.props.editable) {
      userDetailsToShow = (
        <Aux>
          <EditableImageCard editable={true} userImage={this.state.userImage} preview={this.state.userImagePreview} onImageUpdate={this.props.onImageUpdate}/>
          <EditableInfoCard onSaveChanges={this.saveUserDetailsChanges} identifier='firstName' editable={this.props.editable} type="text" subtype="text" value={this.props.user.firstName} label='first name' />
          <EditableInfoCard onSaveChanges={this.saveUserDetailsChanges} identifier='lastName' editable={this.props.editable} type="text" subtype="text" value={this.props.user.lastName} label='last name' />
          <EditableInfoCard onSaveChanges={this.saveUserDetailsChanges} identifier='gender' editable={this.props.editable} type="select" subtype="gender" value={this.props.user.gender} label='gender' options={{options: [{value: 'M', label: 'male'}, {value: 'F', label: 'female'}]}}/>
          <EditableInfoCard onSaveChanges={this.saveUserDetailsChanges} identifier='birthdate' editable={this.props.editable} type="date" subtype="date" value={this.props.user.birthdate} label='birthdate' />
          <EditableInfoCard onSaveChanges={this.saveUserDetailsChanges} identifier='email' editable={false} type="email" subtype="email" verifiable={true} verified={true} value={this.props.user.email} label='email' />
          <EditableInfoCard onSaveChanges={this.saveUserDetailsChanges} identifier='mobileNo' editable={this.props.editable} subtype="mobileNo" verifiable={true} verified={false} type="text" value={this.props.user.mobileNo} label='mobile no.' />
        </Aux>
      );
    }
    else {
      userDetailsToShow = (
        <Aux>
          <EditableImageCard editable={false} userImage={this.state.userImage} preview={this.state.userImagePreview} onImageUpdate={this.props.onImageUpdate}/>
          <EditableInfoCard editable={false} type="text" value={this.props.user.firstName} label='first name' />
          <EditableInfoCard editable={false} type="text" value={this.props.user.lastName} label='last name' />
          <EditableInfoCard editable={false} type="select" value={utils.formatGender(this.props.user.gender)} label='gender' options={{options: [{value: 'M', label: 'male'}, {value: 'F', label: 'female'}]}} />
        </Aux>
      );
    }
    return (
      <Aux>
        <div className={styles.UserDetailsContainer}>
          { userDetailsToShow }
        </div>
      </Aux>
    );
  }
};

export default UserDetails;