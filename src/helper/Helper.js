import {SERVER_PATH, AUTH_KEY} from '../../config';
import {Linking, Alert} from 'react-native';
import {APP_NAME, WHATSAPP_NO} from '../helper/Constants';

const Helpers = {
  ToastShow: function (name, style) {
    if (style === 'success') {
      global.toast_reff.show_toast(name, 1);
    } else {
      global.toast_reff.show_toast(name, 0);
    }
  },

  validateRegex: function (regex, val) {
    var found = val.match(regex);
    var bool = found && found.length;
    return bool;
  },

  getYearList: function () {
    let year = '';
    let yearList = [];
    let cYear = new Date().getFullYear();
    let sYear = 1920;
    for (let i = 0; i <= cYear - sYear; i++) {
      year = sYear + i;
      yearList.push({key: year, text: year});
    }
    return yearList.reverse();
  },

  getBloodGroup: function () {
    let bloodGroups = [
      {key: 0, text: 'O+'},
      {key: 1, text: 'O-'},
      {key: 2, text: 'A+'},
      {key: 3, text: 'A-'},
      {key: 4, text: 'B+'},
      {key: 5, text: 'B-'},
      {key: 6, text: 'AB+'},
      {key: 7, text: 'AB-'},
      {key: 8, text: "I Don't Know"},
    ];
    return bloodGroups;
  },

  shareToWhatsAppWithContact: function (phone, message) {
    console.log('phone', phone);
    let url = `whatsapp://send?text=${message}&phone=${phone}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Please install Whatsapp App first');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(() => console.log(''));
  },

  getThumbnail: function (video, imgType) {
    var lastIndex = video.lastIndexOf('/');
    if (lastIndex > -1) {
      var id = video.substr(lastIndex);
      return `https://img.youtube.com/vi${id}/${
        imgType ? 'hqdefault' : 'maxresdefault'
      }.jpg`;
    } else {
      //return `${HOST}/upload/noimage.jpg`
    }
  },

  contactToSchool: function (result) {
    Alert.alert(
      `You Are Not Allowed To Change Your ${result} Details`,
      `In Case There Is Any Error In Your Record Please Contact ${APP_NAME}`,
      [
        {
          text: 'CANCEL',
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: `CONTACT ${APP_NAME}`,
          onPress: () => {
            Linking.openURL(
              'mailto:' +
                'info@alumbus.com' +
                `?subject=REPORT A PROBLEM TO ${APP_NAME}`,
            );
          },
        },
        {
          text: 'CONTACT VIA WHATSAPP',
          onPress: () => {
            this.shareToWhatsAppWithContact(WHATSAPP_NO, '');
          },
        },
      ],
      {
        cancelable: false,
      },
    );
  },
  getValidUrl: function (url = '') {
    let newUrl = decodeURIComponent(url);
    newUrl = newUrl.trim().replace(/\s/g, '');

    if (/^(:\/\/)/.test(newUrl)) {
      return `http${newUrl}`;
    }
    if (!/^(f|ht)tps?:\/\//i.test(newUrl)) {
      return `http://${newUrl}`;
    }
    return newUrl;
  },
};

export default Helpers;
