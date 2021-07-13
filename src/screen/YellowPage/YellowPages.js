import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Keyboard,
  SafeAreaView,
  Animated,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import g from '../../theme/global';
import {scale} from '../../theme/Scalling';
import grid from '../../theme/grid';
import {IconType} from '../../helper/Constants';
import TopHeaderView from '../../component/TopHeaderView';
import Helper from '../../helper/Helper';
import YellowPageSearch from '../../component/YellowPageSearch';
import AutoSuggestLocationCompany from '../../component/AutoSuggestLocationCompany';
import ProfessionalSheetFilter from '../../component/ProfessionalSheetFilter';
import ProgresImage from '../../component/ProgresImage';
import FlatListSlider from '../../component/FlatListSlider';
import Preview from '../../component/Preview';
import BottomSheetAbout from 'react-native-raw-bottom-sheet';
import {
  doSearchCity,
  doSearchBusiness,
  doSearchProfession,
} from '../../Actions/CommonActions';
import {getProfessionList} from '../../Actions/UserActions';
import {
  doFitlerYellowPage,
  getMyBusinessList,
} from '../../Actions/YelloPageActions';

const {height, width} = Dimensions.get('window');
let searchType = '';
let searchVal = '';
let professionListMain = [];

const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
};
let totalCount = 0;
let filterObject = {
  index: 0,
  size: 10,
};

