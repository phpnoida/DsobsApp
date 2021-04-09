import React, {useState, useEffect, useRef} from 'react';
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
import {IconType, APP_NAME} from '../../helper/Constants';
import HeaderBar from '../../component/HeaderBar';
import Helper from '../../helper/Helper';
import YellowPageSearch from '../../component/YellowPageSearch';

import BottomSheetAbout from 'react-native-raw-bottom-sheet';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';

import {doGetProfessionList} from '../../Actions/UserActions';

const {height, width} = Dimensions.get('window');
const tablet = width >= 768;
const isX =
  Platform.OS === 'ios' && (height > 800 || height > 800) ? true : false;
const isL =
  Platform.OS === 'android' && (height > 1920 || height > 1920) ? true : false;

let searchType = '';
let searchVal = '';
let professionSheet = null;
let professionListMain = [];
let positionY = Platform.OS === 'ios' ? 130 : 180;

const myInput = React.createRef();
const scrollRef = React.createRef();

const YellowPages = ({navigation}) => {
  const refRBSheet = useRef();
  const [checkedType, setCheckedType] = useState(1);
  const [filterQuery, setFilterQuery] = useState('');
  const [professionList, setProfessionList] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [professions, setProfessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    professionSheet = null;
    professionListMain = [];
    searchBy = 1;
    searchVal = '';

    if (global.isConnected) {
      getProfessionList();
    }
    return () => {};
  }, []);

  /*****
   *
   * API Section
   *
   */

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

  /*****
   *
   * API Section
   *
   */

  /*****
   * Tab
   */
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
          {name ? name.toUpperCase() : ''}
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
                  <View style={{width: '60%', height: height - 130}}>
                    <View style={[g.pl5, g.pr5]}>
                      {category.data.children.map((sublinks, subindex) => {
                        return (
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                              // setSearchQuery(sublinks);
                              // searchBy = 5;
                              // setSearchIndex(5);
                              // setTimeout(() => {
                              //   doSearchUser(sublinks);
                              // }, 500);
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
  /****
   * Tab
   */

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.parentStyle}>
        <View style={GlobalInclude.AppStyle.fill}>
          <HeaderBar
            title={'YellowPages'}
            navigation={navigation}
            showBack={true}
            customIcon={{
              containerStyle: {height: scale(24), width: scale(24)},
              iconColor: '#2b3252',
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
          <ScrollView
            ref={scrollRef}
            style={{
              minHeight:
                Platform.OS === 'ios'
                  ? isX
                    ? height - 0
                    : 0
                  : isL
                  ? height - 10
                  : height - 5,
            }}
            showsVerticalScrollIndicator={false}>
            <View>
              <View
                style={{
                  paddingLeft: 15,
                  paddingRight: 15,
                  paddingTop: scale(15),
                  paddingBottom: 0,
                }}>
                {/* search container */}
                <YellowPageSearch
                  scrollRef={scrollRef}
                  mainTitle={'Search By'}
                  chkType={checkedType}
                  chkOneTitle={'Company Name'}
                  chkTwoTitle={'Tags'}
                  ChkThreeTitle={'Location'}
                  onChecked={(type) => {
                    searchType = type;
                    setCheckedType(type);
                  }}
                  changeText={(text) => {
                    searchVal = text;
                    setFilterQuery(text);
                  }}
                  filterQuery={filterQuery}
                  onGoPress={() => {
                    navigation.navigate('YellowPageListing');
                  }}
                />
              </View>
              <View
                style={GlobalInclude.AppStyle.fullWidth}
                onLayout={(event) => {
                  const layout = event.nativeEvent.layout;
                  positionY = layout.y;
                }}>
                <View
                  style={{
                    paddingLeft: 15,
                    paddingRight: 15,
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
                      Business Category
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
              </View>
              {selectedGroup !== '' ? (
                <View style={[g.pl10, g.pr10]}>
                  <View style={[style.tabbarheight, g.mt15]}>
                    {renderTabs()}
                  </View>
                </View>
              ) : null}
              <View style={{height: scale(100)}} />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>

      <BottomSheetAbout
        ref={refRBSheet}
        height={height / 2 - 110}
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
        <TouchableOpacity
          onPress={() => {
            refRBSheet.current.close();
            navigation.navigate('ListMyBusiness');
          }}>
          <Text
            style={[g.fs16, g.FHNM, g.txtLeft, g.colorBlack, g.mt5, g.mb15]}>
            List My Business
          </Text>
        </TouchableOpacity>

        <Text style={[g.fs16, g.FHNR, g.txtLeft, g.colorBlack, g.mb15]}>
          Edit My Business-1
        </Text>
        <Text style={[g.fs16, g.FHNR, g.txtLeft, g.colorBlack, g.mb15]}>
          Edit My Business-2
        </Text>
        <Text style={[g.fs16, g.FHNM, g.txtLeft, g.colorBlack, g.mb15]}>
          About YellowPages
        </Text>
      </BottomSheetAbout>
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

export default YellowPages;
