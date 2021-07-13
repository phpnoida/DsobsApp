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
  ScrollView,
  Dimensions,
} from 'react-native';
import RbSheet from 'react-native-raw-bottom-sheet';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {IconType} from '../../helper/Constants';
import {generateMenuOption, renderCity} from '../../component/Common';
import TopHeaderView from '../../component/TopHeaderView';
import ProgressImage from '../../component/ProgresImage';
import OptionsSheet from 'react-native-raw-bottom-sheet';
import SingleSearchWithFilter from '../../component/SingleSearchWithFilter';
import {renderNoDataComponent} from '../../component/Common';
import ProfessionalSheet from '../../component/ProfessionalSheetFilter';
import AutoSuggestLocationCompany from '../../component/AutoSuggestLocationCompany';
import BottomSheetHeader from '../../component/BottomSheetHeader';
import RadioButton from '../../component/RadioButton';
import Helper from '../../helper/Helper';
import {getProfessionList} from '../../Actions/UserActions';
import {
  doFilterJobs,
  getMyJobs,
  doFilterCities,
} from '../../Actions/JobsActions';

const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
};
let totalCount = 0;
let professionListMain = [];
let filterObject = {
  index: 0,
  size: 10,
};
let curY = new Animated.Value(0);
let searchedCity = '';
const {height} = Dimensions.get('window');

