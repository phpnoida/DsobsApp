import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  ActivityIndicator,
  FlatList,
  Linking,
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
const GalleryListing = ({navigation}) => {
  const refRBSheet = useRef();
  const refRBFilter = useRef();

  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
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
  const [otherSearch, setotherSearch] = useState([]);

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
        setFirstTimeLoad(false);
      },
      (error, message) => {
        console.log('message', message);
        console.log('error', error);
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
      console.log('onPaginate()');
      setPaginationStatus(PaginationStatus.waiting);
      filterObject.index = filterObject.index + 1;
      getAlbumList();
    }
  };

  const onEndReached = () => {
    console.log('onEndReached()');
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
        onImagePress={(imageData, index) => {
          let payload = {
            index: index,
            data: item.images,
            title: item.title,
          };
          navigation.navigate('GalleryDetail', payload);
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
                <ActivityIndicator size={'small'} color={'#2b3252'} />
              </View>
            ) : null}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.parentStyle}>
        <View style={GlobalInclude.AppStyle.fill}>
          <View
            style={{
              paddingLeft: 15,
              paddingRight: 15,
              paddingTop: scale(15),
              paddingBottom: 0,
            }}>
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
            {/* search container */}
            <AutoCompleteSearch
              mainTitle={'Search By'}
              chkType={checkedType}
              chkOneTitle={'Name/Batch/House/Number'}
              chkTwoTitle={'Album'}
              ChkThreeTitle={'Year'}
              ChkFourTitle={'Tags'}
              onChecked={(type) => {
                searchType = type;
                setCheckedType(type);
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
                if (searchType === 1) {
                  if (text.length > 3) {
                    setSearchedUser([]);
                    doSearchUser(text);
                  } else if (text.length < 4) {
                    setSearchedUser([]);
                  }
                } else if (searchType === 2) {
                  filterObject.s = searchVal;
                  setPageContent([]);
                  getAlbumList();
                }
              }}
              filterQuery={filterQuery}
              searchedUser={searchedUser}
              onUserSelected={(row, index) => {
                setFilterQuery('');
                setCheckedType(-1);
                searchVal = '';

                navigation.navigate('FilteredResult', {
                  filterBy: {userId: row._id, index: 0, size: 10},
                  pageTitle: `Search For: ${Helper.concatName(row)}`,
                });
              }}
              onGoPress={() => {
                if (searchType === 4) {
                  navigation.navigate('FilteredResult', {
                    filterBy: {tag: searchVal, index: 0, size: 10},
                    pageTitle: `Search For: ${searchVal}`,
                  });
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
          {firstTimeLoad ? (
            <View style={GlobalInclude.AppStyle.fillCenter}>
              <ActivityIndicator size={'small'} color={'#2b3252'} />
            </View>
          ) : (
            <View style={GlobalInclude.AppStyle.fill}>
              {pageContent === null || pageContent.length === 0 ? (
                <View style={GlobalInclude.AppStyle.center}>
                  <Text style={[g.colorBlack, g.FHNM, g.fs12, g.textCenter]}>
                    No Record Found
                  </Text>
                </View>
              ) : (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  extraData={pageContent}
                  data={pageContent}
                  renderItem={generateGalleryView}
                  keyExtractor={(item, index) => index.toString()}
                  onEndReachedThreshold={0.1}
                  onEndReached={onEndReached}
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  ListFooterComponent={renderFooter}
                />
              )}
            </View>
          )}
        </View>
      </SafeAreaView>

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

          navigation.navigate('FilteredResult', {
            filterBy: {category: categoryName, index: 0, size: 10},
            pageTitle: `Search By: ${categoryName}`,
          });
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

      {/* loader when search or other opertations */}
      {isLoading && (
        <View style={{position: 'absolute', botttom: 0, top: 0, zIndex: 2}}>
          <View style={GlobalInclude.AppStyle.fillCenter}>
            <ActivityIndicator size={'small'} color={'#2b3252'} />
          </View>
        </View>
      )}

      {/* year select */}
      <YearSelection
        refRBSheet={refRBSheet}
        title={'Select Year'}
        onSelect={(value) => {
          refRBSheet.current.close();
          setCheckedType(-1);
          setTimeout(() => {
            navigation.navigate('FilteredResult', {
              filterBy: {year: value.text.toString(), index: 0, size: 10},
              pageTitle: `Search By: ${value.text.toString()}`,
            });
          }, 100);
        }}
      />
      {/* year select */}
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
});

export default GalleryListing;
