import React, {useState, useCallback, useEffect, useRef} from 'react';
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
import Helper from '../../../helper/Helper';
import HeaderBar from '../../../component/HeaderBar';
import {APP_NAME, URL_REGX} from '../../../helper/Constants';
import Description from './Description';
import TheTeam from './TheTeam';
import PitchDocument from './PitchDocument';
import Comments from './Comments';
import CommonButton from '../../../component/CommonButton';
import NumberFormat from 'react-number-format';
import SemiCircleProgress from '../../../component/SemiCircleProgress';
import {getContributionDetail} from '../../../Actions/ContributionActions';

const {urlRegex} = URL_REGX;
let contributeId = '';

const ContributionDetails = ({route, navigation}) => {
  const tabRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [pageContent, setPageContent] = useState(null);
  const [initialPage, setInitialPage] = useState(0);

  useEffect(() => {
    if (route.params && route.params !== undefined && route.params !== null) {
      contributeId = route?.params?.data;
    }
    if (contributeId !== undefined && contributeId !== null) {
      getContributionList();
    }
    return () => {};
  }, [route, getContributionList]);

  /****
   *
   * API Section
   *
   */
  const getContributionList = useCallback(() => {
    getContributionDetail(
      contributeId,
      response => {
        manageResponse(response);
      },
      error => {
        setIsLoading(false);
        setPageContent(null);
      },
    );
  }, [manageResponse]);

  const manageResponse = useCallback(
    response => {
      setIsLoading(false);
      if (response && response !== null) {
        if (
          response.data &&
          response.data !== undefined &&
          response.data !== null
        ) {
          let data = response.data;
          if (data.status) {
            const {resData, contributor} = data;

            resData.contributor = contributor;

            setPageContent(resData);

            let openPastMatch = route?.params?.openLastPage ?? false;
            if (openPastMatch) {
              setTimeout(() => {
                // setInitialPage(1);
                tabRef?.current?.goToPage(1);
              }, 1000);
            }
            console.log('openPastMatch', openPastMatch);
          }
        }
      }
    },
    [route],
  );

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
            <>
              {pageContent !== null && pageContent !== undefined ? (
                <>
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
                      <View style={[g.mt5, g.p5]}>
                        <View style={[g.boxShadow, g.bgWhite, g.br3]}>
                          <View
                            style={[
                              grid.alignItems,
                              grid.justifyContentCenter,
                              g.mb10,
                              g.mt10,
                            ]}>
                            <SemiCircleProgress
                              percentage={
                                Math.round(pageContent.totalRaisedInPr) > 100
                                  ? 100
                                  : Math.round(pageContent.totalRaisedInPr)
                              }
                              circleRadius={70}
                              progressWidth={15}
                              progressColor={GlobalInclude.Color.ColorPrimary}>
                              <Text
                                style={[
                                  g.fs24,
                                  g.FHNB,
                                  GlobalInclude.AppStyle.transform,
                                  g.colorBlue,
                                ]}>{`${
                                Math.round(pageContent.totalRaisedInPr) > 100
                                  ? '100'
                                  : Math.round(pageContent.totalRaisedInPr)
                              }%`}</Text>
                            </SemiCircleProgress>
                          </View>

                          <View style={[g.mb5, GlobalInclude.AppStyle.row]}>
                            <View style={[grid.col, g.pl10, g.mr15]}>
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
                            <View style={[grid.col, g.pl10, g.ml15]}>
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
                        ref={tabRef}
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
                        <TheTeam
                          tabLabel={'Contributors'}
                          content={pageContent}
                          navigation={navigation}
                        />
                        <PitchDocument
                          tabLabel={'Media'}
                          content={pageContent}
                        />
                        <Comments
                          tabLabel={'Comments'}
                          contributeId={contributeId}
                          navigation={navigation}
                        />
                      </ScrollableTabView>
                    </View>
                  </View>
                </>
              ) : null}
            </>
          )}
        </View>

        <View style={style.buttonContainer}>
          {pageContent !== null && pageContent.status === 2 && (
            <CommonButton
              showLoader={false}
              title={'Contribute Now'}
              onPress={() => {
                navigation.navigate('Contributions', {
                  pageContent: pageContent,
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
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(145),
    paddingTop: scale(10),
    paddingBottom: scale(10),
    alignContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: scale(2),
  },
});

export default ContributionDetails;
