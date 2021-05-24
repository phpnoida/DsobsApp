import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
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
import Helpers from '../../../helper/Helper';
import HeaderBar from '../../../component/HeaderBar';
import {APP_NAME, URL_REGX} from '../../../helper/Constants';
import Description from './Description';
import TheTeam from './TheTeam';
import PitchDocument from './PitchDocument';
import Tags from './Tags';
import Comments from './Comments';
import {doFitlerSocialWork} from '../../../Actions/SocialWorkActions';
import CommonButton from '../../../component/CommonButton';

const {urlRegex} = URL_REGX;
let filterObject = {};

const ListingDetails = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pageContent, setPageContent] = useState({});

  useEffect(() => {
    if (route.params && route.params !== undefined && route.params !== null) {
      filterObject = route.params.data;

      console.log('====================================');
      console.log('data', filterObject);
      console.log('====================================');
    }
    if (filterObject !== undefined && filterObject !== null) {
      getSocialWork();
    }
    return () => {};
  }, [route]);

  /****
   *
   * API Section
   *
   */

  const getSocialWork = () => {
    setIsLoading(true);
    doFitlerSocialWork(
      filterObject,
      (response) => {
        setIsLoading(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              if (
                data.data !== undefined &&
                data.data !== null &&
                data.data.length > 0
              ) {
                setPageContent(data.data[0]);
              }
            }
            console.log('====================================');
            console.log(JSON.stringify(data));
            console.log('====================================');
          }
        }
      },
      (code, error) => {
        setPageContent(null);
        console.log('error->', error);
      },
    );
  };

  /****
   *
   * API Section
   *
   */

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.fill}>
        <View style={GlobalInclude.AppStyle.parentStyle}>
          {isLoading ? (
            <View style={GlobalInclude.AppStyle.fillCenter}>
              <ActivityIndicator
                size={'small'}
                color={GlobalInclude.Color.ColorPrimary}
              />
            </View>
          ) : (
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
              {pageContent !== null ? (
                <View style={GlobalInclude.AppStyle.fill}>
                  <View
                    style={[
                      g.bggray3,
                      style.backgroundBorder,
                      g.mt15,
                      g.ml10,
                      g.mr10,
                    ]}>
                    {pageContent.socialWorkVideo !== undefined &&
                    pageContent.socialWorkVideo !== null &&
                    pageContent.socialWorkVideo !== '' &&
                    Helpers.validateRegex(
                      urlRegex,
                      pageContent.socialWorkVideo,
                    ) ? (
                      <YoutubeView
                        link={pageContent.socialWorkVideo}
                        containerStyle={style.videoContainer}
                        overlayStyle={style.overlayStyle}
                        thumbStyle={style.thumbStyle}
                        playIconstyle={style.playIconstyle}
                        playIconContainer={{
                          height: scale(20),
                          width: scale(20),
                        }}
                        iconSize={scale(20)}
                        showPlay={true}
                      />
                    ) : pageContent.socialWorkImage !== undefined &&
                      pageContent.socialWorkImage !== null &&
                      pageContent.socialWorkImage !== '' &&
                      Helpers.validateRegex(
                        urlRegex,
                        pageContent.socialWorkImage,
                      ) ? (
                      <ProgressImage
                        source={{uri: pageContent.socialWorkImage}}
                        containerStyle={style.imageStyle}
                        imageStyle={style.imageStyle}
                        mode={'cover'}
                      />
                    ) : (
                      <ProgressImage
                        source={GlobalInclude.Assets.DefaultImage}
                        containerStyle={style.imageStyle}
                        imageStyle={style.imageStyle}
                        mode={'cover'}
                      />
                    )}
                  </View>

                  <View style={[g.p15, g.pt10]}>
                    <Text
                      style={[g.fs14, g.FHNR, g.colorGray1]}
                      numberOfLines={2}>
                      {pageContent.title &&
                      pageContent.title !== undefined &&
                      pageContent.title !== null
                        ? pageContent.title
                        : 'N/A'}
                    </Text>
                    <View style={[grid.rowdir, g.mt8]}>
                      <View style={grid.flex1}>
                        <Text style={[g.FHNR, g.fs14, g.colorGray1]}>
                          {'Initiated By'}:{' '}
                          {pageContent.initiatedBy &&
                          pageContent.initiatedBy !== undefined &&
                          pageContent.initiatedBy !== null
                            ? pageContent.initiatedBy
                            : 'N/A'}
                        </Text>
                      </View>
                      <Text style={[g.FHNR, g.fs14, g.txtRight, g.colorGray1]}>
                        {pageContent.startedYear &&
                        pageContent.startedYear !== undefined &&
                        pageContent.startedYear !== null
                          ? `Year: ${pageContent.startedYear}`
                          : 'N/A'}
                      </Text>
                    </View>
                  </View>
                  <ScrollableTabView
                    underlineColor={'#ffffff'}
                    initialPage={0}
                    tabBarActiveTextColor={GlobalInclude.Color.ColorPrimary}
                    tabBarInactiveTextColor={'#bababa'}
                    tabBarTextStyle={style.tabTextStyle}
                    tabBarUnderlineStyle={style.tabBarUnderlineStyle}
                    onChangeTab={(tab) => {
                      //console.log('tab', tab);
                    }}
                    renderTabBar={() => (
                      <ScrollableTabBar style={style.tabBarStyle} />
                    )}>
                    <Description tabLabel={'About'} content={pageContent} />
                    <TheTeam
                      tabLabel={'The Team'}
                      content={pageContent}
                      navigation={navigation}
                    />
                    <PitchDocument tabLabel={'Media'} content={pageContent} />
                    <Tags tabLabel={'Tags'} content={pageContent} />
                    <Comments
                      tabLabel={'Comments'}
                      workId={filterObject.id}
                      navigation={navigation}
                    />
                  </ScrollableTabView>
                </View>
              ) : (
                <View style={GlobalInclude.AppStyle.fillCenter}>
                  <Text style={[g.colorBlack, g.FHNM, g.fs12, g.textCenter]}>
                    No Record Found
                  </Text>
                </View>
              )}
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

export default ListingDetails;