const JobListing = ({navigation}) => {
  curY = new Animated.Value(0);
  const professionRef = useRef();
  const flatList = useRef();
  const refOptions = useRef();
  const refPostJobOptions = useRef();
  const refRBSheetCity = useRef();

  const [userJobs, setUserJobs] = useState([]);
  const [professionList, setProfessionList] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');
  const [pageContent, setPageContent] = useState([]);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [animatedHeight, setAnimatedHeight] = useState(100);
  const [searchCategory, setSearchCategory] = useState([]);
  const [searchCityList, setSearchCityList] = useState([]);
  const [topCityList, setTopCityList] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (flatList.current !== null && flatList.current !== undefined) {
        flatList.current.scrollToOffset({x: 0, y: 0, animated: true});
      }
      if (global.isConnected) {
        resetCount();
        getProfession();
        getSearchCity('');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  /**
   *
   * API Section
   */
  const getProfession = () => {
    getProfessionList(
      (response) => {
        getOwnJobs();
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              let professionArray = [];
              if (data.data !== null) {
                professionArray.push({key: -1, text: 'All'});
                data.data.map((item, index) => {
                  professionArray.push({key: index, text: item});
                });
              }
              professionListMain = professionArray;
              setSelectedProfession('All');
              setProfessionList(professionArray);
            }
          }
        }
      },
      (error) => {
        getOwnJobs();
      },
    );
  };

  const getOwnJobs = () => {
    getMyJobs(
      (response) => {
        getFilteredData();
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              setUserJobs([...data.data]);
            }
          }
        }
      },
      (code, error) => {
        getFilteredData();
      },
    );
  };

  const getFilteredData = () => {
    console.log('====================================');
    console.log('filterObject', filterObject);
    console.log('====================================');
    doFilterJobs(
      filterObject,
      (response) => {
        manageResponse(response);
      },
      (code, error) => {
        setIsRefreshing(false);
        setFirstTimeLoad(false);
        setPageContent([]);
        console.log('error->', error, code);
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

  const getSearchCity = (city) => {
    let filterObj = {
      s: city,
    };
    doFilterCities(
      filterObj,
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              if (city === '') {
                let cityTmpArray = [];
                if (data.data !== null) {
                  cityTmpArray.push({
                    key: -1,
                    name: 'All',
                    text: 'All',
                  });

                  data.data.map((item, index) => {
                    let object = item._id;
                    cityTmpArray.push({
                      key: index,
                      name: object.city,
                      text: Helper.capitalize(
                        `${object.city},${object.country}`,
                      ),
                    });
                  });
                }
                setTopCityList(cityTmpArray);
              } else {
                if (searchedCity.length > 0) {
                  let cityTmpArray = [];
                  if (data.data !== null) {
                    data.data.map((item, index) => {
                      let object = item._id;
                      cityTmpArray.push({
                        key: index,
                        name: object.city,
                        country_name: object.country,
                      });
                    });
                  }
                  setSearchCityList(cityTmpArray);
                }
              }
            }
          }
        }
      },
      (error) => {
        getOwnJobs();
      },
    );
  };

  /**
   *
   * API Section
   */

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

  const searchProfession = (searchText) => {
    if (searchText.length > 0) {
      var filtered = professionListMain.filter((element) =>
        element.text.toLowerCase().includes(searchText.toLowerCase()),
      );
      setProfessionList([...filtered]);
    } else {
      setProfessionList([...professionListMain]);
    }
  };

  const userOptions = () => {
    return (
      <OptionsSheet
        ref={refOptions}
        minClosingHeight={50}
        height={250}
        duration={200}
        closeOnDragDown={true}
        customStyles={{
          container: GlobalInclude.AppStyle.sheetContainer,
        }}>
        <View stylre={[grid.flex1, g.mb10]}>
          {generateMenuOption('All Jobs', 'appstore-o', 10, () => {
            refOptions.current.close();
            setTimeout(() => {
              resetCount();
              getFilteredData();
            }, 230);
          })}

          {generateMenuOption('Filter By Location', 'location-pin', 9, () => {
            refOptions.current.close();
            setSearchCityList([]);
            setTimeout(() => {
              if (
                refRBSheetCity.current !== undefined &&
                refRBSheetCity.current !== null
              ) {
                refRBSheetCity.current.open();
              }
            }, 200);
          })}
          {generateMenuOption('Filter By Profession', 'profile', 10, () => {
            refOptions.current.close();
            setTimeout(() => {
              if (
                professionRef.current !== undefined &&
                professionRef.current !== null
              ) {
                professionRef.current.open();
              }
            }, 200);
          })}
        </View>
      </OptionsSheet>
    );
  };

  const createMenu = (key, title, onPress) => {
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

  const optionsList = () => {
    return (
      <OptionsSheet
        ref={refPostJobOptions}
        minClosingHeight={50}
        height={250}
        duration={200}
        closeOnDragDown={true}
        customStyles={{
          container: GlobalInclude.AppStyle.sheetContainer,
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {createMenu(1, 'Post a Job', () => {
              refPostJobOptions.current.close();
              navigation.navigate('AddJobPost', {
                data: {inEditMode: false},
              });
            })}
            {userJobs &&
              userJobs !== null &&
              userJobs !== undefined &&
              userJobs.length > 0 && (
                <View style={[g.mt5, g.mb5]}>
                  {userJobs.map((item, index) => {
                    return (
                      <View>
                        {item.status === 1 ? (
                          <View key={index}>
                            {createMenu(
                              2,
                              item.title &&
                                item.title !== undefined &&
                                item.title !== null
                                ? `Edit ${item.title}`
                                : 'N/A',
                              () => {
                                refPostJobOptions.current.close();
                                navigation.navigate('AddJobPost', {
                                  data: {inEditMode: true, data: item},
                                });
                              },
                            )}
                          </View>
                        ) : null}
                      </View>
                    );
                  })}
                </View>
              )}
          </View>
        </ScrollView>
      </OptionsSheet>
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

  const concateLocation = (item) => {
    let locationString = '';

    if (item.city !== undefined && item.city !== null && item.city !== '') {
      locationString += item.city + ', ';
    }

    if (
      item.country !== undefined &&
      item.country !== null &&
      item.country !== ''
    ) {
      locationString += item.country;
    }
    return locationString;
  };

  const renderItem = ({item, index}) => {
    return (
      <View key={index}>
        <TouchableOpacity
          onPress={() => navigation.navigate('JobDetails', {data: item})}
          activeOpacity={1}
          key={index}
          style={{
            marginBottom: scale(15),
            marginHorizontal: scale(15),
          }}>
          <View
            style={[g.bgWhite, g.boxShadow, {borderRadius: scale(10)}, g.p10]}>
            <View style={grid.rowdir}>
              <ProgressImage
                source={
                  item.logo !== undefined &&
                  item.logo !== null &&
                  item.logo !== ''
                    ? {uri: item.logo}
                    : GlobalInclude.Assets.MainLogo
                }
                containerStyle={{
                  height: scale(65),
                  width: scale(65),
                  borderRadius: scale(10),
                }}
                imageStyle={{
                  height: scale(65),
                  width: scale(65),
                  borderRadius: scale(10),
                }}
                mode={'contain'}
              />
              <View style={[grid.col, g.ml5]}>
                <Text
                  numberOfLines={1}
                  style={[
                    g.txtRight,
                    item.status === 1 ? g.FHNB : g.FHNM,
                    g.fs13,
                    GlobalInclude.AppStyle.transform,
                    item.status === 1
                      ? g.colorBlue
                      : item.status === 2
                      ? g.colorGray
                      : g.colordarkGray,
                  ]}>
                  {item.status === 1 ? 'Open' : 'Closed'}
                </Text>
              </View>
            </View>
            <View style={g.mt5}>
              <Text
                numberOfLines={2}
                style={[
                  g.FHNM,
                  g.fs14,
                  g.colorBlack,
                  GlobalInclude.AppStyle.transform,
                ]}>
                {item.title !== undefined &&
                item.title !== null &&
                item.title !== ''
                  ? item.title
                  : 'N/A'}
              </Text>

              <Text
                numberOfLines={1}
                style={[
                  g.FHNM,
                  g.fs14,
                  g.colorGray,
                  GlobalInclude.AppStyle.transform,
                ]}>
                {item.forCompany !== undefined &&
                item.forCompany !== null &&
                item.forCompany !== ''
                  ? item.forCompany
                  : 'N/A'}
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  g.FHNM,
                  g.fs14,
                  g.colorGray,
                  GlobalInclude.AppStyle.transform,
                ]}>
                {concateLocation(item)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const headerDistance = Animated.diffClamp(curY, 0, 100).interpolate({
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
          <SingleSearchWithFilter
            placeholder={'Search By Keyword'}
            changeText={(text) => {
              setFilterQuery(text);
              if (text.length > 2) {
                resetCount();
                filterObject.s = text;
                getFilteredData();
              } else {
                resetCount();
                getFilteredData();
              }
            }}
            showGoButton={false}
            filterQuery={filterQuery}
            onFilterPress={() => {
              if (
                refOptions.current !== undefined &&
                refOptions.current !== null
              ) {
                refOptions.current.open();
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
        index={11}
        navigation={navigation}
        label={'Post a Job'}
        showLabel={false}
        onLabelPress={() => {
          navigation.navigate('AddJobPost');
        }}
        customIcon={{
          containerStyle: {height: scale(24), width: scale(24)},
          iconColor: GlobalInclude.Color.ColorPrimary,
          iconName: 'dots-horizontal',
          size: scale(24),
          type: IconType[1],
        }}
        customIconPress={() => {
          if (
            refPostJobOptions.current !== undefined &&
            refPostJobOptions.current !== null
          ) {
            refPostJobOptions.current.open();
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

      <ProfessionalSheet
        refRBSheet={professionRef}
        dataList={professionList}
        searchProfession={(query) => {
          searchProfession(query);
        }}
        selectedProfession={selectedProfession}
        setSelectedProfession={(value) => {
          professionRef.current.close();
          if (value !== 'All') {
            setSelectedProfession(value);
            setProfessionList([...professionListMain]);
            resetCount();
            filterObject.profession = value;
            setTimeout(() => {
              getFilteredData();
            }, 230);
          } else {
            resetCount();
            setTimeout(() => {
              getFilteredData();
            }, 230);
          }
        }}
        onClose={() => {}}
      />

      <RbSheet
        ref={refRBSheetCity}
        height={height - 150}
        minClosingHeight={50}
        duration={350}
        closeOnDragDown={true}
        customStyles={{
          container: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,

            paddingBottom: scale(20),
          },
        }}>
        <BottomSheetHeader
          title={'Select City'}
          showSearch={true}
          onSeachQuery={(query) => {
            searchedCity = query;
            if (query.trim().length > 2) {
              getSearchCity(query);
            } else {
              setSearchCityList([]);
            }
          }}
        />
        <View style={[grid.flex1, g.ml15, g.mr15]}>
          <View>
            {searchCityList.length > 0 &&
              renderCity(searchCityList, (item, index) => {
                resetCount();
                filterObject.city = item.name;
                refRBSheetCity.current.close();
                setTimeout(() => {
                  getFilteredData();
                }, 230);
              })}
          </View>
          {topCityList.length > 0 && (
            <View style={grid.flex1}>
              <RadioButton
                defaultSelected={'All'}
                PROP={topCityList}
                capitalize
                onRadioSelect={(item) => {
                  resetCount();
                  if (item.key !== -1) {
                    filterObject.city = item.name;
                  }
                  refRBSheetCity.current.close();
                  setTimeout(() => {
                    getFilteredData();
                  }, 230);
                }}
              />
            </View>
          )}
        </View>
      </RbSheet>

      {userOptions()}
      {optionsList()}
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

export default JobListing;
