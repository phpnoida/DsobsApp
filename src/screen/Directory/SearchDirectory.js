import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import g from '../../theme/global';
import {scale} from '../../theme/Scalling';
import grid from '../../theme/grid';
import {IconType} from '../../helper/Constants';
import TopHeaderView from '../../component/TopHeaderView';
import CheckBoxIOS from 'react-native-check-box';
import {doGetProfessionList} from '../../Actions/UserActions';
import {doSearchCity, doSearchCompany} from '../../Actions/CommonActions';
import {getDirectory, logDirectory} from '../../Actions/DirectoryActions';
import BottomSheetHeader from '../../component/BottomSheetHeader';
import ProfessionSheet from 'react-native-raw-bottom-sheet';
import RadioButton from '../../component/RadioButton';
import AutoSuggestUser from '../../component/AutoSuggestUser';

import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;
const tablet = deviceWidth >= 768;

const isX =
  Platform.OS === 'ios' && (deviceHeight > 800 || deviceHeight > 800)
    ? true
    : false;
const isL =
  Platform.OS === 'android' && (deviceHeight > 1920 || deviceHeight > 1920)
    ? true
    : false;

let professionSheet = null;
let professionListMain = [];
let searchBy = 1;
let searchVal = '';
let positionY = Platform.OS === 'ios' ? 130 : 180;

const myInput = React.createRef();
const scrollRef = React.createRef();

