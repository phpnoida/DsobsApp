import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Dimensions,
  TextInput,
  Keyboard,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import OptionsSheet from 'react-native-raw-bottom-sheet';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';

import {IconType, APP_NAME} from '../../helper/Constants';

import {
  showProgess,
  generateMenuOption,
  uploadMediaButton,
  generateHeader,
  renderNoDataComponent,
} from '../../component/Common';
import UploadMedia from '../../component/UploadMedia';
import TopHeaderView from '../../component/TopHeaderView';
import CommonButton from '../../component/CommonButton';
import SingleSearchWithFilter from '../../component/SingleSearchWithFilter';
import {renderGroupItem} from './GroupCommon';
import {
  doJoinGroup,
  doCreateGroup,
  doGetUserStatusForGroup,
  doSearchGroup,
  doGetDiscoverGroups,
  doGetGroups,
  doGetBatchGroups,
} from '../../Actions/GroupActions';

import _ from 'lodash';
import io from 'socket.io-client';

const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
  fetching: 3,
};

let filterObject = {
  page: 1,
  limit: 10,
  q: '',
};

let totalPages = 0;
let currentPage = 1;
let searchQuery = '';
let responseMessage = '';
let isSuccess = false;
let seletedItem = null;
let firstLoad = true;
let myGroupIds = [];
let selectedTab = 0;

let messageIds = [];

const {height} = Dimensions.get('window');

