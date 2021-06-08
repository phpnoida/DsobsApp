import React, {useState, useEffect} from 'react';
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
  LayoutAnimation,
  Animated,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
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
} from '../../Actions/TickerActions';
import {
  SwipeableFlatList,
  SwipeableQuickActionButton,
  SwipeableQuickActions,
} from 'react-native-swipe-list';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
};
let filterObject = {
  index: 0,
  size: 10,
};
let commentId = '';
let lastIndex = -1;
let totalCount = 0;

const Comments = ({postId, navigation}) => {
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    commentId = '';
    lastIndex = -1;
    totalCount = 0;

    console.log('focus', postId);
    if (global.isConnected) {
      resetCount();
      if (global.isConnected) {
        getCommentsList();
      } else {
        setFirstTimeLoad(false);
      }
    }

    return () => {};
  }, [postId, navigation]);

  /**
   *
   * Pagination
   *
   */
  const onPaginate = () => {
    if (paginationStatus !== PaginationStatus.allLoaded && !isRefreshing) {
      console.log('onPaginate()');
      setPaginationStatus(PaginationStatus.waiting);
      filterObject.index = filterObject.index + 1;
      getCommentsList();
    }
  };

  const onEndReached = () => {
    console.log('onEndReached()');
    if (comments.length === totalCount || comments.length < 10) {
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
    getCommentsList();
  };

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
  const getCommentsList = () => {
    getComments(
      filterObject,
      (response) => {
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
                    commentList.push(items[key]);
                  }
                }
                if (filterObject.index === 0) {
                  totalCount = data.totalCount;
                  setComments([...commentList]);
                } else {
                  setComments([...comments, ...commentList]);
                }
              }
              setPaginationStatus(PaginationStatus.waiting);
            }
          }
        }
      },
      (code, error) => {
        console.log('====================================');
        console.log('code', code, error);
        console.log('====================================');
        setComments([]);
        setFirstTimeLoad(false);
        console.log('error->', error);
      },
    );
  };

  const postUserComment = () => {
    let requestObject = {
      postId: filterObject.postId,
      depth: 0,
      parentId: '',
      commentText: commentText,
    };
    Keyboard.dismiss();
    addUserComment(
      requestObject,
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (data.status) {
              lastIndex = -1;
              commentId = '';
              setCommentError('');
              setCommentText('');
              setIsCommenting(false);
              Alert.alert('Congratulations', 'Comment added successfully');

              setTimeout(() => {
                handleRefresh();
              }, 200);
            } else {
            }
          }
        }
      },
      (code, error) => {
        lastIndex = -1;
        commentId = '';
        setCommentError('');
        setCommentText('');
        setIsCommenting(false);
        Alert.alert('Something went wrong', error);
      },
    );
  };

  const updateUserCommentData = () => {
    let requestObject = {
      status: 2,
      commentText: commentText,
    };
    updateUserComment(
      requestObject,
      commentId,
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (data.status) {
              let commentList = comments;
              let item = commentList[lastIndex];
              item.commentText = commentText;
              setComments([...commentList]);
              lastIndex = -1;
              commentId = '';
              setCommentError('');
              setCommentText('');
              Alert.alert('Congratulations', 'Comment updated successfully');
            } else {
            }
          }
        }
      },
      (code, error) => {
        lastIndex = -1;
        commentId = '';
        setCommentError('');
        setCommentText('');
        Alert.alert('Something went wrong', error);
      },
    );
  };

  const deleteUserCommentData = () => {
    removeUserComment(
      commentId,
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (data.status) {
              let commentList = comments;

              commentList.splice(lastIndex, 1);
              setComments([...commentList]);

              lastIndex = -1;
              commentId = '';
              setCommentError('');
              setCommentText('');
              Alert.alert('Congratulations', 'Comment removed successfully');
            }
          }
        }
      },
      (code, error) => {
        lastIndex = -1;
        commentId = '';
        setCommentError('');
        setCommentText('');
        Alert.alert('Something went wrong', error);
      },
    );
  };

  /**
   *
   * API
   *
   *
   */

  const RightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0.7, 0],
    });
    return (
      <>
        <TouchableOpacity onPress={() => alert('Delete button pressed')}>
          <View
            style={{flex: 1, backgroundColor: 'red', justifyContent: 'center'}}>
            <Animated.Text
              style={{
                color: 'white',
                paddingHorizontal: 10,
                fontWeight: '600',
                transform: [{scale}],
              }}>
              Delete
            </Animated.Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert('Archive button pressed')}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'green',
              justifyContent: 'center',
            }}>
            <Animated.Text
              style={{
                color: 'white',
                paddingHorizontal: 10,
                fontWeight: '600',
                transform: [{scale}],
              }}>
              Archive
            </Animated.Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };

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
        {comments.length === totalCount ? (
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

  const renderItem = ({item, index}) => {
    return (
      <Swipeable renderRightActions={RightActions}>
        <View style={[grid.rowdir, g.mb10]} key={index}>
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
                <Text style={[g.fs15, g.FHNM, g.colorBlue]}>
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
              numberOfLines={3}
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
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={grid.flex1}>
      <View style={grid.flex1}>
        <View style={[grid.rowdir, grid.alignItems]}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={{
              marginHorizontal: scale(3),
            }}>
            <GlobalInclude.BaseIcon
              containerStyle={{height: scale(36), width: scale(36)}}
              iconColor={GlobalInclude.Color.ColorPrimary}
              iconName={'comment'}
              iconSize={scale(36)}
              iconType={IconType[8]}
            />
          </TouchableOpacity>
          <View style={[grid.justifyContentCenter, grid.alignItems]}>
            <Text
              style={[
                g.fs14,
                g.FHNM,
                g.colorBlue,
                grid.justifyContentCenter,
                grid.alignItems,
              ]}>
              Comments
            </Text>
          </View>
        </View>
        {firstTimeLoad ? (
          <View style={GlobalInclude.AppStyle.fillCenter}>
            <ActivityIndicator
              size={'small'}
              color={GlobalInclude.Color.ColorPrimary}
            />
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            extraData={comments}
            data={comments}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={0.1}
            onEndReached={onEndReached}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            ListEmptyComponent={renderNoDataComponent}
            ListFooterComponent={renderFooter}
            contentContainerStyle={{
              paddingBottom: scale(70),
              paddingTop: scale(20),
            }}
          />
        )}
      </View>
      <View style={g.mb10}>
        <View style={[grid.rowrow, grid.justifyContentCenter, grid.alignItems]}>
          <TextInput
            underlineColorAndroid={'transparent'}
            style={[g.inputWhite, grid.flex1, g.mr5]}
            keyboardType={'default'}
            autoCapitalize={'none'}
            returnKeyType={'done'}
            value={commentText}
            placeholder={'Add/Paste Comment'}
            onChangeText={(value) => {
              setCommentText(value);
              setCommentError('');
            }}
          />

          <TouchableOpacity
            onPress={() => {
              if (commentText.trim() === '') {
                setCommentError('This field is required!');
              } else {
                setIsCommenting(true);
                postUserComment();
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
        {commentError && commentError !== null && commentError.length > 0 ? (
          <Text style={g.errorMsg}>{commentError}</Text>
        ) : null}
      </View>
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
});

export default Comments;
