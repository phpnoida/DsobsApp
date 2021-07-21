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
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import TopHeaderView from '../../component/TopHeaderView';
import ProgressImage from '../../component/ProgresImage';
import YoutubeView from '../../component/YoutubeView';
import SocialWorkSearch from '../../component/SocialWorkSearch';
import {renderNoDataComponent} from '../../component/Common';
import FilterCategory from '../../component//FilterCategory';
import AutoSuggestLocationCompany from '../../component/AutoSuggestLocationCompany';
import {
  getWorkCategory,
  doFitlerSocialWork,
} from '../../Actions/SocialVenturesActions';
import {URL_REGX} from '../../helper/Constants';
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
const SocialVenture = ({navigation}) => {
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
  const [animatedHeight, setAnimatedHeight] = useState(0);
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
                  categoryArray.push({key: -1, text: 'All Ventures'});
                  data.data.map((item, index) => {
                    categoryArray.push({key: index, text: item});
                  });
                }
                categoryListMain = categoryArray;
                setCategoryList(categoryArray);
                setSelectedCategory('All Ventures');
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

  const renderItem = ({item, index}) => {
    return (
      <View key={index}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            filterObject.id = item._id;
            navigation.navigate('SocialVentureDetails', {data: filterObject});
          }}
          key={index}
          style={{
            marginBottom: scale(15),
            marginHorizontal: scale(15),
          }}>
          <View style={[g.bgWhite, g.boxShadow, {borderRadius: scale(10)}]}>
            <View style={[g.bggray3, style.backgroundBorder]}>
              {item.ventureImage !== undefined &&
              item.ventureImage !== null &&
              item.ventureImage !== '' &&
              Helper.validateRegex(urlRegex, item.ventureImage) ? (
                <ProgressImage
                  source={{uri: item.ventureImage}}
                  containerStyle={style.imageStyle}
                  imageStyle={style.imageStyle}
                  mode={'cover'}
                />
              ) : item.ventureVideo !== undefined &&
                item.ventureVideo !== null &&
                item.ventureVideo !== '' &&
                Helper.validateRegex(urlRegex, item.ventureVideo) ? (
                <YoutubeView
                  link={item.ventureVideo}
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
              <Text
                style={[
                  g.fs14,
                  g.mt5,
                  g.FHNR,
                  GlobalInclude.AppStyle.transform,
                  style.grayColorText,
                ]}
                numberOfLines={1}>
                {item.investmentClosingDate &&
                item.investmentClosingDate !== undefined &&
                item.investmentClosingDate !== null
                  ? Helper.showFormatedDate(item.investmentClosingDate, false)
                  : 'N/A'}
              </Text>
              <Text
                style={[
                  g.fs14,
                  g.mt5,
                  g.FHNB,
                  GlobalInclude.AppStyle.transform,
                  style.grayColorText,
                ]}
                numberOfLines={1}>
                {item.founder &&
                item.founder !== undefined &&
                item.founder !== null
                  ? item.founder
                  : 'N/A'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const headerDistance = Animated.diffClamp(
    curY,
    0,
    searchCategory.length > 0 ? 328 : animatedHeight,
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
        index={8}
        navigation={navigation}
        label={'Post a Venture'}
        showLabel={true}
        onLabelPress={() => {
          navigation.navigate('ListSocialVenture');
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
                paddingBottom:
                  searchCategory.length > 0 ? scale(280) : scale(130),
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
        title={'Select Nature'}
        selectedFilter={selectedCategory}
        setSelectedFilter={(value, item) => {
          Keyboard.dismiss();
          resetCount();
          if (item.key !== -1) {
            filterObject.category = value;
          }
          setSelectedCategory(Helper.capitalize(value));
          setFirstTimeLoad(true);
          refCategory.current.close();
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

export default SocialVenture;
