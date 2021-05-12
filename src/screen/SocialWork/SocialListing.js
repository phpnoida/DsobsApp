import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  ActivityIndicator,
  FlatList,
  Linking,
  Animated,
  TouchableOpacity,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import TopHeaderView from '../../component/TopHeaderView';
import ProgressImage from '../../component/ProgresImage';
import YoutubeView from '../../component/YoutubeView';
import SocialWorkSearch from '../../component/SocialWorkSearch';
import {renderNoDataComponent} from '../../component/Common';
import CategorySheet from './AddListing/CategorySheet';
import AutoSuggestLocationCompany from '../../component/AutoSuggestLocationCompany';
import {doSearchCity} from '../../Actions/CommonActions';
const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
};
let searchVal = '';
let totalCount = 0;
let categoryListMain = [];
let filterObject = {
  index: 0,
  size: 10,
};
let curY = new Animated.Value(0);
const SocialListing = ({navigation}) => {
  curY = new Animated.Value(0);
  const refCategory = useRef();

  const [firstTimeLoad, setFirstTimeLoad] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pageContent, setPageContent] = useState([
    {item: 1},
    {item: 1},
    {item: 1},
  ]);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [animatedHeight, setAnimatedHeight] = useState(119);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [searchedCityCompany, setSearchedCityCompany] = useState([]);

  useEffect(() => {
    searchVal = '';
    totalCount = 0;
    categoryListMain = [];
    filterObject = {
      index: 0,
      size: 10,
    };

    return () => {};
  }, []);

  const searchCityName = (query) => {
    setIsLoading(true);
    doSearchCity(
      query,
      10,
      0,
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
              if (searchVal.length > 0) {
                let itemList = [];
                data.data.map((child) => {
                  itemList.push({
                    id: child,
                    label: child.name,
                    value: child.country_name,
                  });
                });
                setSearchedCityCompany([...itemList]);
              } else {
                setSearchedCityCompany([]);
              }
            }
          }
        }
      },
      (code, error) => {
        setIsLoading(false);
        setSearchedCityCompany([]);
        console.log('error', error);
      },
    );
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
      //getYellowPage();
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
    setIsRefreshing(true);
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

  const searchCategory = (searchText) => {
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
                <ActivityIndicator size={'small'} color={'#2b3252'} />
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
            navigation.navigate('ListingDetails', {data: item});
          }}
          key={index}
          style={{
            marginBottom: scale(15),
            marginHorizontal: scale(15),
          }}>
          <View style={[g.bgWhite, g.boxShadow, {borderRadius: scale(10)}]}>
            <View
              style={[
                g.bggray3,
                {
                  borderRadius: scale(10),
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  overflow: 'hidden',
                },
              ]}>
              {index === 1 ? (
                <YoutubeView
                  link={'https://www.youtube.com/watch?v=zFSgc6mleXo&t=12s'}
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
                  containerStyle={{
                    aspectRatio: 16 / 9,
                    borderRadius: scale(10),
                  }}
                  imageStyle={{
                    aspectRatio: 16 / 9,
                    borderRadius: scale(10),
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                  mode={'cover'}
                />
              )}
            </View>
            <View style={[g.p15, g.pl10]}>
              <Text
                style={[
                  g.FHNB,
                  g.fs16,
                  g.colorBlack,
                  GlobalInclude.AppStyle.transform,
                ]}>
                {item.businessName &&
                item.businessName !== undefined &&
                item.businessName !== null
                  ? item.businessName
                  : 'Drive Against Corona'}
              </Text>
              <Text
                style={[
                  g.fs14,
                  g.mt5,
                  g.FHNR,
                  GlobalInclude.AppStyle.transform,
                  {color: '#bababa'},
                ]}
                numberOfLines={2}>
                {item.categoryOfBusiness &&
                item.categoryOfBusiness !== undefined &&
                item.categoryOfBusiness !== null
                  ? item.categoryOfBusiness
                  : 'Teeka Utsav'}
              </Text>
              <Text
                style={[
                  g.fs14,
                  g.mt5,
                  g.FHNR,
                  GlobalInclude.AppStyle.transform,
                  {color: '#bababa'},
                ]}
                numberOfLines={2}>
                {item.categoryOfBusiness &&
                item.categoryOfBusiness !== undefined &&
                item.categoryOfBusiness !== null
                  ? item.categoryOfBusiness
                  : 'Year:2021'}
              </Text>
              <Text
                style={[
                  g.fs14,
                  g.mt5,
                  g.FHNR,
                  GlobalInclude.AppStyle.transform,
                  {color: '#bababa'},
                ]}
                numberOfLines={2}>
                {item.categoryOfBusiness &&
                item.categoryOfBusiness !== undefined &&
                item.categoryOfBusiness !== null
                  ? item.categoryOfBusiness
                  : 'Rahul Kumar'}
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
    searchedCityCompany.length > 0 ? 328 : 119,
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
          console.log('item', nativeEvent.layout.height);
          setAnimatedHeight(nativeEvent.layout.height);
        }}>
        <View
          style={[
            GlobalInclude.AppStyle.contentSpace,
            {marginBottom: scale(10)},
          ]}>
          <SocialWorkSearch
            changeText={(text) => {
              searchVal = text;
              setFilterQuery(text);
              searchCityName(text);
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

          {searchedCityCompany.length > 0 && (
            <AutoSuggestLocationCompany
              searchedData={searchedCityCompany}
              onPress={(row, index) => {}}
            />
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.parentStyle}>
        <View style={GlobalInclude.AppStyle.fill}>
          <View
            style={[
              GlobalInclude.AppStyle.contentSpace,
              {zIndex: 1},
              g.bgWhite,
            ]}>
            <TopHeaderView
              index={7}
              navigation={navigation}
              label={'Post a Social'}
              showLabel={true}
              onLabelPress={() => {
                navigation.navigate('ListMyWork');
              }}
            />
          </View>
          <View style={GlobalInclude.AppStyle.fill}>
            {firstTimeLoad ? (
              <View style={GlobalInclude.AppStyle.fillCenter}>
                <ActivityIndicator size={'small'} color={'#2b3252'} />
              </View>
            ) : (
              <View style={GlobalInclude.AppStyle.fill}>
                <Animated.FlatList
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
                      searchedCityCompany.length > 0 ? scale(280) : scale(130),
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
        </View>
      </SafeAreaView>

      <CategorySheet
        refRBSheet={refCategory}
        dataList={categoryList}
        searchProfession={(query) => {
          searchCategory(query);
        }}
        selectedProfession={selectedCategory}
        setSelectedProfession={(value) => {
          console.log('value', value);
          refCategory.current.close();
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
});

export default SocialListing;
