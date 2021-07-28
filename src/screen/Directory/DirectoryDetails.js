import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Animated,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Keyboard,
  Alert,
  SafeAreaView,
  Platform,
  FlatList,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import {IconType} from '../../helper/Constants';
import HeaderBar from '../../component/HeaderBar';
import CityListSheet from 'react-native-raw-bottom-sheet';
import BottomSheetHeader from '../../component/BottomSheetHeader';
import RadioButton from '../../component/RadioButton';
import {doFilterDirectory} from '../../Actions/DirectoryActions';
import Helper from '../../helper/Helper';
import ParallaxScroll from '../../component/ParallaxScroll';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;
let cityListSheet = null;
let offset = 0;
let filterObject = {};
let searchVal = ''; //default search value from previous page
let searchBy = ''; //default search type from previous page
let searchQuery = ''; //search value from text input
let isAtbottom = false;
let currentShowing = 1;
let sortBy = [
  {
    value: '1',
    label: 'Newest',
  },
  {
    value: '5',
    label: 'Alphabetical A-Z',
  },
  {
    value: '7',
    label: 'Most Bookmarked',
  },
];

var tabList = [
  {tabName: 'Gender', value: 'gender'},
  {tabName: 'Location', value: 'location'},
];

const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
};

let dataIndex = 0;
let dataSize = 10;
let totalCount = 0;
let result = '';
var cityList = [];
var listRef = React.createRef();
var lastRequestFrom = ''; //You will get this from SearchDirectory or GalleryListing

