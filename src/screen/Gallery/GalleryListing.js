import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  ActivityIndicator,
  Linking,
  Animated,
  Platform,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import {APP_NAME} from '../../helper/Constants';
import TopHeaderView from '../../component/TopHeaderView';
import GalleryImage from '../../component/GalleryImage';
import ImageShareModal from '../../component/ImageShareModal';
import {getAlbums, getGalleryCategory} from '../../Actions/GalleryActions';
import {getDirectory} from '../../Actions/DirectoryActions';
import axios from 'axios';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';

import AutoCompleteSearch from '../../component/AutoCompleteSearch';
import YearSelection from '../../component/YearSelectionSheet';
import CategoryFilter from '../../component/CategoryFilterSheet';
import Helper from '../../helper/Helper';

let userData = null;
let categoryName = null;
let searchVal = '';
let searchType = 1;
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

const cancelAlbum = axios.CancelToken.source();
let curY = new Animated.Value(0);

const GalleryListing = ({navigation}) => {
  curY = new Animated.Value(0);
  const refRBSheet = useRef();
  const refRBFilter = useRef();

  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const [pageContent, setPageContent] = useState([]);
  const [filterCategory, setFilterCategory] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [checkedType, setCheckedType] = useState(1);
  const [searchedUser, setSearchedUser] = useState([]);
  const [animatedHeight, setAnimatedHeight] = useState(222);

  useEffect(() => {
    userData = null;
    categoryName = null;
    searchVal = '';
    searchType = 1;
    totalCount = 0;
    filterObject = {
      index: 0,
      size: 10,
    };

    userData = global.userDetails;
    getFilterCategory();
    getAlbumList();
    return () => {};
  }, []);

  /**
   *
   * API Section
   *
   */
  const getFilterCategory = () => {
    getGalleryCategory(
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              let records = data.data;
              let pushArray = [];
              records.map((child) => {
                pushArray.push({
                  label: child,
                  value: child,
                  isSelected: false,
                });
              });
              setFilterCategory([...pushArray]);
            }
          }
        }
      },
      (error) => {
        console.log('error', error);
      },
    );
  };

  const getAlbumList = () => {
    getAlbums(
      filterObject,
      cancelAlbum,
      (response) => {
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
        setIsRefreshing(false);
        setFirstTimeLoad(false);
      },
      (error, message) => {
        setPaginationStatus(PaginationStatus.allLoaded);
        setFirstTimeLoad(false);
        setIsRefreshing(false);
        if (error === 404) {
          if (filterObject.index === 0) {
            setPageContent([]);
          }
        }
      },
    );
  };

  // Filter section
  const doSearchUser = (query) => {
    getDirectory(
      '1',
      query,
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (searchVal.length > 0) {
              setSearchedUser([...data.data]);
            } else {
              setSearchedUser([]);
            }
          }
        }
      },
      (error) => {
        setSearchedUser([]);
        console.log('error', error);
      },
    );
  };

  /**
   *
   * API Section
   *
   */

  const selectCategory = (index) => {
    let oldData = filterCategory;

    oldData.map((item) => {
      item.isSelected = false;
    });
    oldData[index].isSelected = true;

    setFilterCategory([...oldData]);
  };

  const onPaginate = () => {
    if (paginationStatus !== PaginationStatus.allLoaded && !isRefreshing) {
      setPaginationStatus(PaginationStatus.waiting);
      filterObject.index = filterObject.index + 1;
      getAlbumList();
    }
  };

  const onEndReached = () => {
    if (pageContent.length === totalCount) {
      setPaginationStatus(PaginationStatus.allLoaded);
      return;
    }
    if (paginationStatus === PaginationStatus.waiting) {
      onPaginate();
    }
  };

  const handleRefresh = () => {
    filterObject.index = 0;
    setPageContent([]);
    getAlbumList();
  };

  const resetData = () => {
    filterObject.index = 0;
    if (
      filterObject.s &&
      filterObject.s !== undefined &&
      filterObject.s !== null
    ) {
      delete filterObject.s;
    }
    setPageContent([]);
    getAlbumList();
  };

  const expandSelectedPanel = (index) => {
    let oldData = pageContent;

    oldData[index].isExpanded = !oldData[index].isExpanded;

    setPageContent([...oldData]);
  };

  const generateGalleryView = ({item, index}) => {
    return (
      <GalleryImage
        key={index}
        title={item.title}
        images={item.images}
        isExpanded={item.isExpanded}
        expandSelectedPanel={() => {
          expandSelectedPanel(index);
        }}
        onImagePress={(imageData, subIndex) => {
          let payload = {
            filterObject: {
              size: subIndex > 0 ? Math.ceil(subIndex / 10) * 10 : 10,
              galleryId: item._id,
              index: 0,
            },
            index: subIndex,
            title: item.title,
          };
          //navigation.navigate('GalleryDetail', payload);
          navigation.navigate('ImageList', payload);
        }}
        onLongPress={() => {
          setShowShareModal(true);
        }}
      />
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

  const renderHeaderComponents = () => {
    return (
      <View
        style={{
          paddingHorizontal: scale(15),
          marginBottom: scale(10),
        }}>
        <AutoCompleteSearch
          mainTitle={'Search By'}
          chkType={checkedType}
          chkOneTitle={'Name/Batch/House/Number'}
          chkTwoTitle={'Album'}
          ChkThreeTitle={'Year'}
          ChkFourTitle={'Tags'}
          withFilter={true}
          onChecked={(type) => {
            searchType = type;
            setCheckedType(type);
            setSearchedUser([]);
            setFilterQuery('');
            if (type === 3) {
              setTimeout(() => {
                refRBSheet.current.open();
              }, 100);
            }
          }}
          onFilterPress={() => {
            if (refRBFilter.current !== null) {
              refRBFilter.current.open();
            }
          }}
          changeText={(text) => {
            searchVal = text;
            setFilterQuery(text);
            console.log('searchType', searchType);
            if (searchType === 1) {
              if (text.length > 3) {
                setSearchedUser([]);
                doSearchUser(text);
              } else if (text.length < 4) {
                setSearchedUser([]);
              }
            } else if (searchType === 2) {
              filterObject.s = searchVal;
              if (text.length === 0) {
                resetData();
              } else {
                setPageContent([]);
                getAlbumList();
              }
            }
          }}
          filterQuery={filterQuery}
          searchedUser={searchedUser}
          onUserSelected={(row, index) => {
            setFilterQuery('');
            setCheckedType(-1);
            searchVal = '';

            let payload = {
              filterObject: {
                size: 10,
                userId: row._id,
                index: 0,
              },
              title: `Search For: ${Helper.concatName(row)}`,
              index: 0,
            };
            navigation.navigate('ImageList', payload);
          }}
          onGoPress={() => {
            if (searchType === 4) {
              let payload = {
                filterObject: {
                  size: 10,
                  tag: searchVal,
                  index: 0,
                },
                title: `Search For: ${searchVal}`,
                index: 0,
              };
              navigation.navigate('ImageList', payload);
            } else if (searchType === 1) {
              navigation.navigate('DirectoryDetails', {
                searchBy: searchType,
                searchVal: searchVal,
                from: 'Gallery',
              });
            }
          }}
        />
      </View>
    );
  };

  const renderNoDataComponent = () => {
    return (
      <View style={GlobalInclude.AppStyle.fillCenter}>
        <Text style={[g.colorBlack, g.FHNM, g.fs12, g.textCenter]}>
          No Record Found
        </Text>
      </View>
    );
  };

  const headerDistance = Animated.diffClamp(
    curY,
    0,
    searchedUser.length > 0 ? 512 : 222,
  ).interpolate({
    inputRange: [0, 1],
    outputRange: [0, -1],
  });

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <TopHeaderView
        index={4}
        navigation={navigation}
        label={'Send Photos'}
        showLabel={true}
        onLabelPress={() => {
          if (userData !== undefined && userData !== null) {
            let house =
              userData.house.toLowerCase().charAt(0).toUpperCase() +
              userData.house.slice(1);
            Linking.openURL(
              `mailto:info@alumbus.com?subject=Photos from ${APP_NAME} user ${userData.firstName} ${userData.lastName}, ${userData.schoolNumber}, ${house}, ${userData.batch} &body=Please send us a note about the photographs. Upload photos upto 20MB here. For larger photos please use Google Drive or a WeTransfer link to send images.`,
            );
          } else {
            Linking.openURL(
              `mailto:info@alumbus.com?subject=Photos from ${APP_NAME} user FullName: School No: House: Batch: &body=Please send us a note about the photographs. Upload photos upto 20MB here. For larger photos please use Google Drive or a WeTransfer link to send images.`,
            );
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
                data={pageContent}
                renderItem={generateGalleryView}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.1}
                onEndReached={onEndReached}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderNoDataComponent}
                contentContainerStyle={{
                  marginTop: animatedHeight,
                  paddingBottom:
                    searchedUser.length > 0 ? scale(400) : scale(230),
                }}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                  [{nativeEvent: {contentOffset: {y: curY}}}],
                  {useNativeDriver: true},
                )}
                contentInset={{top: 0, bottom: 20, left: 0, right: 0}}
                contentInsetAdjustmentBehavior="automatic"
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
                {renderHeaderComponents()}
              </Animated.View>
            </View>
          )}
        </View>

        {/* filter sheet */}
        <CategoryFilter
          refRBSheet={refRBFilter}
          title={'Filter Gallery By'}
          buttonText={'Apply'}
          dataList={filterCategory}
          onPress={(item, index) => {
            categoryName = item.label;
            selectCategory(index);
          }}
          onSelect={() => {
            refRBFilter.current.close();

            let payload = {
              filterObject: {
                size: 10,
                category: categoryName,
                index: 0,
              },
              title: `Search By: ${categoryName}`,
              index: 0,
            };
            navigation.navigate('ImageList', payload);
          }}
        />
        {/* filter sheet */}

        {/* image share modal */}
        {showShareModal && (
          <ImageShareModal
            status={showShareModal}
            onCloseAction={(type) => {
              setShowShareModal(!showShareModal);
            }}
          />
        )}

        {/* year select */}
        <YearSelection
          refRBSheet={refRBSheet}
          title={'Select Year'}
          onSelect={(value) => {
            refRBSheet.current.close();
            setCheckedType(-1);
            setTimeout(() => {
              let payload = {
                filterObject: {
                  size: 10,
                  year: value.text.toString(),
                  index: 0,
                },
                title: `Search By: ${value.text.toString()}`,
                index: 0,
              };
              navigation.navigate('ImageList', payload);
            }, 100);
          }}
        />
        {/* year select */}
      </SafeAreaView>
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
  topContainer: {
    height: Platform.OS === 'android' ? 0 : getStatusBarHeight(),
    width: '100%',
    backgroundColor: 'white',
  },
  headerContainer: {zIndex: 1, backgroundColor: 'white'},
});

export default GalleryListing;
