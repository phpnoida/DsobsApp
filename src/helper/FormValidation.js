import {URL_REGX} from '../helper/Constants';

export default function validateFieldCommon(
  fieldName,
  value,
  state,
  notRequiredField,
) {
  const {errorFlags, errorMessage} = state;
  const {
    urlRegex,
    emailRegex,
    twiterRegex,
    fbRegex,
    instaRegex,
    googleRegex,
    youtubeRegex,
    wikiRegex,
    phoneRegex,
  } = URL_REGX;

  const linkTypeFields = [
    'profileUrl',
    'webUrl',
    'byVideo',
    'byUrl',
    'link',
    'ProjectVideo',
    'otherLink',
    'video_link',
    'pageUrl',
    'linkedin',
  ];
  const textareaFields = ['aboutMe', 'comment', 'aboutProject'];
  const emailTypeFiled = ['myEmail', 'scondaryEmail', 'email'];
  const fbLink = ['fbLink'];
  const twLink = ['twLink'];
  const instaLink = ['instaLink'];
  const wikiLink = ['wikiLink'];
  const googleLinks = ['googleLink'];
  const youtubeLinks = ['youtubeLink'];
  const phoneNo = ['whatsappNo', 'agentPhone'];

  function validateRegex(regex, val) {
    var found = val.match(regex);
    var bool = found && found.length;
    return bool;
  }

  if (value === undefined || value === null || !value) {
    if (notRequiredField && notRequiredField.indexOf(fieldName) > -1) {
      delete errorMessage[fieldName];
      errorFlags[fieldName] = false;
    } else {
      errorMessage[fieldName] = 'This field required!';
      errorFlags[fieldName] = true;
    }
  } else if (value && textareaFields.indexOf(fieldName) > -1) {
    if (value.length < 100) {
      errorFlags[fieldName] = true;
      errorMessage[fieldName] = 'Minimum length of field is 100 characters!';
    } else if (value.length > 10000) {
      errorFlags[fieldName] = true;
      errorMessage[fieldName] = 'Minimum length of field is 10000 characters!';
    } else {
      errorFlags[fieldName] = false;
      if (errorMessage[fieldName]) {
        delete errorMessage[fieldName];
      }
    }
  } else if (value && fieldName === 'conpassword') {
    if (value !== state.password) {
      errorFlags[fieldName] = true;
      errorMessage[fieldName] = 'Password are not matching!';
    } else {
      errorFlags[fieldName] = false;
      if (errorMessage[fieldName]) {
        delete errorMessage[fieldName];
      }
    }
  } else if (value && fieldName === 'pinCode') {
    if (value.length !== 6) {
      errorFlags[fieldName] = true;
      errorMessage[fieldName] = 'Pincode must have 6 digits!';
    } else {
      errorFlags[fieldName] = false;
      if (errorMessage[fieldName]) {
        delete errorMessage[fieldName];
      }
    }
  } else if (
    value &&
    linkTypeFields.indexOf(fieldName) > -1 &&
    !validateRegex(urlRegex, value)
  ) {
    errorFlags[fieldName] = true;
    errorMessage[fieldName] = 'Entered link is not valid!';
  } else if (
    value &&
    emailTypeFiled.indexOf(fieldName) > -1 &&
    !validateRegex(emailRegex, value)
  ) {
    errorFlags[fieldName] = true;
    errorMessage[fieldName] = 'Email address is not valid!';
  } else if (
    value &&
    fbLink.indexOf(fieldName) > -1 &&
    !validateRegex(fbRegex, value)
  ) {
    errorFlags[fieldName] = true;
    errorMessage[fieldName] = 'Facebook link is not valid!';
  } else if (
    value &&
    twLink.indexOf(fieldName) > -1 &&
    !validateRegex(twiterRegex, value)
  ) {
    errorFlags[fieldName] = true;
    errorMessage[fieldName] = 'Twitter link is not valid!';
  } else if (
    value &&
    instaLink.indexOf(fieldName) > -1 &&
    !validateRegex(instaRegex, value)
  ) {
    errorFlags[fieldName] = true;
    errorMessage[fieldName] = 'Instagram link is not valid!';
  } else if (
    value &&
    googleLinks.indexOf(fieldName) > -1 &&
    !validateRegex(googleRegex, value)
  ) {
    errorFlags[fieldName] = true;
    errorMessage[fieldName] = 'Google link is not valid!';
  } else if (
    value &&
    wikiLink.indexOf(fieldName) > -1 &&
    !validateRegex(wikiRegex, value)
  ) {
    errorFlags[fieldName] = true;
    errorMessage[fieldName] = I18n.t('errormsg').wikipedia_link_is_not_valid;
  } else if (
    value &&
    youtubeLinks.indexOf(fieldName) > -1 &&
    !validateRegex(youtubeRegex, value)
  ) {
    errorFlags[fieldName] = true;
    errorMessage[fieldName] = 'Youtube link is not valid!';
  } else if (
    value &&
    phoneNo.indexOf(fieldName) > -1 &&
    !validateRegex(phoneRegex, value)
  ) {
    errorFlags[fieldName] = true;
    errorMessage[fieldName] = 'Phone number is not valid!';
  } else if (!value && fieldName === 'agree') {
    errorFlags[fieldName] = true;
    errorMessage[fieldName] = 'This field is required!';
  } else {
    errorFlags[fieldName] = false;
    if (errorMessage[fieldName]) {
      delete errorMessage[fieldName];
    }
  }
  return {
    errorMessage: errorMessage,
    errorFlags: errorFlags,
  };
}
