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
  Alert,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import g from '../../theme/global';
import {scale} from '../../theme/Scalling';
import grid from '../../theme/grid';
import {IconType, APP_NAME} from '../../helper/Constants';
import HeaderBar from '../../component/HeaderBar';
import ProgresImage from '../../component/ProgresImage';
import {doFilterTeachers} from '../../Actions/TeachersActions.js';
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

const TeachersList = ({navigation}) => {
  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');
  const [pageContent, setPageContent] = useState([]);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    searchVal = '';
    totalCount = 0;
    filterObject = {
      index: 0,
      size: 10,
      type: 1,
    };

    const unsubscribe = navigation.addListener('focus', () => {
      console.log('focus');
      if (global.isConnected) {
        setFirstTimeLoad(true);
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
    setIsRefreshing(true);
  };

  const resetCount = () => {
    totalCount = 0;
    filterObject = {};
    filterObject.index = 0;
    filterObject.size = 10;
    filterObject.type = 1;
  };

  const createFullName = (item) => {
    let fullName = '';

    if (item.title !== undefined && item.title !== null && item.title !== '') {
      fullName = item.title + ' ';
    }

    fullName += Helpers.concatName(item);

    return fullName;
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
          {height: scale(80)},
        ]}>
        <View style={[grid.rowdir]}>
          <View style={[grid.col, grid.justifyContent]}>
            <Text style={[g.colordarkGray, g.FHNB, g.fs15]}>
              {createFullName(item)}
            </Text>
            <Text style={[g.colorLightGray, g.FHNR, g.fs14]}>
              {item.category}
            </Text>
            <Text style={[g.colorBlue, g.FHNB, g.fs13]}>
              Tenure {item.tenure}
            </Text>
          </View>
          <View
            style={[g.w50, g.bggray, g.br3, g.oh, g.mr10, {height: scale(50)}]}>
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
                <ActivityIndicator size={'small'} color={'#2b3252'} />
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

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <HeaderBar title={'Teachers'} navigation={navigation} showBack={true} />
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
        <View style={[GlobalInclude.AppStyle.fill]}>
          {firstTimeLoad ? (
            <View style={GlobalInclude.AppStyle.fillCenter}>
              <ActivityIndicator size={'small'} color={'#2b3252'} />
            </View>
          ) : (
            <View style={GlobalInclude.AppStyle.fill}>
              <View
                style={[
                  GlobalInclude.AppStyle.contentSpace,
                  {marginBottom: scale(10), paddingTop: scale(5)},
                ]}>
                <View style={[grid.rowdir, g.mb5, g.pt15]}>
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
                          g.pl0,
                          g.fs18,
                          grid.col,
                          grid.justifyContentCenter,
                        ]}
                        keyboardType={'default'}
                        placeholder={'Search By Keywords'}
                        onChangeText={(text) => {
                          searchVal = text;
                          setFilterQuery(text);

                          if (text.length > 2) {
                            resetCount();
                            filterObject.s = text;
                            getTeachers();
                          } else {
                            if (text.length === 0) {
                              resetCount();
                              getTeachers();
                            }
                          }
                        }}
                      />
                    </View>
                  </View>
                  {/* <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {}}
                    style={[
                      g.fliterBtnNew,
                      grid.alignItems,
                      grid.justifyContentCenter,
                      g.bgBlue,
                    ]}>
                    <Text style={[g.colorWhite, g.FHNM, g.fs16]}>Go</Text>
                  </TouchableOpacity> */}
                </View>
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
    backgroundColor: '#2b3252',
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
    color: '#2b3252',
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

export default TeachersList;
