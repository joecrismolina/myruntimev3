/* utility files */
import axios from 'axios';
import Avatar from '../assets/images/myruntime-avatar-240x240.png';

const getDateTimeString = (dateString) => {
  const d = new Date(dateString);
  const m = d.getMonth();
  let mS = '';
  switch (m) {
    case 0:
      mS = 'January'
      break;
    case 1:
      mS = 'February'
      break;
    case 2:
      mS = 'March'
      break;
    case 3: 
      mS = 'April'
      break;
    case 4:
      mS = 'May'
      break;
    case 5:
      mS = 'June'
      break;
    case 6:
      mS = 'July'
      break;
    case 7:
      mS = 'August'
      break;
    case 8:
      mS = 'September'
      break;
    case 9:
      mS = 'October'
      break;
    case 10:
      mS = 'November'
      break;
    case 11:
      mS = 'December'
      break;
    default:
      mS = ''
      break;
  }

  const datePart = mS + ' ' + d.getDate() + ', ' + d.getFullYear();
  let hr = d.getHours();
  let mn = d.getMinutes();
  let sc = d.getSeconds();
  let timePart = '';

  let mnStr = '';
  let scStr = '';

  if(mn < 10) mnStr = '0' + mn.toString();
  else mnStr = mn.toString();

  if(sc < 10) scStr = '0' + sc.toString();
  else scStr = sc.toString();

  if (hr > 12) {
    hr = hr - 12;
    timePart = hr.toString() + ':' + mnStr + ':' + scStr + ' PM';  
  }
  else{
    timePart = hr.toString() + ':' + mnStr + ':' + scStr + ' AM'; 
  } 

  return ({
    datePart: datePart,
    timePart: timePart,
    dateTime: datePart + ' ' + timePart
  });
};

export const formatDateTime = (dateString) => {
  return getDateTimeString(dateString).dateTime;
};

export const formatDate = (dateString) => {
  return getDateTimeString(dateString).datePart;
};

export const formatTime = (dateString) => {
  return getDateTimeString(dateString).timePart;
};

export const secondsToTimeString = (seconds) => {
  const hrs = Math.floor(seconds / (3600));
  const mins = Math.floor((seconds - (hrs * 3600)) / 60);
  const secs = Math.floor((seconds - (mins * 60) - (hrs * 3600)));
  let hrsStr = hrs.toString();
  if(hrs < 10) hrsStr = '0' + hrs.toString();
  let minsStr = mins.toString();
  if(mins < 10) minsStr = '0' + mins.toString();
  let secsStr = secs.toString();
  if(secs < 10) secsStr = '0' + secs.toString();
  return hrsStr + ":" + minsStr + ":" + secsStr;
};

export const formatMonthShort = (dateString) => {
  const d = new Date(dateString);
  const m = d.getMonth();
  let mS = '';
  switch (m) {
    case 0:
      mS = 'Jan'
      break;
    case 1:
      mS = 'Feb'
      break;
    case 2:
      mS = 'March'
      break;
    case 3: 
      mS = 'April'
      break;
    case 4:
      mS = 'May'
      break;
    case 5:
      mS = 'June'
      break;
    case 6:
      mS = 'July'
      break;
    case 7:
      mS = 'Aug'
      break;
    case 8:
      mS = 'Sept'
      break;
    case 9:
      mS = 'Oct'
      break;
    case 10:
      mS = 'Nov'
      break;
    case 11:
      mS = 'Dec'
      break;
    default:
      mS = ''
      break;
  }
  return mS;
}

export const parseDateForInput = (dateInput) => {
  const date = new Date(dateInput);
  let m = '';
  if((date.getMonth() + 1) < 10) m = '0' + (date.getMonth() + 1).toString();
  else m = (date.getMonth() + 1).toString();
  let d = '';
  if(date.getDate() < 10) d = '0' + (date.getDate()).toString();
  else d = (date.getDate()).toString();
  return date.getFullYear() + "-" + m + '-' + d;
}

export const formatGender = (inputString) => {
  if(inputString === 'M'|| inputString === 'm' || inputString === 'Male' || inputString === 'male' || inputString === 'MALE') return 'male';
  else return 'female';
}

export const formatDistanceToKm = (distanceInMeters) => {
  if(distanceInMeters % 1000 !== 0) {
    return (distanceInMeters / 1000).toFixed(3) + ' KM';
  }
  else {
    return (distanceInMeters / 1000).toFixed(0) + ' KM';
  }
}

export const getAge = (date) => {
  const now = new Date();
  var birthdate = new Date(date);
  let age = now.getFullYear() - birthdate.getFullYear();
  if(now.getMonth() < birthdate.getMonth()) return (age - 1);
  else if(now.getMonth() === birthdate.getMonth()) {
    if(now.getDate() < birthdate.getDate()) return (age - 1);
    else return age;
  }
  else {
    return age;
  }
}

export const getProfileImageSrc = (user) => {
  return new Promise(function (resolve, reject){
    if(user){
      if(user.faceBookId && user.faceBookId !== '') {
        // FB USER
        if(user.profileImage && user.profileImage.startsWith('http')){
          axios.get('https://graph.facebook.com/' + user.faceBookId + '/picture?redirect=0&height=240&type=normal&width=240')
          .then( resp => {
            resolve (resp.data.data.url);
          })
          .catch( err => {
            resolve (Avatar);
          })
        }
        else if (!user.profileImage) {
          axios.get('https://graph.facebook.com/' + user.faceBookId + '/picture?redirect=0&height=240&type=normal&width=240')
          .then( resp => {
            resolve (resp.data.data.url);
          })
          .catch( err => {
            resolve (Avatar);
          })
        }
        else if (user.profileImage){
          resolve ('https://myrunti.me/images/userimages/' + user.profileImage);
        }
        else {
          resolve(Avatar);
        }
      }
      else if (user.profileImage) { 
        resolve ('https://myrunti.me/images/userimages/' + user.profileImage);
      }
      else {
        resolve(Avatar);
      }
    }
    else {
      resolve(Avatar);
    }
  })
}

export const getProfileImagePreviewSrc = (user) => {
  if(user){
    if(user.faceBookId !== '') {
      return(Avatar);
    }
    else return ('https://myrunti.me/images/userimages/preview-' + user.profileImage);
  }
  else{
    return(Avatar);
  }
}

export const nameToProper = (name) => {
  try{
    if (name.toLowerCase() === 'iii' || name.toLowerCase() === 'iv' || name === '') {
      return name;
    }
    else{
      if(name.length === 1) return name.toUpperCase();
      else{
        return (((name.split(' ')).map( (s) => {
            if(s === '' || s.length === 1){
              return s;
            }
            else{
              return ( s[0].toUpperCase() +  (s.slice(1)).toLowerCase() );
            } 
          }
        )).join(' '));
      }
    }
  }
  catch (err) {
    return name;
  }
}