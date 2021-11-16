import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Alert,
  FlatList,
  Keyboard,
  SafeAreaView,
  Dimensions,
  Modal,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';
import ProgressImage from '../../component/ProgresImage';
import {IconType} from '../../helper/Constants';
import Helper from '../../helper/Helper';
import moment from 'moment';
import {renderNoDataComponent} from '../../component/Common';
import {
  getComments,
  addUserComment,
  updateUserComment,
  removeUserComment,
  doReportComment,
} from '../../Actions/TickerActions';
import HeaderBar from '../../component/HeaderBar';
import OptionsSheet from 'react-native-raw-bottom-sheet';
import {useDispatch} from 'react-redux';
import {increaseComment} from '../../reducer/NotificationReducer';
import {StackActions} from '@react-navigation/native';
import {
  KeyboardAccessoryView,
  useComponentSize,
} from '../../component/keyboardView';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const {width: displayWidth} = Dimensions.get('window');

const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
};
let filterObject = {
  index: 0,
  size: 10,
};
let lastIndex = -1;
let totalCount = 0;
let postId = '';
let postIndex = -1;
let selectedOption = '';
let responseMessage = '';
let inputValue = '';

const Comments = ({route, navigation}) => {
  const refPostComments = useRef();
  const dispatch = useDispatch();
  const {onLayout} = useComponentSize();
  const insets = useSafeAreaInsets();

  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [comments, setComments] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isReplayEditComment, setIsReplayEditComment] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [reportText, setReportText] = useState('');
  const [nestingLevel, setNestingLevel] = useState('0');

  useEffect(() => {
    lastIndex = -1;
    totalCount = 0;
    postId = '';
    postIndex = -1;
    selectedOption = '';
    responseMessage = '';
    inputValue = '';

    const backButtonHandler = () => {
      console.log('83');
      manageCommentDraft();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backButtonHandler,
    );

    if (route.params !== undefined && route.params !== null) {
      postId = route.params.data.postId;
      postIndex = route.params.data.postIndex;
    }

    console.log('====================================');
    console.log('postId', postId);
    console.log('postIndex', postIndex);
    console.log('====================================');

    if (global.isConnected) {
      resetCount();
      if (global.isConnected) {
        getCommentsList();
      } else {
        setFirstTimeLoad(false);
      }
    }

    console.log('global.commentDraft', global.commentDraft);

    checkCommentExist();

    return () => {
      backHandler.remove();
    };
  }, [route, navigation, getCommentsList, manageCommentDraft]);

  const manageCommentDraft = useCallback(() => {
    console.log('commentText', inputValue);
    if (inputValue !== '') {
      addCommentIfNotExist(() => {
        if (postIndex !== -1) {
          navigation.goBack();
        } else {
          navigation.dispatch(StackActions.replace('CommonRoom'));
        }
      });
    } else {
      if (postIndex !== -1) {
        navigation.goBack();
      } else {
        navigation.dispatch(StackActions.replace('CommonRoom'));
      }
    }
  }, [addCommentIfNotExist, navigation]);

  const checkCommentExist = () => {
    var isExistComment = -1;
    if (
      global.commentDraft &&
      global.commentDraft !== undefined &&
      global.commentDraft !== null
    ) {
      for (let i = 0; i < global.commentDraft.length; i++) {
        const child = global.commentDraft[i];
        if (child.key && child.key !== undefined && child.key !== null) {
          if (child.key === postId) {
            setCommentText(child.message);
            isExistComment = i;
            break;
          }
        }
      }
    }
    return isExistComment;
  };

  const addCommentIfNotExist = useCallback(callback => {
    var isExist = checkCommentExist();
    if (isExist === -1) {
      if (
        global.commentDraft &&
        global.commentDraft !== undefined &&
        global.commentDraft !== null
      ) {
        global.commentDraft.push({key: postId, message: inputValue});
      } else {
        global.commentDraft = [];
        global.commentDraft.push({key: postId, message: inputValue});
      }
      callback();
    } else {
      if (
        global.commentDraft &&
        global.commentDraft !== undefined &&
        global.commentDraft !== null
      ) {
        global.commentDraft[isExist].message = inputValue;
      }
      callback();
    }
  }, []);

  /**
   *
   * Pagination
   *
   */
  const onPaginate = useCallback(() => {
    if (paginationStatus !== PaginationStatus.allLoaded && !isRefreshing) {
      console.log('onPaginate()');
      setPaginationStatus(PaginationStatus.waiting);
      filterObject.index = filterObject.index + 1;
      getCommentsList();
    }
  }, [getCommentsList, isRefreshing, paginationStatus]);

  const onEndReached = useCallback(() => {
    if (getCount() === totalCount || totalCount < 10) {
      setPaginationStatus(PaginationStatus.allLoaded);
      return;
    }
    if (paginationStatus === PaginationStatus.waiting) {
      onPaginate();
    }
  }, [getCount, paginationStatus, onPaginate]);

  const handleRefresh = useCallback(() => {
    filterObject.index = 0;
    setIsRefreshing(false);
    resetCount();
    getCommentsList();
  }, [getCommentsList]);

  const resetCount = () => {
    totalCount = 0;
    filterObject = {};
    filterObject.index = 0;
    filterObject.size = 10;
    filterObject.postId = postId;
  };
  /**
   *
   * Pagination
   *
   */

  /**
   *
   * API
   *
   *
   */
  const getCommentsList = useCallback(() => {
    getComments(
      filterObject,
      response => {
        setFirstTimeLoad(false);
        setIsRefreshing(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            let commentList = [];
            if (data.status) {
              if (data.data !== undefined && data.data !== null) {
                let items = data.data;
                for (var key in items) {
                  if (items.hasOwnProperty(key)) {
                    let object = items[key];
                    let subChild = [];

                    if (
                      Object.keys(object.children).length > 0 &&
                      object.children.constructor === Object
                    ) {
                      let children = object.children;

                      for (var child in children) {
                        if (children.hasOwnProperty(child)) {
                          subChild.push(children[child]);
                        }
                      }
                      object.children = subChild;
                      commentList.push(object);
                    } else {
                      commentList.push(object);
                    }
                  }
                }
                if (filterObject.index === 0) {
                  totalCount = data.totalCount;
                  setComments([...commentList]);
                } else {
                  setComments([...comments, ...commentList]);
                }
              }
              if (filterObject.index === 0) {
                if (totalCount < 10) {
                  setPaginationStatus(PaginationStatus.allLoaded);
                } else {
                  setPaginationStatus(PaginationStatus.waiting);
                }
              }
            }
          }
        }
      },
      (code, error) => {
        setComments([]);
        setFirstTimeLoad(false);
        console.log('error->', error);
      },
    );
  }, [comments]);

  const postUserComment = requestObject => {
    Keyboard.dismiss();
    addUserComment(
      requestObject,
      response => {
        setIsCommenting(false);
        setIsReplayEditComment(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (data.status) {
              lastIndex = -1;
              inputValue = '';
              setCommentError('');
              setCommentText('');
              selectedOption = '';
              setTimeout(() => {
                if (postIndex !== -1) {
                  let updateData = {
                    postIndex: postIndex,
                    count: getCount() + 1,
                  };
                  dispatch(increaseComment(updateData));
                }

                handleRefresh();
              }, 200);
            } else {
            }
          }
        }
      },
      (code, error) => {
        setIsCommenting(false);
        lastIndex = -1;
        setCommentError('');
        setCommentText('');
        setIsCommenting(false);
        Alert.alert('Something went wrong', error);
      },
    );
  };

  const getCount = useCallback(() => {
    var count = 0;

    for (let i = 0; i < comments.length; i++) {
      const element = comments[i];
      if (element.children.length > 0) {
        for (let j = 0; j < element.children.length; j++) {
          count = count + 1;
        }
      }
      count = count + 1;
    }
    return count;
  }, [comments]);

  const updateUserCommentData = () => {
    let requestObject = {
      status: 2,
      commentText: commentText,
    };
    updateUserComment(
      requestObject,
      selectedPost._id,
      response => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (data.status) {
              selectedOption = '';
              inputValue = '';
              setIsCommenting(false);
              setCommentError('');
              setCommentText('');
              setIsReplayEditComment(false);

              setTimeout(() => {
                if (postIndex !== -1) {
                  let updateData = {
                    postIndex: postIndex,
                    count: getCount() - 1,
                  };
                  dispatch(increaseComment(updateData));
                }

                handleRefresh();
              }, 200);
            } else {
            }
          }
        }
      },
      (code, error) => {
        lastIndex = -1;
        setIsCommenting(false);
        setCommentError('');
        setCommentText('');
        Alert.alert('Something went wrong', error);
      },
    );
  };

  const deleteUserCommentData = () => {
    removeUserComment(
      selectedPost._id,
      response => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (data.status) {
              lastIndex = -1;
              inputValue = '';
              setCommentError('');
              setCommentText('');

              setTimeout(() => {
                if (postIndex !== -1) {
                  let updateData = {
                    postIndex: postIndex,
                    count: getCount(),
                  };
                  dispatch(increaseComment(updateData));
                }

                handleRefresh();
              }, 200);
            }
          }
        }
      },
      (code, error) => {
        lastIndex = -1;
        setCommentError('');
        setCommentText('');
        Alert.alert('Something went wrong', error);
      },
    );
  };

  const onSubmitReport = () => {
    if (reportText.trim() === '') {
      setErrorMessage({reportContent: 'This field is required'});
    } else {
      let requestData = {
        commentId: selectedPost._id,
        reportTxt: reportText,
      };
      setIsReporting(true);
      doReportComment(
        requestData,
        response => {
          setIsReporting(false);
          if (response && response !== null) {
            if (
              response.data &&
              response.data !== undefined &&
              response.data !== null
            ) {
              let responseData = response.data;
              if (responseData.status) {
                responseMessage = 'Comment reported successfully!';
              } else {
                responseMessage = 'Error while reporting!';
              }
              setShowReportModal(false);
              setShowModal(true);

              setTimeout(() => {
                setShowModal(false);
              }, 2000);
            }
          }
        },
        error => {
          responseMessage = 'Error while reporting!';
          setShowModal(true);
          setIsReporting(false);
          setTimeout(() => {
            setShowModal(false);
          }, 2000);
        },
      );
    }
  };

  /**
   *
   * API
   *
   *
   */

  const removeIndex = () => {
    Alert.alert(
      'Are you sure you want to delete it?',
      '',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Ok',
          onPress: () => {
            deleteUserCommentData();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.footerView}>
        {comments.length === totalCount && comments.length <= 10 ? (
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

  const renderItem = useCallback(({item, index}) => {
    return (
      <View key={index}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setSelectedPost(item);
            setNestingLevel('0');
            setTimeout(() => {
              lastIndex = index;
              selectedOption = '';
              if (
                refPostComments.current !== undefined &&
                refPostComments.current !== null
              ) {
                refPostComments.current.open();
              }
            }, 200);
          }}
          style={[
            grid.rowdir,
            g.bggray3,
            item.children.length > 0 ? g.mb2 : g.mb10,
            {
              borderTopLeftRadius: scale(10),
              borderBottomLeftRadius: scale(10),
              borderTopRightRadius: scale(10),
              borderBottomRightRadius: 0,
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
              {
                width: scale(40),
                height: scale(40),
                borderRadius: scale(50),
              },
            ]}>
            {item.authorId !== undefined &&
            item.authorId !== null &&
            item.authorId.profileImg !== undefined &&
            item.authorId.profileImg !== null &&
            item.authorId.profileImg !== '' ? (
              <ProgressImage
                source={{uri: item.authorId.profileImg}}
                containerStyle={styles.imageStyle}
                mode={'cover'}
              />
            ) : (
              <ProgressImage
                source={GlobalInclude.Assets.DefaultProfile}
                containerStyle={styles.imageStyle}
                mode={'cover'}
              />
            )}
          </View>
          <View style={grid.flex1}>
            <View style={[grid.rowdir]}>
              <View style={[grid.alignItemsTop, grid.col]}>
                <Text
                  style={[
                    g.fs15,
                    g.FHNM,
                    g.colorBlue,
                    GlobalInclude.AppStyle.transform,
                  ]}>
                  {item.authorId !== undefined && item.authorId !== null
                    ? `${Helper.concatName(item.authorId)} (${
                        item.authorId.batch
                      })`
                    : 'N/A'}
                </Text>
              </View>
              <Text
                style={[
                  g.fs12,
                  g.FHNR,
                  g.colorBlue,
                  grid.justifyContentCenter,
                  grid.alignItems,
                  g.txtCenterVertical,
                ]}>
                {moment(item.postedDate).fromNow()}
              </Text>
            </View>
            <Text
              style={[
                g.fs12,
                g.FHNR,
                g.colorBlack,
                g.txtCenterVertical,
                g.mt5,
                {textAlign: 'justify'},
              ]}>
              {item.commentText !== undefined &&
              item.commentText !== null &&
              item.commentText !== ''
                ? item.commentText
                : 'N/A'}
            </Text>
          </View>
        </TouchableOpacity>
        {item.children.length > 0 &&
          item.children.map((child, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if (
                    child.authorId !== undefined &&
                    child.authorId !== null &&
                    child.authorId._id === global.userId
                  ) {
                    setNestingLevel('1');
                    setSelectedPost(child);
                    lastIndex = index;
                    selectedOption = '';
                    if (
                      refPostComments.current !== undefined &&
                      refPostComments.current !== null
                    ) {
                      refPostComments.current.open();
                    }
                  }
                }}
                style={[
                  g.bggray3,
                  {
                    marginLeft: scale(20),
                    marginBottom: scale(10),
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: scale(10),
                    borderTopRightRadius: scale(10),
                    borderBottomRightRadius: scale(10),
                    paddingHorizontal: scale(6),
                    paddingTop: scale(8),
                    paddingBottom: scale(8),
                  },
                ]}>
                <View style={[grid.rowdir]}>
                  <View
                    style={[
                      g.mr10,
                      g.bggray,
                      g.oh,
                      {
                        width: scale(40),
                        height: scale(40),
                        borderRadius: scale(50),
                      },
                    ]}>
                    {child.authorId !== undefined &&
                    child.authorId !== null &&
                    child.authorId.profileImg !== undefined &&
                    child.authorId.profileImg !== null &&
                    child.authorId.profileImg !== '' ? (
                      <ProgressImage
                        source={{uri: child.authorId.profileImg}}
                        containerStyle={styles.imageStyle}
                        mode={'cover'}
                      />
                    ) : (
                      <ProgressImage
                        source={GlobalInclude.Assets.DefaultProfile}
                        containerStyle={styles.imageStyle}
                        mode={'cover'}
                      />
                    )}
                  </View>
                  <View style={grid.flex1}>
                    <View style={[grid.rowdir]}>
                      <View style={[grid.alignItemsTop, grid.col]}>
                        <Text
                          style={[
                            g.fs15,
                            g.FHNM,
                            g.colorBlue,
                            GlobalInclude.AppStyle.transform,
                          ]}>
                          {child.authorId !== undefined &&
                          child.authorId !== null
                            ? `${Helper.concatName(child.authorId)} (${
                                child.authorId.batch
                              })`
                            : 'N/A'}
                        </Text>
                      </View>
                      <Text
                        style={[
                          g.fs12,
                          g.FHNR,
                          g.colorBlue,
                          grid.justifyContentCenter,
                          grid.alignItems,
                          g.txtCenterVertical,
                        ]}>
                        {moment(child.postedDate).fromNow()}
                      </Text>
                    </View>
                    <Text
                      numberOfLines={3}
                      style={[
                        g.fs12,
                        g.FHNR,
                        g.colorBlack,
                        g.txtCenterVertical,
                        g.mt5,
                        {textAlign: 'justify'},
                      ]}>
                      {child.commentText !== undefined &&
                      child.commentText !== null &&
                      child.commentText !== ''
                        ? child.commentText
                        : 'N/A'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
      </View>
    );
  }, []);

  const showUserPostOptions = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            selectedOption = 'Edit';
            if (
              refPostComments.current !== undefined &&
              refPostComments.current !== null
            ) {
              refPostComments.current.close();
            }
            setIsReplayEditComment(true);
            setCommentText(selectedPost.commentText);
          }}
          style={[
            grid.justifyContentCenter,
            grid.alignItems,
            g.p15,
            {
              borderBottomWidth: 2,
              borderBottomColor: '#ebebe4',
            },
          ]}>
          <Text
            style={[
              g.fs18,
              g.FHNM,
              g.colorBlue,
              grid.justifyContentCenter,
              grid.alignItems,
              g.txtCenterVertical,
            ]}>
            Edit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            selectedOption = 'Remove';
            if (
              refPostComments.current !== undefined &&
              refPostComments.current !== null
            ) {
              refPostComments.current.close();
            }
            removeIndex();
          }}
          style={[grid.justifyContentCenter, grid.alignItems, g.p15]}>
          <Text
            style={[
              g.fs18,
              g.FHNM,
              g.colorBlue,
              grid.justifyContentCenter,
              grid.alignItems,
              g.txtCenterVertical,
            ]}>
            Remove Comment
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const showOtherPostOptions = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            if (
              refPostComments.current !== undefined &&
              refPostComments.current !== null
            ) {
              refPostComments.current.close();
            }
            setTimeout(() => {
              setShowReportModal(true);
            }, 250);
          }}
          style={[grid.justifyContentCenter, grid.alignItems, g.p15]}>
          <Text
            style={[
              g.fs18,
              g.FHNM,
              g.colorBlue,
              grid.justifyContentCenter,
              grid.alignItems,
              g.txtCenterVertical,
            ]}>
            Report Comment
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const postComments = () => {
    return (
      <OptionsSheet
        ref={refPostComments}
        minClosingHeight={50}
        height={
          selectedPost !== null && selectedPost.authorId._id === global.userId
            ? 320
            : 260
        }
        duration={200}
        closeOnDragDown={false}
        keyboardAvoidingViewEnabled={false}
        customStyles={{
          container: {
            backgroundColor: 'transparent',
          },
        }}>
        <View
          style={{
            backgroundColor: 'white',
            marginHorizontal: scale(10),
            borderRadius: 15,
          }}>
          {nestingLevel === '0' && (
            <TouchableOpacity
              onPress={() => {
                selectedOption = 'Replay';
                if (
                  refPostComments.current !== undefined &&
                  refPostComments.current !== null
                ) {
                  refPostComments.current.close();
                }
                setIsReplayEditComment(true);
              }}
              style={[
                grid.justifyContentCenter,
                grid.alignItems,
                g.p15,
                {borderBottomWidth: 2, borderBottomColor: '#ebebe4'},
              ]}>
              <Text
                style={[
                  g.fs18,
                  g.FHNM,
                  g.colorBlue,
                  grid.justifyContentCenter,
                  grid.alignItems,
                  g.txtCenterVertical,
                ]}>
                Reply
              </Text>
            </TouchableOpacity>
          )}
          {selectedPost !== null && selectedPost.authorId._id === global.userId
            ? showUserPostOptions()
            : showOtherPostOptions()}
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            selectedOption = '';
            if (
              refPostComments.current !== undefined &&
              refPostComments.current !== null
            ) {
              refPostComments.current.close();
            }
          }}
          style={{
            backgroundColor: 'white',
            marginHorizontal: scale(10),
            borderRadius: 15,
            marginVertical: scale(10),
          }}>
          <View style={[grid.justifyContentCenter, grid.alignItems, g.p15]}>
            <Text
              style={[
                g.fs18,
                g.FHNM,
                g.colorBlue,
                grid.justifyContentCenter,
                grid.alignItems,
                g.txtCenterVertical,
              ]}>
              Close
            </Text>
          </View>
        </TouchableOpacity>
      </OptionsSheet>
    );
  };

  const emptyComponent = useCallback(() => {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <View style={[GlobalInclude.AppStyle.fillCenter]}>
          <Text
            style={[
              g.colorBlack,
              g.FHNM,
              g.fs12,
              g.txtCenter,
              grid.alignItems,
              grid.justifyContentCenter,
            ]}>
            No Record Found
          </Text>
        </View>
      </View>
    );
  }, []);

  const renderScrollable = useCallback(
    panHandlers => (
      <View style={grid.flex1}>
        {firstTimeLoad ? (
          <View style={GlobalInclude.AppStyle.fillCenter}>
            <ActivityIndicator
              size={'small'}
              color={GlobalInclude.Color.ColorPrimary}
            />
          </View>
        ) : (
          <FlatList
            data={comments}
            extraData={comments}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            enableEmptySections
            automaticallyAdjustContentInsets={false}
            style={{flex: 1}}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: comments.length !== 0 ? undefined : 'center',
              paddingTop:
                Platform.OS === 'android'
                  ? insets.bottom + 20
                  : insets.bottom - 15,
              paddingHorizontal: scale(15),
              paddingBottom: scale(60),
            }}
            onEndReached={onEndReached}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            scrollEventThrottle={100}
            onEndReachedThreshold={0.1}
            removeClippedSubviews={Platform.OS !== 'web'}
            showsVerticalScrollIndicator={false}
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
            }}
            ListEmptyComponent={emptyComponent}
            bounces={false}
            initialNumToRender={10}
            maxToRenderPerBatch={8}
            updateCellsBatchingPeriod={100}
            initialListSize={10}
            pageSize={1}
            {...panHandlers}
          />
        )}
      </View>
    ),
    [
      insets.bottom,
      emptyComponent,
      renderItem,
      comments,
      isRefreshing,
      onEndReached,
      handleRefresh,
      firstTimeLoad,
    ],
  );

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <HeaderBar
        navigation={navigation}
        showBack={true}
        onGoBack={() => manageCommentDraft()}
      />
      <KeyboardAccessoryView
        {...{
          renderScrollable,
        }}>
        <View style={[g.mb5, g.pl10, g.pr10]}>
          <View
            style={
              isReplayEditComment
                ? [
                    g.bggray3,
                    {
                      borderTopLeftRadius: scale(10),
                      borderTopRightRadius: scale(10),
                      borderBottomLeftRadius: scale(8),
                      borderBottomRightRadius: scale(15),
                    },
                  ]
                : {}
            }>
            {isReplayEditComment && (
              <View style={[g.pl10, g.pb10, grid.rowdir]}>
                <View style={[grid.col, g.pt10]}>
                  <Text
                    style={[
                      g.fs14,
                      g.FHNB,
                      g.colorBlue,
                      grid.justifyContentCenter,
                      grid.alignItems,
                      g.txtCenterVertical,
                    ]}>
                    {selectedOption === 'Edit' ? 'Editing:' : 'Commenting On:'}
                  </Text>
                  <Text
                    style={[
                      g.fs12,
                      g.FHNM,
                      g.colorBlue,
                      grid.justifyContentCenter,
                      grid.alignItems,
                      g.txtCenterVertical,
                      g.mt5,
                    ]}
                    numberOfLines={2}>
                    {selectedPost != null && selectedPost.commentText}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    selectedOption = '';
                    setIsReplayEditComment(false);
                    setSelectedPost(null);
                  }}
                  style={{
                    width: scale(26),
                    height: scale(26),
                    borderRadius: scale(30),
                    backgroundColor: GlobalInclude.Color.ColorPrimary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: scale(5),
                    marginRight: scale(5),
                  }}>
                  <GlobalInclude.BaseIcon
                    containerStyle={{
                      height: scale(14),
                      width: scale(14),
                      justifyContent: 'center',
                    }}
                    iconColor={'#fff'}
                    iconName={'close'}
                    iconSize={scale(14)}
                    iconType={IconType[6]}
                  />
                </TouchableOpacity>
              </View>
            )}
            <View
              style={[grid.rowrow, grid.justifyContentCenter, grid.alignItems]}>
              <TextInput
                underlineColorAndroid={'transparent'}
                style={[
                  grid.flex1,
                  g.mr5,
                  {
                    backgroundColor: '#f8f8f8',
                    fontSize: scale(12),
                    borderRadius: scale(8),
                    fontFamily: 'Lato-Regular',
                    justifyContent: 'center',
                    textAlignVertical: 'center',
                    minHeight: scale(40),
                    padding: scale(10),
                  },
                ]}
                keyboardType={'default'}
                autoCapitalize={'sentences'}
                returnKeyType={'done'}
                value={commentText}
                multiline={true}
                placeholder={'Add/Paste Comment'}
                onChangeText={value => {
                  setCommentText(value);
                  setCommentError('');
                  inputValue = value;
                }}
              />

              <TouchableOpacity
                onPress={() => {
                  if (commentText.trim() === '') {
                    setCommentError('This field is required!');
                  } else {
                    setIsCommenting(true);
                    if (selectedOption === '') {
                      let requestObject = {
                        postId: filterObject.postId,
                        depth: 0,
                        parentId: '',
                        commentText: commentText,
                      };
                      postUserComment(requestObject);
                    } else if (selectedOption === 'Replay') {
                      let requestObject = {
                        postId: filterObject.postId,
                        depth: parseInt(selectedPost.depth, 10) + 1,
                        parentId: selectedPost._id,
                        commentText: commentText,
                      };
                      postUserComment(requestObject);
                    } else if (selectedOption === 'Edit') {
                      updateUserCommentData();
                    }
                  }
                }}
                style={styles.commentButton}>
                {isCommenting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(20), width: scale(20)}}
                    iconColor={'#FFF'}
                    iconName={'send-o'}
                    iconSize={scale(20)}
                    iconType={IconType[4]}
                  />
                )}
              </TouchableOpacity>
            </View>
            {commentError &&
            commentError !== null &&
            commentError.length > 0 ? (
              <Text style={g.errorMsg}>{commentError}</Text>
            ) : null}
          </View>
        </View>
      </KeyboardAccessoryView>
      {postComments()}
      <Modal
        transparent={true}
        animationType="fade"
        supportedOrientations={['landscape', 'portrait']}
        onRequestClose={() => {
          setShowReportModal(false);
        }}
        visible={showReportModal}>
        <View style={[g.bgBlack, grid.flex1, g.p15, {paddingTop: '25%'}]}>
          <View style={grid.col}>
            <View style={[g.bgWhite, g.p15, g.br3]}>
              <View
                style={[
                  grid.rowdir,
                  grid.justifyContentRight,
                  grid.alignItemsBottom,
                ]}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setShowReportModal(false);
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
              <TextInput
                maxLength={200}
                placeholder={'Write Text Here'}
                underlineColorAndroid="transparent"
                multiline={true}
                returnKeyType="done"
                blurOnSubmit={true}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
                style={[
                  g.mt10,
                  g.bgWhite,
                  g.textareaStyle,
                  {minHeight: 100, maxHeight: 100, height: 100},
                ]}
                onChangeText={comment => {
                  setReportText(comment);
                  setErrorMessage({});
                }}
              />
              {errorMessage.reportContent &&
                errorMessage.reportContent.length > 0 && (
                  <Text style={[g.errorMsg, g.pt5]}>
                    {errorMessage.reportContent}
                  </Text>
                )}
              <View style={[grid.rowdir, g.pt10, grid.justifyContentRight]}>
                {isReporting ? (
                  <ActivityIndicator size="large" color="#666666" />
                ) : (
                  <Text style={g.btn} onPress={() => onSubmitReport()}>
                    {'Submit'}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {showModal && (
        <Modal
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setShowModal(!showModal);
          }}
          hardwareAccelerated={true}
          visible={showModal}>
          <View style={styles.centeredView}>
            <View style={styles.responseMessage}>
              <Text style={styles.headerText}>{responseMessage}</Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  imageStyle: {
    aspectRatio: 1 / 1,
    alignSelf: 'center',
    width: scale(40),
    justifyContent: 'center',
  },
  iconContainer: {
    width: scale(22),
    height: scale(22),
    borderRadius: scale(22),
    elevation: 1,
  },
  footerView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  commentButton: {
    height: scale(40),
    width: scale(40),
    borderRadius: scale(45),
    backgroundColor: GlobalInclude.Color.ColorPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'rgba(62,62,62,0.5)',
    flex: 1,
    width: '100%',
  },
  responseMessage: {
    width: displayWidth - 50,
    backgroundColor: 'white',
    borderRadius: scale(6),
    padding: scale(7),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: scale(60),
    alignContent: 'center',
  },
  headerText: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: scale(16),
    textAlign: 'center',
    ...g.FHNR,
    ...g.colorBlue,
  },
});

export default Comments;
