import {Linking, Alert, Platform} from 'react-native';
import {APP_NAME, WHATSAPP_NO} from '../helper/Constants';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment';

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
    var bool =
      found && found !== undefined && found !== null && found.length > 0
        ? true
        : false;
    return bool;
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
  loadYoutubeThumb: function (video) {
    return `https://img.youtube.com/vi/${video}/0.jpg`;
  },

  stripParameters: function (str) {
    // Split parameters or split folder separator
    if (str.indexOf('?') > -1) {
      return str.split('?')[0];
    }
    if (str.indexOf('/') > -1) {
      return str.split('/')[0];
    }
    if (str.indexOf('&') > -1) {
      return str.split('&')[0];
    }
    return str;
  },
  GetYoutubeId: function (youtubeStr) {
    let str = youtubeStr;

    // remove time hash at the end of the string
    str = str.replace(/#t=.*$/, '');

    // shortcode
    const shortcode = /youtube:\/\/|https?:\/\/youtu\.be\/|http:\/\/y2u\.be\//g;

    if (shortcode.test(str)) {
      const shortcodeid = str.split(shortcode)[1];
      return this.stripParameters(shortcodeid);
    }

    // /v/ or /vi/
    const inlinev = /\/v\/|\/vi\//g;

    if (inlinev.test(str)) {
      const inlineid = str.split(inlinev)[1];
      return this.stripParameters(inlineid);
    }

    // v= or vi=
    const parameterv = /v=|vi=/g;

    if (parameterv.test(str)) {
      const arr = str.split(parameterv);
      return this.stripParameters(arr[1].split('&')[0]);
    }

    // v= or vi=
    const parameterwebp = /\/an_webp\//g;

    if (parameterwebp.test(str)) {
      const webp = str.split(parameterwebp)[1];
      return this.stripParameters(webp);
    }

    // embed
    const embedreg = /\/embed\//g;

    if (embedreg.test(str)) {
      const embedid = str.split(embedreg)[1];
      return this.stripParameters(embedid);
    }

    // ignore /user/username pattern
    const usernamereg = /\/user\/([a-zA-Z0-9]*)$/g;

    if (usernamereg.test(str)) {
      return undefined;
    }

    // user
    const userreg = /\/user\/(?!.*videos)/g;

    if (userreg.test(str)) {
      const elements = str.split('/');
      return this.stripParameters(elements.pop());
    }

    // attribution_link
    const attrreg = /\/attribution_link\?.*v%3D([^%&]*)(%26|&|$)/;

    if (attrreg.test(str)) {
      return this.stripParameters(str.match(attrreg)[1]);
    }

    return undefined;
  },
  presentNotification: function (from, notification) {
    console.log('from', from);
    //console.log('notification', notification.data);

    const title = notification.data.title;
    const body = notification.data.body;
    const icon = notification.data.imagelink;

    if (Platform.OS === 'android') {
      var notificationObj = {
        title: title,
        message: body,
        bigText: body,
        bigPictureUrl: icon,
        vibrate: true,
        vibration: 100,
        onlyAlertOnce: true,
        allowWhileIdle: true,
        invokeApp: true,
        importance: 'max',
        priority: 'max',
        ignoreInForeground: false,
        foreground: true,
        channelId: APP_NAME,
      };
      if (icon !== '') {
        notificationObj.largeIconUrl = icon;
      } else {
        notificationObj.largeIcon = 'ic_launcher';
      }
      PushNotification.channelExists(APP_NAME, (status) => {
        console.log('status', status);
        if (status) {
          PushNotification.presentLocalNotification(notificationObj);
        } else {
        }
      });
    } else if (Platform.OS === 'ios') {
      let details = {
        alertBody: body,
        alertTitle: title,
        alertAction: 'view',
        userInfo: notification.data,
      };
      console.log('nextAppState', global.nextAppState);
      console.log('isNotificationTap', global.isNotificationTap);

      if (global.nextAppState === 'active' && !global.isNotificationTap) {
        PushNotificationIOS.presentLocalNotification(details);
      }
    }
    return Promise.resolve();
  },
  concatName: function (item) {
    let fullName = '';

    if (
      item.firstName &&
      item.firstName !== undefined &&
      item.firstName !== ''
    ) {
      fullName += item.firstName;
    }

    if (item.lastName && item.lastName !== undefined && item.lastName !== '') {
      fullName += ' ' + item.lastName;
    }
    return fullName;
  },

  generateYearList: function (onGoing, defaultChecked) {
    let year = '';
    let yearList = [];
    let cYear = new Date().getFullYear();
    let sYear = 1920;

    for (let i = 0; i <= cYear - sYear; i++) {
      year = sYear + i;
      yearList.push({
        key: year,
        text: year,
        selected: year === defaultChecked ? true : false,
      });
    }
    yearList.reverse();

    if (onGoing) {
      yearList.splice(0, 0, {
        key: 'Ongoing',
        text: 'Ongoing',
        selected: defaultChecked === 'Ongoing' ? true : false,
      });
    }
    return yearList;
  },
  formateDate: function (date) {
    let month = '',
      dateVal = '';

    if (date.getMonth() + 1 < 10) {
      month = '0' + (date.getMonth() + 1).toString();
    } else {
      month = date.getMonth() + 1;
    }
    if (date.getDate() < 10) {
      dateVal = '0' + date.getDate().toString();
    } else {
      dateVal = date.getDate();
    }
    let stringDate = `${dateVal}/${month}/${date.getFullYear()}`;
    let serverDate = `${date.getFullYear()}/${month}/${dateVal}`;

    return {displayDate: stringDate, serverDate: serverDate};
  },
  openDialler: function (number) {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number.trim()}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  },
  openEmail: function (email) {
    Linking.openURL('mailto:' + `${email}` + '?subject= ');
  },
  openLink: function (link) {
    Linking.canOpenURL(link).then((status) => {
      if (status) {
        Linking.openURL(link).catch(() => {
          Alert.alert('Unable to open link!');
        });
      } else {
        Alert.alert('Invalid link!');
      }
    });
  },
  uploadImage: function (pickFile) {
    let body = [];
    if (pickFile !== null) {
      var path = '';

      if (Platform.OS === 'android') {
        path = pickFile.path;
      } else if (Platform.OS === 'ios') {
        path = pickFile.sourceURL;
      }
      let imageName = '';
      if (
        pickFile.fileName === undefined ||
        pickFile.fileName == null ||
        pickFile.fileName === ''
      ) {
        var getFilename = path.split('/');
        imageName = getFilename[getFilename.length - 1];
        var extension = imageName.split('.')[1];
        imageName = new Date().getTime() + '.' + extension;
      } else {
        imageName = pickFile.fileName;
      }

      let imagePath =
        Platform.OS === 'ios' ? path.replace('file://', '') : path;

      let imageType = pickFile.mime;

      var imageData = {
        name: 'image',
        filename: imageName,
        type: imageType,
        data: RNFetchBlob.wrap(decodeURIComponent(imagePath)),
      };
      body.push(imageData);

      return body;
    }
    return null;
  },
  capitalize: function (str) {
    const arrOfWords = str.split(' ');
    const arrOfWordsCased = [];

    for (let i = 0; i < arrOfWords.length; i++) {
      const word = arrOfWords[i];
      arrOfWordsCased.push(word[0].toUpperCase() + word.slice(1).toLowerCase());
    }
    return arrOfWordsCased.join(' ');
  },
  showFormatedDate: function (timestamp, withTime) {
    if (timestamp > 0) {
      var dateVal = new Date(timestamp * 1000);
      if (withTime) {
        return moment(dateVal, ['HH']).format('MMM DD, YYYY | h:mm A');
      }
      return moment(dateVal).format('MMM DD, YYYY');
    } else {
      return 'N/A';
    }
  },
  showUserSchoolDetail: function (item) {
    let title = '';

    if (
      item.schoolNumber !== undefined &&
      item.schoolNumber !== null &&
      item.schoolNumber !== ''
    ) {
      title += item.schoolNumber + ' ';
    }

    if (item.house !== undefined && item.house !== null && item.house !== '') {
      title += item.house + ' ';
    }

    if (
      item.section !== undefined &&
      item.section !== null &&
      item.section !== ''
    ) {
      title += item.section + ' ';
    }

    if (item.batch !== undefined && item.batch !== null && item.batch !== '') {
      title += item.batch;
    }

    return title;
  },
  getLatLngFromMap: function (link) {
    var regex = /@(-?\d+\.\d+),(-?\d+\.\d+),(\d+\.?\d?)+z/g,
      params = {},
      match;
    var latitude = 0,
      longitude = 0;

    while ((match = regex.exec(link))) {
      params[match[1]] = match[2];
    }

    if (params !== undefined && params !== null) {
      for (var key in params) {
        if (params.hasOwnProperty(key)) {
          latitude = parseFloat(key);
          longitude = parseFloat(params[key]);
        }
      }
    }
    return {latitude: latitude, longitude: longitude};
  },
};

export default Helpers;
