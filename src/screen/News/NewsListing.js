import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
  Image,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Modal,
  Keyboard,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {IconType, APP_NAME, URL_REGX} from '../../helper/Constants';
import {
  getNews,
  getNewsCategoris,
  doPostNews,
  doFilterNews,
} from '../../Actions/NewsActions';

import {getDirectory} from '../../Actions/DirectoryActions';
import ProgresImage from '../../component/ProgresImage';
import TopHeaderView from '../../component/TopHeaderView';
import FilterSheet from 'react-native-raw-bottom-sheet';
import CommonButton from '../../component/CommonButton';
import Helper from '../../helper/Helper';
import AutoSuggestUser from '../../component/AutoSuggestUser';

const {width, height} = Dimensions.get('window');
const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
};

const {urlRegex} = URL_REGX;

let newsIndex = 0;
let newsSize = 10;
let totalCount = 0;
let filterSheet = null;
let newsLink = '',
  newsAbout = '';

let filteredRegion = [];
let filteredIndustry = [];
let filteredTopic = [];
let searchVal = '';
const NewsListing = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pageContent, setPageContent] = useState([]);
  const [newsCategoris, setNewsCategories] = useState([]);
  const [searchedUser, setSearchedUser] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showAddNewsLoader, setShowAddNewsLoader] = useState(false);
  const [filterQuery, setfilterQuery] = useState('');
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );
  useEffect(() => {
    newsIndex = 0;
    newsSize = 10;
    totalCount = 0;
    newsLink = '';
    newsAbout = '';

    filteredRegion = [];
    filteredIndustry = [];
    filteredTopic = [];

    setIsLoading(true);
    getFilterCategory();
    getNewsListing('');
    return () => {};
  }, []);

  /**
   * ************************************************
   * API Section Start
   * ************************************************
   */

  const doSearchUser = (searchQuery) => {
    getDirectory(
      '1',
      searchQuery,
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
      },
    );
  };

  const getFilteredNews = (filters) => {
    doFilterNews(
      filters,
      newsIndex,
      newsSize,
      (response) => {
        setIsLoading(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (newsIndex === 0) {
              totalCount = data.totalCount;
            }

            if (data.status) {
              saveData(data);
            }
          }
        }
      },
      (error) => {
        if (newsIndex === 0) {
          setPageContent(null);
        }
        setIsLoading(false);
      },
    );
  };

  const getNewsListing = (searchQuery) => {
    getNews(
      searchQuery,
      newsIndex,
      newsSize,
      (response) => {
        setIsLoading(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (newsIndex === 0) {
              totalCount = data.totalCount;
            }

            if (data.status) {
              saveData(data);
            }
          }
        }
      },
      (error) => {
        if (newsIndex === 0) {
          setPageContent(null);
        }
        setIsLoading(false);
        console.log('error', error);
      },
    );
  };

  const saveData = (data) => {
    let records = data.data;
    if (newsIndex === 0) {
      setPageContent([...records]);
    } else {
      setPageContent([...pageContent, ...records]);
    }
    setPaginationStatus(PaginationStatus.waiting);
  };

  const getFilterCategory = () => {
    setIsRefreshing(true);
    getNewsCategoris(
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
              var categoryFilterArray = [];
              for (var key in records) {
                if (records.hasOwnProperty(key)) {
                  let filterItem = [];
                  records[key].map((category) => {
                    filterItem.push({
                      label: category,
                      selected: false,
                    });
                  });
                  categoryFilterArray.push({
                    header: key,
                    categories: filterItem,
                    isVisible: false,
                  });
                }
              }
              categoryFilterArray[0].isVisible = true;

              setNewsCategories([...categoryFilterArray]);
              setIsRefreshing(false);
            }
          }
        }
      },
      (error) => {
        setNewsCategories([]);
        console.log('error', error);
      },
    );
  };

  const addNewsPost = () => {
    let userData = global.userDetails;
    let requestData = {
      senderId: userData._id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      batch: userData.batch,
      phone: userData.phone,
      countryCode: userData.countryCode,
      schoolNumber: userData.schoolNumber,
      link: newsLink,
      notes: newsAbout,
    };

    let users = [];

    selectedUsers.map((user) => {
      users.push({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        batch: user.batch,
        schoolNumber: user.schoolNumber,
        house: user.house,
        section: user.section,
        phone: user.phone,
        countryCode: user.countryCode,
      });
    });

    requestData.users = users;

    setShowAddNewsLoader(true);
    doPostNews(
      requestData,
      (response) => {
        setShowAddNewsLoader(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (data.status) {
              newsLink = '';
              newsAbout = '';
              newsIndex = 0;
              setfilterQuery('');
              setShowAddPostModal(false);
              setTimeout(() => {
                getNewsListing('');
              }, 300);
            }
          }
        }
      },
      (error) => {
        setShowAddNewsLoader(false);
        setIsLoading(false);
      },
    );
  };

  /**
   * ************************************************
   * API Section End
   * ************************************************
   */

  const hideShowCategory = (index) => {
    let oldData = newsCategoris;

    oldData[index].isVisible = !oldData[index].isVisible;

    setNewsCategories([...oldData]);
  };

  const selectCategory = (index, childIndex) => {
    let oldData = newsCategoris;
    let filters = oldData[index].categories;
    filters[childIndex].selected = !filters[childIndex].selected;

    if (oldData[index].header === 'by-Region') {
      var index = filteredRegion.indexOf(filters[childIndex].label);
      if (index === -1) {
        filteredRegion.push(filters[childIndex].label);
      } else {
        filteredRegion.splice(index, 1);
      }
    } else if (oldData[index].header === 'by-Industry') {
      var index = filteredIndustry.indexOf(filters[childIndex].label);
      if (index === -1) {
        filteredIndustry.push(filters[childIndex].label);
      } else {
        filteredIndustry.splice(index, 1);
      }
    } else if (oldData[index].header === 'by-Topic') {
      var index = filteredTopic.indexOf(filters[childIndex].label);
      if (index === -1) {
        filteredTopic.push(filters[childIndex].label);
      } else {
        filteredTopic.splice(index, 1);
      }
    }

    setNewsCategories([...oldData]);
  };

  const onPaginate = () => {
    if (paginationStatus !== PaginationStatus.allLoaded && !isRefreshing) {
      console.log('onPaginate()');
      setPaginationStatus(PaginationStatus.waiting);
      newsIndex = parseInt(newsIndex, 10) + 1;
      getNewsListing(filterQuery);
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
    newsIndex = 0;
    getNewsListing(filterQuery);
  };

  const handleBlank = () => {
    newsIndex = 0;
    getNewsListing('');
  };

  const getSelectedFilteres = () => {
    filterSheet.close();

    let requestPayload = '';
    let regionPayload = '';
    let industryPayload = '';
    let topicPayload = '';

    if (filteredRegion.length > 0) {
      regionPayload = `region=${filteredRegion.toString()}`;
    }
    if (filteredIndustry.length > 0) {
      industryPayload = `industry=${filteredIndustry.toString()}`;
    }
    if (filteredTopic.length > 0) {
      topicPayload = `topic=${filteredTopic.toString()}`;
    }

    if (regionPayload !== '') {
      requestPayload = regionPayload;
    }

    if (industryPayload !== '') {
      if (requestPayload !== '') {
        requestPayload = `${requestPayload}&${industryPayload}`;
      } else {
        requestPayload = industryPayload;
      }
    }

    if (topicPayload !== '') {
      if (requestPayload !== '') {
        requestPayload = `${requestPayload}&${topicPayload}`;
      } else {
        requestPayload = topicPayload;
      }
    }

    if (
      filteredRegion.length > 0 ||
      filteredIndustry.length > 0 ||
      filteredTopic.length > 0
    ) {
      newsIndex = 0;
      setIsLoading(true);
      getFilteredNews(requestPayload);
    } else {
      handleRefresh();
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

  const renderSelectedUsers = () => {
    var data = selectedUsers.map((row, index) => {
      return (
        <View key={index} style={style.selectedUserContainer}>
          <View style={[g.bggray2, g.br3, {height: scale(65)}]}>
            {row.profileImg != null && row.profileImg !== '' && (
              <ProgresImage
                source={
                  row.profileImg != null && row.profileImg !== ''
                    ? {uri: row.profileImg}
                    : GlobalInclude.Assets.DefaultImage
                }
                containerStyle={style.userProfileContainer}
                imageStyle={style.userProfiileView}
                mode={'cover'}
              />
            )}
            <TouchableOpacity
              style={style.removeUserContainer}
              activeOpacity={0.8}
              onPress={() => {
                let oldData = selectedUsers;
                oldData.splice(index, 1);
                setSelectedUsers([...oldData]);
              }}
              hitSlop={{
                top: 15,
                bottom: 15,
                left: 15,
                right: 15,
              }}>
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(18), width: scale(18)}}
                iconColor={'#fff'}
                iconName={'close'}
                iconSize={scale(18)}
                iconType={IconType[8]}
              />
            </TouchableOpacity>
          </View>
          <View style={{padding: scale(3)}}>
            <Text style={style.userNameView}>{concatName(row)}</Text>
            {row.schoolNumber ? (
              <Text
                style={[
                  g.fs10,
                  g.colorBlack,
                  g.FHNR,
                  {marginTop: scale(2), marginBottom: scale(2)},
                ]}>
                {row.schoolNumber}
              </Text>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                marginTop: scale(2),
                marginBottom: scale(2),
              }}>
              {row.house ? (
                <Text
                  style={[
                    g.fs10,
                    g.colorBlack,
                    g.FHNR,
                    {marginRight: scale(2)},
                  ]}>
                  {row.house.toLowerCase().charAt(0).toUpperCase() +
                    row.house.toLowerCase().slice(1)}
                </Text>
              ) : null}
              {row.section ? (
                <Text
                  style={[
                    g.fs10,
                    g.colorBlack,
                    g.FHNR,
                    {marginLeft: scale(2)},
                  ]}>
                  {row.section}
                </Text>
              ) : null}
            </View>
            {row.batch ? (
              <Text
                style={[
                  g.fs10,
                  g.colorBlack,
                  g.FHNR,
                  {marginTop: scale(2), marginBottom: scale(2)},
                ]}>
                {row.batch}
              </Text>
            ) : null}
          </View>
        </View>
      );
    });
    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        {data}
      </ScrollView>
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

  const renderItem = ({item, index}) => {
    return (
      <View
        style={[
          g.mb5,
          g.mr5,
          g.ml5,
          g.mt10,
          g.bgWhite,
          g.boxShadow,
          {shadowOpacity: 0.15, borderRadius: scale(10)},
        ]}
        key={index}>
        <TouchableOpacity
          activeOpacity={1}
          style={style.newsImageParent}
          onPress={() => {
            navigation.navigate('CommonWebPage', {
              link: item.link,
            });
          }}>
          <ProgresImage
            source={
              item.image != null && item.image !== ''
                ? {uri: item.image}
                : GlobalInclude.Assets.DefaultImage
            }
            containerStyle={style.newsImageContainer}
            imageStyle={style.newsImage}
            mode={'cover'}
          />
          <View style={g.p10}>
            {item.title ? (
              <Text style={[g.colorBlack, g.fs16, g.FHNB]} numberOfLines={2}>
                {item.title}
              </Text>
            ) : null}
            {item.desc ? (
              <Text
                style={[g.colorBlack, g.fs16, g.FHNR, g.mt5]}
                numberOfLines={2}>
                {item.desc}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.parentStyle}>
        <View
          style={[
            GlobalInclude.AppStyle.fill,
            GlobalInclude.AppStyle.contentSpace,
          ]}>
          <TopHeaderView
            index={2}
            navigation={navigation}
            label={'Post News'}
            showLabel={true}
            onLabelPress={() => {
              searchVal = '';
              setSearchedUser([]);
              setSelectedUsers([]);
              setSearchUserQuery('');
              setShowAddPostModal(true);
            }}
          />
          <View style={[grid.rowdir, g.mb15, g.mt10]}>
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
                    g.fs16,
                    grid.col,
                    grid.justifyContentCenter,
                  ]}
                  keyboardType={'default'}
                  placeholder={'Search by(Name/Title/Tags)'}
                  onChangeText={(text) => {
                    setfilterQuery(text);
                    if (text.trim().length === 0) {
                      setfilterQuery('');
                      Keyboard.dismiss();
                      handleBlank();
                    }
                  }}
                />
              </View>
            </View>
            {filterQuery.length <= 3 ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  filterSheet.open();
                }}
                style={[
                  g.fliterBtnNew,
                  grid.alignItems,
                  grid.justifyContentCenter,
                ]}>
                <Image
                  source={GlobalInclude.Assets.Filter}
                  resizeMode="contain"
                  style={{width: 16}}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  newsIndex = 0;
                  newsSize = 10;
                  totalCount = 0;
                  Keyboard.dismiss();
                  getNewsListing(filterQuery);
                }}
                style={[
                  g.fliterBtnNew,
                  grid.alignItems,
                  grid.justifyContentCenter,
                  g.bgBlue,
                ]}>
                <Text style={[g.colorWhite, g.FHNM, g.fs16]}>Go</Text>
              </TouchableOpacity>
            )}
          </View>
          {isLoading ? (
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
                <View style={GlobalInclude.AppStyle.fill}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    extraData={pageContent}
                    data={pageContent}
                    onEndReachedThreshold={0.1}
                    onEndReached={onEndReached}
                    renderItem={renderItem}
                    keyExtractor={(v, i) => i.toString()}
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    ListFooterComponent={renderFooter}
                  />
                </View>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
      {/* filter sheet */}
      <FilterSheet
        ref={(ref) => {
          filterSheet = ref;
        }}
        onClose={() => {}}
        height={height - 100}
        minClosingHeight={50}
        duration={350}
        closeOnDragDown={true}
        customStyles={{
          container: style.filterSheetContainer,
        }}>
        <Text style={[g.mt15, g.colorBlue, g.fs15, g.FHNB, style.filterText]}>
          FILTER NEWS BY
        </Text>
        <ScrollView
          style={GlobalInclude.AppStyle.fill}
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <View>
            {newsCategoris !== undefined &&
              newsCategoris !== null &&
              newsCategoris.map((item, index) => {
                return (
                  <View key={index}>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={[
                        grid.rowdir,
                        grid.alignItems,
                        grid.justifyContent,
                        style.categoryTitle,
                      ]}
                      onPress={() => {
                        hideShowCategory(index);
                      }}>
                      <Text
                        style={[
                          g.fs13,
                          g.FHNB,
                          g.colorBlack,
                          {textTransform: 'uppercase'},
                        ]}>
                        {item.header.replace('-', ' ')}
                      </Text>
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                          hideShowCategory(index);
                        }}>
                        <GlobalInclude.BaseIcon
                          containerStyle={{height: scale(16), width: scale(16)}}
                          iconColor={'#2b3252'}
                          iconName={item.isVisible ? 'caretup' : 'caretdown'}
                          iconSize={scale(16)}
                          iconType={IconType[10]}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                    {item.isVisible && (
                      <View>
                        {item.categories !== undefined &&
                          item.categories !== null &&
                          item.categories.length > 0 &&
                          item.categories.map((child, childIndex) => {
                            return (
                              <View key={childIndex}>
                                <Text
                                  style={[
                                    g.fs12,
                                    g.FHNM,
                                    {
                                      paddingLeft: 15,
                                      paddingBottom: 10,
                                      paddingRight: 5,
                                      color: child.selected
                                        ? '#2b3252'
                                        : '#a6a6a6',
                                    },
                                  ]}
                                  onPress={() => {
                                    selectCategory(index, childIndex);
                                  }}
                                  numberOfLines={1}>
                                  {child.label}
                                </Text>
                              </View>
                            );
                          })}
                      </View>
                    )}
                  </View>
                );
              })}
          </View>
        </ScrollView>
        <View style={style.goButtonContainer}>
          <CommonButton
            showLoader={false}
            title={'Go'}
            onPress={() => {
              getSelectedFilteres();
            }}
          />
        </View>
      </FilterSheet>
      {/* filter sheet */}

      {/* post video modal */}
      <Modal
        animationType="slide"
        transparent={true}
        hardwareAccelerated={true}
        visible={showAddPostModal}>
        <View style={style.centeredView}>
          <View style={style.modalView}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
                <View style={style.headerView}>
                  <View style={style.closeButton}>
                    <TouchableOpacity
                      style={{alignSelf: 'flex-end'}}
                      activeOpacity={0.8}
                      onPress={() => {
                        setShowAddPostModal(false);
                      }}
                      hitSlop={{
                        top: 15,
                        bottom: 15,
                        left: 15,
                        right: 15,
                      }}>
                      <GlobalInclude.BaseIcon
                        containerStyle={{height: scale(26), width: scale(26)}}
                        iconColor={'#808080'}
                        iconName={'close'}
                        iconSize={scale(26)}
                        iconType={IconType[8]}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                {/* content */}
                <View style={style.postNewsChildContainer}>
                  <View style={g.mb15}>
                    <View style={[grid.rowdir, grid.alignItemsTop]}>
                      <Text style={g.labeltext1}>Paste Link To News Story</Text>
                      <Text style={g.colorRed}>*</Text>
                    </View>
                    <TextInput
                      underlineColorAndroid="transparent"
                      style={[g.inputWhite]}
                      autoCapitalize={'none'}
                      placeholder={'Paste link here'}
                      onChangeText={(value) => {
                        newsLink = value;
                      }}
                    />
                    {errorMessage !== null &&
                      errorMessage.link !== undefined &&
                      errorMessage.link !== '' && (
                        <Text style={[g.errorMsg, g.fs12]}>
                          {errorMessage.link}
                        </Text>
                      )}
                  </View>

                  <View style={g.mb15}>
                    <View style={[grid.rowdir, grid.alignItemsTop]}>
                      <Text style={g.labeltext1}>Name of {APP_NAME} User</Text>
                    </View>
                    <TextInput
                      underlineColorAndroid="transparent"
                      style={[g.inputWhite]}
                      autoCapitalize={'words'}
                      value={searchUserQuery}
                      placeholder={'Search user here'}
                      onChangeText={(value) => {
                        searchVal = value;
                        setSearchUserQuery(value);
                        if (value.length > 0) {
                          doSearchUser(value);
                        } else {
                          setSearchedUser([]);
                        }
                      }}
                    />
                  </View>

                  {searchedUser.length > 0 && (
                    <AutoSuggestUser
                      searchedUser={searchedUser}
                      onPress={(row, index) => {
                        let oldData = selectedUsers;

                        if (oldData.length < 3) {
                          searchVal = '';
                          oldData.push(row);
                          setSearchUserQuery('');
                          setSelectedUsers([...oldData]);
                          setSearchedUser([]);
                        }
                      }}
                    />
                  )}

                  {selectedUsers.length > 0 && (
                    <View style={g.mb15}>
                      <View style={[grid.rowdir, grid.alignItemsTop]}>
                        <Text style={g.labeltext1}>Selected Users</Text>
                      </View>
                      {renderSelectedUsers()}
                    </View>
                  )}

                  <View style={g.mb15}>
                    <View style={[grid.rowdir, grid.alignItemsTop]}>
                      <Text style={g.labeltext1}>Note to {APP_NAME}</Text>
                    </View>
                    <TextInput
                      underlineColorAndroid="transparent"
                      numberOfLines={6}
                      multiline={true}
                      style={[
                        g.inputWhite,
                        {height: 100, textAlignVertical: 'top'},
                      ]}
                      autoCapitalize={'sentences'}
                      placeholder="Enter your text here"
                      onChangeText={(value) => {
                        newsAbout = value;
                      }}
                    />
                  </View>

                  <View style={style.submitButton}>
                    <CommonButton
                      showLoader={showAddNewsLoader}
                      title={'Submit'}
                      onPress={() => {
                        setErrorMessage({});
                        if (newsLink.trim() === '') {
                          setErrorMessage({link: 'This field is required!'});
                        } else if (!Helper.validateRegex(urlRegex, newsLink)) {
                          setErrorMessage({link: 'This link is not valid!'});
                        } else {
                          addNewsPost();
                        }
                      }}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      {/* post video modal */}
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
  filterSheetContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingStart: scale(15),
    paddingEnd: scale(15),
    paddingBottom: scale(20),
    paddingTop: scale(10),
  },
  newsImageParent: {
    overflow: 'hidden',
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
  },
  newsImageContainer: {
    aspectRatio: 16 / 9,
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
    flex: 1,
    overflow: 'hidden',
  },
  newsImage: {
    aspectRatio: 16 / 9,
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
  },
  filterText: {
    paddingTop: 12,
    paddingBottom: 12,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
  },
  categoryTitle: {
    paddingTop: 12,
    paddingBottom: 12,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
  },
  userName: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    textAlign: 'center',
    fontSize: scale(11),
    color: '#333333',
    fontFamily: 'Lato-Regular',
    marginTop: scale(5),
  },
  suggestionContainer: {
    width: scale(55),
    marginEnd: scale(10),
    marginTop: scale(6),
    marginBottom: scale(6),
  },
  centeredView: {
    flex: 1,
    paddingTop: scale(60),
    alignItems: 'center',
    backgroundColor: 'rgba(62,62,62,0.5)',
  },
  modalView: {
    width: width - 30,
    maxHeight: height / 2 + 200,
    backgroundColor: 'white',
    borderRadius: scale(6),
    paddingBottom: scale(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerView: {
    padding: scale(5),
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  userProfileContainer: {
    height: scale(65),
    width: '100%',
    borderRadius: scale(8),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  userProfileView: {
    height: scale(75),
    width: '100%',
    borderRadius: scale(8),
  },
  selectedUserContainer: {
    width: scale(60),
    marginEnd: scale(10),
    marginTop: scale(6),
    marginBottom: scale(6),
  },
  removeUserContainer: {
    alignSelf: 'flex-end',
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#2b3252',
    borderRadius: scale(30),
  },
  userNameView: {
    justifyContent: 'flex-start',
    textAlign: 'left',
    fontSize: scale(10),
    color: '#333333',
    fontFamily: 'Lato-Regular',
    marginTop: scale(5),
  },
  goButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(90),
    alignContent: 'center',
    alignSelf: 'center',
  },
  hidePostModalContainer: {
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 3,
    top: -5,
  },
  postNewsChildContainer: {
    width: '100%',
    paddingStart: scale(10),
    paddingEnd: scale(10),
    paddingTop: scale(5),
    paddingBottom: scale(10),
  },
  submitButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    alignContent: 'center',
    alignSelf: 'center',
  },
  footerView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  closeButton: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    alignContent: 'flex-end',
    flex: 1,
  },
  userProfiileView: {
    height: '100%',
    width: '100%',
    borderRadius: scale(6),
  },
});

export default NewsListing;
