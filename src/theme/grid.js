const React = require('react-native');

const {StyleSheet, Dimensions, Platform} = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default {
  row: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },

  rowdir: {
    flexDirection: 'row',
    width: '100%',
  },

  flexwrap: {
    flexWrap: 'wrap',
  },

  rowrow: {
    flexDirection: 'row',
  },

  flex1: {
    flex: 1,
  },

  col: {
    flexGrow: 1,
    flexBasis: 0,
  },

  alignItems: {
    alignItems: 'center',
  },

  alignItemsTop: {
    alignItems: 'flex-start',
  },
  alignItemsBottom: {
    alignItems: 'flex-end',
  },
  alignSelf: {
    alignSelf: 'flex-start',
  },
  justifyContent: {
    justifyContent: 'space-between',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  justifyContentRight: {
    justifyContent: 'flex-end',
  },
  justifyContentLeft: {
    justifyContent: 'flex-start',
  },
  w50: {
    width: 50,
  },
  w85: {
    width: 85,
  },
  w100: {
    width: 100,
  },
  w120: {
    width: 120,
  },
  w150: {
    width: 150,
  },

  c2: {
    width: '47.5%',
    margin: '1%',
  },

  c44: {
    width: '31%',
    marginRight: '2%',
  },

  c21: {
    width: deviceWidth / 2 - 20,
  },
  w48per: {
    width: '43%',
    margin: '1%',
  },
  c3: {
    width: '100%',
    marginbottom: '2%',
  },
  c31: {
    width: deviceWidth / 3 - 20,
    marginRight: 5,
  },

  displayinlineBlock: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
};
