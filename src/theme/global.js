import {scale} from '../theme/Scalling';

const React = require('react-native');

const {Dimensions, Platform} = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const isX =
  Platform.OS === 'ios' && (deviceHeight > 800 || deviceHeight > 800)
    ? true
    : false;
const isXR = Platform.OS === 'ios' && deviceHeight === 896 ? true : false;
const smallDevise1 = deviceWidth > 380;

const tablet = deviceWidth >= 768;

const Defaultbr = 8;

export default {
  FHNL: {
    fontFamily: 'Lato-Light',
  },
  FHNR: {
    fontFamily: 'Lato-Regular',
  },
  FHNM: {
    fontFamily: 'Lato-Medium',
  },
  FHNB: {
    fontFamily: 'Lato-Bold',
  },

  Fbold: {
    fontWeight: 'bold',
  },

  statusBar: {
    height: Platform.OS === 'ios' ? 30 : null,
    backgroundColor: '#ffffff',
  },

  trianglebottom: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#ffffff',
  },

  errorMsg: {
    color: 'red',
    fontSize: scale(11),
  },

  errorMsg1: {
    color: 'red',
    fontSize: deviceWidth > 380 ? 11 : 9,

    paddingTop: 1,
  },

  BT0: {
    borderTopWidth: 0,
  },
  BB0: {
    borderBottomWidth: 0,
  },

  pt2: {
    paddingTop: 2,
  },

  pt3: {
    paddingTop: 3,
  },

  pb3: {
    paddingBottom: 3,
  },

  lh: {
    lineHeight: 16,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
  },

  /*colors*/

  colorWhite: {
    color: '#ffffff',
  },
  colorRed: {
    color: '#ff0000',
  },
  colorRed1: {
    color: '#cc3300',
  },
  colorBlack: {
    color: '#000000',
  },
  colorGray: {
    color: '#6e6e6e',
  },
  colorGray1: {
    color: '#959595',
  },
  colorGray2: {
    color: '#888888',
  },
  colorGray3: {
    color: '#999999',
  },
  colorGray4: {
    color: '#ffffff66',
  },
  colorGray5: {
    color: '#a6a6a6',
  },
  colorGray6: {
    color: '#535353',
  },
  colorGray7: {
    color: '#dadada',
  },
  colorGray8: {
    color: '#cccccc',
  },
  colorGray9: {
    color: '#c8c8c8',
  },
  colordarkGray: {
    color: '#333333',
  },
  colorGreen: {
    color: 'green',
  },
  colorBlur: {
    color: '#5cabfc',
  },
  colorBlue: {
    color: '#2b3252',
  },
  colorBlue1: {
    color: '#2b3252',
  },
  colorV1: {
    color: '#6a0dad',
  },
  colorRed2: {
    color: '#ff0000',
  },
  colorGreen1: {
    color: '#006000',
  },
  colorYellow: {
    color: '#2b3252',
  },
  colorY1: {
    color: '#ffff00',
  },
  bcWhite: {
    borderColor: '#ffffff',
  },
  bcBlue: {
    borderColor: '#0066ff',
  },
  bcGreen: {
    borderColor: '#00cc00',
  },
  bcRed: {
    borderColor: '#ff0000',
  },

  colorDarkBlur: {
    color: '#00001d',
  },
  colorLightGray: {
    color: '#bababa',
  },

  /* paddind*/
  p0: {
    padding: 0,
  },
  pt0: {
    paddingTop: 0,
  },
  p10: {
    padding: scale(10),
  },
  p11: {
    padding: scale(11),
  },
  p7: {
    padding: scale(7),
  },
  p15: {
    padding: scale(15),
  },
  p20: {
    padding: scale(20),
  },
  pt4: {
    paddingTop: scale(4),
  },
  pt5: {
    paddingTop: scale(5),
  },
  pt6: {
    paddingTop: scale(6),
  },
  pt7: {
    paddingTop: scale(7),
  },
  pt9: {
    paddingTop: scale(9),
  },
  pt10: {
    paddingTop: scale(10),
  },
  pt15: {
    paddingTop: scale(15),
  },
  pt20: {
    paddingTop: scale(20),
  },
  pt30: {
    paddingTop: scale(30),
  },
  p3: {
    padding: scale(3),
  },

  p5: {
    padding: scale(5),
  },

  brr20: {
    borderRadius: scale(20),
  },
  pb0: {
    paddingBottom: 0,
  },
  pb10: {
    paddingBottom: scale(10),
  },
  pl2: {
    paddingLeft: scale(2),
  },
  pl5: {
    paddingLeft: scale(5),
  },
  pl10: {
    paddingLeft: scale(10),
  },
  pl15: {
    paddingLeft: scale(15),
  },
  pl0: {
    paddingLeft: scale(0),
  },

  pr0: {
    paddingRight: scale(0),
  },
  pr2: {
    paddingRight: scale(2),
  },
  pr5: {
    paddingRight: scale(5),
  },
  pr10: {
    paddingRight: scale(10),
  },
  pr15: {
    paddingRight: scale(15),
  },
  pb2: {
    paddingBottom: scale(2),
  },
  pb4: {
    paddingBottom: scale(4),
  },
  pb5: {
    paddingBottom: scale(5),
  },
  pb6: {
    paddingBottom: scale(6),
  },
  pb7: {
    paddingBottom: scale(7),
  },
  pb15: {
    paddingBottom: scale(15),
  },
  pb20: {
    paddingBottom: scale(20),
  },
  pb30: {
    paddingBottom: scale(30),
  },

  m0: {
    margin: 0,
  },
  m10: {
    margin: 10,
  },

  /*Margin Left*/
  ml0: {
    marginLeft: 0,
  },
  ml2: {
    marginLeft: scale(2),
  },
  ml5: {
    marginLeft: scale(5),
  },
  ml10: {
    marginLeft: scale(10),
  },
  ml15: {
    marginLeft: scale(15),
  },

  /*Margin Right*/
  mr0: {
    marginRight: scale(0),
  },
  mr2: {
    marginRight: scale(2),
  },
  mr4: {
    marginRight: scale(4),
  },
  mr5: {
    marginRight: scale(5),
  },
  mr7: {
    marginRight: scale(7),
  },
  mr10: {
    marginRight: scale(10),
  },
  mr15: {
    marginRight: scale(15),
  },

  /*margin Top*/
  mt0: {
    marginTop: scale(0),
  },
  mt1: {
    marginTop: scale(1),
  },
  mt2: {
    marginTop: scale(2),
  },
  mt3: {
    marginTop: scale(3),
  },
  mt5: {
    marginTop: scale(5),
  },
  mt8: {
    marginTop: scale(8),
  },
  mt10: {
    marginTop: scale(10),
  },
  mt15: {
    marginTop: scale(15),
  },
  ml24: {
    marginLeft: scale(24),
  },
  mt20: {
    marginTop: scale(20),
  },
  mt45: {
    marginTop: scale(42),
  },
  mt75: {
    marginTop: 75,
  },
  mt100: {
    marginTop: 100,
  },

  mb0: {
    marginBottom: scale(0),
  },
  mb2: {
    marginBottom: scale(2),
  },
  mb5: {
    marginBottom: scale(5),
  },
  mb10: {
    marginBottom: scale(10),
  },
  mb15: {
    marginBottom: scale(15),
  },
  mb20: {
    marginBottom: scale(20),
  },

  mb25: {
    marginBottom: scale(25),
  },

  mb35: {
    marginBottom: scale(35),
  },
  mb100: {
    marginBottom: scale(100),
  },

  bw0: {
    borderWidth: 0,
  },
  bgr1: {
    borderRightWidth: 1,
    borderRightColor: '#ced4da',
  },

  txtCenter: {
    textAlign: 'center',
  },
  txtRight: {
    textAlign: 'right',
  },
  txtLeft: {
    textAlign: 'left',
  },

  bgBlack: {
    backgroundColor: '#000000',
  },
  bgBlack08: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  bgBlack09: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  bggray: {
    backgroundColor: '#202020',
  },
  bggray1: {
    backgroundColor: '#6c757d',
  },
  bggray2: {
    backgroundColor: '#323232',
  },
  bggray3: {
    backgroundColor: '#f2f2f2',
  },
  bggray4: {
    backgroundColor: '#ebebe4',
  },
  bggray5: {
    backgroundColor: '#b1b1b1',
  },
  bggray6: {
    backgroundColor: '#a6a6a6',
  },
  bgWhite: {
    backgroundColor: '#ffffff',
  },
  bgDib: {
    backgroundColor: '#0000ff',
  },
  bgWhite02: {
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
  },
  bgRed: {
    backgroundColor: '#38b6ff',
  },
  bgYellow: {
    backgroundColor: '#2b3252',
  },
  bgRed1: {
    backgroundColor: '#ff0000',
  },
  bggraybgBlue: {
    backgroundColor: '#2b3252',
  },
  bgGreen: {
    backgroundColor: '#00cc00',
  },
  bgGreen1: {
    backgroundColor: '#087608',
  },
  lightGray: {
    backgroundColor: '#e5e5e5',
  },
  bglightGray: {
    backgroundColor: '#f8f8f8',
  },
  bgLightBlue: {
    backgroundColor: '#38b6ff',
  },
  darkBlue: {
    backgroundColor: '#2b3252',
  },
  bgBlue: {
    backgroundColor: '#2b3252',
  },
  lightBlue: {
    backgroundColor: '#000028',
  },
  bgB1: {
    backgroundColor: '#2b3252',
  },
  bgB2: {
    backgroundColor: '#87ceeb',
  },
  bgV1: {
    backgroundColor: '#390161',
  },

  mh100: {
    minHeight: Platform.OS === 'ios' ? deviceHeight - 75 : deviceHeight - 75,
  },
  mh100_n: {
    minHeight: Platform.OS === 'ios' ? deviceHeight : deviceHeight,
  },
  cmh100: {
    minHeight: deviceHeight - 110,
  },

  jobmh100: {
    minHeight: Platform.OS === 'ios' ? deviceHeight - 95 : deviceHeight - 75,
  },

  mediaheight: {
    minHeight: Platform.OS === 'ios' ? deviceHeight - 20 : deviceHeight,
  },

  galleryPopHeight: {
    minHeight: deviceHeight - 20,
  },
  toppanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 15,
    zIndex: 99,
  },
  mh100d: {
    minHeight: deviceHeight,
  },

  mhcreate100: {
    minHeight: deviceHeight - 100,
  },

  mh100px: {
    minHeight: deviceHeight - 55,
  },

  hautoCom: {
    minHeight: deviceHeight - 100,
  },

  br3: {
    borderRadius: Defaultbr,
  },
  brtl3: {
    borderTopLeftRadius: Defaultbr,
  },
  brtr3: {
    borderTopRightRadius: Defaultbr,
  },

  brtr0: {
    borderTopRightRadius: 0,
  },
  brbr0: {
    borderBottomRightRadius: 0,
  },

  br0: {
    borderRadius: 0,
  },

  /**Button**/
  btnline: {
    backgroundColor: '#2b3252',
    color: '#ffffff',
    textAlign: 'center',
    fontSize: tablet ? 16 : 12,
    minHeight: tablet ? 39 : 26,
    padding: tablet ? 9 : 6,
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderColor: '#2b3252',
    borderRadius: Defaultbr,
  },
  btnWhiteline: {
    //backgroundColor: '#2b3252',
    color: '#666666',
    textAlign: 'center',
    fontSize: tablet ? 16 : 9,
    minHeight: tablet ? 39 : 26,
    padding: tablet ? 9 : 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: '#a6a6a6',
    borderRadius: Defaultbr,
    overflow: 'hidden',
  },
  btnWhiteActive: {
    backgroundColor: '#a6a6a6',
    color: '#ffffff',
  },
  btnRedActive: {
    backgroundColor: '#38b6ff',
    color: '#ffffff',
    borderColor: '#38b6ff',
  },
  btnlineActive: {
    backgroundColor: '#ffffff',
    color: '#2b3252',
    textAlign: 'center',
    fontSize: tablet ? 16 : 12,
    minHeight: tablet ? 39 : 26,
    padding: tablet ? 9 : 6,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: Defaultbr,
    borderWidth: 1,
    borderColor: '#2b3252',
    overflow: 'hidden',
  },
  btn: {
    backgroundColor: '#2b3252',
    color: '#ffffff',
    textAlign: 'center',
    fontSize: scale(16),
    //height: 26,
    padding: scale(8),
    borderRadius: Defaultbr,
    overflow: 'hidden',
  },
  btnL: {
    backgroundColor: '#2b3252',
    color: '#ffffff',
    textAlign: 'center',
    borderRadius: Defaultbr,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnGrayLogin: {
    backgroundColor: '#2b3252',
    color: '#ffffff',
    textAlign: 'center',
    fontSize: scale(16),
    padding: scale(11),
    borderRadius: Defaultbr,
    width: '100%',
  },

  btnt: {
    backgroundColor: '#2b3252',
    minHeight: 26,
    padding: 6,
    paddingLeft: 10,
    paddingRight: 10,
  },

  btnGrayline: {
    borderWidth: 1,
    borderColor: '#bbbbbb',
    borderBottomWidth: 0,
  },

  btnGraylinetxt: {
    color: '#666666',
    fontSize: 11,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 6,
    paddingBottom: 5,
  },

  w100p: {
    width: '100%',
  },
  w100d: {
    width: deviceWidth,
  },
  w250: {
    width: 250,
  },
  w20: {
    width: 20,
  },
  w30: {
    width: 30,
  },
  w50: {
    width: 50,
  },
  w60: {
    width: 60,
  },
  w80: {
    width: 80,
  },
  w100: {
    width: 100,
  },
  w115: {
    width: 115,
  },

  tags: {
    backgroundColor: '#f0f0f0',
    padding: 5,
    color: '#6e6e6e',
    fontSize: 13,
    borderRadius: Defaultbr,
  },

  tagsNew: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    //fontSize: 13,
    borderRadius: Defaultbr,
  },
  tagsNewTxt: {
    fontSize: 16,
    color: '#333333',
  },

  tagStyle: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    //fontSize: 13,
    borderRadius: Defaultbr,
    //g.bggray5, , g.p3, g.colorWhite, g.fs10, g.pr5
  },
  tagTxtStyle: {
    color: '#333333',
    fontSize: scale(16),
  },
  tagStyleClose: {
    position: 'absolute',
    top: 12,
    right: 5,
    color: '#333333',
    fontSize: 16,
  },

  /*Input*/
  shareStyle: {
    backgroundColor: '#f8f8f8',
    borderRadius: Defaultbr,
  },
  bwr1: {
    borderRightWidth: 1,
    borderRightColor: '#ced4da',
  },
  inputNew: {
    height: scale(45),
    borderRadius: scale(8),
    backgroundColor: '#f8f8f8',
    fontFamily: 'Lato-Regular',
  },
  searchInputView: {
    flexDirection: 'row',
    height: scale(45),
    alignItems: 'center',
    paddingStart: scale(10),
    paddingEnd: scale(10),
    borderRadius: scale(8),
    backgroundColor: '#f8f8f8',
  },
  fliterBtnNew: {
    backgroundColor: '#f8f8f8',
    width: scale(45),
    height: scale(45),
    borderRadius: 8,
  },
  myurlInput: {
    borderWidth: 1,
    borderColor: '#ced4da',
    backgroundColor: '#ffffff',
    margin: 0,
    height: tablet ? 36 : 27,
    width: '100%',
    fontSize: tablet ? 16 : 12,
    borderRadius: Defaultbr,
    borderRightWidth: 0,
    paddingLeft: 5,
    paddingRight: 0,
    paddingTop: 5,
    paddingBottom: 3,
  },
  inputWhite: {
    backgroundColor: '#f8f8f8',
    padding: scale(10),
    margin: 0,
    height: scale(38),
    width: '100%',
    fontSize: scale(12),
    borderRadius: scale(8),
    fontFamily: 'Lato-Regular',
    justifyContent: 'center',
    textAlignVertical: 'center',
  },
  inputWhiteA: {
    borderWidth: 1,
    borderColor: '#ced4da',
    backgroundColor: '#ffffff',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    margin: 0,
    height: tablet ? 36 : 27,
    borderRadius: Defaultbr,
    textAlignVertical: 'center',
  },
  inputWhiteA1: {
    borderWidth: 1,
    borderColor: '#ced4da',
    backgroundColor: '#ffffff',
    paddingLeft: 5,
    paddingRight: 5,
    margin: 0,
    height: 26,
  },
  inputWhiteA2: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    backgroundColor: '#ffffff',
    height: 26,
    fontSize: 12,
  },
  inputWhiteA3: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: 'transparent',
    height: 24,
    fontSize: 12,
    borderWidth: 0,
  },
  inputWhiteA4: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: 'transparent',
    height: 24,
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  inputGray: {
    borderWidth: 0,
    backgroundColor: '#e5e5e5',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    margin: 0,
    height: tablet ? 39 : 26,
    width: '100%',
    color: '#2b3252',
    fontSize: tablet ? 15 : 12,
    borderRadius: Defaultbr,
  },
  inputGrayLogin: {
    borderWidth: 0,
    backgroundColor: '#f8f8f8',
    padding: scale(12),
    height: scale(45),
    width: '100%',
    color: '#333333',
    fontSize: scale(15),
    fontFamily: 'Lato-Regular',
    borderRadius: scale(6),
  },
  countryCode: {
    minWidth: scale(50),
    height: scale(40),
    backgroundColor: '#f8f8f8',
    borderTopLeftRadius: scale(6),
    borderBottomLeftRadius: scale(6),
    borderRightWidth: 1,
    borderRightColor: '#cccccc',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  whiteSelect: {
    height: tablet ? 39 : 26,
    backgroundColor: '#ffffff',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    borderColor: '#c2c2c2',
    borderWidth: 1,
  },
  txtwhiteSelect: {
    fontSize: tablet ? 16 : 15,
  },
  graySelect: {
    height: tablet ? 39 : 26,
    backgroundColor: '#e5e5e5',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    borderRadius: Defaultbr,
  },
  graytextareaStyle: {
    padding: 8,
    margin: 0,
    textAlignVertical: 'top',
    width: '100%',
    fontSize: tablet ? 15 : 12,
    backgroundColor: '#e5e5e5',
    color: '#000000',
  },
  textareaStyle: {
    padding: 15,
    margin: 0,
    textAlignVertical: 'top',
    width: '100%',
    fontSize: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  labeltext: {
    fontSize: 14,
    marginLeft: 5,
    color: '#000000',
  },
  labeltext1: {
    fontSize: scale(13),
    fontFamily: 'Lato-Bold',
    color: '#000000',
    marginBottom: scale(5),
  },
  labeltextwhite: {
    fontSize: tablet ? 16 : 11,
    // paddingBottom: 5,
    color: '#000000',
    minHeight: tablet ? 24 : 17,
  },
  fs6: {
    fontSize: scale(6),
  },
  fs7: {
    fontSize: scale(7),
  },
  fs8: {
    fontSize: scale(8),
  },
  fs9: {
    fontSize: scale(9),
  },
  fs10: {
    fontSize: scale(10),
  },
  fs11: {
    fontSize: scale(11),
  },
  fs12: {
    fontSize: scale(12),
  },
  fs13: {
    fontSize: scale(13),
  },
  fs14: {
    fontSize: scale(13),
  },
  fs15: {
    fontSize: scale(15),
  },
  fs16: {
    fontSize: scale(16),
  },
  fs18: {
    fontSize: scale(18),
  },
  fs20: {
    fontSize: scale(20),
  },
  fs24: {
    fontSize: scale(24),
  },
  fs28: {
    fontSize: scale(28),
  },
  fs32: {
    fontSize: scale(32),
  },
  fs36: {
    fontSize: scale(36),
  },

  borderTopgray: {
    borderTopColor: '#dddddd',
  },

  title1: {
    backgroundColor: '#333333',
    color: '#2b3252',
    fontSize: smallDevise1 ? 14 : 12,
    textAlign: 'center',
    letterSpacing: 2,
    height: 27,
    lineHeight: 27,
  },
  title2: {
    backgroundColor: '#f8f8f8',
    height: 33,
  },
  title2txt: {
    color: '#2b3252',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Lato-Bold',
  },
  title1txt: {
    paddingTop: 6,
    paddingBottom: 7,
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 4,
  },

  projectCallout: {
    width: tablet ? 200 : 140,
    paddingRight: 10,
  },

  textunderline: {
    textDecorationLine: 'underline',
  },

  o5: {
    opacity: 0.1,
  },
  o6: {
    opacity: 0.6,
  },
  o: {
    opacity: 1,
  },

  o6: {
    opacity: 0.6,
  },

  close: {
    width: 20,
    height: 20,
  },
  dt: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: '#2b3252',
    borderRightColor: '#2b3252',
    padding: 10,
  },
  listView: {
    flex: 1,
    marginTop: 20,
  },
  lineSeorator: {
    flex: 1,
  },
  progress: {
    height: 10,
  },
  w90p: {
    width: '90%',
  },
  w86p: {
    width: '86%',
  },

  addPhotoFrame: {
    borderWidth: 1,
    borderColor: '#cccccc',
    width: 200,
    borderRadius: Defaultbr,
    overflow: 'hidden',
  },
  addPhotoFrame1: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: Defaultbr,
    overflow: 'hidden',
    //width: 200
  },
  b1: {
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  bl1: {
    borderLeftWidth: 1,
    borderLeftColor: '#cccccc',
  },
  br1: {
    borderRightWidth: 1,
    borderRightColor: '#cccccc',
  },
  brc1: {
    borderRightWidth: 1,
    borderRightColor: '#cccccc',
  },
  blc1: {
    borderLeftWidth: 1,
    borderLeftColor: '#666666',
  },
  bb1: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  bt1: {
    borderTopWidth: 1,
    borderTopColor: '#3e3e3e',
  },
  addPhotoTxt: {
    fontSize: 80,
    color: '#2b3252',
    textAlign: 'center',
    paddingTop: 15,
    paddingBottom: 15,
  },
  addPhotoLine: {
    fontSize: 12,
    color: '#000000',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    paddingTop: tablet ? 10 : 5,
    paddingBottom: tablet ? 10 : 5,
  },
  iconstyle1: {
    backgroundColor: '#b2b2b2',
    width: tablet ? 72 : 36,
    height: tablet ? 36 : 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Defaultbr,
  },
  iconstyle2: {
    backgroundColor: '#b2b2b2',
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderRadius: Defaultbr,
  },
  bgwhatsapp: {
    backgroundColor: '#25d366',
  },
  oh: {
    overflow: 'hidden',
  },

  bgfbLink: {
    backgroundColor: '#3b5998',
  },
  bgtwLink: {
    backgroundColor: '#55acee',
  },
  bginsta: {
    backgroundColor: '#3f729b',
  },
  bggoogle: {
    backgroundColor: '#dd4b39',
  },
  bgwikiLink: {
    backgroundColor: '#222222',
  },
  bgyoutube: {
    backgroundColor: '#c62d1d',
  },
  borderradius5: {
    borderRadius: 5,
  },
  viewPager: {
    flex: 1,
  },
  pageStyle: {
    alignItems: 'center',
    padding: 20,
  },
  h20: {
    height: 20,
  },
  refDetailGrid: {
    borderWidth: 1,
    borderColor: '#b1b1b1',
    height: 80,
  },

  widthHeader: {
    height: deviceHeight - 75,
  },

  createHeight: {
    height: isX ? deviceHeight - 185 : deviceHeight - 135,
  },

  eh: {
    height: deviceHeight - 79,
  },

  jh: {
    height: deviceHeight - 75,
  },

  profiledeckheight: {
    height: deviceHeight - 240,
  },

  gphotoupload: {
    borderWidth: 1,
    borderColor: '#202020',
  },

  gphotouploadactive: {
    borderWidth: 1,
    borderColor: '#2b3252',
  },

  refDetailGrid: {
    borderWidth: 2,
    borderColor: '#b1b1b1',
    height: 80,
  },
  triangleshapecss: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#a6a6a6',
    marginLeft: 8,
  },

  starlistheight: {
    height: deviceHeight - 280,
  },
  starheight: {
    height: deviceHeight - 400,
  },
  starfeedheight: {
    height: deviceHeight - 480,
  },
  starlistheight1: {
    height: deviceHeight - 330,
  },
  btnsort: {
    //olor : '#ffffff',
    borderWidth: 1,
    borderColor: '#999999',
    marginLeft: 10,
    borderRadius: Defaultbr,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  btnsortactive: {
    backgroundColor: '#a6a6a6',
  },
  shareStyle1: {
    width: 25,
    //height: 25,
    borderRadius: 30,
    //textAlign: 'center',
    //lineHeight: 25,
    height: 25,
    paddingTop: 6,
    backgroundColor: '#666666',
    overflow: 'hidden',
  },
  shareStyle2: {
    width: 25,
    //height: 25,
    borderRadius: 25,
    //textAlign: 'center',
    //lineHeight: 25,
    height: 25,
    backgroundColor: '#666666',
    //overflow: 'hidden',
  },
  shadowEffect: {
    //borderWidth: 1,
    //borderColor: '#dddddd',
    borderRadius: Defaultbr,
    overflow: 'hidden',
    marginBottom: deviceHeight / 10,
  },
  shadowEffect1: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: Defaultbr,
    overflow: 'hidden',
    marginBottom: 10,
  },
  myKalakarHeight: {
    height: deviceHeight - 215,
  },
  AutoCompleteList: {
    backgroundColor: '#e5e5e5',
    //position: Platform.OS === 'ios' ? 'relative' : 'absolute',
    //top: Platform.OS === 'ios' ? 0 : 28,
    //left: Platform.OS === 'ios' ? 0 : 0,
    //width: '100%',
    borderRadius: Defaultbr,
    padding: 15,
    paddingTop: 8,
    paddingBottom: 10,
    marginTop: 1,
    zIndex: 2,
  },
  AutoCompleteList1: {
    backgroundColor: '#f1f1f1',
    //position: Platform.OS === 'ios' ? 'relative' : 'absolute',
    //top: Platform.OS === 'ios' ? 0 : 28,
    //left: Platform.OS === 'ios' ? 0 : 0,
    //width: '100%',
    borderRadius: Defaultbr,
    padding: 15,
    paddingTop: 8,
    paddingBottom: 10,
    marginTop: 3,
    zIndex: 2,
  },
  AutoCompleteHeight: {
    maxHeight: 120,
  },
  AutoCompleteHeight1: {
    maxHeight: 220,
  },
  videoWrapper: {
    position: 'relative',
    //borderRadius: 3,
    //overflow: 'hidden'
  },
  sendMessageInputWrapper1: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 10,
    paddingTop: 8,
    //fontSize: 12
  },
  videoBlackBg: {
    backgroundColor: '#00000066',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 1,
    borderRadius: scale(6),
  },
  videoiconPlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoiconPlay1: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '30%',
    left: '50%',
    zIndex: 2,
  },
  videoiconPlay2: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: '37%',
    left: '44%',
    zIndex: 2,
  },
  videoPopupMargin: {
    marginTop: deviceHeight / 4,
  },
  createFooter: {
    height: 60,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#ffffff',
  },
  profileheight: {
    height: Platform.OS === 'ios' ? deviceHeight - 239 : deviceHeight - 249,
  },
  profileheight1: {
    height: deviceHeight - 110,
  },
  projectheight: {
    height: deviceHeight - 204,
  },
  projectloginheight: {
    height: deviceHeight - 234,
  },
  calwrappers: {
    backgroundColor: '#0000070d',
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#b1b1b1',
    padding: 15,
  },
  weeklist: {
    width: (deviceWidth - 62) / 7,
  },
  iconstamp: {
    borderRadius: 21,
    width: 42,
    height: 42,
    borderColor: '#747474',
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smalliconstamp: {
    borderRadius: 24,
    width: 30,
    height: 30,
  },
  smalliconsubtxt: {
    fontSize: 18,
  },
  smalliconstamptxt: {
    fontSize: 9,
  },
  iconstamptxt: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 10,
    fontFamily: 'Lato-Bold',
  },
  iconsubtxt: {
    fontSize: 22,
  },
  smalltitlestamp: {
    position: 'absolute',
    top: 0,
    left: 10,
    zIndex: 5,
    width: 32,
    height: 32,
    backgroundColor: '#0f1128',
  },
  smalltitlestamp1: {
    position: 'absolute',
    top: 0,
    left: 10,
    zIndex: 5,
    width: 33,
    height: 33,
    backgroundColor: '#0f1128',
  },
  kalakarurl: {
    backgroundColor: '#f4f4f4',
    borderWidth: 1,
    borderColor: '#cbcaca',
    paddingTop: 5,
    padding: 10,
    borderRadius: Defaultbr,
  },

  basicprofileheight: {
    height: isX ? deviceHeight - 210 : deviceHeight - 187,
  },

  dashbordHeight: {
    height: deviceHeight - 160,
  },
  txtfuture: {
    width: deviceWidth > 370 ? null : 150,
  },
  chatHeight: {
    height: deviceHeight / 2,
  },
  chatListCom: {
    backgroundColor: '#ffffff',
    marginBottom: 28,
    borderRadius: 10,
    paddingTop: 12,
    paddingBottom: 11,
    padding: 18,
    maxWidth: deviceWidth - 70,
    minWidth: 100,
  },
  timeStamp: {
    backgroundColor: '#2b3252',
    marginBottom: 10,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 7,
  },
  txttimeStamp: {
    fontSize: 12,
  },
  boxblocklist: {
    backgroundColor: '#232323e6',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
    borderRadius: 10,
  },
  txtblocklist: {
    textAlign: 'center',
    fontSize: 14,
    color: '#ffffff',
  },
  sendMessagepanel: {
    padding: 10,
  },
  sendMessageBtn: {
    backgroundColor: '#2b3252',
    borderRadius: 20,
    overflow: 'hidden',
    width: tablet ? 60 : 40,
    height: 40,
    paddingTop: tablet ? 9 : 11,
    paddingLeft: tablet ? 18 : 10,
  },
  sendMessageInputWrapper: {
    backgroundColor: '#f8f8f8',
    height: 40,
    borderRadius: 20,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: Platform.OS === 'ios' ? 2 : 0,
    marginRight: 5,
    justifyContent: 'center',
    //fontSize: 12
  },
  sendMessageInput: {
    fontSize: tablet ? 18 : 13,
    padding: 0,
  },
  messageHeight: {
    minHeight: deviceHeight / 2,
    //paddingTop: 10
  },
  messagetriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#ffffff',
    transform: [{rotate: '67deg'}],
    margin: 0,
    marginTop: -3,
    marginLeft: -3,
    borderWidth: 0,
    borderColor: '#e5e5e5',
  },
  messagetriangleleft: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 6,
    borderRightWidth: 12,
    borderBottomWidth: 6,
    borderTopColor: 'transparent',
    borderRightColor: '#ffffff',
    borderBottomColor: 'transparent',
    transform: [{rotate: '25deg'}],
    margin: 0,
    marginTop: -3.3,
    marginRight: -3,
    borderWidth: 0,
    borderColor: '#ffffff',
  },
  messageTabHeight: {
    minHeight: Platform.OS === 'ios' ? null : deviceHeight / 2,
  },
  txtprofile12: {
    fontSize: scale(12),
  },
  txtprofile10: {
    fontSize: scale(12),
  },
  txtprofile13: {
    fontSize: scale(13),
  },
  btncom: {
    width: tablet ? 48 : 24,
    height: tablet ? 48 : 24,
    borderRadius: 50,
    backgroundColor: '#2b3252',
    paddingTop: 5,
    paddingLeft: 7,
  },
  newHeaderConcept: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
  },
  newHeaderConcept1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
  },
  socialSpace: {
    paddingTop: 15,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
  },
  facebookHeight: {
    height: isX ? deviceHeight - 250 : deviceHeight - 180,
  },
  deleteMsg: {
    backgroundColor: '#2b2b2b',
  },
  deleteMsgCir: {
    backgroundColor: '#75100c',
  },
  deleteMsgfirstTime: {
    backgroundColor: '#dddddd',
  },
  attachedBtn: {
    backgroundColor: '#000000',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  disabled: {
    backgroundColor: '#dddddd',
    zIndex: 99,
  },
  attachedPopup: {
    position: 'absolute',
    width: deviceWidth - 20,
    left: 0,
    bottom: 60,
    zIndex: 3,
  },
  socialNameImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    backgroundColor: '#000000',
  },
  btnScrollStrip: {
    position: 'absolute',
    bottom: 50,
    zIndex: 999999,
    width: scale(70),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  grayAutoComplted: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 10,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    paddingTop: 5,
    paddingBottom: 5,
  },
  fliterStyle: {
    backgroundColor: '#e5e5e5',
    paddingTop: 10,
    paddingBottom: 10,
  },
  fliterBtn: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 15,
    height: 27,
  },
  eventline: {
    backgroundColor: '#bbbbbb',
    height: 1,
  },
  userWidth: {
    maxWidth: tablet ? 500 : null,
    paddingTop: tablet ? 15 : 0,
  },

  newProjectList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: tablet ? 5 : 15,
    paddingRight: tablet ? 5 : 15,
    paddingTop: tablet ? 5 : 0,
    paddingBottom: tablet ? 50 : 0,
  },
  newProjectItem: {
    width: tablet ? (deviceWidth - 10) / 2 : deviceWidth - 30,
    padding: tablet ? 5 : 0,
    marginTop: tablet ? 0 : 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  newProjectItemBG: {
    backgroundColor: tablet ? '#f5f5f5' : '#ffffff',
    borderRadius: Defaultbr,
    flex: 1,
    overflow: 'hidden',
  },
  newProjectBottomBG: {
    backgroundColor: tablet ? '#bfbfbf' : '#ffffff',
    flex: 1,
    paddingBottom: tablet ? 10 : 0,
  },
  jobDetailBtn: {
    paddingBottom: isXR ? 70 : 30,
  },
  checkmark: {
    width: 5,
    height: 12,
    borderColor: '#999999',
    borderTopWidth: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 0,
    borderRightWidth: 2,
  },
  homeSortBtn: {
    borderWidth: 1,
    borderColor: '#666666',
    width: 100,
    paddingTop: 6,
    paddingBottom: 6,
    marginRight: 10,
    borderRadius: 20,
  },
  homeSorttxt: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
  },

  videoiconPlay11: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    zIndex: 2,
  },
  videoiconPlay12: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    zIndex: 2,
  },
  checkmarknew: {
    width: 5,
    height: 12,
    borderColor: '#34b7f1',
    borderTopWidth: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 0,
    borderRightWidth: 2,
  },
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    paddingBottom: 3,
  },
  boxShadow: {
    shadowColor: '#333333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
  },

  progress1: {
    width: 10 * 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    height: 7,
    marginLeft: 10,
  },
  progress1Active: {
    borderColor: '#2b3252',
    backgroundColor: '#2b3252',
  },
  bbtnNew: {
    borderWidth: 1,
    borderColor: '#2b3252',
    borderRadius: 5,
    padding: 15,
    width: deviceWidth / 2 - 70,
  },
  bbtnNewtxt: {
    color: '#2b3252',
    fontSize: deviceWidth > 380 ? 16 : 14,
    textAlign: 'center',
    lineHeight: 17,
    fontFamily: 'Lato-bold',
  },
};
