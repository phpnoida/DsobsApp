import React, {useState, useEffect, useLayoutEffect} from 'react';
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
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import {IconType} from '../../helper/Constants';
import CityListSheet from 'react-native-raw-bottom-sheet';
import RadioButton from '../../component/RadioButton';
import BottomSheetHeader from '../../component/BottomSheetHeader';
import HeaderBar from '../../component/HeaderBar';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;
let cityListSheet = null;
let offset = 0;
let isAtbottom = false;
let oldData = [];
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
var cityList = [];
var filteredCount = -1;
var listRef = React.createRef();
const DirectoryDetails = ({route, navigation}) => {
  if (route.params !== undefined && route.params !== null) {
    if (route.params.data !== undefined && route.params.data !== null) {
      oldData = route.params.data;
    }
  }
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedUser, setSearchedUser] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [sortedBy, setSortedBy] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('gender');
  const [genderFilter, setGenderFilter] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [curY, setCurY] = useState(new Animated.Value(0));
  const [animatedHeight, setAnimatedHeight] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <HeaderBar navigation={navigation} />,
    });
    return () => {};
  }, [navigation]);

  useEffect(() => {
    if (oldData.length > 0) {
      cityList = [];
      oldData.map((data) => {
        if (data.city !== '') {
          const found = cityList.some((el) => el.text === data.city);
          if (!found) {
            cityList.push({key: data._id, text: data.city});
          }
        }
      });

      cityList.sort(function (a, b) {
        if (a.text < b.text) {
          return -1;
        }
        if (a.text > b.text) {
          return 1;
        }
        return 0;
      });

      setSearchedUser([...oldData]);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => {};
  }, []);

  const applyFilter = () => {
    let mainResult = oldData;
    let filteredResult = [];

    if (locationFilter === '' && genderFilter.length === 0) {
      clearFilter();
    } else {
      mainResult.map((item) => {
        if (locationFilter !== '' && genderFilter.length > 0) {
          if (
            item.city.toString().toLowerCase() === locationFilter &&
            genderFilter.includes(item.gender)
          ) {
            const found = filteredResult.some((el) => el._id === item._id);
            if (!found) {
              filteredResult.push(item);
            }
          }
        } else if (locationFilter !== '') {
          if (item.city.toString().toLowerCase() === locationFilter) {
            const found = filteredResult.some((el) => el._id === item._id);
            if (!found) {
              filteredResult.push(item);
            }
          }
        } else if (genderFilter.length > 0) {
          if (genderFilter.includes(item.gender)) {
            const found = filteredResult.some((el) => el._id === item._id);
            if (!found) {
              filteredResult.push(item);
            }
          }
        }
      });
      filteredCount = filteredResult.length;
      setSearchedUser([...filteredResult]);
      setShowFilter(!showFilter);
    }
  };

  const applySorting = (type) => {
    let tmpData = searchedUser;
    if (type === 0) {
      tmpData.sort(function (a, b) {
        if (b.batch < a.batch) {
          return -1;
        }
        if (b.batch > a.batch) {
          return 1;
        }
        return 0;
      });
      setSearchedUser([...tmpData]);
    } else if (type === 1) {
      tmpData.sort(function (a, b) {
        if (a.firstName < b.firstName) {
          return -1;
        }
        if (a.firstName > b.firstName) {
          return 1;
        }
        return 0;
      });
      setSearchedUser([...tmpData]);
    } else {
      Alert.alert('Coming soon!');
    }
  };

  const clearFilter = () => {
    filteredCount = -1;
    setGenderFilter([]);
    setLocationFilter('');
    setShowFilter(!showFilter);
    setSearchedUser([...oldData]);
  };

  const doSearchUser = (searchText) => {
    let oldContent = searchedUser;
    var list = [];

    if (searchText.length > 0) {
      list = oldContent.filter(function (element) {
        return element.firstName
          .toLowerCase()
          .startsWith(searchText.toLowerCase());
      });

      setSearchedUser([...list]);
    } else {
      setSearchedUser([...oldData]);
    }
  };

  const concatName = (item) => {
    let fullName = '';

    if (
      item.firstName &&
      item.firstName !== undefined &&
      item.firstName !== ''
    ) {
      fullName += item.firstName;
    }

    if (item.lastName && item.lastName !== undefined && item.lastName !== '') {
      fullName += ' ' + item.lastName;
    }
    return fullName;
  };

  const concateLocation = (item) => {
    let fullName = '';

    if (item.city && item.city !== undefined && item.city !== '') {
      fullName += item.city.charAt(0).toUpperCase() + item.city.slice(1);
    }

    if (item.country && item.country !== undefined && item.country !== '') {
      fullName +=
        ' ' + item.country.charAt(0).toUpperCase() + item.country.slice(1);
    }
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
                genderFilter.includes(1) ? g.colorBlue : g.colorWhite,
              ]}
              numberOfLines={1}
              onPress={() => {
                let tempData = genderFilter;
                if (tempData.includes(1)) {
                  const index = tempData.indexOf(1);
                  if (index > -1) {
                    tempData.splice(index, 1);
                  }
                } else {
                  tempData.push(1);
                }
                setGenderFilter([...tempData]);
              }}>
              {'Male'}
            </Text>
            <Text
              style={[
                g.fs12,
                g.mb5,
                genderFilter.includes(0) ? g.colorBlue : g.colorWhite,
              ]}
              numberOfLines={1}
              onPress={() => {
                let tempData = genderFilter;
                if (tempData.includes(0)) {
                  const index = tempData.indexOf(0);
                  if (index > -1) {
                    tempData.splice(index, 1);
                  }
                } else {
                  tempData.push(0);
                }
                setGenderFilter([...tempData]);
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
              {locationFilter.length > 0 ? locationFilter : 'Select'}
            </Text>
            <View style={style.triangleShape} />
          </TouchableOpacity>
        );
      }
    }
    return <View />;
  };

  const renderProfileSearch = (item, index) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={1}
        onPress={() => {
          navigation.navigate('UserProfile', {
            userId: item._id,
          });
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
                {concatName(item)}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: scale(6),
                  marginBottom: scale(8),
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

  const handleSearch = (text) => {
    doSearchUser(text);
  };

  const headerComponent = () => {
    return (
      <View
        style={{
          paddingHorizontal: scale(15),
          marginBottom: scale(10),
          paddingTop: scale(15),
        }}>
        {/* search view */}
        <View style={[grid.rowdir, g.mb15, g.mt5]}>
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
                style={[
                  g.inputNew,
                  g.fs18,
                  grid.col,
                  grid.justifyContentCenter,
                ]}
                keyboardType={'default'}
                placeholder={'I am looking for'}
                onChangeText={handleSearch}
              />
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              g.fliterBtnNew,
              grid.alignItems,
              grid.justifyContentCenter,
              g.bgBlue,
            ]}>
            <Text style={[g.colorWhite, g.FHNM, g.fs16]}>Go</Text>
          </TouchableOpacity>
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
              iconColor={showFilter ? '#2b3252' : '#000'}
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
                        setSortedBy(item.value);
                        applySorting(i);
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
          {'ALL RESULTS'}: {oldData.length} {'Profiles'}
        </Text>
        <Text style={[g.fs10, g.FHNR, g.colorBlack, g.pt2]}>
          {'CURRENT RESULTS'}:
          {filteredCount > 0 ? filteredCount : oldData.length} {'Profiles'}
        </Text>
        {/* filter result */}
      </View>
    );
  };

  const headerDistance = Animated.diffClamp(curY, 0, 130).interpolate({
    inputRange: [0, 1],
    outputRange: [0, -1],
  });

  return (
    <TouchableOpacity
      style={GlobalInclude.AppStyle.fill}
      activeOpacity={1}
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <HeaderBar navigation={navigation} />
      <SafeAreaView
        style={[GlobalInclude.AppStyle.fill, {backgroundColor: 'white'}]}>
        {isLoading ? (
          <View style={GlobalInclude.AppStyle.fillCenter}>
            <ActivityIndicator size={'small'} color={'#2b3252'} />
          </View>
        ) : (
          <View style={GlobalInclude.AppStyle.fill}>
            <Animated.ScrollView
              ref={listRef}
              onScrollEndDrag={onScrollEndDrag}
              scrollEventThrottle={16}
              contentContainerStyle={{
                marginTop: animatedHeight,
              }}
              onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {y: curY}}}],
                {useNativeDriver: true, listener: onScroll},
              )}>
              {/* searched data */}
              <View
                style={{
                  paddingStart: scale(15),
                  paddingEnd: scale(15),
                  paddingBottom: animatedHeight + scale(15),
                }}>
                <View style={[grid.rowdir, grid.flexwrap]}>
                  {searchedUser.map((item, index) => {
                    return renderProfileSearch(item, index);
                  })}
                </View>
              </View>

              {/* searched data */}
            </Animated.ScrollView>

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

        {showScrollTop ? (
          <View style={[g.btnScrollStrip, grid.alignItems]}>
            <TouchableOpacity
              style={{width: scale(70)}}
              activeOpacity={0.8}
              onPress={() => {
                setShowScrollTop(false);
                if (listRef !== null) {
                  listRef.current.scrollTo({
                    animated: true,
                    y: 0,
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
      </SafeAreaView>
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
    </TouchableOpacity>
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
    backgroundColor: '#2b3252',
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
    color: '#2b3252',
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
