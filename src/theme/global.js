import React from 'react';
import {Dimensions, Platform} from 'react-native';
import {scale} from '../theme/Scalling';
import Color from '../theme/Colors';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const tablet = deviceWidth >= 768;
const Defaultbr = 8;
const isX =
  Platform.OS === 'ios' && (deviceHeight > 800 || deviceHeight > 800)
    ? true
    : false;

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
  errorMsg: {
    color: 'red',
    fontSize: scale(11),
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
  /*colors*/
  colorWhite: {
    color: '#ffffff',
  },
  colorRed: {
    color: '#ff0000',
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
  colorGray5: {
    color: '#a6a6a6',
  },
  colorGray8: {
    color: '#cccccc',
  },
  colordarkGray: {
    color: '#333333',
  },
  colorDisabled: {
    color: '#ebebe4',
  },
  colorBlue: {
    color: Color.ColorPrimary,
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
  txtCenter: {
    textAlign: 'center',
  },
  txtCenterVertical: {
    textAlignVertical: 'center',
  },
  txtRight: {
    textAlign: 'right',
  },
  txtLeft: {
    textAlign: 'left',
  },
  textJustify: {
    textAlign: 'justify',
  },
  bgBlack: {
    backgroundColor: '#000000',
  },
  bgBlack08: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  bgBlack06: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  bggray: {
    backgroundColor: '#202020',
  },
  bggray2: {
    backgroundColor: '#323232',
  },
  bggray3: {
    backgroundColor: '#f2f2f2',
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
  lightGray: {
    backgroundColor: '#e5e5e5',
  },
  bglightGray: {
    backgroundColor: '#f8f8f8',
  },
  darkBlue: {
    backgroundColor: Color.ColorPrimary,
  },
  bgBlue: {
    backgroundColor: Color.ColorPrimary,
  },
  bgGreenLight: {
    backgroundColor: '#DCF8C6',
  },
  mh100: {
    minHeight: Platform.OS === 'ios' ? deviceHeight - 75 : deviceHeight - 75,
  },
  mh100d: {
    minHeight: deviceHeight,
  },
  mhcreate100: {
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
  btn: {
    backgroundColor: Color.ColorPrimary,
    color: '#ffffff',
    textAlign: 'center',
    fontSize: scale(16),
    //height: 26,
    padding: scale(8),
    borderRadius: Defaultbr,
    overflow: 'hidden',
  },
  btnL: {
    backgroundColor: Color.ColorPrimary,
    color: '#ffffff',
    textAlign: 'center',
    borderRadius: Defaultbr,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnGrayLogin: {
    backgroundColor: Color.ColorPrimary,
    color: '#ffffff',
    textAlign: 'center',
    fontSize: scale(16),
    padding: scale(11),
    borderRadius: Defaultbr,
    width: '100%',
  },
  btnt: {
    backgroundColor: Color.ColorPrimary,
    minHeight: 26,
    padding: 6,
    paddingLeft: 10,
    paddingRight: 10,
  },
  w100p: {
    width: '100%',
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
  /*Input*/
  shareStyle: {
    backgroundColor: '#f8f8f8',
    borderRadius: Defaultbr,
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

  textareaStyle: {
    padding: 15,
    margin: 0,
    textAlignVertical: 'top',
    width: '100%',
    fontSize: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  labeltext1: {
    fontSize: scale(13),
    fontFamily: 'Lato-Bold',
    color: '#000000',
    marginBottom: scale(5),
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
  close: {
    width: 20,
    height: 20,
  },
  dt: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: Color.ColorPrimary,
    borderRightColor: Color.ColorPrimary,
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
  bb1: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  iconstyle1: {
    backgroundColor: '#b2b2b2',
    width: tablet ? 72 : 36,
    height: tablet ? 36 : 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Defaultbr,
  },
  bgwhatsapp: {
    backgroundColor: '#25d366',
  },
  oh: {
    overflow: 'hidden',
  },
  h20: {
    height: 20,
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
  AutoCompleteList1: {
    backgroundColor: '#f1f1f1',
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
  newHeaderConcept: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
  },
  btnScrollStrip: {
    position: 'absolute',
    bottom: 50,
    zIndex: 999999,
    width: scale(70),
    justifyContent: 'center',
    alignSelf: 'center',
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
  title1: {
    backgroundColor: '#333333',
    color: Color.ColorPrimary,
    fontSize: 12,
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
    color: Color.ColorPrimary,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Lato-Bold',
  },
  gphotoupload: {
    borderWidth: 1,
    borderColor: '#202020',
  },

  gphotouploadactive: {
    borderWidth: 1,
    borderColor: Color.ColorPrimary,
  },
};
