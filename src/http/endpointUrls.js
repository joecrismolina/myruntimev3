// LOCALHOST DEV VALUES
let fbCallbackUrl = 'http://localhost:9000/api/facebook/authcallback';
let fbSignInUrl = 'https://www.facebook.com/v3.0/dialog/oauth?client_id=457491477676998&response_type=code&state=fbloginstateapp&redirect_uri=http://localhost:9000/api/facebook/authcallback';
let appDomain = 'http://localhost:9000';
let appDomainNonSsl = 'http://localhost:9000';
let fbAppId = '457491477676998';

// MYRUNTI.ME PROD VALUES
if (process.env.NODE_ENV === 'production'){
  fbCallbackUrl = 'https://myrunti.me/api/facebook/authcallback';
  fbSignInUrl = 'https://www.facebook.com/v3.0/dialog/oauth?client_id=353126178090062&response_type=code&redirect_uri=https://myrunti.me/api/facebook/authcallback';
  appDomain = 'https://myrunti.me';
  appDomainNonSsl = 'http://myrunti.me';
  fbAppId = '353126178090062';
}

exports.fbCallbackUrl = fbCallbackUrl;
exports.fbSignInUrl = fbSignInUrl;
exports.appDomain = appDomain;
exports.appDomainNonSsl = appDomainNonSsl;
exports.fbAppId = fbAppId;