const GroupsList = ({route, navigation}) => {
  const socketRef = useRef();
  const refOptions = useRef();
  const refJoinGroup = useRef();
  const createGroupRef = useRef();
  const uploadRef = useRef();

  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [currentTab, setCurrentTab] = useState(-1);
  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const [postData, setPostData] = useState([]);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  /**
   * Create Group
   *
   */
  const [groupName, setGroupName] = useState('');
  const [aboutGroup, setAboutGroup] = useState('');
  const [mediaData, setMediaData] = useState(null);
  const [myComment, setMyComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      disconnectSocket();
      connectSocket();
    });

    return () => {
      unsubscribe();
      disconnectSocket();
    };
  }, [navigation, openSelctedTab, connectSocket]);

  const disconnectSocket = () => {
    socketRef?.current?.removeListener('connect');
    socketRef?.current?.removeListener('error');
    socketRef?.current?.removeListener('disconnect');
    socketRef?.current?.removeListener('reconnect');
    socketRef?.current?.removeListener('reconnect_error');
    socketRef?.current?.removeListener('reconnect_attempt');
    socketRef?.current?.removeListener('user-connected');
    socketRef?.current?.removeListener('get-message');
    socketRef?.current?.disconnect();
    socketRef.current = null;
  };

  const connectSocket = useCallback(() => {
    if (
      socketRef == null ||
      socketRef.current === null ||
      socketRef.current === undefined
    ) {
      socketRef.current = io('https://devapi-dsobs.alumbus.com/', {
        reconnectionAttempts: 2,
        transports: ['websocket'],
        upgrade: false,
      });
    }

    socketRef?.current?.on('connect', () => {
      if (socketRef?.current.connected) {
        setCurrentTab(0);
        resetField();
        setCurrentTab(0);
        openSelctedTab(0);
        socketRef?.current.on('error', attempt => {
          console.log('====================================');
          console.log('errror', attempt);
          console.log('====================================');
        });

        socketRef?.current.on('disconnect', () => {
          console.log('socket disconnected'); // undefined
        });

        socketRef?.current.on('reconnect', attempt => {
          console.log('====================================');
          console.log('attempt', attempt);
          console.log('====================================');
        });
        socketRef?.current.on('reconnect_error', attempt => {
          console.log('====================================');
          console.log('reconnect_error', attempt);
          console.log('====================================');
        });
        socketRef?.current.on('reconnect_attempt', attempt => {
          console.log('====================================');
          console.log('reconnect_attempt', attempt);
          console.log('====================================');
        });

        socketRef?.current.once('user-connected', event => {
          console.log('====================================');
          console.log('connected', event);
          console.log('connected', event.status);
          console.log('====================================');
        });
      }
    });
    /********************
     * Specific Events
     */
  }, [openSelctedTab]);

  useEffect(() => {
    if (postData.length > 0) {
      if (socketRef.current !== undefined && socketRef.current !== null) {
        socketRef?.current?.removeListener('get-message');
        socketRef?.current.on('get-message', event => {
          if (event && event !== null && event !== undefined) {
            let message = event.message;
            let exist = _.includes(messageIds, message._id);
            if (!exist) {
              console.log('====================================');
              console.log('useEffect-message-209', message);
              console.log('====================================');
              updateCountInGroup(message);
            }
          }
        });
      }
    }

    return () => {};
  }, [postData, updateCountInGroup]);

  /**
   *
   * @API Section
   */

  const searchGroupData = useCallback(async () => {
    filterObject.q = searchQuery;
    doSearchGroup(
      filterObject,
      response => {
        manageResponse(response);
      },
      (code, error) => {
        setPostData([]);
      },
    );
  }, [manageResponse]);

  const getGroupData = useCallback(() => {
    doGetGroups(
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

  const getDiscoverGroups = useCallback(() => {
    doGetDiscoverGroups(
      filterObject,
      response => {
        setShowLoader(false);
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

  const getBatchGroups = useCallback(() => {
    doGetBatchGroups(
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
            console.log('====================================');
            console.log('data', data);
            console.log('====================================');
            if (data.status) {
              let arrayItems = data.groups;

              if (arrayItems.length > 0 && selectedTab === 0) {
                let result = _.map(arrayItems, '_id');
                let isAnyNew = false;
                let unJoined = [];
                result.forEach(element => {
                  let exist = _.includes(myGroupIds, element);
                  if (!exist) {
                    unJoined.push(element);
                    isAnyNew = true;
                    myGroupIds.push(element);
                  }
                });
                if (isAnyNew) {
                  joinGroupWithSocket(unJoined);
                }
              }

              if (firstLoad && arrayItems.length === 0 && selectedTab === 0) {
                firstLoad = false;
                setCurrentTab(1);
                openSelctedTab(1);
              } else {
                if (filterObject.page === 1) {
                  setPostData([...arrayItems]);
                } else {
                  let oldData = postData;
                  var merge = _.merge(oldData, arrayItems);

                  setPostData([...merge]);
                }
                setPaginationStatus(PaginationStatus.waiting);
              }
            }
          } catch (error) {
            console.log('====================================');
            console.log('error');
            console.log('====================================');
          }
        }
      }
    },
    [postData, openSelctedTab, joinGroupWithSocket],
  );

  const uploadPostData = requestObject => {
    setSubmitting(true);
    doCreateGroup(
      requestObject,
      response => {
        setSubmitting(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (data.status) {
              isSuccess = true;
              responseMessage =
                'You have successfully submitted your request to start a new group';
              setShowErrorMessage(true);
              setTimeout(() => {
                setShowErrorMessage(false);
                openSelctedTab(currentTab);
              }, 2500);
            } else {
              responseMessage = 'Error while posting your request!';
              setShowErrorMessage(true);
              setTimeout(() => {
                setShowErrorMessage(false);
              }, 2500);
            }
          }
        }
      },
      (code, error) => {
        setSubmitting(false);
        Alert.alert('Something went wrong', error);
      },
    );
  };

  const joinGroupRequest = () => {
    if (selectedGroup === undefined || selectedGroup === null) {
      return;
    }
    let groupId = selectedGroup._id;
    global.loader_ref.show_loader(1);
    doJoinGroup(
      groupId,
      response => {
        global.loader_ref.show_loader(0);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (data.status) {
              isSuccess = true;
              responseMessage =
                'You have successfully submitted your request to join group';
              setShowErrorMessage(true);
              setTimeout(() => {
                openSelctedTab(currentTab);
                setShowErrorMessage(false);
              }, 2500);
            } else {
              responseMessage = 'Error while posting your request!';
              setShowErrorMessage(true);
              setTimeout(() => {
                setShowErrorMessage(false);
              }, 2500);
            }
          }
        }
      },
      (code, error) => {
        console.log('error: ' + error);
        console.log('code: ' + code);
        global.loader_ref.show_loader(0);
      },
    );
  };

  const getUserStatus = groupId => {
    global.loader_ref.show_loader(1);
    doGetUserStatusForGroup(
      groupId,
      response => {
        global.loader_ref.show_loader(0);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data && data !== null && data !== undefined) {
              if (data.status) {
                //{"status": true, "userStatus": 1}
                let userStatus = data.userStatus;
                /*
                      -1 = unjoin
                      0 = pending
                      1 = active
                      2 = rejected
                      3 = removed
                    */
                if (userStatus === 1) {
                  let group = seletedItem;
                  disconnectAllGroup();
                  disconnectSocket();
                  //resetField();
                  navigation.navigate('StartGroupChat', {
                    groupId: group._id,
                    groupInfo: group,
                  });
                } else {
                  seletedItem.status = userStatus;
                  setSelectedGroup(seletedItem);
                  if (
                    refJoinGroup.current !== undefined &&
                    refJoinGroup.current !== null
                  ) {
                    refJoinGroup.current.open();
                  }
                }
              }
            }
            console.log('====================================');
            console.log('user status', data);
            console.log('====================================');
          }
        }
      },
      (code, error) => {
        global.loader_ref.show_loader(0);
        Alert.alert('something wrong', error);
        console.log('====================================');
        console.log('code ,error', code, error);
        console.log('====================================');
      },
    );
  };
  /**
   *
   * @API Section
   */

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
      openSelctedTab(currentTab);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(false);
    resetCount();
    openSelctedTab(currentTab);
  };

  const resetCount = () => {
    totalPages = 0;
    currentPage = 1;
    filterObject = {};
    filterObject.page = 1;
    filterObject.limit = 10;
  };

  const resetField = () => {
    totalPages = 0;
    currentPage = 1;
    searchQuery = '';
    responseMessage = '';
    isSuccess = false;
    seletedItem = null;
    firstLoad = true;
    myGroupIds = [];
    selectedTab = 0;
  };
  /**
   *
   * Pagination
   *
   */

  const joinGroupWithSocket = useCallback(unJoined => {
    if (socketRef.current !== undefined && socketRef.current !== null) {
      unJoined.forEach(element => {
        let payload = {
          groupId: element,
          userId: global.userId,
        };
        setTimeout(() => {
          socketRef?.current?.emit('subscribe-group', payload);
        }, 100);
      });
    }
  }, []);

  const disconnectAllGroup = useCallback(() => {
    if (socketRef.current !== undefined && socketRef.current !== null) {
      myGroupIds.forEach((element, index) => {
        let payload = {
          groupId: element,
          userId: global.userId,
        };
        socketRef?.current?.emit('user-disconnect', payload);
      });
      disconnectSocket();
    }
  }, []);

  const updateCountInGroup = useCallback(
    message => {
      let oldData = postData;
      let index = _.findIndex(oldData, function (item) {
        return item._id === message.groupId;
      });
      if (index !== undefined && index !== null && index > -1) {
        let newCount = oldData[index].unreadMessageCount + 1;
        oldData[index].unreadMessageCount = newCount;

        // oldData = _.orderBy(oldData, ['unreadMessageCount'], ['desc']);

        var placeholder = {};
        var objectToMove = oldData.splice(index, 1, placeholder)[0];
        oldData.splice(0, 0, objectToMove);
        oldData.splice(oldData.indexOf(placeholder), 1);

        setPostData([...oldData]);
      }
    },
    [postData],
  );

  const openSelctedTab = useCallback(
    index => {
      selectedTab = index;
      resetCount();
      //setPostData([]);
      setShowLoader(true);
      setPaginationStatus(PaginationStatus.waiting);
      if (index === 0) {
        getGroupData();
      } else if (index === 1) {
        getDiscoverGroups();
      } else if (index === 2) {
        getBatchGroups();
      }
    },
    [getGroupData, getDiscoverGroups, getBatchGroups],
  );

  const isValidMedia = imageMedia => {
    if (imageMedia !== undefined && imageMedia !== null) {
      let info = imageMedia.imageInfo;
      let cropRect = info.cropRect;
      let ratio = cropRect.width / cropRect.height;

      let result =
        Math.abs(ratio - 4 / 3) < Math.abs(ratio - 16 / 9) ? '4:3' : '16:9';

      if (result === '16:9') {
        return true;
      }
      return false;
    }
  };

  const validateInput = () => {
    if (groupName.trim() === '' || groupName.length === 0) {
      setErrorMessage({groupName: 'This field is required'});
    } else if (aboutGroup.trim() === '' || aboutGroup.length === 0) {
      setErrorMessage({aboutGroup: 'This field is required'});
    } else if (mediaData === undefined || mediaData === null) {
      setErrorMessage({mediaData: 'This field is required'});
    } else {
      saveGroup();
    }
  };

  const saveGroup = () => {
    let requestObject = {
      name: groupName,
      description: aboutGroup,
      profilePicture: mediaData.thumbnail,
      firstComment: myComment,
    };

    Keyboard.dismiss();
    createGroupRef?.current?.close();
    setTimeout(() => {
      uploadPostData(requestObject);
    }, 200);
  };

  const createNewGroup = () => {
    return (
      <OptionsSheet
        ref={createGroupRef}
        minClosingHeight={50}
        height={height / 2 + 75}
        duration={200}
        closeOnDragDown={false}
        closeOnPressBack={true}
        dragFromTopOnly={true}
        keyboardAvoidingViewEnabled={true}
        closeOnPressMask={true}
        customStyles={{
          container: GlobalInclude.AppStyle.sheetContainer,
        }}>
        <View style={GlobalInclude.AppStyle.fill}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'handled'}
            style={[grid.flex1]}
            showsVerticalScrollIndicator={false}>
            <View>
              <View style={g.mb10}>
                {generateHeader('Set Group Name', true)}
                <TextInput
                  underlineColorAndroid="transparent"
                  numberOfLines={1}
                  style={g.inputWhite}
                  value={groupName}
                  keyboardType={'default'}
                  autoCapitalize={'words'}
                  multiline={false}
                  blurOnSubmit={true}
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  returnKeyType="done"
                  placeholder={'Type here'}
                  onChangeText={value => {
                    setErrorMessage({});
                    setGroupName(value);
                  }}
                />
                {errorMessage.groupName && errorMessage.groupName !== '' ? (
                  <Text style={g.errorMsg}>{errorMessage.groupName}</Text>
                ) : null}
              </View>

              <View style={g.mb10}>
                {generateHeader('About Group', true)}
                <TextInput
                  underlineColorAndroid="transparent"
                  numberOfLines={6}
                  style={styles.commentInput}
                  value={aboutGroup}
                  keyboardType={'default'}
                  autoCapitalize={'words'}
                  multiline={true}
                  blurOnSubmit={true}
                  maxLength={500}
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  returnKeyType="done"
                  placeholder={'Type here'}
                  onChangeText={value => {
                    setErrorMessage({});
                    setAboutGroup(value);
                  }}
                />
                {errorMessage.aboutGroup && errorMessage.aboutGroup !== '' ? (
                  <Text style={g.errorMsg}>{errorMessage.aboutGroup}</Text>
                ) : null}
              </View>

              <View style={g.mb10}>
                {generateHeader('Upload Pic', true)}
                {uploadMediaButton(
                  () => {
                    if (uploadRef.current !== null) {
                      uploadRef.current.open();
                    }
                  },
                  mediaData !== undefined && mediaData !== null
                    ? 'Image Uploaded successfully'
                    : 'Upload Pic',
                )}
                {errorMessage.mediaData && errorMessage.mediaData !== '' ? (
                  <Text style={g.errorMsg}>{errorMessage.mediaData}</Text>
                ) : null}
              </View>

              <View style={g.mb10}>
                {generateHeader('Your first comment in the group', false)}
                <TextInput
                  underlineColorAndroid="transparent"
                  numberOfLines={1}
                  style={styles.commentInput}
                  value={myComment}
                  keyboardType={'default'}
                  autoCapitalize={'words'}
                  multiline={true}
                  blurOnSubmit={true}
                  maxLength={200}
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  returnKeyType="done"
                  placeholder={'Type here'}
                  onChangeText={value => {
                    setErrorMessage({});
                    setMyComment(value);
                  }}
                />
                {errorMessage.myComment && errorMessage.myComment !== '' ? (
                  <Text style={g.errorMsg}>{errorMessage.inputValue}</Text>
                ) : null}
              </View>
            </View>
          </KeyboardAwareScrollView>
          <View style={styles.buttonContainer}>
            <CommonButton
              showLoader={submitting}
              title={'Create Now'}
              onPress={e => {
                e.preventDefault();
                validateInput();
              }}
            />
          </View>
        </View>
      </OptionsSheet>
    );
  };

  const userOptions = () => {
    return (
      <OptionsSheet
        ref={refOptions}
        minClosingHeight={50}
        height={260}
        duration={200}
        closeOnDragDown={true}
        customStyles={{
          container: GlobalInclude.AppStyle.sheetContainer,
        }}>
        <View stylre={[grid.flex1, g.mb10]}>
          {generateMenuOption('Start a New Group', 'add-to-list', 9, () => {
            refOptions.current.close();
            setGroupName('');
            setAboutGroup('');
            setMediaData(null);
            setMyComment('');
            setSubmitting(false);
            setErrorMessage({});
            setTimeout(() => {
              if (
                createGroupRef.current !== undefined &&
                createGroupRef.current !== null
              ) {
                createGroupRef.current.open();
              }
            }, 220);
          })}

          {generateMenuOption('Group Settings', 'setting', 10, () => {
            refOptions.current.close();
            setTimeout(() => {
              navigation.navigate('GroupSettings');
            }, 220);
          })}

          {generateMenuOption('About Groups', 'exclamationcircleo', 10, () => {
            refOptions.current.close();
          })}
        </View>
      </OptionsSheet>
    );
  };

  const joinGroup = () => {
    /*
      -1 = unjoin
      0 = pending
      1 = active
      2 = rejected
      3 = removed
    */

    let title = '';
    let groupStatus = selectedGroup.status;
    switch (selectedGroup.status) {
      case -1:
        title = 'Join Group';
        break;
      case 0:
        title = 'Join Group (Request Pending)';
        break;
      case 1:
        title = 'Join Group (Member)';
        break;
      case 2:
        title = 'Join Group (Request Rejected)';
        break;
      case 3:
        title = 'Join Group (You Left)';
        break;
      case 4:
        title = 'Join Group (Member Removed)';
        break;
      default:
        break;
    }

    return (
      <OptionsSheet
        ref={refJoinGroup}
        minClosingHeight={50}
        height={160}
        duration={200}
        closeOnDragDown={true}
        customStyles={{
          container: GlobalInclude.AppStyle.sheetContainer,
        }}>
        <View stylre={[grid.flex1, g.mb10]}>
          {groupStatus === -1
            ? generateMenuOption('Join Group', 'add-to-list', 9, () => {
                refJoinGroup.current.close();
                setTimeout(() => {
                  joinGroupRequest();
                }, 200);
              })
            : generateMenuOption(title, 'add-to-list', 9, () => {
                refJoinGroup.current.close();
                if (groupStatus === 2 || groupStatus === 3) {
                  setTimeout(() => {
                    joinGroupRequest();
                  }, 200);
                }
              })}
        </View>
      </OptionsSheet>
    );
  };

  const renderItem = ({item, index}) => {
    return renderGroupItem(selectedTab, item, index, () => {
      seletedItem = item;
      setTimeout(() => {
        getUserStatus(item._id);
      }, 100);
    });
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
        navigation={navigation}
        index={13}
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
      />

      <SafeAreaView style={GlobalInclude.AppStyle.fill}>
        {firstTimeLoad ? (
          <View style={GlobalInclude.AppStyle.fillCenter}>
            <ActivityIndicator
              size={'large'}
              color={GlobalInclude.Color.ColorPrimary}
            />
          </View>
        ) : (
          <View style={[GlobalInclude.AppStyle.fill]}>
            <View style={[GlobalInclude.AppStyle.fill, g.pt10]}>
              <View style={GlobalInclude.AppStyle.contentSpaceHorizonta}>
                <SingleSearchWithFilter
                  placeholder={'Type more than three Characters'}
                  filterQuery={filterQuery}
                  changeText={text => {
                    setFilterQuery(text);
                    searchQuery = text;

                    if (text.length > 3) {
                      resetCount();
                      setPostData([]);
                      searchGroupData();
                    } else if (text.length === 1) {
                      setPostData([]);
                    }
                    if (text.trim().length === 0) {
                      openSelctedTab(currentTab);
                    }
                  }}
                  showGoButton={false}
                  onFilterPress={() => {}}
                  hideFilter={true}
                />
              </View>

              {filterQuery.length === 0 && (
                <View style={[grid.rowdir, g.mt5, g.mb10]}>
                  <TouchableOpacity
                    style={grid.col}
                    activeOpacity={1}
                    onPress={e => {
                      e.preventDefault();
                      setCurrentTab(0);
                      openSelctedTab(0);
                    }}>
                    <Text
                      style={[
                        g.fs15,
                        currentTab === 0 ? g.colorBlue : styles.colorInActive,
                        g.FHNB,
                        g.txtCenter,
                        g.txtCenterVertical,
                        grid.justifyContentCenter,
                        grid.alignItems,
                      ]}>
                      My Groups
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={grid.col}
                    activeOpacity={1}
                    onPress={e => {
                      e.preventDefault();
                      setCurrentTab(1);
                      openSelctedTab(1);
                    }}>
                    <Text
                      style={[
                        g.fs15,
                        currentTab === 1 ? g.colorBlue : styles.colorInActive,
                        g.FHNB,
                        g.txtCenter,
                        g.txtCenterVertical,
                        grid.justifyContentCenter,
                        grid.alignItems,
                      ]}>
                      Discover More
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={grid.col}
                    activeOpacity={1}
                    onPress={e => {
                      e.preventDefault();
                      setCurrentTab(2);
                      openSelctedTab(2);
                    }}>
                    <Text
                      style={[
                        g.fs15,
                        currentTab === 2 ? g.colorBlue : styles.colorInActive,
                        g.FHNB,
                        g.txtCenter,
                        g.txtCenterVertical,
                        grid.justifyContentCenter,
                        grid.alignItems,
                      ]}>
                      Batch Groups
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

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
          </View>
        )}

        {userOptions()}
        {createNewGroup()}
        {selectedGroup !== undefined && selectedGroup !== null && joinGroup()}

        {showErrorMessage && (
          <GlobalInclude.ModalAlert
            status={showErrorMessage}
            header={responseMessage}
            okButton={isSuccess ? 'Okay' : `Contact ${APP_NAME}`}
            okAction={() => {
              setShowErrorMessage(!showErrorMessage);
            }}
            closeAction={() => {
              setShowErrorMessage(!showErrorMessage);
            }}
          />
        )}
      </SafeAreaView>

      <UploadMedia
        navigation={navigation}
        refRBSheet={uploadRef}
        media={{
          image: false,
          video: true,
          document: true,
          audio: true,
        }}
        supportMultiple={false}
        onPickMedia={media => {
          uploadRef.current.close();
          if (media !== undefined && media !== null) {
            if (!isValidMedia(media[0])) {
              setErrorMessage({mediaData: 'Photo must be in 16:9 ratio'});
            } else {
              setErrorMessage({});
              setMediaData(media[0]);
            }
          }
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  tabBarStyle: {borderBottomWidth: 0, margin: 0},
  tabBarUnderlineStyle: {
    borderBottomColor: 'transparent',
    backgroundColor: 'white',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    paddingTop: scale(10),
    paddingBottom: scale(10),
    alignContent: 'center',
    alignSelf: 'center',
  },
  commentInput: {
    height: scale(90),
    color: 'black',
    textAlignVertical: 'top',
    backgroundColor: '#f8f8f8',
    padding: scale(10),
    margin: 0,
    fontSize: scale(12),
    borderRadius: scale(8),
    fontFamily: 'Lato-Regular',
    justifyContent: 'center',
  },
  colorInActive: {color: '#bababa'},
});

export default GroupsList;
