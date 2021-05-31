import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  Keyboard,
  Linking,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import TopHeaderView from '../../component/TopHeaderView';
import ProgressImage from '../../component/ProgresImage';
import YoutubeView from '../../component/YoutubeView';
import SocialWorkSearch from '../../component/SocialWorkSearch';
import {renderNoDataComponent} from '../../component/Common';
import FilterCategory from '../../component/FilterCategory';
import AutoSuggestLocationCompany from '../../component/AutoSuggestLocationCompany';
import {
  getWorkCategory,
  doFitlerSocialWork,
} from '../../Actions/SocialEventsActions';
import {URL_REGX, IconType} from '../../helper/Constants';
import Helper from '../../helper/Helper';

const {urlRegex} = URL_REGX;

const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
};

let totalCount = 0;
let categoryListMain = [];
let filterObject = {
  index: 0,
  size: 10,
};

let curY = new Animated.Value(0);
const SocialEvents = ({navigation}) => {
  curY = new Animated.Value(0);
  const refCategory = useRef();
  const flatList = useRef();

  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');
  const [pageContent, setPageContent] = useState([]);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [animatedHeight, setAnimatedHeight] = useState(119);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchCategory, setSearchCategory] = useState([]);

  useEffect(() => {
    categoryListMain = [];

    const getCategory = () => {
      getWorkCategory(
        (response) => {
          getSocialWork();
          if (response && response !== null) {
            if (
              response.data &&
              response.data !== undefined &&
              response.data !== null
            ) {
              let data = response.data;

              if (data.status) {
                let categoryArray = [];
                if (data.data !== null) {
                  categoryArray.push({key: -1, text: 'All Events'});
                  data.data.map((item, index) => {
                    categoryArray.push({key: index, text: item});
                  });
                  categoryArray.push({
                    key: -2,
                    text: 'Past Events',
                  });
                }
                categoryListMain = categoryArray;
                setCategoryList(categoryArray);
                setSelectedCategory('All Events');
              }
            }
          }
        },
        (error) => {
          getSocialWork();
        },
      );
    };

    const unsubscribe = navigation.addListener('focus', () => {
      if (flatList.current !== null && flatList.current !== undefined) {
        flatList.current.scrollToOffset({x: 0, y: 0, animated: true});
      }
      if (global.isConnected) {
        resetCount();
        getCategory();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  /*****
   *
   * API Section
   *
   */

  const getSocialWork = () => {
    console.log('====================================');
    console.log('filterObject', filterObject);
    console.log('====================================');
    doFitlerSocialWork(
      filterObject,
      (response) => {
        manageResponse(response);
      },
      (code, error) => {
        setIsRefreshing(false);
        setFirstTimeLoad(false);
        setPageContent([]);
        console.log('error->', error);
      },
    );
  };

  const manageResponse = (response) => {
    setIsRefreshing(false);
    if (response && response !== null) {
      if (
        response.data &&
        response.data !== undefined &&
        response.data !== null
      ) {
        let data = response.data;

        if (data.status) {
          if (filterObject.index === 0) {
            totalCount = data.totalCount;
            setPageContent([...data.data]);
          } else {
            setPageContent([...pageContent, ...data.data]);
          }
          setPaginationStatus(PaginationStatus.waiting);
        }
      }
    }
    setFirstTimeLoad(false);
  };

  /**
   *
   * Pagination
   *
   */
  const onPaginate = () => {
    if (paginationStatus !== PaginationStatus.allLoaded && !isRefreshing) {
      console.log('onPaginate()');
      setPaginationStatus(PaginationStatus.waiting);
      filterObject.index = filterObject.index + 1;
      getSocialWork();
    }
  };

  const onEndReached = () => {
    console.log('onEndReached()');
    if (pageContent.length === totalCount || pageContent.length < 10) {
      setPaginationStatus(PaginationStatus.allLoaded);
      return;
    }
    if (paginationStatus === PaginationStatus.waiting) {
      onPaginate();
    }
  };

  const handleRefresh = () => {
    filterObject.index = 0;
    setIsRefreshing(false);
    resetCount();
    getSocialWork();
  };

  const resetCount = () => {
    totalCount = 0;
    filterObject = {};
    filterObject.index = 0;
    filterObject.size = 10;
  };
  /**
   *
   * Pagination
   *
   */

  const searchCategoryName = (searchText) => {
    let oldContent = categoryList;
    var list = [];
    if (searchText.length > 0) {
      oldContent.forEach((element) => {
        if (element.text.toLowerCase().includes(searchText.toLowerCase())) {
          list.push(element);
        }
      });
      setCategoryList([...list]);
    } else {
      setCategoryList([...categoryListMain]);
    }
  };

  const renderFooter = () => {
    return (
      <View style={style.footerView}>
        {pageContent.length === totalCount ? (
          <View />
        ) : (
          <View style={{height: scale(30)}}>
            {paginationStatus === PaginationStatus.waiting ? (
              <View style={g.p10}>
                <ActivityIndicator
                  size={'small'}
                  color={GlobalInclude.Color.ColorPrimary}
                />
              </View>
            ) : null}
          </View>
        )}
      </View>
    );
  };

  const showMapIcon = (link) => {
    if (
      link &&
      link !== undefined &&
      link !== null &&
      link !== '' &&
      Helper.validateRegex(urlRegex, link)
    ) {
      // let response = Helper.getLatLngFromMap(link);
      // if (
      //   response &&
      //   response !== null &&
      //   response.latitude !== 0 &&
      //   response.longitude !== 0
      // ) {
      //   return true;
      // } else {
      //   return false;
      // }
      return true;
    }
    return false;
  };

  const renderItem = ({item, index}) => {
    return (
      <View key={index}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            filterObject.id = item._id;
            navigation.navigate('EventDetails', {data: filterObject});
          }}
          key={index}
          style={{
            marginBottom: scale(15),
            marginHorizontal: scale(15),
          }}>
          <View style={[g.bgWhite, g.boxShadow, {borderRadius: scale(10)}]}>
            <View style={[g.bggray3, style.backgroundBorder]}>
              {item.eventImage !== undefined &&
              item.eventImage !== null &&
              item.eventImage !== '' &&
              Helper.validateRegex(urlRegex, item.eventImage) ? (
                <ProgressImage
                  source={{uri: item.eventImage}}
                  containerStyle={style.imageStyle}
                  imageStyle={style.imageStyle}
                  mode={'cover'}
                />
              ) : item.eventVideo !== undefined &&
                item.eventVideo !== null &&
                item.eventVideo !== '' &&
                Helper.validateRegex(urlRegex, item.eventVideo) ? (
                <YoutubeView
                  link={item.eventVideo}
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
              ) : (
                <ProgressImage
                  source={GlobalInclude.Assets.DefaultImage}
                  containerStyle={style.imageStyle}
                  imageStyle={style.imageStyle}
                  mode={'cover'}
                />
              )}
            </View>
            <View style={[g.pr10, g.pl10, g.pt5, g.pb5]}>
              <Text
                numberOfLines={1}
                style={[
                  g.FHNB,
                  g.fs16,
                  g.colorBlack,
                  GlobalInclude.AppStyle.transform,
                ]}>
                {item.title && item.title !== undefined && item.title !== null
                  ? item.title
                  : 'N/A'}
              </Text>
              <Text
                style={[
                  g.fs14,
                  g.mt5,
                  g.FHNR,
                  GlobalInclude.AppStyle.transform,
                  style.grayColorText,
                ]}
                numberOfLines={1}>
                {item.category &&
                item.category !== undefined &&
                item.category !== null
                  ? item.category
                  : 'N/A'}
              </Text>
              <View style={[grid.row, g.mt5, grid.alignItems]}>
                <View style={grid.col}>
                  <Text style={[g.fs14, g.FHNB, g.colorBlue]} numberOfLines={1}>
                    {Helper.showFormatedDate(item.eventTime, true)}
                  </Text>
                </View>
                {showMapIcon(item.googleMapLink) ? (
                  <TouchableOpacity
                    style={[grid.rowrow, grid.alignItems]}
                    onPress={() => {
                      // createOpenLink({
                      //   travelType: 'public_transport',
                      //   provider: 'google',
                      //   latitude: Helper.getLatLngFromMap(item.googleMapLink)
                      //     .latitude,
                      //   longitude: Helper.getLatLngFromMap(item.googleMapLink)
                      //     .longitude,
                      // });
                      Linking.canOpenURL(item.googleMapLink).then(
                        (supported) => {
                          if (supported) {
                            Linking.openURL(item.googleMapLink);
                          } else {
                            console.log(
                              "Don't know how to open URI: " +
                                item.googleMapLink,
                            );
                          }
                        },
                      );
                    }}>
                    <GlobalInclude.BaseIcon
                      containerStyle={{height: scale(17), width: scale(17)}}
                      iconColor={GlobalInclude.Color.ColorPrimary}
                      iconName={'map-marker'}
                      iconSize={scale(17)}
                      iconType={IconType[4]}
                    />
                    <Text
                      style={[
                        g.fs14,
                        g.FHNB,
                        GlobalInclude.AppStyle.transform,
                        g.colorBlue,
                      ]}
                      numberOfLines={1}>
                      {'Maps'}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const headerDistance = Animated.diffClamp(
    curY,
    0,
    searchCategory.length > 0 ? 328 : 119,
  ).interpolate({
    inputRange: [0, 1],
    outputRange: [0, -1],
  });

  const renderHeader = () => {
    return (
      <Animated.View
        style={[
          g.newHeaderConcept,
          {
            transform: [
              {
                translateY: headerDistance,
              },
            ],
          },
        ]}
        onLayout={({nativeEvent}) => {
          setAnimatedHeight(nativeEvent.layout.height);
        }}>
        <View
          style={[
            GlobalInclude.AppStyle.contentSpace,
            {marginBottom: scale(10)},
          ]}>
          <SocialWorkSearch
            changeText={(text) => {
              setFilterQuery(text);
              if (text.length === 0) {
                Keyboard.dismiss();
                setSearchCategory([]);
                resetCount();
                getSocialWork();
              } else if (text.length >= 2) {
                resetCount();
                filterObject.s = text;
                getSocialWork();
              }
            }}
            filterQuery={filterQuery}
            onFilterPress={() => {
              if (
                refCategory.current !== undefined &&
                refCategory.current !== null
              ) {
                refCategory.current.open();
              }
            }}
          />

          {searchCategory.length > 0 && (
            <AutoSuggestLocationCompany
              searchedData={searchCategory}
              onPress={(row, index) => {
                Keyboard.dismiss();
                resetCount();
                setSearchCategory([]);
                setFilterQuery(Helper.capitalize(row.label));
                filterObject.category = row.label;
                setFirstTimeLoad(true);
                getSocialWork();
              }}
            />
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <TopHeaderView
        index={9}
        navigation={navigation}
        label={'Post an Event'}
        showLabel={true}
        onLabelPress={() => {
          navigation.navigate('ListSocialEvent');
        }}
      />
      <SafeAreaView style={GlobalInclude.AppStyle.fill}>
        <View style={GlobalInclude.AppStyle.fill}>
          {firstTimeLoad ? (
            <View style={GlobalInclude.AppStyle.fillCenter}>
              <ActivityIndicator
                size={'small'}
                color={GlobalInclude.Color.ColorPrimary}
              />
            </View>
          ) : (
            <View style={GlobalInclude.AppStyle.fill}>
              <Animated.FlatList
                ref={flatList}
                showsVerticalScrollIndicator={false}
                extraData={pageContent}
                data={pageContent}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.1}
                onEndReached={onEndReached}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                ListEmptyComponent={renderNoDataComponent}
                ListFooterComponent={renderFooter}
                contentContainerStyle={{
                  marginTop: animatedHeight,
                  paddingBottom:
                    searchCategory.length > 0 ? scale(280) : scale(130),
                }}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                  [{nativeEvent: {contentOffset: {y: curY}}}],
                  {useNativeDriver: true},
                )}
              />
              {renderHeader()}
            </View>
          )}
        </View>
      </SafeAreaView>

      <FilterCategory
        refRBSheet={refCategory}
        dataList={categoryList}
        title={'Select Nature'}
        selectedFilter={selectedCategory}
        setSelectedFilter={(value, item) => {
          Keyboard.dismiss();
          resetCount();
          if (item.key === -2) {
            filterObject.past = true;
          } else if (item.key !== -1) {
            filterObject.category = value;
          }
          setSelectedCategory(Helper.capitalize(value));

          refCategory.current.close();
          setFirstTimeLoad(true);
          setTimeout(() => {
            getSocialWork();
          }, 350);
        }}
        onClose={() => {}}
      />
    </View>
  );
};

const style = StyleSheet.create({
  searchIcon: {
    height: scale(20),
    width: scale(20),
    alignSelf: 'center',
    marginEnd: scale(6),
    marginStart: scale(6),
  },
  filterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    alignContent: 'center',
    alignSelf: 'center',
  },
  filterText: {
    paddingTop: 12,
    paddingBottom: 12,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
  },
  footerView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
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
    bottom: 15,
    left: 15,
  },
  imageStyle: {
    aspectRatio: 16 / 9,
    borderRadius: scale(10),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  grayColorText: {color: '#bababa'},
  backgroundBorder: {
    borderRadius: scale(10),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
  },
});

export default SocialEvents;
