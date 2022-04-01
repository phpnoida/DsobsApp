import React, {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import OptionsSheet from 'react-native-raw-bottom-sheet';

import TopHeaderView from '../../component/TopHeaderView';
import ProgressImage from '../../component/ProgresImage';
import YoutubeView from '../../component/YoutubeView';
import SocialWorkSearch from '../../component/SocialWorkSearch';
import {
  generateMenuOption,
  renderNoDataComponent,
} from '../../component/Common';
import FilterCategory from '../../component/FilterCategory';
import {URL_REGX, IconType} from '../../helper/Constants';
import Helper from '../../helper/Helper';
import NumberFormat from 'react-number-format';
import {
  getContributions,
  getFilterData,
} from '../../Actions/ContributionActions';

const {urlRegex} = URL_REGX;

const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
};

let totalCount = 0;

let filterObject = {
  page: 1,
  limit: 10,
};

let curY = new Animated.Value(0);

const ContributionsList = ({navigation}) => {
  curY = new Animated.Value(0);
  const refCategory = useRef();
  const flatList = useRef();
  const refOptions = useRef();

  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');
  const [pageContent, setPageContent] = useState([]);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [animatedHeight, setAnimatedHeight] = useState(0);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshData();
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, refreshData]);

  /*****
   *
   * API Section
   *
   */

  const categoryListRequest = useCallback(() => {
    getFilterData(
      response => {
        getContributionList();
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (data.status) {
              let categoryArray = [];
              const categoryObject = data?.data ?? {};

              if (categoryObject !== null) {
                categoryArray.push({key: -1, text: 'All Contributions'});
                for (var key in categoryObject) {
                  if (categoryObject.hasOwnProperty(key)) {
                    if (key.toString() !== '1' && key.toString() !== '2') {
                      categoryArray.push({key: key, text: categoryObject[key]});
                    }
                  }
                }
              }

              setCategoryList(categoryArray);
              setSelectedCategory('All Contributions');
            }
          }
        }
      },
      error => {
        getContributionList();
      },
    );
  }, [getContributionList]);

  const getContributionList = useCallback(() => {
    getContributions(
      filterObject,
      response => {
        manageResponse(response);
      },
      error => {
        setIsRefreshing(false);
        setPaginationStatus(PaginationStatus.allLoaded);
      },
    );
  }, [manageResponse]);

  const manageResponse = useCallback(response => {
    setIsRefreshing(false);
    if (response && response !== null) {
      if (
        response.data &&
        response.data !== undefined &&
        response.data !== null
      ) {
        let data = response.data;
        // console.log('data', data);
        if (data.status) {
          if (filterObject.page === 1) {
            totalCount = data.totalCount;
            setPageContent([...data.data]);
            if (data.data.length > 0) {
              setPaginationStatus(
                totalCount === data.data.length
                  ? PaginationStatus.allLoaded
                  : PaginationStatus.waiting,
              );
            } else {
              setPaginationStatus(PaginationStatus.allLoaded);
            }
          } else {
            setPageContent(old => [...old, ...data.data]);
            if (data.data.length > 0) {
              setPaginationStatus(
                totalCount === data.data.length
                  ? PaginationStatus.allLoaded
                  : PaginationStatus.waiting,
              );
            } else {
              setPaginationStatus(PaginationStatus.allLoaded);
            }
          }
        }
      }
    }
    setFirstTimeLoad(false);
  }, []);

  const refreshData = useCallback(() => {
    resetCount();
    categoryListRequest();
  }, [categoryListRequest]);

  /**
   *
   * Pagination
   *
   */
  const onPaginate = () => {
    if (paginationStatus !== PaginationStatus.allLoaded && !isRefreshing) {
      setPaginationStatus(PaginationStatus.waiting);
      filterObject.page = filterObject.page + 1;
    }
  };

  const onEndReached = () => {
    if (pageContent.length === totalCount || pageContent.length < 10) {
      setPaginationStatus(PaginationStatus.allLoaded);
      return;
    }
    if (paginationStatus === PaginationStatus.waiting) {
      onPaginate();
    }
  };

  const handleRefresh = () => {
    filterObject.page = 1;
    setIsRefreshing(false);
    resetCount();
  };

  const resetCount = () => {
    totalCount = 0;
    filterObject = {};
    filterObject.page = 1;
    filterObject.size = 10;
  };
  /**
   *
   * Pagination
   *
   */

  const userOptions = useMemo(() => {
    return (
      <OptionsSheet
        ref={refOptions}
        minClosingHeight={50}
        height={300}
        duration={200}
        closeOnDragDown={true}
        customStyles={{
          container: GlobalInclude.AppStyle.sheetContainer,
        }}>
        <View stylre={[grid.flex1, g.mb10]}>
          {generateMenuOption(
            'About Contributions',
            'exclamationcircleo',
            10,
            () => {
              refOptions.current.close();
              setTimeout(() => {
                // navigation.navigate('ChatEtiquette');
              }, 220);
            },
          )}
        </View>
      </OptionsSheet>
    );
  }, []);

  const renderFooter = () => {
    return (
      <View style={style.footerView}>
        {pageContent.length === totalCount || totalCount < 10 ? (
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

  const loadContributionPhoto = useCallback(itemPath => {
    const {contributionsVideo, contributionsPhoto} = itemPath;

    if (
      contributionsVideo !== undefined &&
      contributionsVideo !== null &&
      contributionsVideo !== '' &&
      Helper.validateRegex(urlRegex, contributionsVideo)
    ) {
      return (
        <YoutubeView
          link={contributionsVideo}
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
    } else if (
      contributionsPhoto !== undefined &&
      contributionsPhoto !== null &&
      contributionsPhoto !== '' &&
      Helper.validateRegex(urlRegex, contributionsPhoto)
    ) {
      return (
        <ProgressImage
          source={{uri: contributionsPhoto}}
          containerStyle={style.imageStyle}
          imageStyle={style.imageStyle}
          mode={'cover'}
        />
      );
    } else {
      return (
        <ProgressImage
          source={GlobalInclude.Assets.DefaultImage}
          containerStyle={style.imageStyle}
          imageStyle={style.imageStyle}
          mode={'cover'}
        />
      );
    }
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <View key={index}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            navigation.navigate('ContributonDetails', {data: item._id});
          }}
          key={index}
          style={{
            marginBottom: scale(15),
            marginHorizontal: scale(15),
          }}>
          <View style={[g.bgWhite, g.boxShadow, {borderRadius: scale(10)}]}>
            <View style={[g.bggray3, style.backgroundBorder]}>
              {loadContributionPhoto(item)}
            </View>
            <View style={[g.pr10, g.pl10, g.pt5, g.pb5]}>
              <Text
                numberOfLines={1}
                style={[
                  g.FHNB,
                  g.fs15,
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
                  g.FHNM,
                  GlobalInclude.AppStyle.transform,
                  g.colorBlack,
                ]}
                numberOfLines={2}>
                {`Raised so far - ${Math.round(item.totalRaisedInPr)}%`}
              </Text>

              <NumberFormat
                value={item.amountTORaise}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'₹'}
                decimalSeparator={false}
                renderText={formattedValue => (
                  <Text
                    style={[
                      g.fs15,
                      g.mt5,
                      g.FHNM,
                      GlobalInclude.AppStyle.transform,
                      g.colorBlue,
                    ]}
                    numberOfLines={1}>
                    To Raise{' '}
                    <Text
                      style={[
                        g.fs15,
                        g.mt5,
                        g.FHNB,
                        GlobalInclude.AppStyle.upper,
                        g.colorBlue,
                      ]}
                      numberOfLines={1}>
                      {formattedValue}
                    </Text>
                  </Text>
                )}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const headerDistance = Animated.diffClamp(
    curY,
    0,
    animatedHeight,
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
            changeText={text => {
              setFilterQuery(text);
              if (text.length === 0) {
                Keyboard.dismiss();
                resetCount();
                getContributionList();
              } else if (text.length >= 2) {
                resetCount();
                filterObject.search = text;
                getContributionList();
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
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <TopHeaderView
        index={14}
        navigation={navigation}
        label={'Contributions'}
        customIcon={{
          containerStyle: {height: scale(24), width: scale(24)},
          iconColor: GlobalInclude.Color.ColorPrimary,
          iconName: 'dots-horizontal',
          size: scale(24),
          type: IconType[1],
        }}
        customIconPress={() => {
          if (refOptions.current !== undefined && refOptions.current !== null) {
            refOptions.current.open();
          }
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
                paddingBottom: scale(130),
              }}
              scrollEventThrottle={16}
              onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {y: curY}}}],
                {useNativeDriver: true},
              )}
            />
          )}

          {renderHeader()}
        </View>
      </SafeAreaView>

      <FilterCategory
        refRBSheet={refCategory}
        dataList={categoryList}
        title={'Select'}
        selectedFilter={selectedCategory}
        setSelectedFilter={(value, item) => {
          Keyboard.dismiss();
          resetCount();
          if (item.key !== -1) {
            filterObject.type = item.key;
          } else {
            delete filterObject.type;
          }
          setSelectedCategory(Helper.capitalize(value));

          refCategory.current.close();
          getContributionList();
          setFirstTimeLoad(true);
        }}
        onClose={() => {}}
      />
      {userOptions}
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

export default ContributionsList;
