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
  Keyboard,
  SafeAreaView,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import g from '../../theme/global';
import {scale} from '../../theme/Scalling';
import grid from '../../theme/grid';
import {IconType} from '../../helper/Constants';
import TopHeaderView from '../../component/TopHeaderView';
import CheckBoxIOS from 'react-native-check-box';
import {doGetProfessionList} from '../../Actions/UserActions';
import {getDirectory} from '../../Actions/DirectoryActions';
import BottomSheetHeader from '../../component/BottomSheetHeader';
import ProfessionSheet from 'react-native-raw-bottom-sheet';
import RadioButton from '../../component/RadioButton';

import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;
let professionSheet = null;
let professionListMain = [];
let searchBy = 1;

const myInput = React.createRef();
const scrollRef = React.createRef();

const SearchDirectory = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchIndex, setSearchIndex] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [professionList, setProfessionList] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [professions, setProfessions] = useState([]);
  const [searchedUser, setSearchedUser] = useState([]);

  useEffect(() => {
    if (global.isConnected) {
      getProfessionList();
    }
    return () => {};
  }, []);

  const getProfessionList = () => {
    setIsLoading(true);
    doGetProfessionList(
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
        setIsLoading(false);
        console.log('error', error);
      },
    );
  };

  const doSearchUser = (query) => {
    getDirectory(
      searchBy.toString(),
      query,
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (searchBy === 5) {
              if (data.data.length > 0) {
                navigation.navigate('DirectoryDetails', {data: data.data});
              }
            } else {
              setSearchedUser([...data.data]);
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
        <Text
          style={[
            style.tabBarText,
            g.FHNB,
            g.fs16,
            isTabActive && [g.colorBlue],
          ]}>
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
                  <View style={[style.tabsubheight, {width: '60%'}]}>
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
                            <Text style={[g.fs15, g.FHNR, g.p5, g.colorBlue]}>
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
                                      g.fs15,
                                      g.FHNR,
                                      g.p5,
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
          {row.house ? (
            <Text style={[g.fs12, g.colorBlack, g.FHNR, {margin: scale(2)}]}>
              {row.house.toLowerCase().charAt(0).toUpperCase() +
                row.house.toLowerCase().slice(1)}
            </Text>
          ) : null}
        </TouchableOpacity>
      );
    });
    return (
      <View style={[g.AutoCompleteList1, g.p10]}>
        <Text style={[g.colordarkGray, g.fs12, g.FHNM, g.pb5]}>
          Search Suggestion:
        </Text>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          {data}
        </ScrollView>
      </View>
    );
  };

  const searchProfession = (searchText) => {
    let oldContent = professions;
    var list = [];
    if (searchText.length > 0) {
      oldContent.forEach((element) => {
        if (element.text.toLowerCase().includes(searchText.toLowerCase())) {
          list.push(element);
        }
      });
      setProfessions([...list]);
    } else {
      setProfessions([...professionListMain]);
    }
  };

  return (
    <SafeAreaView style={GlobalInclude.AppStyle.fill}>
      <TouchableOpacity
        style={GlobalInclude.AppStyle.fill}
        activeOpacity={1}
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <View style={GlobalInclude.AppStyle.fill}>
          <View style={GlobalInclude.AppStyle.parentStyle}>
            <View
              style={[
                GlobalInclude.AppStyle.fill,
                {
                  paddingBottom: scale(15),
                },
              ]}>
              {isLoading ? (
                <View style={GlobalInclude.AppStyle.fillCenter}>
                  <ActivityIndicator size={'small'} color={'#2b3252'} />
                </View>
              ) : (
                <View style={GlobalInclude.AppStyle.fill}>
                  <View style={{paddingHorizontal: scale(15)}}>
                    <TopHeaderView
                      index={2}
                      showBack={true}
                      onIconPress={() => {
                        navigation.goBack();
                      }}
                      onTabPress={() => {}}
                    />
                  </View>

                  <ScrollView
                    ref={scrollRef}
                    style={GlobalInclude.AppStyle.fill}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{flexGrow: 1}}>
                    <View style={GlobalInclude.AppStyle.fill}>
                      <View
                        style={{
                          paddingHorizontal: scale(15),
                          paddingTop: scale(5),
                        }}>
                        <View style={[grid.rowdir, grid.alignItems, g.mt5]}>
                          <Text
                            style={[g.fs16, g.FHNR, g.colordarkGray, grid.col]}>
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
                          ]}>
                          <View style={{width: scale(113)}}>
                            <View style={[grid.rowdir, grid.alignItems]}>
                              <CheckBoxIOS
                                checkBoxColor={'#2b3252'}
                                style={[
                                  g.mr2,
                                  g.br3,
                                  {maxWidth: 23, height: 20},
                                ]}
                                onClick={() => {
                                  setSearchIndex(1);
                                  searchBy = 1;
                                }}
                                isChecked={searchIndex === 1 ? true : false}
                                checkedImage={
                                  <Image
                                    source={
                                      GlobalInclude.Assets.CheckboxChecked
                                    }
                                    style={{maxWidth: 20, height: 20}}
                                  />
                                }
                                unCheckedImage={
                                  <Image
                                    source={
                                      GlobalInclude.Assets.CheckboxDefault
                                    }
                                    style={{maxWidth: 20, height: 20}}
                                  />
                                }
                              />
                              <Text
                                style={[
                                  g.colordarkGray,
                                  g.FHNR,
                                  grid.col,
                                  g.fs12,
                                ]}>
                                {'Name/Batch/House/Number'}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              width: scale(70),
                              marginStart: scale(3),
                              marginEnd: scale(3),
                            }}>
                            <View style={[grid.rowdir, grid.alignItems]}>
                              <CheckBoxIOS
                                checkBoxColor={'#2b3252'}
                                style={[
                                  g.mr2,
                                  g.br3,
                                  {maxWidth: 23, height: 20},
                                ]}
                                onClick={() => {
                                  setSearchIndex(2);
                                  searchBy = 2;
                                }}
                                isChecked={searchIndex === 2 ? true : false}
                                checkedImage={
                                  <Image
                                    source={
                                      GlobalInclude.Assets.CheckboxChecked
                                    }
                                    style={{maxWidth: 20, height: 20}}
                                  />
                                }
                                unCheckedImage={
                                  <Image
                                    source={
                                      GlobalInclude.Assets.CheckboxDefault
                                    }
                                    style={{maxWidth: 20, height: 20}}
                                  />
                                }
                              />
                              <Text
                                style={[
                                  g.colordarkGray,
                                  g.FHNR,
                                  grid.col,
                                  g.fs12,
                                ]}>
                                {'Location'}
                              </Text>
                            </View>
                          </View>
                          <View style={{width: scale(75)}}>
                            <View style={[grid.rowdir, grid.alignItems]}>
                              <CheckBoxIOS
                                checkBoxColor={'#2b3252'}
                                style={[
                                  g.mr2,
                                  g.br3,
                                  {maxWidth: 23, height: 20},
                                ]}
                                onClick={() => {
                                  setSearchIndex(3);
                                  searchBy = 3;
                                }}
                                isChecked={searchIndex === 3 ? true : false}
                                checkedImage={
                                  <Image
                                    source={
                                      GlobalInclude.Assets.CheckboxChecked
                                    }
                                    style={{maxWidth: 20, height: 20}}
                                  />
                                }
                                unCheckedImage={
                                  <Image
                                    source={
                                      GlobalInclude.Assets.CheckboxDefault
                                    }
                                    style={{maxWidth: 20, height: 20}}
                                  />
                                }
                              />
                              <Text
                                style={[
                                  g.colordarkGray,
                                  g.FHNR,
                                  grid.col,
                                  g.fs12,
                                ]}>
                                {'Company'}
                              </Text>
                            </View>
                          </View>
                          <View style={[grid.col, {marginStart: scale(3)}]}>
                            <View style={[grid.rowdir, grid.alignItems]}>
                              <CheckBoxIOS
                                checkBoxColor={'#2b3252'}
                                style={[
                                  g.mr2,
                                  g.br3,
                                  {maxWidth: 23, height: 20},
                                ]}
                                onClick={() => {
                                  setSearchIndex(4);
                                  searchBy = 4;
                                }}
                                isChecked={searchIndex === 4 ? true : false}
                                checkedImage={
                                  <Image
                                    source={
                                      GlobalInclude.Assets.CheckboxChecked
                                    }
                                    style={{maxWidth: 20, height: 20}}
                                  />
                                }
                                unCheckedImage={
                                  <Image
                                    source={
                                      GlobalInclude.Assets.CheckboxDefault
                                    }
                                    style={{maxWidth: 20, height: 20}}
                                  />
                                }
                              />
                              <Text
                                style={[
                                  g.colordarkGray,
                                  g.FHNR,
                                  grid.col,
                                  g.fs12,
                                ]}>
                                {'Tags'}
                              </Text>
                            </View>
                          </View>
                        </View>
                        {/* search view */}
                        <View style={[grid.rowdir, g.mb5]}>
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
                                  setSearchQuery(text);
                                  if (text.length > 0) {
                                    doSearchUser(text);
                                  } else {
                                    setSearchedUser([]);
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
                                });
                              }}
                              style={[
                                g.fliterBtnNew,
                                grid.alignItems,
                                grid.justifyContentCenter,
                                g.bgBlue,
                              ]}>
                              <Text style={[g.colorWhite, g.FHNM, g.fs16]}>
                                Go
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        {/* Search  view end */}
                        <View>
                          {searchedUser.length > 0 && renderAutoSuggest()}
                        </View>
                        {/* below contents */}
                        {professionList.length > 0 && (
                          <View style={GlobalInclude.AppStyle.fullWidth}>
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
                                      setTimeout(() => {
                                        scrollRef.current.scrollTo({
                                          y:
                                            searchedUser.length > 0 ? 430 : 140,
                                          animated: true,
                                        });
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
                                      {listItem.group
                                        ? listItem.group.toUpperCase()
                                        : ''}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              })}
                            </View>
                          </View>
                        )}
                      </View>
                      {selectedGroup !== '' ? (
                        <View style={[style.tabbarheight, g.mt15]}>
                          {renderTabs()}
                        </View>
                      ) : null}
                    </View>
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        </View>
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
      </TouchableOpacity>
    </SafeAreaView>
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
    alignSelf: 'flex-start',
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
});

export default SearchDirectory;
