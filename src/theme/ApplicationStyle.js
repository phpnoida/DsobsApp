import {StyleSheet, Platform, StatusBar} from 'react-native';

import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {scale} from './Scalling';
import Color from '../theme/Colors';

export default StyleSheet.create({
  space: {
    position: 'absolute',
    top:
      Platform.OS === 'android' ? scale(15) : getStatusBarHeight() + scale(10),
    flexDirection: 'row',
  },
  closeSpace: {
    position: 'absolute',
    right: scale(10),
    top:
      Platform.OS === 'android' ? scale(15) : getStatusBarHeight() + scale(10),
    flexDirection: 'row',
  },
  topSpace: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 0 : getStatusBarHeight(),
    backgroundColor: 'white',
  },
  topSpaceWithoutFlex: {
    paddingTop: Platform.OS === 'android' ? 0 : getStatusBarHeight(),
    backgroundColor: 'white',
  },
  contentSpace: {
    paddingStart: scale(15),
    paddingEnd: scale(15),
    paddingTop: scale(15),
  },
  contentSpaceHorizonta: {
    paddingStart: scale(15),
    paddingEnd: scale(15),
  },
  buttonSpace: {
    paddingStart: scale(15),
    paddingEnd: scale(15),
    paddingBottom: scale(15),
  },
  ViewStyle: {
    flex: 1,
    backgroundColor: 'white',
  },
  parentStyle: {
    flex: 1,
    backgroundColor: '#fff',
  },
  progressIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingBottom: scale(40),
  },
  childContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingBottom: scale(20),
  },
  appContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  scrollview: {
    paddingStart: scale(10),
    paddingEnd: scale(10),
    backgroundColor: 'transparent',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  colCenter: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  colCross: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  colMain: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  crossCenter: {
    alignItems: 'center',
  },
  crossEnd: {
    alignItems: 'flex-end',
  },
  crossStart: {
    alignItems: 'flex-start',
  },
  crossStretch: {
    alignItems: 'stretch',
  },
  fill: {
    flex: 1,
  },
  fillCenter: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  fillCol: {
    flex: 1,
    flexDirection: 'column',
  },
  fillColCenter: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  fillColCross: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
  },
  fillColMain: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  fillColReverse: {
    flex: 1,
    flexDirection: 'column-reverse',
  },
  row: {
    flexDirection: 'row',
  },
  fillRow: {
    flex: 1,
    flexDirection: 'row',
  },
  fillRowCenter: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  fillRowCross: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  fillRowMain: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  fullSize: {
    height: '100%',
    width: '100%',
  },
  fullWidth: {
    width: '100%',
  },
  mainCenter: {
    justifyContent: 'center',
  },
  textCenter: {
    textAlign: 'center',
  },
  textJustify: {
    textAlign: 'justify',
  },
  textLeft: {
    textAlign: 'left',
  },
  textRight: {
    textAlign: 'right',
  },
  areaStyle: {
    flex: 1,
  },
  radioText: {
    fontSize: scale(16),
    color: '#000',
    fontWeight: '200',
  },
  radioCircle: {
    height: scale(14),
    width: scale(14),
    borderRadius: 100,
    borderWidth: scale(2.5),
    borderColor: Color.ColorPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(10),
  },
  selectedRb: {
    height: scale(7),
    width: scale(7),
    borderRadius: scale(30),
    backgroundColor: Color.ColorPrimary,
  },
  result: {
    marginTop: 20,
    color: 'white',
    fontWeight: '600',
    backgroundColor: '#F3FBFE',
  },
  appLogo: {
    shadowColor: '#333333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
    backgroundColor: '#ffffff',
    width: scale(45),
    borderRadius: scale(45),
  },
  userProfileBox: {
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#333333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
    padding: scale(12),
    marginTop: scale(6),
    marginBottom: scale(8),
    marginStart: scale(4),
    marginEnd: scale(4),
  },
  menuTitle: {
    color: '#bababa',
    fontSize: scale(13),
    fontFamily: 'Lato-Regular',
    textAlign: 'left',
  },
  menuHeader: {
    color: '#000',
    fontSize: scale(13),
    fontFamily: 'Lato-Bold',
    textAlign: 'left',
  },
  transform: {
    textTransform: 'capitalize',
  },
  triangleShape: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#dddddd',
    marginLeft: 8,
  },
  sheetContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingStart: scale(15),
    paddingEnd: scale(15),
    paddingTop: scale(10),
  },
});
