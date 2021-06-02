import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Linking,
  TextInput,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import g from '../../theme/global';
import {scale} from '../../theme/Scalling';
import grid from '../../theme/grid';
import {IconType, APP_NAME} from '../../helper/Constants';
import HeaderBar from '../../component/HeaderBar';
import ProgresImage from '../../component/ProgresImage';
import {
  doFilterTeachers,
  doGetAllCategories,
} from '../../Actions/TeachersActions.js';
import Helpers from '../../helper/Helper';

const {height, width} = Dimensions.get('window');
let searchVal = '';

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

const VolunteerList = ({navigation}) => {
  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const [pageContent, setPageContent] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    searchVal = '';
    totalCount = 0;
    filterObject = {
      index: 0,
      size: 10,
      type: 2,
    };

    const unsubscribe = navigation.addListener('focus', () => {
      console.log('focus');
      if (global.isConnected) {
        setFirstTimeLoad(true);
        getCategoryList();
        resetCount();
        getTeachers();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  /*****
   *
   * API Section
   *
   */

  const getCategoryList = () => {
    doGetAllCategories(
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            console.log('data', data);
            if (data.data !== undefined && data.data !== null) {
              let arrayItem = data.data;
              arrayItem.unshift('All');
              setCategoryList([...arrayItem]);
            }
          }
        }
      },
      (code, error) => {},
    );
  };

  const getTeachers = () => {
    doFilterTeachers(
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
      getTeachers();
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
    getTeachers();
  };

  const resetCount = () => {
    totalCount = 0;

    filterObject = {};
    filterObject.index = 0;
    filterObject.size = 10;
    filterObject.type = 2;
  };

  const createFullName = (item) => {
    let fullName = '';

    if (item.title !== undefined && item.title !== null && item.title !== '') {
      fullName = item.title + ' ';
    }

    fullName += Helpers.concatName(item);

    return fullName;
  };

  const sortData = (item) => {
    setSelectedCategory(item);
    resetCount();
    if (item !== 'All') {
      filterObject.filter = item;
    }
    getTeachers();
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {}}
        key={index}
        style={[
          g.bgWhite,
          g.boxShadow,
          g.br3,
          g.p15,
          g.mt5,
          g.mb10,
          g.ml15,
          g.mr15,
          {height: scale(85)},
        ]}>
        <View style={[grid.rowdir]}>
          <View style={[grid.col, grid.justifyContent]}>
            <Text style={[g.colordarkGray, g.FHNB, g.fs15]}>
              {createFullName(item)}
            </Text>
            <Text
              style={[
                g.colorLightGray,
                g.FHNR,
                g.fs14,
                g.mt5,
                g.mb5,
                GlobalInclude.AppStyle.transform,
              ]}>{`${item.schoolNumber} ${item.house} ${item.section} ${item.batch}`}</Text>
            <Text style={[g.colorLightGray, g.FHNR, g.fs13]}>
              {item.category}
            </Text>
          </View>
          <View
            style={[
              g.w50,
              g.bggray,
              g.br3,
              g.oh,
              g.mr10,
              {height: scale(50), alignSelf: 'center'},
            ]}>
            {item.profilePic !== null &&
              item.profilePic !== undefined &&
              item.profilePic !== '' && (
                <ProgresImage
                  source={{uri: item.profilePic}}
                  containerStyle={{
                    aspectRatio: 3 / 4,
                    borderRadius: 8,
                  }}
                  imageStyle={{
                    aspectRatio: 3 / 4,
                    borderRadius: 8,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                  mode={'cover'}
                />
              )}
          </View>
          <View style={[g.w30, grid.alignItemsBottom, grid.justifyContent]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (
                  item.phone !== undefined &&
                  item.phone !== null &&
                  item.phone !== ''
                ) {
                  Linking.openURL(`tel:${item.countryCode} ${item.phone}`);
                } else {
                  Alert.alert(
                    'Not supported',
                    'Your device not supported call facility',
                  );
                }
              }}>
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(20), width: scale(20)}}
                iconColor={'#959595'}
                iconName={'phone'}
                iconSize={scale(20)}
                iconType={IconType[4]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (
                  item.phone !== undefined &&
                  item.phone !== null &&
                  item.phone !== ''
                ) {
                  Linking.openURL(`mailto:${item.email}`);
                } else {
                  Alert.alert(
                    'Not supported',
                    'Your device not supported email facility',
                  );
                }
              }}>
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(20), width: scale(20)}}
                iconColor={'#959595'}
                iconName={'envelope'}
                iconSize={scale(20)}
                iconType={IconType[4]}
              />
            </TouchableOpacity>
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

  const renderNoDataComponent = () => {
    return (
      <View style={GlobalInclude.AppStyle.center}>
        <Text style={[g.colorBlack, g.FHNM, g.fs12, g.textCenter]}>
          No Record Found
        </Text>
      </View>
    );
  };

  const renderCategory = () => {
    const sort_by_category_list = categoryList;
    return sort_by_category_list.map((item, index) => {
      return (
        <TouchableOpacity
          key={index}
          activeOpacity={0.8}
          onPress={() => sortData(item)}>
          <View
            style={[
              g.fliterBtn,
              grid.rowrow,
              grid.justifyContentCenter,
              grid.alignItems,
              g.mr5,
              selectedCategory === item && g.bglightGray,
            ]}>
            <Text
              style={[
                g.fs14,
                g.FHNB,
                selectedCategory === item ? g.colorBlue : g.colorBlack,
              ]}>
              {item}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <HeaderBar title={'Volunteers'} navigation={navigation} showBack={true} />
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
        <View style={[GlobalInclude.AppStyle.fill]}>
          {firstTimeLoad ? (
            <View style={GlobalInclude.AppStyle.fillCenter}>
              <ActivityIndicator
                size={'small'}
                color={GlobalInclude.Color.ColorPrimary}
              />
            </View>
          ) : (
            <View style={GlobalInclude.AppStyle.fill}>
              <View style={GlobalInclude.AppStyle.contentSpace}>
                <ScrollView
                  style={[g.pt10, g.pb10]}
                  horizontal
                  showsHorizontalScrollIndicator={false}>
                  {renderCategory()}
                </ScrollView>
                <Text style={[g.fs14, g.FHNB, g.colorBlack, g.mt10, g.mb10]}>
                  Showing Results - {selectedCategory}
                </Text>
              </View>

              <FlatList
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
                  paddingBottom: scale(100),
                }}
                scrollEventThrottle={16}
              />
            </View>
          )}
        </View>
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

export default VolunteerList;
