import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  Dimensions,
  Animated,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import HeaderBar from '../../component/HeaderBar';
import OptionsSheet from 'react-native-raw-bottom-sheet';
import {generateMenuOption} from '../../component/Common';
import {renderNoDataComponent} from '../../component/Common';
import Likes from './Likes';
import {
  doGetMypost,
  doDeletePost,
  doFitlerPost,
} from '../../Actions/TickerActions';
import PostFeedCard from '../../component/PostFeedCard';
import ImageViewer from 'react-native-image-zoom-viewer';
import DocViewer from '../../component/DocViewer';
import {IconType} from '../../helper/Constants';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {
  clearIncreaseComment,
  refreshPreviousScreen,
} from '../../reducer/NotificationReducer';
import {StackActions} from '@react-navigation/native';

const {height: displayHeight} = Dimensions.get('window');
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
let postMode = '';
let selectedIndex = -1;
let responseMessage = '';
let searchVal = '';
let imageArray = [];
let dataSourceCords = [];
let documentItem = '';
let commentUpddate = null;
let selectedUserId = '';

const MyPreviousPost = ({route, navigation}) => {
  const refPostOptions = useRef();
  const refPostLikes = useRef();
  const refFlatList = useRef();

  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const [postContent, setPostContent] = useState([]);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [showImageViewer, setshowImageViewer] = useState(false);
  const [showDocViewer, setShowDocViewer] = useState(false);
  const [postTitle, setPostTitle] = useState('My Post(s)');
  const dispatch = useDispatch();

  const refreshState = useSelector((state) => {
    if (state.notification && state.notification !== undefined) {
      let notification = state.notification;
      if (
        notification.commentUpdate &&
        notification.commentUpdate !== undefined
      ) {
        //{"commentData": {"count": 4, "postIndex": 0}, "commentUpdate": true, "refresh": false}
        if (
          notification.commentData &&
          notification.commentData !== null &&
          notification.commentData !== undefined
        ) {
          commentUpddate = notification.commentData;
        }
        return true;
      }
    }
    return false;
  }, shallowEqual);

  useEffect(() => {
    if (refreshState) {
      let oldData = postContent;
      if (commentUpddate !== undefined && commentUpddate !== null) {
        let postIndex = commentUpddate.postIndex;
        let count = commentUpddate.count;
        oldData[postIndex].totalComments = count;
      }

      setTimeout(() => {
        dispatch(clearIncreaseComment());
        setTimeout(() => {
          setPostContent([...oldData]);
        }, 100);
      }, 200);
    }
    return () => {};
  }, [refreshState]);

  useEffect(() => {
    selectedUserId = '';
    if (route.params !== undefined && route.params !== null) {
      selectedUserId = route.params.userId;
      setPostTitle(route.params.title);
    }
    postMode = '';
    const unsubscribe = navigation.addListener('focus', () => {
      if (global.isConnected) {
        postMode = '';
        resetCount();
        if (selectedUserId === global.userId) {
          getMyTickers(filterObject);
        } else {
          postMode = '';
          filterObject.authorId = selectedUserId;
          getTickerPost(filterObject);
        }
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

  const getMyTickers = (requestObj) => {
    doGetMypost(
      (response) => {
        manageResponse(response);
      },
      (code, error) => {
        setIsRefreshing(false);
        setFirstTimeLoad(false);
        setPostContent([]);
        console.log('error->', error);
      },
    );
  };

  const manageResponse = (response) => {
    setIsRefreshing(false);
    if (response && response !== null) {
      if (
        response.data &&
        response.data !== undefined &&
        response.data !== null
      ) {
        let data = response.data;

        if (data.status) {
          let item = data.data[0];
          if (postMode !== '') {
            if (postMode === 'edit') {
              postMode = '';
              navigation.navigate('PostTicker', {
                data: {inEditMode: true, data: item},
              });
            }
          } else {
            if (filterObject.index === 0) {
              totalCount = data.totalCount;
              setPostContent([...data.data]);
            } else {
              setPostContent([...postContent, ...data.data]);
            }
            setPaginationStatus(PaginationStatus.waiting);

            if (selectedIndex !== -1) {
              if (dataSourceCords.length > selectedIndex) {
                setTimeout(() => {
                  refFlatList.current.scrollToOffset({
                    offset: dataSourceCords[selectedIndex],
                    animated: false,
                  });
                  selectedIndex = -1;
                }, 0);
              }
            }
          }
        }
      }
    }
    setFirstTimeLoad(false);
  };

  const getTickerPost = (requestObj) => {
    global.loader_ref.show_loader(1);
    doFitlerPost(
      requestObj,
      (response) => {
        global.loader_ref.show_loader(0);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              let item = data.data[0];
              if (postMode === 'edit') {
                postMode = '';
                navigation.navigate('PostTicker', {
                  data: {inEditMode: true, data: item},
                });
              } else {
                manageResponse(response);
              }
            }
          }
        }
      },
      (code, error) => {
        global.loader_ref.show_loader(0);
        console.log('error->', error);
      },
    );
  };

  const deletePost = () => {
    doDeletePost(
      selectedFeed._id,
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
              setSelectedFeed(null);
              setTimeout(() => {
                handleRefresh();
              }, 230);
            }
          }
        }
      },
      (code, error) => {
        setSelectedFeed(null);
        Alert.alert('Something went wrong', error);
      },
    );
  };

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
      if (
        filterObject.authorId &&
        filterObject.authorId !== undefined &&
        filterObject.authorId !== null
      ) {
        getTickerPost(filterObject);
      } else {
        getMyTickers(filterObject);
      }
    }
  };

  const onEndReached = () => {
    console.log('onEndReached()');
    if (postContent.length === totalCount || postContent.length < 10) {
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
    getMyTickers(filterObject);
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
            deletePost();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.footerView}>
        {postContent.length === totalCount ? (
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

  const postOptions = () => {
    return (
      <OptionsSheet
        ref={refPostOptions}
        minClosingHeight={50}
        height={250}
        duration={200}
        closeOnDragDown={true}
        customStyles={{
          container: GlobalInclude.AppStyle.sheetContainer,
        }}>
        <View stylre={[grid.flex1, g.mb10]}>
          {selectedFeed !== null &&
            generateMenuOption('Edit Post', 'edit', 4, () => {
              refPostOptions.current.close();
              postMode = 'edit';
              setTimeout(() => {
                resetCount();
                filterObject.id = selectedFeed._id;
                getTickerPost(filterObject);
              }, 220);
            })}

          {selectedFeed !== null &&
            generateMenuOption('Delete Post', 'delete', 1, () => {
              refPostOptions.current.close();
              setTimeout(() => {
                removeIndex();
              }, 220);
            })}
        </View>
      </OptionsSheet>
    );
  };

  const postLikes = () => {
    return (
      <OptionsSheet
        ref={refPostLikes}
        minClosingHeight={50}
        height={
          Platform.OS === 'ios' ? displayHeight - 100 : displayHeight - 64
        }
        duration={200}
        closeOnDragDown={true}
        // onClose={() => {
        //   resetCount();
        //   getMyTickers(filterObject);
        // }}
        onClose={() => {
          let oldData = postContent;
          oldData[selectedIndex] = selectedFeed;
          setPostContent([...oldData]);
        }}
        customStyles={{
          container: GlobalInclude.AppStyle.sheetContainer,
        }}>
        {selectedFeed !== null && (
          <Likes
            postId={selectedFeed._id}
            navigation={navigation}
            onStatusChange={(status) => {
              if (
                selectedFeed.totalLikes !== undefined &&
                selectedFeed.totalLikes !== null
              ) {
                selectedFeed.totalLikes = status
                  ? selectedFeed.totalLikes + 1
                  : selectedFeed.totalLikes - 1;
              }
            }}
            onClickUser={(userId) => {
              refPostLikes.current.close();
              setTimeout(() => {
                navigation.navigate('UserProfile', {
                  userId: userId,
                });
              }, 350);
            }}
          />
        )}
      </OptionsSheet>
    );
  };

  const renderItem = ({item, index}) => (
    <PostFeedCard
      feedType={item.author.id === global.userId ? 'Main' : 'Other'}
      navigation={navigation}
      itemIndex={index}
      postId={item._id}
      author={item.author}
      status={item.status}
      postedAt={item.postedAt}
      categoryId={item.categoryId}
      categoryMsg={item.categoryMsg}
      title={item.title}
      linkHost={item.linkHost}
      fullUrl={item.fullUrl}
      colorCode={item.colorCode}
      body={item.body}
      links={item.links}
      totalLikes={item.totalLikes}
      totalComments={item.totalComments}
      item={item}
      onLayout={(event) => {
        const layout = event.nativeEvent.layout;
        dataSourceCords[index] = layout.y;
      }}
      onClickUser={() => {
        if (item.author !== undefined && item.author !== null) {
          navigation.navigate('UserProfile', {
            userId: item.author.id,
          });
        }
      }}
      onItemCallback={(post, clickIndex) => {
        imageArray = [];
        console.log('post[clickIndex].type', post[clickIndex]);
        if (post[clickIndex].type === 3) {
          documentItem = post[clickIndex].file;
          setShowDocViewer(true);
        } else {
          post.map((child, indx) => {
            if (child.type === 1) {
              imageArray.push({url: child.file, key: indx});
            }
          });
          if (imageArray.length > 0) {
            setshowImageViewer(true);
          }
        }
      }}
      onClickPostOptions={() => {
        setSelectedFeed(item);
        if (
          refPostOptions.current !== undefined &&
          refPostOptions.current !== null
        ) {
          refPostOptions.current.open();
        }
      }}
      onClickMediaOption={(type) => {
        selectedIndex = index;
        if (type === 1) {
          //getPostLikeDetail(item._id);
          setSelectedFeed(item);

          setTimeout(() => {
            if (
              refPostLikes.current !== undefined &&
              refPostLikes.current !== null
            ) {
              refPostLikes.current.open();
            }
          }, 200);
        } else if (type === 2) {
          navigation.navigate('Comments', {
            data: {postId: item._id, postIndex: index},
          });
        }
      }}
    />
  );

  const keyExtractor = (item, index) => index;

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <HeaderBar
        title={postTitle}
        navigation={navigation}
        showBack={true}
        onGoBack={() => {
          //dispatch(refreshPreviousScreen());
          setTimeout(() => {
            navigation.dispatch(StackActions.replace('CommonRoom'));
          }, 100);
        }}
      />

      <SafeAreaView style={GlobalInclude.AppStyle.fill}>
        <View style={GlobalInclude.AppStyle.fill}>
          {firstTimeLoad ? (
            <View style={GlobalInclude.AppStyle.fillCenter}>
              <ActivityIndicator
                size={'small'}
                color={GlobalInclude.Color.ColorPrimary}
              />
            </View>
          ) : (
            <View style={[GlobalInclude.AppStyle.fill, g.bggray3]}>
              {postContent.length === 0 ? (
                renderNoDataComponent()
              ) : (
                <Animated.FlatList
                  ref={refFlatList}
                  removeClippedSubviews={Platform.OS !== 'web'}
                  showsVerticalScrollIndicator={false}
                  extraData={postContent}
                  data={postContent}
                  renderItem={renderItem}
                  keyExtractor={keyExtractor}
                  onEndReachedThreshold={0.1}
                  onEndReached={onEndReached}
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  ListEmptyComponent={renderNoDataComponent}
                  ListFooterComponent={renderFooter}
                  scrollEventThrottle={16}
                  contentContainerStyle={{
                    paddingBottom: scale(130),
                    paddingTop: scale(5),
                  }}
                />
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
      {postOptions()}
      {postLikes()}

      <Modal
        transparent={true}
        animationType="fade"
        supportedOrientations={['landscape', 'portrait']}
        onRequestClose={() => {
          setshowImageViewer(false);
        }}
        visible={showImageViewer}>
        <View style={[styles.modalView, g.bgBlack]}>
          <View
            style={{
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              alignSelf: 'flex-end',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={() => {
                setshowImageViewer(false);
              }}
              style={[styles.buttonCircle, {marginHorizontal: scale(8)}]}>
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(22), width: scale(22)}}
                iconColor={'#FFF'}
                iconName={'closecircleo'}
                iconSize={scale(22)}
                iconType={IconType[10]}
              />
            </TouchableOpacity>
          </View>

          <ImageViewer
            imageUrls={imageArray}
            enablePreload={true}
            backgroundColor={'#000'}
            renderIndicator={() => {
              <View />;
            }}
          />
        </View>
      </Modal>
      {/* doc viewer */}
      {showDocViewer && (
        <DocViewer
          mediaContent={documentItem}
          onClose={() => {
            setShowDocViewer(false);
          }}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  totalComments: {
    position: 'absolute',
    top: -1,
    left: -1,
    borderRadius: scale(30),
    height: scale(22),
    width: scale(22),
  },
  totalLikes: {
    position: 'absolute',
    top: -1,
    left: -1,
    borderRadius: scale(30),
    height: scale(22),
    width: scale(22),
  },
});

export default MyPreviousPost;
