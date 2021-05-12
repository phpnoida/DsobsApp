import React, {useState, useRef, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
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
import {APP_NAME} from '../../../helper/Constants';
import Description from './Description';
import TheTeam from './TheTeam';
import PitchDocument from './PitchDocument';
import Tags from './Tags';
import Comments from './Comments';

const ListingDetails = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pageContent, setPageContent] = useState({});

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.fill}>
        <View style={GlobalInclude.AppStyle.parentStyle}>
          {isLoading ? (
            <View style={GlobalInclude.AppStyle.fillCenter}>
              <ActivityIndicator size={'small'} color={'#2b3252'} />
            </View>
          ) : (
            <View style={GlobalInclude.AppStyle.fill}>
              <HeaderBar
                title={
                  pageContent !== null &&
                  pageContent.businessName &&
                  pageContent.businessName !== undefined &&
                  pageContent.businessName !== null
                    ? pageContent.businessName
                    : APP_NAME
                }
                navigation={navigation}
                customIcon={{
                  containerStyle: {height: scale(30), width: scale(30)},
                  iconColor: '#2b3252',
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
                  <View style={[g.bggray3, g.mt15, g.ml10, g.mr10]}>
                    <View
                      style={[
                        g.bggray3,
                        {
                          borderRadius: scale(10),
                          overflow: 'hidden',
                        },
                      ]}>
                      <YoutubeView
                        link={
                          'https://www.youtube.com/watch?v=zFSgc6mleXo&t=12s'
                        }
                        containerStyle={style.videoContainer}
                        overlayStyle={style.overlayStyle}
                        thumbStyle={style.thumbStyle}
                        playIconstyle={style.playIconstyle}
                        playIconContainer={{
                          height: scale(20),
                          width: scale(20),
                        }}
                        iconSize={scale(20)}
                      />
                    </View>
                  </View>
                  <View style={[g.p15, g.pt10]}>
                    <Text
                      style={[g.fs14, g.FHNR, g.colorGray1]}
                      numberOfLines={2}>
                      {pageContent.categoryOfBusiness &&
                      pageContent.categoryOfBusiness !== undefined &&
                      pageContent.categoryOfBusiness !== null
                        ? pageContent.categoryOfBusiness
                        : 'Drive Against Corona'}
                    </Text>
                    <View style={[grid.rowdir, g.mt8]}>
                      <View style={grid.flex1}>
                        <Text style={[g.FHNR, g.fs14, g.colorGray1]}>
                          {'Initiated By'}:{' '}
                          {pageContent.categoryOfBusiness &&
                          pageContent.categoryOfBusiness !== undefined &&
                          pageContent.categoryOfBusiness !== null
                            ? pageContent.categoryOfBusiness
                            : 'Rahul Kumar'}
                        </Text>
                      </View>
                      <Text style={[g.FHNR, g.fs14, g.txtRight, g.colorGray1]}>
                        {pageContent.categoryOfBusiness &&
                        pageContent.categoryOfBusiness !== undefined &&
                        pageContent.categoryOfBusiness !== null
                          ? pageContent.categoryOfBusiness
                          : 'Year: 2021'}
                      </Text>
                    </View>
                  </View>

                  <ScrollableTabView
                    underlineColor={'#ffffff'}
                    initialPage={0}
                    tabBarActiveTextColor={'#2b3252'}
                    tabBarInactiveTextColor={'#bababa'}
                    tabBarTextStyle={{
                      fontSize: scale(15),
                      fontFamily: 'Lato-Regular',
                      margin: -5,
                    }}
                    tabBarUnderlineStyle={style.tabBarUnderlineStyle}
                    renderTabBar={() => (
                      <ScrollableTabBar style={style.tabBarStyle} />
                    )}>
                    <Description
                      tabLabel={'Description'}
                      content={pageContent}
                    />
                    <TheTeam tabLabel={'The Team'} content={pageContent} />
                    <PitchDocument
                      tabLabel={'Pitch Document'}
                      content={pageContent}
                    />
                    <Tags
                      tabLabel={'Tags'}
                      content={pageContent}
                      productTags={[
                        '#Structure',
                        '#Corona',
                        '#Help',
                        '#Support India',
                      ]}
                    />
                    <Comments
                      tabLabel={'Comments'}
                      content={pageContent}
                      productTags={[
                        '#Structure',
                        '#Corona',
                        '#Help',
                        '#Support India',
                      ]}
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
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarStyle: {borderBottomWidth: 0, margin: 0},
  tabBarUnderlineStyle: {
    borderBottomColor: 'transparent',
    backgroundColor: 'white',
  },
});

export default ListingDetails;