let sortBy = [
  {
    value: '1',
    label: 'Newest',
  },
  {
    value: '5',
    label: 'Alphabetical A-Z',
  },
];
let curY = new Animated.Value(0);
const YellowPages = ({navigation}) => {
  curY = new Animated.Value(0);
  const refRBSheet = useRef();
  const refProfessionalSheet = useRef();

  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const [checkedType, setCheckedType] = useState(1);
  const [filterQuery, setFilterQuery] = useState('');
  const [professionList, setProfessionList] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [searchedCityCompany, setSearchedCityCompany] = useState([]);
  const [sortedBy, setSortedBy] = useState('');
  const [pageContent, setPageContent] = useState([]);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [myBusinessList, setMyBusinessList] = useState([]);
  const [animatedHeight, setAnimatedHeight] = useState(255);
  const [viewWidth, setViewWidth] = useState(width);

  useEffect(() => {
    professionListMain = [];
    searchVal = '';
    searchType = 1;
    totalCount = 0;
    filterObject = {
      index: 0,
      size: 10,
    };

    const unsubscribe = navigation.addListener('focus', () => {
      if (global.isConnected) {
        setFirstTimeLoad(true);
        resetCount();
        getMyBusiness();
        getProfession();
        getYellowPage();
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

  const getMyBusiness = () => {
    getMyBusinessList(
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            console.log('====================================');
            console.log('My Business', data);
            console.log('====================================');
            if (data.status) {
              setMyBusinessList([...data.data]);
            }
          }
        }
      },
      (error, message) => {
        console.log(message);
        console.log(error);
      },
    );
  };

  const getProfession = () => {
    getProfessionList(
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            console.log('====================================');
            console.log('profession', data);
            console.log('====================================');

            if (data.status) {
              let professionArray = [];
              if (data.data !== null) {
                data.data.map((item, index) => {
                  professionArray.push({key: index, text: item});
                });
              }
              professionListMain = professionArray;
              setProfessionList(professionArray);
            }
          }
        }
      },
      (error) => {},
    );
  };

  const searchCityName = (query) => {
    doSearchCity(
      query,
      10,
      0,
      (response) => {
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
        setSearchedCityCompany([]);
        console.log('error', error);
      },
    );
  };

  const searchCompanyName = (query) => {
    doSearchBusiness(
      query,
      10,
      0,
      (response) => {
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
                  itemList.push({id: child, label: child, value: ''});
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
        setSearchedCityCompany([]);
        console.log('error->', error);
      },
    );
  };
  const searchProfession = (query) => {
    doSearchProfession(
      query,
      10,
      0,
      (response) => {
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
                  itemList.push({id: child, label: child, value: ''});
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
        setSearchedCityCompany([]);
        console.log('error->', error);
      },
    );
  };

  const getYellowPage = () => {
    doFitlerYellowPage(
      filterObject,
      (response) => {
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
      },
      (code, error) => {
        setIsRefreshing(false);
        setFirstTimeLoad(false);
        setPageContent([]);
        console.log('error->', error);
      },
    );
  };

  /*****
   *
   * API Section
   *
   */

  const onPaginate = () => {
    if (paginationStatus !== PaginationStatus.allLoaded && !isRefreshing) {
      console.log('onPaginate()');
      setPaginationStatus(PaginationStatus.waiting);
      filterObject.index = filterObject.index + 1;
      getYellowPage();
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
    filterObject.index = 0;
    filterObject.size = 10;

    if (filterObject.s !== undefined && filterObject.s !== null) {
      delete filterObject.s;
    }
    if (filterObject.type !== undefined && filterObject.type !== null) {
      delete filterObject.type;
    }
    if (
      filterObject.categoryOfBusiness !== undefined &&
      filterObject.categoryOfBusiness !== null
    ) {
      delete filterObject.categoryOfBusiness;
    }
    if (filterObject.sortBy !== undefined && filterObject.sortBy !== null) {
      delete filterObject.sortBy;
    }
  };

  const filterProfession = (searchText) => {
    if (searchText.length > 0) {
      var filtered = professionListMain.filter((element) =>
        element.text.toLowerCase().includes(searchText.toLowerCase()),
      );

      setProfessionList([...filtered]);
    } else {
      setProfessionList([...professionListMain]);
    }
  };

  const loadCities = (citiesOfOperation) => {
    let cities = [];
    citiesOfOperation.map((child) => {
      let result = child.split(',');
      if (
        result &&
        result !== null &&
        result !== undefined &&
        result.length > 0
      ) {
        cities.push(result[0]);
      }
    });

    if (cities.length > 0) {
      return cities.toString().replace(/,/g, ', ');
    }
    return 'N/A';
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          navigation.navigate('BusinessDetails', {data: item});
        }}
        key={index}
        style={{
          marginBottom: scale(15),
          marginHorizontal: scale(15),
        }}>
        <View style={[g.bgWhite, g.boxShadow, {borderRadius: scale(10)}]}>
          <View
            onLayout={(event) => {
              setViewWidth(event.nativeEvent.layout.width);
            }}
            style={[
              g.bggray3,
              {
                borderRadius: scale(10),
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                overflow: 'hidden',
              },
            ]}>
            {item.coverImages &&
            item.coverImages !== null &&
            item.coverImages !== undefined &&
            item.coverImages.length > 0 ? (
              <View>
                {item.coverImages.length > 1 ? (
                  <FlatListSlider
                    width={viewWidth}
                    data={item.coverImages}
                    component={<Preview />}
                    contentContainerStyle={{
                      borderRadius: scale(10),
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                    autoscroll={false}
                  />
                ) : (
                  <ProgresImage
                    source={{uri: item.coverImages[0]}}
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
            ) : (
              <ProgresImage
                source={GlobalInclude.Assets.DefaultImage}
                containerStyle={{aspectRatio: 16 / 9, borderRadius: scale(10)}}
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
          <View style={[g.pr10, g.pl10, g.pt5, g.pb5]}>
            <Text
              style={[
                g.FHNB,
                g.fs16,
                g.colorBlue,
                GlobalInclude.AppStyle.transform,
              ]}>
              {item.businessName &&
              item.businessName !== undefined &&
              item.businessName !== null
                ? item.businessName
                : 'N/A'}
            </Text>
            <Text
              style={[
                g.fs14,
                g.mt5,
                g.FHNR,
                g.colorBlack,
                GlobalInclude.AppStyle.transform,
              ]}
              numberOfLines={2}>
              {item.categoryOfBusiness &&
              item.categoryOfBusiness !== undefined &&
              item.categoryOfBusiness !== null
                ? item.categoryOfBusiness
                : 'N/A'}
            </Text>
            {item.citiesOfOperation &&
            item.citiesOfOperation !== undefined &&
            item.citiesOfOperation !== null &&
            item.citiesOfOperation.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Text style={[g.fs12, g.mt5, g.FHNR, g.colorBlack]}>
                  {loadCities(item.citiesOfOperation)}
                </Text>
              </ScrollView>
            ) : (
              <Text
                style={[g.fs12, g.mt5, g.FHNR, g.colorBlack]}
                numberOfLines={2}>
                N/A
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
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

  const headerDistance = Animated.diffClamp(
    curY,
    0,
    searchedCityCompany.length > 0 ? 510 : 255,
  ).interpolate({
    inputRange: [0, 1],
    outputRange: [0, -1],
  });

  const headerComponent = () => {
    return (
      <View
        style={[
          GlobalInclude.AppStyle.contentSpace,
          {marginBottom: scale(10)},
        ]}>
        {/* search container */}
        <YellowPageSearch
          mainTitle={'Search By'}
          chkType={checkedType}
          chkOneTitle={'Category'}
          chkTwoTitle={'Company'}
          ChkThreeTitle={'Tags'}
          ChkFourTitle={'Location'}
          onChecked={(type) => {
            searchType = type;
            resetCount();
            setCheckedType(type);
            setSearchedCityCompany([]);
            setFilterQuery('');
            searchVal = '';
          }}
          changeText={(text) => {
            searchVal = text;
            setFilterQuery(text);
            if (searchType === 1) {
              if (text.length >= 2) {
                searchProfession(text);
              } else {
                setSearchedCityCompany([]);
                if (text.length === 0) {
                  resetCount();
                  getYellowPage();
                }
              }
            } else if (searchType === 2) {
              if (text.length >= 2) {
                searchCompanyName(text);
              } else {
                setSearchedCityCompany([]);
                if (text.length === 0) {
                  resetCount();
                  getYellowPage();
                }
              }
            } else if (searchType === 3) {
              resetCount();
              if (text.length >= 2) {
                filterObject.s = text;
                filterObject.type = 2;
                getYellowPage();
              } else {
                if (text.length === 0) {
                  resetCount();
                  getYellowPage();
                }
              }
            } else if (searchType === 4) {
              if (text.length >= 2) {
                searchCityName(text);
              } else {
                setSearchedCityCompany([]);
                if (text.length === 0) {
                  resetCount();
                  getYellowPage();
                }
              }
            }
          }}
          filterQuery={filterQuery}
          onGoPress={() => {
            navigation.navigate('YellowPageListing');
          }}
          onFilterPress={() => {
            if (
              refProfessionalSheet.current !== undefined &&
              refProfessionalSheet.current !== null
            ) {
              refProfessionalSheet.current.open();
            }
          }}
        />

        {searchedCityCompany.length > 0 && (
          <AutoSuggestLocationCompany
            searchedData={searchedCityCompany}
            onPress={(row, index) => {
              Keyboard.dismiss();
              setFilterQuery('');
              setSearchedCityCompany([]);
              setFilterQuery(Helper.capitalize(row.label));

              searchVal = row.label;
              resetCount();
              setTimeout(() => {
                if (searchType === 1) {
                  filterObject.categoryOfBusiness = row.label;
                } else if (searchType === 2) {
                  filterObject.s = row.label;
                  filterObject.type = 1;
                } else if (searchType === 4) {
                  filterObject.s = row.label;
                  filterObject.type = 3;
                }
                setFirstTimeLoad(true);
                getYellowPage();
              }, 150);
            }}
          />
        )}

        <View style={[grid.rowdir, g.mt10, g.mb5]}>
          {sortBy.map((item, i) => {
            return (
              <View
                style={[
                  g.btnsort,
                  sortedBy === item.value && g.darkBlue,
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
                    if (pageContent !== null && pageContent.length > 0) {
                      filterObject.sortBy = i + 1;
                      setSortedBy(item.value);
                      getYellowPage();
                    }
                  }}>
                  {item.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderNoDataComponent = () => {
    return (
      <View style={GlobalInclude.AppStyle.center}>
        <Text style={[g.colorBlack, g.FHNM, g.fs12, g.textCenter]}>
          No Record Found
        </Text>
      </View>
    );
  };

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
        <View>{headerComponent()}</View>
      </Animated.View>
    );
  };

  const createMenu = (key, title, icon, onPress) => {
    return (
      <View
        style={
          key === 3
            ? [{padding: 13, paddingLeft: 0}]
            : [
                g.bb1,
                {borderBottomColor: '#e5e5e5', padding: 13, paddingLeft: 0},
              ]
        }>
        <TouchableOpacity
          activeOpacity={1}
          style={[grid.rowdir, grid.alignItems]}
          onPress={onPress}>
          <Image
            source={icon}
            style={{height: scale(20), width: scale(20)}}
            resizeMethod={'auto'}
            resizeMode={'contain'}
          />
          <Text
            style={
              key === 2
                ? [{marginLeft: 10, fontSize: 16}, g.FHNR, g.colordarkGray]
                : [{marginLeft: 10, fontSize: 18}, g.FHNB, g.colorBlue]
            }>
            {title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <TopHeaderView
        navigation={navigation}
        index={5}
        customIcon={{
          containerStyle: {height: scale(24), width: scale(24)},
          iconColor: GlobalInclude.Color.ColorPrimary,
          iconName: 'dots-horizontal',
          size: scale(24),
          type: IconType[1],
        }}
        customIconPress={() => {
          if (refRBSheet.current !== null) {
            refRBSheet.current.open();
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
                    searchedCityCompany.length > 0 ? scale(400) : scale(230),
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

      <BottomSheetAbout
        ref={refRBSheet}
        height={height / 2}
        minClosingHeight={50}
        duration={350}
        closeOnDragDown={true}
        customStyles={{
          container: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            padding: 20,
          },
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {createMenu(
              1,
              'List My Business',
              GlobalInclude.Assets.MyYellowPages,
              () => {
                refRBSheet.current.close();
                navigation.navigate('ListMyBusiness', {
                  data: {inEditMode: false},
                });
              },
            )}

            {myBusinessList &&
              myBusinessList !== null &&
              myBusinessList !== undefined &&
              myBusinessList.length > 0 && (
                <View style={[g.mt5, g.mb5]}>
                  {myBusinessList.map((item, index) => {
                    return (
                      <View key={index}>
                        {createMenu(
                          2,
                          item.businessName &&
                            item.businessName !== undefined &&
                            item.businessName !== null
                            ? `Edit ${item.businessName}`
                            : 'N/A',
                          GlobalInclude.Assets.ListYellowPage,
                          () => {
                            refRBSheet.current.close();
                            navigation.navigate('ListMyBusiness', {
                              data: {inEditMode: true, data: item},
                            });
                          },
                        )}
                      </View>
                    );
                  })}
                </View>
              )}

            {createMenu(
              3,
              'About Yellow Pages',
              GlobalInclude.Assets.AboutYellowPage,
              () => {
                refRBSheet.current.close();
                navigation.navigate('AboutYellowPage');
              },
            )}
          </View>
        </ScrollView>
      </BottomSheetAbout>

      <ProfessionalSheetFilter
        refRBSheet={refProfessionalSheet}
        dataList={professionList}
        searchProfession={(query) => {
          filterProfession(query);
        }}
        selectedProfession={selectedProfession}
        setSelectedProfession={(value) => {
          setSelectedProfession(value);
          setFilterQuery(value);
          searchVal = value;
          refProfessionalSheet.current.close();
          setProfessionList([...professionListMain]);
          resetCount();
          filterObject.categoryOfBusiness = value;
          setTimeout(() => {
            setFirstTimeLoad(true);
            getYellowPage();
          }, 150);
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
  tabsbut: {
    backgroundColor: GlobalInclude.Color.ColorPrimary,
    color: '#ffffff',
    width: scale(100),
    paddingTop: scale(10),
    paddingBottom: scale(10),
    fontSize: scale(12),
    textAlign: 'center',
    borderRadius: scale(4),
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
    fontSize: 16,
  },
  tabSpace: {
    paddingRight: width - 105,
  },
  tabbarheight: {
    minHeight: height - 90,
  },
});

export default YellowPages;
