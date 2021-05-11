import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import HeaderBar from '../../component/HeaderBar';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import ProgresImage from '../../component/ProgresImage';
import Slideshow from '../../component/Slideshow.js';
import {getYellowPageAbout} from '../../Actions/YelloPageActions';

import HTML from 'react-native-render-html';

const AboutYellowPage = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pageContent, setPageContent] = useState(null);

  useEffect(() => {
    const doGetAbout = () => {
      getYellowPageAbout(
        (response) => {
          if (response && response !== null) {
            if (
              response.data &&
              response.data !== undefined &&
              response.data !== null
            ) {
              let data = response.data;

              if (data.status) {
                let record = data.data;
                if (
                  record !== undefined &&
                  record !== null &&
                  record.length > 0
                ) {
                  console.log('====================================');
                  console.log(record[0].about);
                  console.log('====================================');
                  setPageContent(record[0].about);
                }
              }
            }
          }
        },
        (error) => {
          //setSearchedUser([]);
        },
      );
    };
    doGetAbout();
    return () => {};
  }, []);

  const computeEmbeddedMaxWidth = (availableWidth) => {
    return Math.min(availableWidth, 500);
  };

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.parentStyle}>
        <HeaderBar
          title={'About Yellow Pages'}
          navigation={navigation}
          showBack={true}
        />
        {isLoading ? (
          <View style={GlobalInclude.AppStyle.fillCenter}>
            <ActivityIndicator size={'small'} color={'#2b3252'} />
          </View>
        ) : (
          <View style={GlobalInclude.AppStyle.fill}>
            {pageContent === null ? (
              <View style={GlobalInclude.AppStyle.center}>
                <Text style={[g.colorBlack, g.FHNM, g.fs12, g.textCenter]}>
                  No Record Found
                </Text>
              </View>
            ) : (
              <View
                style={[
                  GlobalInclude.AppStyle.fill,
                  GlobalInclude.AppStyle.contentSpace,
                ]}>
                <HTML
                  source={{
                    html:
                      '<div>' +
                      pageContent
                        .replace(/<p[^>]*><br><\/p>/g, '<br>')
                        .replace(/<h3[^>]*><br><\/h3>/g, '')
                        .replace(/(<br\s*\/?>){1,}/gi, '<br>')
                        .replace(/(\r\n|\n|\r)/gm, '')
                        .replace(/(<br\s*\/?>)/gi, '') +
                      '</div>',
                  }}
                  textSelectable={false}
                  defaultTextProps={{allowFontScaling: true}}
                  tagsStyles={richTextStyles}
                  allowWhitespaceNodes={false}
                  containerStyle={style.container}
                  contentWidth={Dimensions.get('window').width - 30}
                  computeEmbeddedMaxWidth={computeEmbeddedMaxWidth}
                />
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

const richTextStyles = StyleSheet.create({
  p: {
    textAlign: 'justify',
    paddingStart: scale(4),
    paddingEnd: scale(4),
  },
});

const style = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    padding: scale(6),
  },
  mainContainer: {
    backgroundColor: '#ffffff',
    shadowColor: '#333333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
    marginTop: scale(5),
    marginStart: scale(5),
    marginEnd: scale(5),
    marginBottom: scale(15),
  },
  videoContainer: {
    height: scale(200),
    width: '100%',
    borderRadius: scale(15),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: 'center',
  },
  overlayStyle: {
    backgroundColor: '#00000066',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 1,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderRadius: scale(15),
  },
  thumbStyle: {
    borderRadius: scale(15),
    height: scale(200),
    width: '100%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  playIconstyle: {
    position: 'absolute',
    zIndex: 9,
    bottom: 15,
    left: 15,
  },
  childVideoContainer: {
    height: scale(100),
    width: '100%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: 'center',
  },
  childThumb: {
    height: scale(100),
    width: '100%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  seeMore: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  showChildVideo: {
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
    paddingBottom: 15,
  },
  submitButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    alignContent: 'center',
    alignSelf: 'center',
  },
  contentContainer: {
    width: '100%',
    paddingStart: scale(10),
    paddingEnd: scale(10),
    paddingTop: scale(5),
    paddingBottom: scale(10),
  },
  closeButton: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    alignContent: 'flex-end',
    flex: 1,
  },
});

export default AboutYellowPage;