const DirectoryDetails = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [lookingFor, setLookingFor] = useState('');
  const [searchedUser, setSearchedUser] = useState([]);
  const [defaultUsersList, setDefaultUsers] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [sortedBy, setSortedBy] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('gender');
  const [genderFilter, setGenderFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [curY, setCurY] = useState(new Animated.Value(0));
  const [animatedHeight, setAnimatedHeight] = useState(0);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );
  const [showLoader, setShowLoader] = useState(false);
  useEffect(() => {
    dataIndex = 0;
    dataSize = 10;
    totalCount = 0;
    currentShowing = 1;
    filterObject = {};
    filterObject.index = dataIndex;
    filterObject.size = dataSize;

    if (route.params !== undefined && route.params !== null) {
      if (
        route.params.searchBy !== undefined &&
        route.params.searchBy !== null
      ) {
        searchBy = route.params.searchBy;
        filterObject.type = searchBy;
      }

      if (
        route.params.searchVal !== undefined &&
        route.params.searchVal !== null
      ) {
        searchVal = route.params.searchVal;
        filterObject.s = route.params.searchVal;
      }
      if (route.params.from !== undefined && route.params.from !== null) {
        lastRequestFrom = route.params.from;
      }
    }
    getFilterDirectory();
    return () => {};
  }, []);

  const getFilterDirectory = () => {
    setShowLoader(true);
    doFilterDirectory(
      filterObject,
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (dataIndex === 0) {
              totalCount = data.totalCount;
            }

            if (data.status) {
              saveData(data);
            }
          }
        }
        setShowLoader(false);
        if (dataIndex === 0) {
          setIsLoading(false);
        }
      },
      (error) => {
        if (dataIndex === 0) {
          setSearchedUser(null);
          setIsLoading(false);
        }
        setShowLoader(false);
      },
    );
  };

  const saveData = (data) => {
    let records = data.data;
    cityList = [];
    data.uniqueCity.map((item) => {
      cityList.push({key: item, text: item});
    });
    if (dataIndex === 0) {
      setSearchedUser([...records]);
      setDefaultUsers([...records]);
      result = `${currentShowing}-${dataSize}`;
    } else {
      currentShowing = dataIndex * 10;
      result = `${currentShowing}-${
        records.length < 10
          ? currentShowing + records.length
          : currentShowing + dataSize
      }`;
      setSearchedUser([...searchedUser, ...records]);
      setDefaultUsers([...defaultUsersList, ...records]);
    }
    setPaginationStatus(PaginationStatus.waiting);
  };

  const applyFilter = () => {
    if (locationFilter === '' && genderFilter === '') {
      clearFilter();
    } else {
      if (locationFilter !== '' && genderFilter !== '') {
        filterObject.city = locationFilter;
        filterObject.gender = genderFilter;
      } else if (locationFilter !== '') {
        filterObject.city = locationFilter;
      } else if (genderFilter !== '') {
        filterObject.gender = genderFilter;
      }
      setShowFilter(!showFilter);
      setTimeout(() => {
        resetCount();
      }, 100);
    }
  };

  const applySorting = (type) => {
    filterObject.sortBy = type;

    setTimeout(() => {
      resetCount();
    }, 100);
  };

  const resetCount = () => {
    dataIndex = 0;
    dataSize = 10;
    totalCount = 0;
    filterObject.index = dataIndex;
    getFilterDirectory();
  };

  const clearFilter = () => {
    setGenderFilter('');
    setLocationFilter('');
    setLookingFor('');
    setShowFilter(!showFilter);

    delete filterObject.sortBy;
    delete filterObject.city;
    delete filterObject.gender;
    filterObject.s = searchVal;
    setTimeout(() => {
      resetCount();
    }, 200);
  };

  const handleSearch = (text) => {
    searchQuery = text;
    setLookingFor(text);

    // if (text.length > 0) {
    //   let filterTracks = searchedUser.filter((item) => {
    //     if (item.firstName.toLowerCase().match(text.toLowerCase())) {
    //       return item;
    //     }
    //   });
    //   setSearchedUser([...filterTracks]);
    // } else {
    //   setSearchedUser([...defaultUsersList]);
    // }
  };

  const onPaginate = () => {
    if (paginationStatus !== PaginationStatus.allLoaded && !showLoader) {
      console.log('onPaginate()');
      setPaginationStatus(PaginationStatus.waiting);
      dataIndex = parseInt(dataIndex, 10) + 1;
      filterObject.index = dataIndex;
      getFilterDirectory();
    }
  };

  const onEndReached = () => {
    console.log('onEndReached()');
    if (searchedUser.length === totalCount) {
      setPaginationStatus(PaginationStatus.allLoaded);
      return;
    }
    if (paginationStatus === PaginationStatus.waiting) {
      onPaginate();
    }
  };

  const handleRefresh = () => {
    resetCount();
  };

  const onScrollEndDrag = (event) => {
    if (isAtbottom) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  const onScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const dif = currentOffset - (offset || 0);

    if (Math.abs(dif) < 3) {
    } else if (dif < 0) {
      isAtbottom = false;
    } else {
      isAtbottom = true;
    }

    offset = currentOffset;
  };

  const concateLocation = (item) => {
    let fullName = '';

    if (item.city && item.city !== undefined && item.city !== '') {
      fullName += item.city.charAt(0).toUpperCase() + item.city.slice(1);
    }

    // if (item.country && item.country !== undefined && item.country !== '') {
    //   fullName +=
    //     ' ' + item.country.charAt(0).toUpperCase() + item.country.slice(1);
    // }
    return fullName;
  };

  const renameProfession = (profession) => {
    if (profession.includes('-')) {
      let profArray = profession.split('-');
      return profArray.length > 2 ? profArray[2] : profession;
    } else {
      return profession;
    }
  };

  const tabContent = () => {
    switch (selectedFilter) {
      case 'gender': {
        return (
          <View>
            <Text
              style={[
                g.fs12,
                g.mb5,
                genderFilter === 1 ? g.colorBlue : g.colorWhite,
              ]}
              numberOfLines={1}
              onPress={() => {
                setGenderFilter(1);
              }}>
              {'Male'}
            </Text>
            <Text
              style={[
                g.fs12,
                g.mb5,
                genderFilter === 0 ? g.colorBlue : g.colorWhite,
              ]}
              numberOfLines={1}
              onPress={() => {
                setGenderFilter(0);
              }}>
              {'Female'}
            </Text>
          </View>
        );
      }
      case 'location': {
        return (
          <TouchableOpacity
            activeOpacity={1}
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            onPress={() => {
              cityListSheet.open();
            }}
            style={[grid.rowdir, grid.alignItems, g.br3, g.whiteSelect]}>
            <Text style={[grid.col, g.fs12, g.FHNM]} numberOfLines={1}>
              {locationFilter.length > 0
                ? locationFilter.toLowerCase().charAt(0).toUpperCase() +
                  locationFilter.slice(1)
                : 'Select'}
            </Text>
            <View style={style.triangleShape} />
          </TouchableOpacity>
        );
      }
    }
    return <View />;
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={1}
        onPress={() => {
          if (lastRequestFrom === 'Gallery') {
            navigation.navigate('FilteredResult', {
              filterBy: {userId: item._id, index: 0, size: 10},
              pageTitle: `Search For: ${Helper.concatName(item)}`,
            });
          } else {
            navigation.navigate('UserProfile', {
              userId: item._id,
            });
          }
        }}
        style={{
          overflow: 'hidden',
          borderRadius: scale(8),
          width: '48%',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: scale(16),
          marginHorizontal: scale(3),
        }}>
        <View style={grid.row}>
          <View style={grid.col}>
            <View
              style={{
                backgroundColor: '#202020',
                borderRadius: scale(10),
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              }}>
              {item.profileImg !== '' ? (
                <Image
                  style={{
                    width: '100%',
                    borderRadius: scale(10),
                    aspectRatio: 3 / 4,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                  source={{uri: item.profileImg}}
                  resizeMode={'cover'}
                />
              ) : (
                <View style={{aspectRatio: 3 / 4}} />
              )}
            </View>
            <View style={[g.bggray3, g.p5, g.w100p, {minHeight: scale(80)}]}>
              <Text
                style={[g.fs12, g.FHNR, g.colorBlack]}
                numberOfLines={2}
                ellipsizeMode={'tail'}>
                {Helper.concatName(item)}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: scale(6),
                  marginBottom: scale(5),
                }}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  {item.schoolNumber ? (
                    <Text style={[g.fs12, g.colorBlack, g.FHNR]}>
                      {item.schoolNumber}
                    </Text>
                  ) : null}

                  {item.house ? (
                    <Text style={[g.fs12, g.colorBlack, g.FHNR, g.ml5, g.mr5]}>
                      {item.house.toLowerCase().charAt(0).toUpperCase() +
                        item.house.toLowerCase().slice(1)}
                    </Text>
                  ) : null}

                  {item.section ? (
                    <Text style={[g.fs12, g.colorBlack, g.FHNR]}>
                      {item.section}
                    </Text>
                  ) : null}
                </View>

                {item.batch ? (
                  <Text style={[g.fs12, g.colorBlack, g.FHNR]}>
                    {item.batch}
                  </Text>
                ) : null}
              </View>
              <Text
                style={[
                  g.fs11,
                  g.colorBlack,
                  g.justifyContentCenter,
                  grid.alignContent,
                  g.mb5,
                  {textTransform: 'capitalize'},
                ]}>
                {concateLocation(item)}
              </Text>
              {item.profession ? (
                <Text
                  style={[
                    g.fs12,
                    g.colorBlack,
                    g.FHNR,
                    {
                      justifyContent: 'center',
                      alignContent: 'center',
                      flex: 1,
                      textAlignVertical: 'center',
                    },
                  ]}
                  numberOfLines={2}
                  ellipsizeMode={'tail'}>
                  {renameProfession(item.profession)}
                </Text>
              ) : (
                <Text
                  style={[
                    g.fs12,
                    g.colorBlack,
                    g.FHNR,
                    {
                      justifyContent: 'center',
                      alignContent: 'center',
                      flex: 1,
                      textAlignVertical: 'center',
                    },
                  ]}
                  numberOfLines={2}
                  ellipsizeMode={'tail'}>
                  No Profession Selected
                </Text>
              )}

              {/* <View style={[grid.row, grid.alignItemsBottom, g.mt10]}>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={[g.shareStyle2, g.mr5, {padding: 3, paddingLeft: 2}]}
                    onPress={() => {}}
                    activeOpacity={1}
                    hitSlop={{top: 20, bottom: 20, left: 10, right: 20}}>
                    <Image
                      resizeMode="cover"
                      source={GlobalInclude.Assets.Share}
                      style={{width: 19, height: 19}}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {}}
                    activeOpacity={1}
                    hitSlop={{top: 10, bottom: 10, left: 0, right: 10}}>
                    <Image
                      source={GlobalInclude.Assets.Bookmark}
                      style={[{width: scale(20), height: scale(20)}]}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
                <View style={{flex: 1, justifyContent: 'flex-end'}}>
                  <Text
                    style={[
                      g.fs11,
                      g.colorBlack,
                      g.justifyContentCenter,
                      grid.alignContent,
                      {textAlign: 'right', textAlignVertical: 'center'},
                    ]}>
                    {concateLocation(item)}
                  </Text>
                </View>
              </View> */}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const headerComponent = () => {
    return (
      <View
        style={{
          ...Platform.select({
            android: {
              paddingTop: scale(15),
            },
            ios: {
              paddingTop: scale(10),
            },
          }),
          paddingHorizontal: scale(15),
          marginBottom: scale(10),
        }}>
        {/* search view */}
        <View style={[grid.rowdir, g.mb15]}>
          <View style={[g.br3, grid.col, g.mr5]}>
            <View style={[g.inputNew, grid.rowdir]}>
              <GlobalInclude.BaseIcon
                containerStyle={style.searchIcon}
                iconColor={'#dddddd'}
                iconName={'search'}
                iconSize={scale(20)}
                iconType={IconType[4]}
              />
              <TextInput
                underlineColorAndroid="transparent"
                value={lookingFor}
                style={[
                  g.inputNew,
                  g.fs16,
                  grid.col,
                  grid.justifyContentCenter,
                ]}
                keyboardType={'default'}
                placeholder={'I am looking for'}
                onChangeText={handleSearch}
              />
            </View>
          </View>
          {/* <TouchableOpacity
            enabled={false}
            activeOpacity={0.8}
            onPress={() => {
              // if (searchQuery.trim().length > 0) {
              //   Keyboard.dismiss();
              //   filterObject.s = searchQuery;
              //   setTimeout(() => {
              //     resetCount();
              //   }, 200);
              // }
            }}
            style={[
              g.fliterBtnNew,
              grid.alignItems,
              grid.justifyContentCenter,
              g.bgBlue,
            ]}>
            <Text style={[g.colorWhite, g.FHNM, g.fs16]}>Go</Text>
          </TouchableOpacity> */}
        </View>
        {/* <View>{searchSuggestions.length > 0 && renderAutoSuggest()}</View> */}

        {/* Filter options */}
        <View style={[grid.rowdir, grid.alignItems]}>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => {
              setShowFilter(!showFilter);
            }}>
            <GlobalInclude.BaseIcon
              containerStyle={style.filterIcon}
              iconColor={showFilter ? GlobalInclude.Color.ColorPrimary : '#000'}
              iconName={'filter'}
              iconSize={scale(14)}
              iconType={IconType[4]}
            />
            <Text
              style={[g.fs11, g.pr10, showFilter ? g.colorBlue : g.colorBlack]}>
              {showFilter ? 'CLOSE FILTERS' : 'FILTERS'}
            </Text>
          </TouchableOpacity>
          <View style={grid.col}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {sortBy.map((item, i) => {
                return (
                  <View
                    style={[
                      g.btnsort,
                      sortedBy === item.value && g.btnsortactive,
                      i === 0 && g.ml0,
                    ]}
                    key={i}>
                    <Text
                      style={[
                        g.colorGray,
                        g.fs12,
                        sortedBy === item.value && g.colorWhite,
                      ]}
                      onPress={() => {
                        if (i === 2) {
                          alert('Coming soon.');
                        } else {
                          setSortedBy(item.value);
                          applySorting(i + 1);
                        }
                      }}>
                      {item.label}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
        {/* Filter options */}
        {/* show hide filter */}
        {showFilter && (
          <View style={[g.bggray3, g.mt15]}>
            <View style={[g.p10]}>
              <Text style={[g.colorBlack, g.fs12]}>
                Apply Filters To Result
              </Text>
              <View style={[grid.rowdir, g.mt10]}>
                <View style={[grid.w120, g.mr10]}>
                  {tabList.map((tab, index) => {
                    return (
                      <TouchableOpacity
                        style={[
                          g.btnt,
                          grid.rowdir,
                          grid.alignItems,
                          g.br3,
                          selectedFilter !== tab.value && g.bggray6,
                          index !== 0 && g.mt5,
                        ]}
                        onPress={() => {
                          setSelectedFilter(tab.value);
                        }}
                        key={index}>
                        <Text
                          style={[g.colorWhite, g.fs12, g.txtLeft, grid.col]}>
                          {tab.tabName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <View style={[grid.col, g.bggray6, g.p10, g.br3]}>
                  <ScrollView>{tabContent()}</ScrollView>
                  <View>
                    <Text
                      style={[g.btn, g.fs12, g.mt10]}
                      onPress={() => {
                        applyFilter();
                      }}>
                      {'Apply Filters'}
                    </Text>
                    <Text
                      style={[g.btn, g.bgWhite, g.fs12, g.colorBlack, g.mt10]}
                      onPress={() => {
                        clearFilter();
                      }}>
                      {'Clear Filters'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
        {/* show hide filter */}

        {/* filter result */}
        <Text style={[g.fs10, g.FHNR, g.colorBlack, g.mt10]}>
          {'ALL RESULTS'}: {totalCount} {'Profiles'}
        </Text>
        <Text style={[g.fs10, g.FHNR, g.colorBlack, g.pt2]}>
          {'CURRENT RESULTS'}:{result}
          {'Profiles'}
        </Text>
        {/* filter result */}
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

  const renderFooter = () => {
    return (
      <View style={style.footerView}>
        {searchedUser.length === totalCount ? (
          <View />
        ) : (
          <View style={{height: scale(60)}}>
            {paginationStatus === PaginationStatus.waiting ? (
              <View style={g.p10}>
                <ActivityIndicator
                  size={'large'}
                  color={GlobalInclude.Color.ColorPrimary}
                />
              </View>
            ) : null}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <HeaderBar navigation={navigation} showBack={true} title={'Directory'} />
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
        <TouchableOpacity
          style={GlobalInclude.AppStyle.fill}
          activeOpacity={1}
          onPress={() => {
            Keyboard.dismiss();
          }}>
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
                <Animated.FlatList
                  showsVerticalScrollIndicator={false}
                  ref={listRef}
                  numColumns={2}
                  extraData={searchedUser}
                  data={searchedUser}
                  onEndReachedThreshold={0.1}
                  onEndReached={onEndReached}
                  renderItem={renderItem}
                  contentContainerStyle={{
                    marginTop: animatedHeight,
                    paddingStart: scale(15),
                    paddingEnd: scale(15),
                    paddingBottom: animatedHeight,
                  }}
                  bounces={false}
                  ListFooterComponent={renderFooter}
                  keyExtractor={(v, i) => i.toString()}
                  onScrollEndDrag={onScrollEndDrag}
                  scrollEventThrottle={16}
                  onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: curY}}}],
                    {useNativeDriver: true, listener: onScroll},
                  )}
                />

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
                  <View>{headerComponent()}</View>
                </Animated.View>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </SafeAreaView>

      {showScrollTop && !showLoader ? (
        <View style={[g.btnScrollStrip, grid.alignItems]}>
          <TouchableOpacity
            style={{width: scale(90)}}
            activeOpacity={0.8}
            onPress={() => {
              setShowScrollTop(false);
              if (listRef !== null) {
                //.scrollToOffset({ animated: true, offset: 0 });
                listRef.current.scrollToOffset({
                  animated: true,
                  offset: 0,
                });
              }
            }}
            hitSlop={{top: 50, bottom: 50, left: 100, right: 100}}>
            <Text style={[g.btn, g.btnScrolltoTop, g.fs11]}>
              {'Scroll to top'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* city list sheet */}
      <CityListSheet
        ref={(ref) => {
          cityListSheet = ref;
        }}
        height={deviceHeight - 150}
        minClosingHeight={50}
        duration={350}
        closeOnDragDown={true}
        customStyles={{
          container: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingStart: scale(15),
            paddingEnd: scale(15),
            paddingBottom: scale(20),
          },
        }}>
        <BottomSheetHeader title={'Select City'} showSearch={false} />

        <RadioButton
          defaultSelected={locationFilter}
          PROP={cityList}
          capitalize
          onRadioSelect={(value) => {
            setLocationFilter(value.text.toString());
            cityListSheet.close();
          }}
        />
      </CityListSheet>
    </View>
  );
};

const style = StyleSheet.create({
  mainContainer: {
    paddingBottom: scale(15),
    paddingTop: scale(15),
    flex: 1,
    backgroundColor: 'white',
  },
  searchIcon: {
    height: scale(20),
    width: scale(20),
    alignSelf: 'center',
    marginEnd: scale(6),
    marginStart: scale(6),
  },
  filterIcon: {
    height: scale(14),
    width: scale(14),
    alignSelf: 'center',
    marginEnd: scale(3),
    justifyContent: 'center',
  },
  tabsbut: {
    backgroundColor: GlobalInclude.Color.ColorPrimary,
    color: '#ffffff',
    width: scale(100),
    paddingTop: 9,
    paddingBottom: 9,
    fontSize: scale(12),
    textAlign: 'center',
    borderRadius: scale(6),
    overflow: 'hidden',
  },
  bbtbgnactive: {
    backgroundColor: '#f8f8f8',
    color: GlobalInclude.Color.ColorPrimary,
  },
  tabBarText: {
    color: '#333333',
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 14,
  },
  tabSpace: {
    paddingRight: deviceWidth - 105,
  },
  tabsubheight: {
    height: deviceHeight - 130,
  },
  tabbarheight: {
    minHeight: deviceHeight - 90,
  },
  userName: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    textAlign: 'left',
    fontSize: scale(12),
    color: '#333333',
    fontFamily: 'Lato-Regular',
    marginTop: scale(5),
  },
  suggestionContainer: {
    width: scale(70),
    marginEnd: scale(10),
    marginTop: scale(6),
    marginBottom: scale(6),
  },
  triangleShape: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#dddddd',
    marginLeft: 8,
  },
});

export default DirectoryDetails;