const SearchDirectory = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchIndex, setSearchIndex] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [professionList, setProfessionList] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [professions, setProfessions] = useState([]);
  const [searchedUser, setSearchedUser] = useState([]);
  const [searchedCityCompany, setSearchedCityCompany] = useState([]);

  useEffect(() => {
    professionSheet = null;
    professionListMain = [];
    searchBy = 1;
    searchVal = '';

    const unsubscribe = navigation.addListener('focus', () => {
      if (global.isConnected) {
        logDirectory(
          (response) => {
            if (response && response !== null) {
              if (
                response.data &&
                response.data !== undefined &&
                response.data !== null
              ) {
                let data = response.data;
                console.log('data', data);
                if (data.status) {
                }
              }
            }
          },
          (code, error) => {
            console.log('error', error);
          },
        );
      }
    });

    if (global.isConnected) {
      getProfessionList();
    }
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  const getProfessionList = () => {
    doGetProfessionList(
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              let dataList = [];

              data.data.map((item) => {
                item.children.map((child) => {
                  child.children.map((sub, index) => {
                    dataList.push({key: index, text: sub});
                  });
                });
              });
              professionListMain = dataList;
              setProfessions([...dataList]);
              setProfessionList([...data.data]);
            }
          }
        }
      },
      (code, error) => {
        console.log('error', error);
      },
    );
  };

  const getSearchDataByCity = (query) => {
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
              console.log('data.status', data.data);
              if (searchVal.length > 0) {
                setSearchedCityCompany([...data.data]);
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

  const getSearchDataByCompany = (query) => {
    setIsLoading(true);
    doSearchCompany(
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
              console.log('data.status', data.data);
              if (searchVal.length > 0) {
                setSearchedCityCompany([...data.data]);
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

  const doSearchUser = (query) => {
    setIsLoading(true);
    getDirectory(
      searchBy.toString(),
      query,
      (response) => {
        setIsLoading(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (searchBy === 5) {
              if (data.data.length > 0) {
                navigation.navigate('DirectoryDetails', {
                  data: data.data,
                  searchBy: searchBy,
                  searchVal: query,
                });
              }
            } else {
              if (searchVal.length > 0) {
                setSearchedUser([...data.data]);
              } else {
                setSearchedUser([]);
              }
            }
          }
        }
      },
      (error) => {
        setIsLoading(false);
        setSearchedUser([]);
        console.log('error', error);
      },
    );
  };

  const renderTab = (
    name,
    page,
    isTabActive,
    onPressHandler,
    onLayoutHandler,
  ) => {
    return (
      <TouchableOpacity
        key={`${name}_${page}`}
        onPress={() => onPressHandler(page)}
        onLayout={onLayoutHandler}>
        <Text style={[style.tabBarText, g.FHNB, isTabActive && [g.colorBlue]]}>
          {name ? name.toUpperCase() : 'dasa'}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleChangeTab = ({i, ref, from}) => {};

  const renderTabs = () => {
    let data = [];
    professionList.map((listItem, index) => {
      if (selectedGroup === listItem.group) {
        if (
          listItem.children &&
          listItem.children !== null &&
          listItem.children.length > 0
        ) {
          listItem.children.map((sub, subIndex) => {
            data.push({data: sub, id: subIndex});
          });
        }
      }
    });
    if (data.length > 0) {
      return (
        <ScrollableTabView
          activeTab={1}
          ref={myInput}
          tabBarUnderlineStyle={{height: 0}}
          renderTabBar={() => (
            <ScrollableTabBar
              style={{borderColor: '#ffffff', height: 38, borderWidth: 0}}
              renderTab={renderTab}
              onChangeTab={handleChangeTab}
              tabsContainerStyle={style.tabSpace}
            />
          )}>
          {data.map((category, index) => {
            return (
              <View tabLabel={category.data.group} key={index}>
                <View style={grid.rowdir}>
                  <View style={{width: '60%', height: deviceHeight - 130}}>
                    <View style={[g.pl5, g.pr5]}>
                      {category.data.children.map((sublinks, subindex) => {
                        return (
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                              setSearchQuery(sublinks);
                              searchBy = 5;
                              setSearchIndex(5);
                              setTimeout(() => {
                                doSearchUser(sublinks);
                              }, 500);
                            }}
                            key={subindex}>
                            <Text
                              style={[
                                {fontSize: 15, padding: 5},
                                g.FHNR,
                                g.colorBlue,
                              ]}>
                              {sublinks}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                  <View style={grid.col}>
                    <View style={[g.pl5, g.pr5]}>
                      {data.map((dummyList, dummyIndex) => {
                        if (dummyList.id === category.id + 1) {
                          return dummyList.data.children.map(
                            (sublinks, subindex) => {
                              return (
                                <TouchableOpacity
                                  activeOpacity={1}
                                  onPress={() => {
                                    myInput.current.goToPage(index + 1);
                                  }}
                                  key={subindex}
                                  onPressIn={() => {}}
                                  onPressOut={() => {}}>
                                  <Text
                                    style={[
                                      {fontSize: 15, padding: 5},
                                      g.FHNR,
                                      g.colorLightGray,
                                    ]}>
                                    {sublinks}
                                  </Text>
                                </TouchableOpacity>
                              );
                            },
                          );
                        }
                      })}
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollableTabView>
      );
    }
    return <View />;
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

  const renderAutoSuggest = () => {
    var data = searchedUser.map((row, index) => {
      return (
        <TouchableOpacity
          key={index}
          activeOpacity={1}
          style={style.suggestionContainer}
          onPress={() => {
            navigation.navigate('UserProfile', {
              userId: row._id,
            });
          }}>
          <View
            style={{
              backgroundColor: '#323232',
              borderRadius: scale(10),
              height: scale(93),
            }}>
            {row.profileImg !== '' ? (
              <Image
                style={{
                  width: '100%',
                  height: scale(93),
                  borderRadius: scale(10),
                }}
                source={{uri: row.profileImg}}
                resizeMode={'cover'}
              />
            ) : (
              <View />
            )}
          </View>
          <Text style={style.userName}>{concatName(row)}</Text>
          {row.batch ? (
            <Text style={[g.fs12, g.colorBlack, g.FHNR, {margin: scale(2)}]}>
              {row.batch}
            </Text>
          ) : null}
          {row.schoolNumber ? (
            <Text style={[g.fs12, g.colorBlack, g.FHNR, {margin: scale(2)}]}>
              {row.schoolNumber}
            </Text>
          ) : null}
          <View style={{flexDirection: 'row'}}>
            {row.house ? (
              <Text style={[g.fs12, g.colorBlack, g.FHNR, {margin: scale(2)}]}>
                {row.house.toLowerCase().charAt(0).toUpperCase() +
                  row.house.toLowerCase().slice(1)}
              </Text>
            ) : null}
            {row.section ? (
              <Text style={[g.fs12, g.colorBlack, g.FHNR, {margin: scale(2)}]}>
                {row.section}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
      );
    });
    return (
      <View>
        {searchedUser.length > 0 && (
          <View style={[g.AutoCompleteList1, g.p10]}>
            <Text style={[g.colordarkGray, g.fs12, g.FHNM, g.pb5]}>
              Auto Suggestion:
            </Text>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {data}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };
  const searchProfession = (searchText) => {
    if (searchText.length > 0) {
      var filtered = professionListMain.filter((element) =>
        element.text.toLowerCase().includes(searchText.toLowerCase()),
      );
      setProfessions([...filtered]);
    } else {
      setProfessions([...professionListMain]);
    }
  };

  /**
   *
   * New added on 09-03-2021
   *
   */

  const renderAutoSuggestCityCompany = () => {
    var data = searchedCityCompany.map((row, index) => {
      return (
        <TouchableOpacity
          key={index}
          activeOpacity={1}
          style={style.suggestionContainer}
          onPress={() => {
            setSearchedCityCompany([]);
            if (searchIndex === 2) {
              setTimeout(() => {
                let title =
                  row.name.toString().toLowerCase().charAt(0).toUpperCase() +
                  row.name.toString().toLowerCase().slice(1);
                setSearchQuery(title);
                doSearchUser(row.name.toString());
              }, 200);
            } else if (searchIndex === 3) {
              setTimeout(() => {
                setSearchQuery(row.toString());
                doSearchUser(row.toString());
              }, 200);
            }
          }}>
          <View
            style={{
              backgroundColor: '#323232',
              borderRadius: scale(10),
              height: scale(93),
            }}
          />
          {searchIndex === 2 ? (
            <View style={{marginStart: scale(5)}}>
              <Text
                style={[
                  style.userName,
                  {
                    textTransform: 'capitalize',
                  },
                ]}>
                {row.name}
              </Text>
              <Text
                style={[
                  style.userName,
                  {
                    textTransform: 'capitalize',
                    flex: 1,
                    flexWrap: 'wrap',
                  },
                ]}>
                {row.country_name}
              </Text>
            </View>
          ) : (
            <View
              style={{
                marginStart: scale(3),
                marginTop: scale(5),
              }}>
              {row.split(' ').map((child) => {
                if (child.trim() !== '') {
                  return (
                    <Text
                      style={{
                        fontSize: scale(12),
                        color: '#333333',
                        fontFamily: 'Lato-Regular',
                        includeFontPadding: false,
                      }}>
                      {child.trim()}
                    </Text>
                  );
                }
              })}
            </View>
          )}
        </TouchableOpacity>
      );
    });
    return (
      <View>
        {searchedCityCompany.length > 0 && (
          <View style={[g.AutoCompleteList1, g.p10]}>
            <Text style={[g.colordarkGray, g.fs12, g.FHNM, g.pb5]}>
              Auto Suggestion:
            </Text>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {data}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  /**
   *
   * New added on 09-03-2021
   *
   */

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <TopHeaderView navigation={navigation} index={0} showBack={true} />
      <SafeAreaView>
        <ScrollView
          ref={scrollRef}
          style={{
            minHeight:
              Platform.OS === 'ios'
                ? isX
                  ? deviceHeight - 0
                  : 0
                : isL
                ? deviceHeight - 10
                : deviceHeight - 5,
          }}
          showsVerticalScrollIndicator={false}>
          <View
            style={GlobalInclude.AppStyle.fill}
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
            }}>
            <View
              style={{
                paddingHorizontal: scale(15),
                paddingBottom: 15,
              }}>
              <View style={[grid.rowdir, grid.alignItems, g.mt10]}>
                <Text style={[g.fs16, g.FHNR, g.colordarkGray, grid.col]}>
                  {'Search By'}
                </Text>
              </View>
              {/* search container */}

              <View
                style={[
                  grid.rowdir,
                  grid.alignItems,
                  g.mt10,
                  g.mb10,
                  tablet && g.pt10,
                ]}>
                <View style={{width: scale(115)}}>
                  <View style={[grid.rowdir, grid.alignItems]}>
                    <CheckBoxIOS
                      checkBoxColor={GlobalInclude.Color.ColorPrimary}
                      style={[g.mr2, g.br3, {maxWidth: 23, height: 20}]}
                      onClick={() => {
                        setSearchedCityCompany([]);
                        setSearchIndex(1);
                        searchBy = 1;
                      }}
                      isChecked={searchIndex === 1 ? true : false}
                      checkedImage={
                        <Image
                          source={GlobalInclude.Assets.CheckboxChecked}
                          style={{maxWidth: 20, height: 20}}
                        />
                      }
                      unCheckedImage={
                        <Image
                          source={GlobalInclude.Assets.CheckboxDefault}
                          style={{maxWidth: 20, height: 20}}
                        />
                      }
                    />
                    <Text style={[g.colordarkGray, g.FHNR, grid.col, g.fs12]}>
                      {'Name/Batch/House/Number'}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: scale(75),
                    marginStart: scale(3),
                    marginEnd: scale(3),
                  }}>
                  <View style={[grid.rowdir, grid.alignItems]}>
                    <CheckBoxIOS
                      checkBoxColor={GlobalInclude.Color.ColorPrimary}
                      style={[g.mr2, g.br3, {maxWidth: 23, height: 20}]}
                      onClick={() => {
                        setSearchedCityCompany([]);
                        setSearchIndex(2);
                        searchBy = 2;
                      }}
                      isChecked={searchIndex === 2 ? true : false}
                      checkedImage={
                        <Image
                          source={GlobalInclude.Assets.CheckboxChecked}
                          style={{maxWidth: 20, height: 20}}
                        />
                      }
                      unCheckedImage={
                        <Image
                          source={GlobalInclude.Assets.CheckboxDefault}
                          style={{maxWidth: 20, height: 20}}
                        />
                      }
                    />
                    <Text style={[g.colordarkGray, g.FHNR, grid.col, g.fs12]}>
                      {'Location'}
                    </Text>
                  </View>
                </View>
                <View style={{width: scale(75)}}>
                  <View style={[grid.rowdir, grid.alignItems]}>
                    <CheckBoxIOS
                      checkBoxColor={GlobalInclude.Color.ColorPrimary}
                      style={[g.mr2, g.br3, {maxWidth: 23, height: 20}]}
                      onClick={() => {
                        setSearchedCityCompany([]);
                        setSearchIndex(3);
                        searchBy = 3;
                      }}
                      isChecked={searchIndex === 3 ? true : false}
                      checkedImage={
                        <Image
                          source={GlobalInclude.Assets.CheckboxChecked}
                          style={{maxWidth: 20, height: 20}}
                        />
                      }
                      unCheckedImage={
                        <Image
                          source={GlobalInclude.Assets.CheckboxDefault}
                          style={{maxWidth: 20, height: 20}}
                        />
                      }
                    />
                    <Text style={[g.colordarkGray, g.FHNR, grid.col, g.fs12]}>
                      {'Company'}
                    </Text>
                  </View>
                </View>
                <View style={[grid.col, {marginStart: scale(3)}]}>
                  <View style={[grid.rowdir, grid.alignItems]}>
                    <CheckBoxIOS
                      checkBoxColor={GlobalInclude.Color.ColorPrimary}
                      style={[g.mr2, g.br3, {maxWidth: 23, height: 20}]}
                      onClick={() => {
                        setSearchedCityCompany([]);
                        setSearchIndex(4);
                        searchBy = 4;
                      }}
                      isChecked={searchIndex === 4 ? true : false}
                      checkedImage={
                        <Image
                          source={GlobalInclude.Assets.CheckboxChecked}
                          style={{maxWidth: 20, height: 20}}
                        />
                      }
                      unCheckedImage={
                        <Image
                          source={GlobalInclude.Assets.CheckboxDefault}
                          style={{maxWidth: 20, height: 20}}
                        />
                      }
                    />
                    <Text style={[g.colordarkGray, g.FHNR, grid.col, g.fs12]}>
                      {'Tags'}
                    </Text>
                  </View>
                </View>
              </View>
              {/* search view */}
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
                      blurOnSubmit={true}
                      underlineColorAndroid="transparent"
                      style={[
                        g.inputNew,
                        g.pl0,
                        g.fs18,
                        grid.col,
                        grid.justifyContentCenter,
                      ]}
                      value={searchQuery}
                      keyboardType={'default'}
                      returnKeyType={'done'}
                      placeholder={'I am looking for'}
                      onChangeText={(text) => {
                        searchVal = text;
                        setSearchQuery(text);
                        if (text.length > 0) {
                          setSearchedUser([]);
                          if (searchIndex === 2) {
                            if (text.length > 2) {
                              getSearchDataByCity(text);
                            } else {
                              setSearchedCityCompany([]);
                            }
                          } else if (searchIndex === 3) {
                            if (text.length > 2) {
                              getSearchDataByCompany(text);
                            } else {
                              setSearchedCityCompany([]);
                            }
                          } else {
                            doSearchUser(text);
                          }
                        } else {
                          setSearchedUser([]);
                          setSearchedCityCompany([]);
                        }
                      }}
                    />
                  </View>
                </View>
                {searchQuery.length === 0 ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      professionSheet.open();
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
                      navigation.navigate('DirectoryDetails', {
                        data: searchedUser,
                        searchBy: searchBy,
                        searchVal: searchVal,
                      });
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
              {/* Search  view end */}
              <View>
                {searchedCityCompany.length > 0
                  ? renderAutoSuggestCityCompany()
                  : searchedUser.length > 0 && (
                      <AutoSuggestUser
                        searchedUser={searchedUser}
                        onPress={(row, index) => {
                          navigation.navigate('UserProfile', {
                            userId: row._id,
                          });
                        }}
                      />
                    )}
              </View>
              {/* below contents */}
              {professionList.length > 0 && (
                <View
                  style={GlobalInclude.AppStyle.fullWidth}
                  onLayout={(event) => {
                    const layout = event.nativeEvent.layout;
                    console.log('layout', layout);
                    positionY = layout.y;
                  }}>
                  <View style={[grid.rowdir]}>
                    <Text
                      style={[
                        g.fs14,
                        g.colordarkGray,
                        grid.col,
                        g.pr10,
                        g.mt10,
                      ]}>
                      Search By Profession
                    </Text>
                  </View>
                  <View
                    style={{
                      marginTop: scale(3),
                      flexWrap: 'wrap',
                      flexDirection: 'row',
                    }}>
                    {professionList.map((listItem, index) => {
                      return (
                        <TouchableOpacity
                          activeOpacity={1}
                          onPress={() => {
                            setSelectedGroup(listItem.group);
                            if (myInput.current !== null) {
                              myInput.current.goToPage(0);
                            }

                            setTimeout(() => {
                              if (
                                scrollRef !== null &&
                                scrollRef.current !== null
                              ) {
                                // scrollRef.current.scrollTo({
                                //   y: searchedUser.length > 0 ? 393 : positionY,
                                //   animated: true,
                                // });

                                scrollRef.current.scrollTo({
                                  y: positionY,
                                  animated: true,
                                });
                              }
                            }, 300);
                          }}
                          key={index}
                          style={g.p3}
                          onPressIn={() => {}}>
                          <Text
                            style={[
                              style.tabsbut,
                              g.FHNB,
                              g.fs12,
                              g.pt7,
                              g.pb7,
                              selectedGroup === listItem.group &&
                                style.bbtbgnactive,
                            ]}>
                            {listItem.group ? listItem.group.toUpperCase() : ''}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>
            {selectedGroup !== '' ? (
              <View style={[g.pl10, g.pr10]}>
                <View style={[style.tabbarheight, g.mt15]}>{renderTabs()}</View>
              </View>
            ) : null}
            <View style={{height: scale(100)}} />
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* profession sheet */}
      <ProfessionSheet
        ref={(ref) => {
          professionSheet = ref;
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
        <BottomSheetHeader
          title={'Select Profession'}
          showSearch={true}
          onSeachQuery={(query) => {
            searchProfession(query);
          }}
        />
        <RadioButton
          defaultSelected={searchQuery}
          PROP={professions}
          onRadioSelect={(value) => {
            setSearchQuery(value.text.toString());
            setSearchIndex(5);
            searchBy = 5;
            doSearchUser(value.text.toString());
            professionSheet.close();
          }}
        />
      </ProfessionSheet>
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
    alignSelf: 'flex-start',
    alignContent: 'center',
    textAlign: 'left',
    fontSize: scale(12),
    color: '#333333',
    fontFamily: 'Lato-Regular',
    marginTop: scale(5),
  },
  suggestionContainer: {
    width: scale(73),
    marginEnd: scale(10),
    marginTop: scale(6),
    marginBottom: scale(6),
  },
});

export default SearchDirectory;
