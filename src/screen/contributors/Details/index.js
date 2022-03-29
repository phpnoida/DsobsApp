import React, {useState, useCallback, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import {IconType} from '../../../helper/Constants';
import ProgressImage from '../../../component/ProgresImage';
import YoutubeView from '../../../component/YoutubeView';
import Helper from '../../../helper/Helper';
import HeaderBar from '../../../component/HeaderBar';
import {APP_NAME, URL_REGX} from '../../../helper/Constants';
import Description from './Description';
import TheTeam from './TheTeam';
import PitchDocument from './PitchDocument';
import Tags from './Tags';
import Comments from './Comments';
import CommonButton from '../../../component/CommonButton';
import NumberFormat from 'react-number-format';
import * as Progress from 'react-native-progress';

const {urlRegex} = URL_REGX;
let filterObject = {};

const ContributionDetails = ({route, navigation}) => {
  const {width} = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(false);
  const [pageContent, setPageContent] = useState({
    currency: 'INR',
    totalRaised: 1850,
    totalRaisedInPr: 85,
    status: 0,
    _id: '6242de2423962f2080c8064c',
    amountTORaise: 2000,
    title: 'DEV',
    closingDate: 1711673044,
    contributionsPhoto: 'https://live-thequorum.incred.io/images/logo.png',
    description:
      'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available.',
    media: [],
    createdAt: '2022-03-29T10:23:32.969Z',
    updatedAt: '2022-03-29T10:23:32.969Z',
    __v: 0,
  });

  useEffect(() => {
    if (route.params && route.params !== undefined && route.params !== null) {
      filterObject = route.params.data;
      console.log('====================================');
      console.log('data', filterObject);
      console.log('====================================');
    }
    // if (filterObject !== undefined && filterObject !== null) {
    //   getSocialWork();
    // }
    return () => {};
  }, [route]);

  /****
   *
   * API Section
   *
   */

  /****
   *
   * API Section
   *
   */

  const loadContributionPhoto = useCallback(itemPath => {
    if (
      itemPath === undefined ||
      itemPath === null ||
      itemPath === '' ||
      !Helper.validateRegex(urlRegex, itemPath)
    ) {
      return (
        <ProgressImage
          source={GlobalInclude.Assets.DefaultImage}
          containerStyle={style.imageStyle}
          imageStyle={style.imageStyle}
          mode={'cover'}
        />
      );
    }
    let extension = itemPath.split(/[#?]/)[0].split('.').pop().trim();
    if (
      extension.toLowerCase() === 'png' ||
      extension.toLowerCase() === 'jpg' ||
      extension.toLowerCase() === 'jpeg'
    ) {
      return (
        <ProgressImage
          source={{uri: itemPath}}
          containerStyle={style.imageStyle}
          imageStyle={style.imageStyle}
          mode={'cover'}
        />
      );
    } else {
      return (
        <YoutubeView
          link={itemPath}
          containerStyle={style.videoContainer}
          overlayStyle={style.overlayStyle}
          thumbStyle={style.thumbStyle}
          showPlay
          playIconstyle={style.playIconstyle}
          playIconContainer={{
            height: scale(20),
            width: scale(20),
          }}
          iconSize={scale(20)}
        />
      );
    }
  }, []);

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <HeaderBar
        title={
          pageContent !== null &&
          pageContent.title &&
          pageContent.title !== undefined &&
          pageContent.title !== null
            ? pageContent.title
            : APP_NAME
        }
        navigation={navigation}
        customIcon={{
          containerStyle: {height: scale(30), width: scale(30)},
          iconColor: GlobalInclude.Color.ColorPrimary,
          iconName: 'keyboard-backspace',
          size: scale(30),
          type: IconType[1],
        }}
        customIconPress={() => {
          navigation.goBack();
        }}
      />
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
        <View style={GlobalInclude.AppStyle.fill}>
          {isLoading ? (
            <View style={GlobalInclude.AppStyle.fillCenter}>
              <ActivityIndicator
                size={'small'}
                color={GlobalInclude.Color.ColorPrimary}
              />
            </View>
          ) : (
            <View style={GlobalInclude.AppStyle.fill}>
              <View style={GlobalInclude.AppStyle.fill}>
                <View
                  style={[
                    g.bggray3,
                    style.backgroundBorder,
                    g.mt15,
                    g.ml10,
                    g.mr10,
                  ]}>
                  {loadContributionPhoto(pageContent.contributionsPhoto)}
                </View>
                <View
                  style={[
                    GlobalInclude.AppStyle.center,
                    GlobalInclude.AppStyle.textCenter,

                    grid.alignItems,
                    g.mt5,
                    g.p5,
                  ]}>
                  <View style={[g.boxShadow, g.bgWhite, g.br3]}>
                    <Progress.Bar
                      height={scale(5)}
                      width={width - 20}
                      progress={pageContent.totalRaisedInPr / 100}
                      borderRadius={scale(8)}
                      borderWidth={0}
                      unfilledColor={'#f8f8f8'}
                      color={GlobalInclude.Color.ColorPrimary}
                    />
                    <View style={[g.mb5, GlobalInclude.AppStyle.row]}>
                      <View
                        style={[
                          grid.col,
                          GlobalInclude.AppStyle.center,
                          GlobalInclude.AppStyle.textCenter,
                          grid.alignItems,
                          g.mr5,
                        ]}>
                        <Text
                          style={[
                            g.fs15,
                            g.FHNM,
                            GlobalInclude.AppStyle.transform,
                            g.colorBlue,
                          ]}
                          numberOfLines={1}>
                          Total to Raise
                        </Text>
                        <NumberFormat
                          value={pageContent.amountTORaise}
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={'₹'}
                          decimalScale={2}
                          fixedDecimalScale
                          renderText={formattedValue => (
                            <Text
                              style={[
                                g.fs20,
                                g.FHNB,
                                GlobalInclude.AppStyle.upper,
                                g.colorBlue,
                              ]}
                              numberOfLines={1}>
                              {formattedValue}
                            </Text>
                          )}
                        />
                      </View>
                      <View
                        style={[
                          grid.col,
                          GlobalInclude.AppStyle.center,
                          GlobalInclude.AppStyle.textCenter,
                          grid.alignItems,
                          g.ml5,
                        ]}>
                        <Text
                          style={[
                            g.fs15,
                            g.FHNM,
                            GlobalInclude.AppStyle.transform,
                            g.colorBlue,
                          ]}
                          numberOfLines={1}>
                          Raised so far
                        </Text>
                        <NumberFormat
                          value={pageContent.totalRaised}
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={'₹'}
                          decimalScale={2}
                          fixedDecimalScale
                          renderText={formattedValue => (
                            <Text
                              style={[
                                g.fs20,
                                g.FHNB,
                                GlobalInclude.AppStyle.upper,
                                g.colorBlue,
                              ]}
                              numberOfLines={1}>
                              {formattedValue}
                            </Text>
                          )}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                <ScrollableTabView
                  underlineColor={'#ffffff'}
                  initialPage={0}
                  tabBarActiveTextColor={GlobalInclude.Color.ColorPrimary}
                  tabBarInactiveTextColor={'#bababa'}
                  tabBarTextStyle={style.tabTextStyle}
                  tabBarUnderlineStyle={style.tabBarUnderlineStyle}
                  renderTabBar={() => (
                    <ScrollableTabBar style={style.tabBarStyle} />
                  )}>
                  <Description tabLabel={'About'} content={pageContent} />
                  <TheTeam tabLabel={'Contributors'} content={pageContent} />
                  <PitchDocument tabLabel={'Media'} content={pageContent} />
                </ScrollableTabView>
              </View>
            </View>
          )}
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: scale(125),
            paddingTop: scale(10),
            paddingBottom: scale(10),
            alignContent: 'center',
            alignSelf: 'center',
            position: 'absolute',
            bottom: scale(2),
          }}>
          {pageContent !== null && (
            <CommonButton
              showLoader={false}
              title={'Connect'}
              onPress={() => {
                navigation.navigate('UserProfile', {
                  userId: pageContent.createdById,
                });
              }}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const style = StyleSheet.create({
  videoContainer: {
    aspectRatio: 16 / 9,
    width: '100%',
    borderRadius: scale(10),
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
    borderRadius: scale(10),
  },
  thumbStyle: {
    borderRadius: scale(10),
    aspectRatio: 16 / 9,
    width: '100%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  playIconstyle: {
    position: 'absolute',
    zIndex: 9,
    bottom: 12,
    left: 12,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarStyle: {borderBottomWidth: 0, margin: 0},
  tabBarUnderlineStyle: {
    borderBottomColor: 'transparent',
    backgroundColor: 'white',
  },
  imageStyle: {
    aspectRatio: 16 / 9,
    borderRadius: scale(10),
  },
  grayColorText: {color: '#bababa'},
  backgroundBorder: {
    borderRadius: scale(10),
    overflow: 'hidden',
  },
  tabTextStyle: {
    fontSize: scale(15),
    fontFamily: 'Lato-Regular',
    margin: -5,
  },
});

export default ContributionDetails;
