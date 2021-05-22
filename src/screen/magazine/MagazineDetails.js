import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  Clipboard,
  Platform,
  ToastAndroid,
  Alert,
  Animated,
  SafeAreaView,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import {
  IconType,
  TWITTER_ICON,
  FACEBOOK_ICON,
  WHATSAPP_ICON,
  EMAIL_ICON,
  CLIPBOARD_ICON,
  MORE_ICON,
} from '../../helper/Constants';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import HTML from 'react-native-render-html';
import Share, {ShareSheet, Button} from 'react-native-share';
import ZoomImage from '../../component/ZoomImage';
import ProgresImage from '../../component/ProgresImage';

let magazineData = null;
let currentIndex = 0;
let imageArray = [];

let shareOptions = {
  title: '',
  message: '',
  url: '',
  subject: 'A E-SANDESH Article Link', //  for email
};

const MagazineDetails = ({route, navigation}) => {
  const scrollViewRef = useRef();
  const [pageContent, setPageContent] = useState(null);
  const [currentFontSize, setCurrentFontSize] = useState(scale(12));
  const [selectedSize, setSelectedSize] = useState(1);
  const [showShare, setShowShare] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [useHack, setUseHack] = useState(true);

  useEffect(() => {
    magazineData = null;
    currentIndex = 0;
    imageArray = [];

    if (route.params && route.params !== undefined && route.params !== null) {
      magazineData = route.params.data;
      currentIndex = route.params.currentIndex;

      console.log('magazine', currentIndex);
      console.log('magazine', magazineData.length);

      setPageContent(magazineData);

      setTimeout(() => {
        scrollViewRef.current.goToPage(currentIndex);
        setUseHack(false);
      }, 50);
    }

    return () => {};
  }, []);

  const computeEmbeddedMaxWidth = (availableWidth) => {
    return Math.min(availableWidth, 500);
  };

  const onCancelShare = () => {
    setShowShare(false);
  };

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.fill}>
        <View style={GlobalInclude.AppStyle.parentStyle}>
          <View style={GlobalInclude.AppStyle.fill}>
            {pageContent === null ? (
              <View style={GlobalInclude.AppStyle.fillCenter}>
                <Image
                  style={{height: scale(100), width: scale(100)}}
                  source={GlobalInclude.Assets.AppLogo}
                />
                <Text style={[g.colorGray8, g.FHNM, g.fs18]}>
                  No Content Found
                </Text>
              </View>
            ) : (
              <View style={GlobalInclude.AppStyle.fill}>
                <ScrollableTabView
                  ref={scrollViewRef}
                  underlineColor={'#ffffff'}
                  style={{paddingLeft: 0, paddingRight: 0}}
                  tabBarActiveTextColor={GlobalInclude.Color.ColorPrimary}
                  tabBarInactiveTextColor={'#bababa'}
                  tabBarTextStyle={{
                    fontSize: scale(15),
                    fontFamily: 'Lato-Regular',
                  }}
                  locked={false}
                  tabBarUnderlineStyle={{height: 0}}
                  onChangeTab={(index) => {
                    shareOptions.url = pageContent[index.i].shareLink;
                    //console.log('data', pageContent[index.i]);
                  }}
                  renderTabBar={() => <View />}>
                  {pageContent.map((content, index) => {
                    return (
                      <View
                        style={[
                          GlobalInclude.AppStyle.fill,
                          GlobalInclude.AppStyle.contentSpace,
                        ]}
                        key={index}>
                        {useHack ? (
                          <View />
                        ) : (
                          <View style={GlobalInclude.AppStyle.fill}>
                            <View
                              style={[
                                GlobalInclude.AppStyle.row,
                                grid.alignItems,
                                grid.justifyContent,
                                g.mb10,
                              ]}>
                              <View style={grid.col}>
                                <View style={[grid.rowrow, grid.alignItems]}>
                                  <TouchableOpacity
                                    onPress={() => navigation.goBack()}>
                                    <GlobalInclude.BaseIcon
                                      containerStyle={styles.backIcon}
                                      iconColor={
                                        GlobalInclude.Color.ColorPrimary
                                      }
                                      iconName={'arrowleft'}
                                      iconSize={scale(30)}
                                      iconType={IconType[10]}
                                    />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => {
                                      //setShowShare(true);
                                      Alert.alert('Coming soon!');
                                    }}
                                    style={{marginStart: scale(5)}}>
                                    <GlobalInclude.BaseIcon
                                      containerStyle={styles.backIcon}
                                      iconColor={
                                        GlobalInclude.Color.ColorPrimary
                                      }
                                      iconName={'sharealt'}
                                      iconSize={scale(24)}
                                      iconType={IconType[10]}
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                              <View
                                style={[
                                  grid.rowrow,
                                  grid.alignItemsBottom,
                                  grid.justifyContent,
                                  {marginEnd: scale(10), height: 30},
                                ]}>
                                <TouchableOpacity
                                  activeOpacity={1}
                                  onPress={() => {
                                    setCurrentFontSize(scale(12));
                                    setSelectedSize(1);
                                  }}>
                                  <Text
                                    style={[
                                      selectedSize === 1
                                        ? g.colorBlue
                                        : g.colordarkGray,
                                      selectedSize === 1
                                        ? g.textunderline
                                        : null,
                                      {
                                        lineHeight: 18,
                                        fontSize: 12,
                                      },
                                      g.FHNB,
                                    ]}>
                                    A
                                  </Text>
                                </TouchableOpacity>
                                <View style={{marginHorizontal: scale(4)}} />
                                <TouchableOpacity
                                  activeOpacity={1}
                                  onPress={() => {
                                    setCurrentFontSize(scale(16));
                                    setSelectedSize(2);
                                  }}>
                                  <Text
                                    style={[
                                      selectedSize === 2
                                        ? g.colorBlue
                                        : g.colordarkGray,
                                      selectedSize === 2
                                        ? g.textunderline
                                        : null,
                                      {lineHeight: 20, fontSize: 15},
                                      g.FHNB,
                                    ]}>
                                    A
                                  </Text>
                                </TouchableOpacity>
                                <View style={{marginHorizontal: scale(3)}} />
                                <TouchableOpacity
                                  activeOpacity={1}
                                  onPress={() => {
                                    setCurrentFontSize(scale(20));
                                    setSelectedSize(3);
                                  }}>
                                  <Text
                                    style={[
                                      selectedSize === 3
                                        ? g.colorBlue
                                        : g.colordarkGray,
                                      selectedSize === 3
                                        ? g.textunderline
                                        : null,
                                      {lineHeight: 20, fontSize: 20},
                                      g.FHNB,
                                    ]}>
                                    A
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                            <ScrollView
                              showsVerticalScrollIndicator={false}
                              style={GlobalInclude.AppStyle.fill}
                              key={index}>
                              <View
                                style={[
                                  g.p10,
                                  g.bgWhite,
                                  grid.rowrow,
                                  grid.justifyContent,
                                  grid.alignItems,
                                ]}>
                                <View style={[grid.col]}>
                                  <Text
                                    style={{
                                      fontSize: currentFontSize + scale(2),
                                      color: '#000000',
                                      marginBottom: scale(5),
                                      fontWeight: 'bold',
                                    }}>
                                    {content.header}
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: currentFontSize,
                                      color: '#000000',
                                      fontWeight: 'bold',
                                    }}>
                                    {content.subTitle}
                                  </Text>
                                </View>
                              </View>
                              <HTML
                                key={index}
                                source={{
                                  html:
                                    '<div>' +
                                    content.body
                                      .replace(/<p[^>]*><br><\/p>/g, '<br>')
                                      .replace(/<h3[^>]*><br><\/h3>/g, '')
                                      .replace(/(<br\s*\/?>){1,}/gi, '<br>')
                                      .replace(/(\r\n|\n|\r)/gm, '')
                                      .replace(/(<br\s*\/?>)/gi, '') +
                                    '</div>',
                                }}
                                baseFontStyle={{fontSize: currentFontSize}}
                                textSelectable={false}
                                defaultTextProps={{allowFontScaling: true}}
                                tagsStyles={richTextStyles}
                                allowWhitespaceNodes={false}
                                containerStyle={styles.container}
                                contentWidth={
                                  Dimensions.get('window').width - 30
                                }
                                computeEmbeddedMaxWidth={
                                  computeEmbeddedMaxWidth
                                }
                                renderers={{
                                  img: (
                                    htmlAttribs,
                                    children,
                                    convertedCSSStyles,
                                    passProps,
                                  ) => {
                                    return (
                                      <TouchableOpacity
                                        onPress={() => {
                                          imageArray = [{url: htmlAttribs.src}];
                                          setShowImageModal(true);
                                        }}>
                                        <ProgresImage
                                          source={
                                            htmlAttribs.src != null &&
                                            htmlAttribs.src !== ''
                                              ? {uri: htmlAttribs.src}
                                              : GlobalInclude.Assets
                                                  .DefaultImage
                                          }
                                          containerStyle={{aspectRatio: 1}}
                                          imageStyle={{
                                            aspectRatio: 1,
                                          }}
                                          mode={'contain'}
                                        />
                                      </TouchableOpacity>
                                    );
                                  },
                                }}
                              />
                            </ScrollView>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </ScrollableTabView>
              </View>
            )}
          </View>
        </View>
        <ShareSheet visible={showShare} onCancel={onCancelShare}>
          <Button
            iconSrc={{uri: TWITTER_ICON}}
            onPress={() => {
              onCancelShare();
              shareOptions.social = 'twitter';
              setTimeout(() => {
                Share.shareSingle(shareOptions, Share.Social.TWITTER);
              }, 300);
            }}>
            Twitter
          </Button>
          <Button
            iconSrc={{uri: FACEBOOK_ICON}}
            onPress={() => {
              onCancelShare();
              shareOptions.social = 'facebook';
              setTimeout(() => {
                Share.shareSingle(shareOptions, Share.Social.FACEBOOK);
              }, 300);
            }}>
            Facebook
          </Button>
          <Button
            iconSrc={{uri: WHATSAPP_ICON}}
            onPress={() => {
              onCancelShare();
              shareOptions.social = 'whatsapp';
              setTimeout(() => {
                Share.shareSingle(shareOptions, Share.Social.WHATSAPP);
              }, 300);
            }}>
            Whatsapp
          </Button>
          <Button
            iconSrc={{uri: EMAIL_ICON}}
            onPress={() => {
              onCancelShare();
              shareOptions.social = 'email';
              setTimeout(() => {
                Share.shareSingle(shareOptions, Share.Social.EMAIL);
              }, 300);
            }}>
            Email
          </Button>
          <Button
            iconSrc={{uri: CLIPBOARD_ICON}}
            onPress={() => {
              onCancelShare();
              setTimeout(() => {
                if (typeof shareOptions.url !== undefined) {
                  Clipboard.setString(shareOptions.url);
                  if (Platform.OS === 'android') {
                    ToastAndroid.show('Link Copied', ToastAndroid.SHORT);
                  } else if (Platform.OS === 'ios') {
                    Alert.alert('Link Copied');
                  }
                }
              }, 300);
            }}>
            Copy Link
          </Button>
          <Button
            iconSrc={{uri: MORE_ICON}}
            onPress={() => {
              onCancelShare();
              setTimeout(() => {
                Share.open(shareOptions);
              }, 300);
            }}>
            More
          </Button>
        </ShareSheet>

        {showImageModal && (
          <ZoomImage
            mediaContent={imageArray}
            onClose={() => {
              setShowImageModal(!showImageModal);
            }}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {borderBottomWidth: 0},
  container: {
    height: '100%',
    width: '100%',
    padding: scale(6),
  },
  downloadIcon: {
    height: scale(20),
    width: scale(20),
  },
  backIcon: {
    height: scale(39),
    width: scale(39),
  },
});

const richTextStyles = StyleSheet.create({
  p: {
    textAlign: 'justify',
    paddingStart: scale(4),
    paddingEnd: scale(4),
  },
});

export default MagazineDetails;
