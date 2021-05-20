import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import ProgressImage from '../../../component/ProgresImage';
import {IconType} from '../../../helper/Constants';
import Helper from '../../../helper/Helper';
import moment from 'moment';
import {renderNoDataComponent} from '../../../component/Common';

import {
  getComments,
  addUserComment,
  updateUserComment,
  removeUserComment,
} from '../../../Actions/SocialVenturesActions';

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

const Comments = ({ventureId, navigation}) => {
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [comments, setComments] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    commentId = '';
    lastIndex = -1;
    totalCount = 0;

    console.log('focus', ventureId);
    if (global.isConnected) {
      resetCount();
      filterObject.ventureId = ventureId;
      if (global.isConnected) {
        getCommentsList();
      } else {
        setFirstTimeLoad(false);
      }
    }

    return () => {};
  }, [ventureId, navigation]);

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
    setIsRefreshing(true);
  };

  const resetCount = () => {
    totalCount = 0;
    filterObject = {};
    filterObject.index = 0;
    filterObject.size = 10;
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
      ventureId: filterObject.ventureId,
      depth: 0,
      parentId: '',
      commentText: commentText,
    };
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
              let commentList = comments;
              let detail = {};

              detail._id = global.userDetails._id;
              detail.profileImg = global.userDetails.profileImg;
              detail.lastName = global.userDetails.lastName;
              detail.batch = global.userDetails.batch;
              detail.firstName = global.userDetails.firstName;

              let item = data.data;
              item.authorId = detail;
              commentList.splice(0, 0, item);
              setComments([...commentList]);
              lastIndex = -1;
              commentId = '';
              setCommentError('');
              setCommentText('');
              hideModal();
              Alert.alert('Congratulations', 'Comment added successfully');
            } else {
              hideModal();
            }
          }
        }
      },
      (code, error) => {
        lastIndex = -1;
        commentId = '';
        setCommentError('');
        setCommentText('');
        hideModal();
        Alert.alert('Something went wrong', error);
      },
    );
  };

  const hideModal = () => {
    setIsCommenting(false);
    setShowCommentModal(false);
    setCommentText('');
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
              hideModal();
              Alert.alert('Congratulations', 'Comment updated successfully');
            } else {
              hideModal();
            }
          }
        }
      },
      (code, error) => {
        lastIndex = -1;
        commentId = '';
        setCommentError('');
        setCommentText('');
        hideModal();
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
      <TouchableOpacity
        style={g.mb10}
        key={index}
        onLongPress={
          global.userId === item.authorId._id
            ? () => {
                lastIndex = index;
                commentId = item._id;
                setCommentError('');
                setCommentText(item.commentText);
                setShowOptions(true);
              }
            : null
        }>
        <View style={[g.mb5, grid.rowdir]}>
          <View
            style={[
              g.mr10,
              g.bggray,
              g.oh,
              {width: scale(35), height: scale(35), borderRadius: scale(50)},
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
            <View style={grid.rowrow}>
              <Text style={[g.fs15, g.FHNM, g.colordarkGray, grid.col, g.mr5]}>
                {item.authorId !== undefined && item.authorId !== null
                  ? `${Helper.concatName(item.authorId)} (${
                      item.authorId.batch
                    })`
                  : 'N/A'}
              </Text>
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
            <Text style={[g.fs13, g.FHNR, g.colorLightGray, g.mt5]}>
              {item.commentText !== undefined &&
              item.commentText !== null &&
              item.commentText !== ''
                ? item.commentText
                : 'N/A'}
            </Text>
            {/* {global.userId === item.authorId._id ? (
              <View style={[grid.rowdir, g.mb5, grid.justifyContentRight]}>
                <TouchableOpacity
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 0}}
                  activeOpacity={0.8}
                  onPress={() => {}}
                  style={[
                    grid.rowdir,
                    grid.alignItems,
                    grid.justifyContentCenter,
                    g.bgBlue,
                    g.mr10,
                    styles.iconContainer,
                  ]}>
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(12), width: scale(12)}}
                    iconColor={'#fff'}
                    iconName={'pencil'}
                    iconSize={scale(12)}
                    iconType={IconType[4]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                  activeOpacity={0.8}
                  onPress={() => {
                    commentId = item._id;
                    lastIndex = index;
                    removeIndex();
                  }}
                  style={[
                    grid.rowdir,
                    grid.alignItems,
                    grid.justifyContentCenter,
                    g.bgBlue,
                    styles.iconContainer,
                  ]}>
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(12), width: scale(12)}}
                    iconColor={'#fff'}
                    iconName={'close'}
                    iconSize={scale(12)}
                    iconType={IconType[4]}
                  />
                </TouchableOpacity>
              </View>
            ) : null} */}
          </View>
        </View>
        <View style={{borderBottomWidth: 0.5, borderBottomColor: '#e5e5e5'}} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.pl15, g.pr15]}>
      <View style={[grid.rowdir, grid.justifyContentRight, g.mb10]}>
        <Text
          style={g.btn}
          onPress={() => {
            setShowCommentModal(true);
          }}>
          {'Submit your comments'}
        </Text>
      </View>
      {firstTimeLoad ? (
        <View style={GlobalInclude.AppStyle.fillCenter}>
          <ActivityIndicator size={'small'} color={'#2b3252'} />
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
          contentContainerStyle={{paddingBottom: scale(70)}}
        />
      )}

      <Modal
        transparent={true}
        visible={showCommentModal}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {
          setShowCommentModal(false);
        }}>
        <ScrollView
          contentContainerStyle={[
            g.bgBlack,
            grid.flex1,
            g.p15,
            {paddingTop: '25%'},
          ]}>
          <View style={grid.col}>
            <View style={[g.bgWhite, g.p15, g.br3]}>
              <View style={[grid.justifyContentRight, grid.rowdir]}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setShowCommentModal(false);
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
              <Text style={[g.fs12, g.FHNR, g.mb5, g.pt10]}>
                {commentId !== '' ? 'Update Your Comment' : 'Post Your Comment'}
              </Text>
              <TextInput
                maxLength={1500}
                placeholder={'Write Text Here'}
                underlineColorAndroid="transparent"
                multiline={true}
                value={commentText}
                autoFocus
                style={[
                  g.mt10,
                  g.bgWhite,
                  g.textareaStyle,
                  {minHeight: 160, maxHeight: 160, height: 160},
                ]}
                onChangeText={(comment) => {
                  setCommentText(comment);
                }}
              />
              <Text style={[g.fs12, g.FHNR, g.mb5, g.pt10, g.txtRight]}>
                {`Max 1000 characters: ${commentText.length}`}
              </Text>
              {commentError &&
              commentError !== null &&
              commentError.length > 0 ? (
                <Text style={g.errorMsg}>{commentError}</Text>
              ) : null}
              <View style={[grid.rowdir, g.mt10]}>
                <View style={[g.btn, g.mr5, {width: scale(130)}]}>
                  {isCommenting ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text
                      style={[g.fs12, g.FHNR, g.txtCenter, g.colorWhite]}
                      onPress={() => {
                        if (
                          commentText.length === 0 ||
                          commentText.trim() === ''
                        ) {
                          setCommentError('This field is required!');
                        } else {
                          setIsCommenting(true);
                          if (commentId !== '') {
                            updateUserCommentData();
                          } else {
                            postUserComment();
                          }
                        }
                      }}>
                      {commentId !== '' ? 'Update Comment' : 'Post Comment'}
                    </Text>
                  )}
                </View>

                <Text
                  style={[g.btn, g.bggray, g.fs12]}
                  onPress={() => {
                    setShowCommentModal(false);
                  }}>
                  Cancel
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>

      {showOptions && (
        <GlobalInclude.ModalAlert
          status={showOptions}
          okButton={'Edit'}
          cancelButton={'Delete'}
          okAction={() => {
            setShowOptions(false);
            setShowCommentModal(true);
          }}
          cancelAction={() => {
            setShowOptions(false);
            removeIndex();
          }}
          closeAction={() => {
            setShowOptions(false);
          }}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  imageStyle: {
    aspectRatio: 1 / 1,
    alignSelf: 'center',
    width: scale(35),
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
});
export default Comments;
