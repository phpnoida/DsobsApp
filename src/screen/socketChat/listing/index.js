import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
  BackHandler,
  ScrollView,
  AppState,
} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import {scale} from '../../../theme/Scalling';
import TopHeaderView from '../../../component/TopHeaderView';
import ProgressImage from '../../../component/ProgresImage';
import SingleSearchWithFilter from '../../../component/SingleSearchWithFilter';
import {generateMenuOption, showProgess} from '../../../component/Common';
import {IconType, APP_NAME} from '../../../helper/Constants';
import Helper from '../../../helper/Helper';
import OptionsSheet from 'react-native-raw-bottom-sheet';
import Highlighter from '../../../component/HighlightWord';
import {CommonActions} from '@react-navigation/native';
import {doGetChats} from '../../../Actions/SocketChatActions';
import _ from 'lodash';

const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
  fetching: 3,
};
let filterObject = {
  page: 1,
  limit: 10,
  search: '',
};

let totalPages = 0;
let currentPage = 1;
let searchQuery = '';

const ChatList = ({navigation}) => {
  const refOptions = useRef();

  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [postData, setPostData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.allLoaded,
  );

  useEffect(() => {
    getGroupData();
    return () => {};
  }, [getGroupData]);

  /**
   *
   * @API Section
   */
  const getGroupData = useCallback(() => {
    doGetChats(
      filterObject,
      response => {
        setShowLoader(false);
        setFirstTimeLoad(false);
        manageResponse(response);
      },
      (code, error) => {
        setShowLoader(false);
        console.log('====================================');
        console.log('error,code', code, error);
        console.log('====================================');
        setFirstTimeLoad(false);
        setPostData([]);
      },
    );
  }, [manageResponse]);

  /**
   *
   * @API Section
   */

  const manageResponse = useCallback(
    response => {
      if (response && response !== null) {
        if (
          response.data &&
          response.data !== undefined &&
          response.data !== null
        ) {
          try {
            let data = response.data;
            totalPages = data.totalPages;
            currentPage = data.currentPage;

            if (data.status) {
              let arrayItems = data.groups;

              console.log('arrayItems', arrayItems);

              if (filterObject.page === 1) {
                setPostData([...arrayItems]);
              } else {
                let oldData = postData;
                var merge = _.merge(oldData, arrayItems);

                setPostData([...merge]);
              }
              setPaginationStatus(PaginationStatus.waiting);
            }
          } catch (error) {
            setPaginationStatus(PaginationStatus.allLoaded);
          }
        }
      }
    },
    [postData],
  );

  /**
   *
   * Pagination
   *
   */

  const onEndReached = () => {
    if (totalPages <= currentPage) {
      setPaginationStatus(PaginationStatus.allLoaded);
      return;
    }
    if (paginationStatus === PaginationStatus.waiting) {
      onPaginate();
    }
  };

  const onPaginate = () => {
    if (paginationStatus !== PaginationStatus.allLoaded && !isRefreshing) {
      setPaginationStatus(PaginationStatus.fetching);
      filterObject.page = filterObject.page + 1;
      getGroupData();
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(false);
    resetCount();
    getGroupData();
  };

  const resetCount = () => {
    totalPages = 0;
    currentPage = 1;
    filterObject = {};
    filterObject.page = 1;
    filterObject.limit = 10;
    filterObject.search = '';
  };

  /**
   *
   * Pagination
   *
   */

  const userOptions = () => {
    return (
      <OptionsSheet
        ref={refOptions}
        minClosingHeight={50}
        height={300}
        duration={200}
        closeOnDragDown={true}
        customStyles={{
          container: GlobalInclude.AppStyle.sheetContainer,
        }}>
        <View stylre={[grid.flex1, g.mb10]}>
          {generateMenuOption(
            'Start a new conversation',
            'add-to-list',
            9,
            () => {
              refOptions.current.close();
              setTimeout(() => {
                navigation.navigate('CreateChat');
              }, 220);
            },
          )}

          {generateMenuOption('My Settings', 'setting', 10, () => {
            refOptions.current.close();
            setTimeout(() => {
              navigation.navigate('ChatSettings');
            }, 220);
          })}

          {generateMenuOption(
            'Chat Etiquette ',
            'exclamationcircleo',
            10,
            () => {
              refOptions.current.close();
              setTimeout(() => {
                navigation.navigate('ChatEtiquette');
              }, 220);
            },
          )}
        </View>
      </OptionsSheet>
    );
  };

  const renderItem = ({index, item}) => {
    let itemImage = '';
    let headerTitle = APP_NAME;
    let subHeader = '';
    let emptyPicMsg = '';

    if (
      item.profilePicture !== undefined &&
      item.profilePicture !== null &&
      item.profilePicture !== ''
    ) {
      itemImage = {uri: item.profilePicture};
    }

    headerTitle = item?.name;
    emptyPicMsg = item?.name?.charAt(0);

    let mediaIcon = null;
    let mediaIconType = null;

    // if (item.lastMessageType === 2) {
    //   mediaIcon = 'camera';
    //   mediaIconType = 'feather';
    // } else if (item.lastMessageType === 3) {
    //   mediaIcon = 'video';
    //   mediaIconType = 'feather';
    // } else if (item.lastMessageType === 4) {
    //   mediaIcon = 'audiotrack';
    //   mediaIconType = 'material-icon';
    // } else if (item.lastMessageType === 5) {
    //   mediaIcon = 'file-pdf-o';
    //   mediaIconType = 'font-awesome';
    // }

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          let payload = {
            groupId: item._id,
          };
          navigation.replace('MakeChat', payload);
        }}
        onLongPress={() => {
          // setSelectedItem(item);
          // if (!isUserRemoved(item)) {
          //   if (
          //     refPostOptions.current !== undefined &&
          //     refPostOptions.current !== null
          //   ) {
          //     selectedIndex = index;
          //     refPostOptions.current.open();
          //   }
          // }
        }}
        style={[
          grid.rowdir,
          g.bggray3,
          g.mb10,
          {
            borderRadius: scale(10),
            paddingHorizontal: scale(6),
            paddingTop: scale(8),
            paddingBottom: scale(8),
          },
        ]}
        key={index}>
        <View
          style={[
            g.mr10,
            g.bggray,
            g.oh,
            grid.alignItems,
            grid.justifyContentCenter,
            {
              width: scale(45),
              height: scale(45),
              borderRadius: scale(50),
            },
          ]}>
          {itemImage !== undefined && itemImage !== null && itemImage !== '' ? (
            <ProgressImage
              source={itemImage}
              containerStyle={styles.imageStyle}
              mode={'cover'}
            />
          ) : item.isGroup ? (
            <GlobalInclude.BaseIcon
              containerStyle={{
                width: scale(35),
                height: scale(35),
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
              }}
              iconColor={'white'}
              iconName={'groups'}
              iconSize={scale(30)}
              iconType={IconType[0]}
            />
          ) : (
            <Text
              style={[
                g.fs32,
                g.FHNM,
                g.colorWhite,
                GlobalInclude.AppStyle.transform,
              ]}>
              {emptyPicMsg}
            </Text>
          )}
        </View>
        <View style={grid.flex1}>
          <View style={[grid.rowdir, grid.alignItemsTop]}>
            <View style={grid.col}>
              <Text
                style={[
                  g.fs13,
                  g.FHNB,
                  g.colorBlue,
                  GlobalInclude.AppStyle.transform,
                ]}>
                {headerTitle}
              </Text>
              {subHeader !== undefined && subHeader !== '' && (
                <Text
                  style={[
                    g.fs12,
                    g.FHNM,
                    g.colorBlue,
                    GlobalInclude.AppStyle.transform,
                    g.mt2,
                  ]}>
                  {subHeader}
                </Text>
              )}
            </View>
            {item.lastMessageTime > 0 && (
              <Text
                style={[
                  g.fs13,
                  g.FHNM,
                  item.unreadMessageCount > 0 ? g.colorBlue : g.colordarkGray,
                ]}>
                {Helper.getChatDate(item.lastMessageTime)}
              </Text>
            )}
          </View>
          <View style={grid.rowdir}>
            <View style={[grid.col, g.mt5]}>
              <View style={[grid.rowdir]}>
                {mediaIcon !== null && (
                  <View style={[g.mr5]}>
                    <GlobalInclude.BaseIcon
                      containerStyle={{height: scale(16), width: scale(16)}}
                      iconColor={'#A9A9A9'}
                      iconName={mediaIcon}
                      iconSize={scale(14)}
                      iconType={mediaIconType}
                    />
                  </View>
                )}
                {item.lastMessage !== undefined &&
                item.lastMessage !== null &&
                item.lastMessage !== '' ? (
                  <Text
                    numberOfLines={item.lastMessageType === 1 ? 2 : 1}
                    style={[
                      g.fs12,
                      g.FHNR,
                      g.colorBlack,
                      g.txtCenterVertical,
                      g.textJustify,
                    ]}>
                    {/* {isExited ? 'You left' : lastMessage} */}
                    Last Messages
                  </Text>
                ) : (
                  <Text
                    style={[
                      g.fs12,
                      g.FHNR,
                      g.colorBlack,
                      g.txtCenterVertical,
                      g.textJustify,
                    ]}>
                    No Messages yet!
                  </Text>
                )}
              </View>
            </View>
            <View
              style={[
                g.ml5,
                grid.alignItems,
                grid.justifyContentCenter,
                grid.rowrow,
              ]}>
              {/* {isConversionMuted(item.mutedBy) && (
                <View style={[g.ml5, g.mr5]}>
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(18), width: scale(18)}}
                    iconColor={GlobalInclude.Color.ColorPrimary}
                    iconName={'volume-mute'}
                    iconSize={scale(18)}
                    iconType={IconType[1]}
                  />
                </View>
              )} */}
              {/* {!item.isGroup && isUserBlocked(item.userInfo) && (
                <View style={[g.ml5, g.mr5]}>
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(18), width: scale(18)}}
                    iconColor={'red'}
                    iconName={'block'}
                    iconSize={scale(18)}
                    iconType={IconType[0]}
                  />
                </View>
              )} */}
              {item.unreadMessageCount > 0 && (
                <View style={styles.unreadCount}>
                  <Text
                    style={[
                      g.fs13,
                      g.FHNB,
                      g.colorWhite,
                      g.txtCenter,
                      grid.alignItems,
                    ]}>
                    {item.unreadMessageCount > 99
                      ? '+99'
                      : item.unreadMessageCount}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const noDataComponent = () => {
    return (
      <View style={GlobalInclude.AppStyle.fillColCenter}>
        <Text
          style={[
            g.colorBlack,
            g.FHNM,
            g.fs12,
            g.textCenter,
            grid.alignItems,
            grid.justifyContentCenter,
          ]}>
          No Record Found
        </Text>
      </View>
    );
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <TopHeaderView
        index={4}
        navigation={navigation}
        label={'Chat'}
        showLabel={false}
        customIcon={{
          containerStyle: {height: scale(24), width: scale(24)},
          iconColor: GlobalInclude.Color.ColorPrimary,
          iconName: 'dots-horizontal',
          size: scale(24),
          type: IconType[1],
        }}
        customIconPress={() => {
          if (refOptions.current !== undefined && refOptions.current !== null) {
            refOptions.current.open();
          }
        }}
        customDelegate={() => {}}
        openNewPage={page => {}}
      />
      <SafeAreaView style={GlobalInclude.AppStyle.fill}>
        <View style={GlobalInclude.AppStyle.fill}>
          <View style={grid.flex1}>
            {firstTimeLoad ? (
              <View style={GlobalInclude.AppStyle.fillCenter}>
                <ActivityIndicator
                  size={'small'}
                  color={GlobalInclude.Color.ColorPrimary}
                />
              </View>
            ) : (
              <View style={[GlobalInclude.AppStyle.fill]}>
                <View style={[GlobalInclude.AppStyle.contentSpaceHorizonta]}>
                  <SingleSearchWithFilter
                    placeholder={'Search'}
                    filterQuery={filterQuery}
                    changeText={text => {
                      setFilterQuery(text);
                    }}
                    showGoButton={false}
                    onFilterPress={() => {}}
                    hideFilter={true}
                  />
                </View>
                {showLoader ? (
                  <View style={GlobalInclude.AppStyle.fillCenter}>
                    <ActivityIndicator
                      size={'large'}
                      color={GlobalInclude.Color.ColorPrimary}
                    />
                  </View>
                ) : (
                  <FlatList
                    style={grid.col}
                    showsVerticalScrollIndicator={false}
                    extraData={postData}
                    data={postData}
                    onEndReachedThreshold={0.1}
                    onEndReached={onEndReached}
                    renderItem={renderItem}
                    ListEmptyComponent={noDataComponent}
                    contentContainerStyle={{
                      flexGrow: 1,
                      paddingStart: scale(15),
                      paddingEnd: scale(15),
                    }}
                    bounces={false}
                    keyExtractor={(v, i) => i.toString()}
                    scrollEventThrottle={16}
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    handleRefresh={handleRefresh}
                  />
                )}
                {showProgess(paginationStatus === PaginationStatus.fetching)}
              </View>
            )}
          </View>
        </View>

        <View style={styles.chatIcon}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setTimeout(() => {
                navigation.navigate('CreateChat');
              }, 220);
            }}
            style={[grid.alignItems, grid.justifyContentCenter]}>
            <GlobalInclude.BaseIcon
              containerStyle={{height: scale(25), width: scale(25)}}
              iconColor={'#fff'}
              iconName={'chat'}
              iconSize={scale(25)}
              iconType={IconType[9]}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {userOptions()}
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    aspectRatio: 1 / 1,
    alignSelf: 'center',
    width: scale(45),
    justifyContent: 'center',
  },
  unreadCount: {
    borderRadius: scale(100),
    backgroundColor: GlobalInclude.Color.ColorPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(24),
    height: scale(24),
  },
  chatIcon: {
    position: 'absolute',
    bottom: scale(10),
    right: scale(10),
    height: scale(46),
    width: scale(46),
    backgroundColor: GlobalInclude.Color.ColorPrimary,
    borderRadius: scale(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatList;
