import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Platform,
  Dimensions,
  Animated,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import HeaderBar from '../../component/HeaderBar';
import {IconType} from '../../helper/Constants';
import OptionsSheet from 'react-native-raw-bottom-sheet';
import {generateMenuOption} from '../../component/Common';
import ProgressImage from '../../component/ProgresImage';
import moment from 'moment';
import Helpers from '../../helper/Helper';
import FitImage from '../../component/FitImage';
import {ScrollView} from 'react-native';
import {showUser} from '../../component/Common';
import {renderNoDataComponent} from '../../component/Common';
import Comments from './Comments';
import {
  doGetMypost,
  getPostLikes,
  doLikePost,
  doDislikePost,
} from '../../Actions/TickerActions';
import MoreInfo from '../../component/MoreInfo';
import FlatListSlider from '../../component/FlatListSlider';
import SliderImage from '../../component/SliderImage';

const {height: displayHeight, width: displayWidth} = Dimensions.get('window');

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
let selectedPostId = '';
let postMode = '';
let selectedIndex = -1;
let dataSourceCords = [];

function showMediaIcon(status, iconName, iconType, label, onPress) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      disabled={status === 2}
      style={[grid.rowrow, grid.alignItems, grid.justifyContentCenter]}>
      <GlobalInclude.BaseIcon
        containerStyle={{height: scale(28), width: scale(28)}}
        iconColor={status === 2 ? '#ebebe4' : GlobalInclude.Color.ColorPrimary}
        iconName={iconName}
        iconSize={scale(28)}
        iconType={IconType[iconType]}
      />
      <Text
        style={[
          g.fs13,
          g.FHNM,
          status === 2 ? g.colorDisabled : g.colorBlue,
          grid.alignItems,
          grid.justifyContentCenter,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function PostFeed({
  index: itemIndex,
  item: {body, totalComments, author, postedAt, status, imageLinks},
  onClickPostOptions,
  onClickMediaOption,
  onClickUser,
  onLayout,
}) {
  return useMemo(() => {
    return (
      <View
        onLayout={onLayout}
        style={[itemIndex === 0 ? g.mt0 : g.mt15, g.bgWhite, g.pb7]}
        key={itemIndex}>
        <View style={[grid.justifyContentCenter, {borderRadius: scale(10)}]}>
          {/* User Row */}
          <View style={[grid.rowdir, g.p10, g.pl5, g.pr5]}>
            <TouchableOpacity
              style={grid.row}
              activeOpacity={0.9}
              onPress={onClickUser}>
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
                {author.profileImg !== undefined &&
                author.profileImg !== null &&
                author.profileImg !== '' ? (
                  <ProgressImage
                    source={{uri: author.profileImg}}
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
              {author !== undefined && author !== null && (
                <View style={[grid.justifyContentCenter, grid.flex1]}>
                  <View style={grid.rowdir}>
                    <View style={[grid.col]}>
                      <Text style={[g.fs15, g.FHNM, g.colorBlue]}>
                        {`${Helpers.concatName(author)} - ${author.batch}`}
                      </Text>
                    </View>

                    {status !== 2 && (
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={onClickPostOptions}
                        style={[
                          g.mr7,
                          grid.justifyContentCenter,
                          grid.alignItems,
                        ]}>
                        <GlobalInclude.BaseIcon
                          containerStyle={{height: scale(22), width: scale(22)}}
                          iconColor={GlobalInclude.Color.ColorPrimary}
                          iconName={'dots-three-horizontal'}
                          iconSize={scale(22)}
                          iconType={IconType[9]}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text
                    style={[
                      g.fs14,
                      g.FHNR,
                      g.colorBlack,
                      grid.justifyContentCenter,
                      grid.alignItems,
                      g.txtCenterVertical,
                      g.mt5,
                    ]}>
                    {moment(postedAt * 1000).fromNow()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* User Row */}

          {/* Post Content */}

          {/* Post message */}

          {status === 2 ? (
            <View style={styles.emptyArea}>
              <Text
                style={[
                  g.fs18,
                  g.FHNM,
                  g.colorBlack,
                  grid.justifyContentCenter,
                  grid.alignItems,
                ]}>
                {body}
              </Text>
            </View>
          ) : (
            <View>
              {body !== undefined && body !== null && body !== '' ? (
                <MoreInfo text={body} linesToTruncate={3} />
              ) : null}
            </View>
          )}

          {/* Post message */}

          {/* Post Image */}
          {imageLinks.length > 0 ? (
            <View>
              {imageLinks.length > 1 ? (
                <FlatListSlider
                  data={imageLinks}
                  component={<SliderImage />}
                  autoscroll={false}
                />
              ) : (
                <FitImage source={{uri: imageLinks[0]}} />
              )}
            </View>
          ) : null}
          {/*  */}

          {/* Post Content */}

          {/* Post operations */}
          <View style={[grid.rowdir, g.mt8]}>
            <View
              style={[grid.row, grid.alignItems, grid.justifyContentCenter]}>
              {showMediaIcon(status, 'like', 8, 'Likes', () =>
                onClickMediaOption(1),
              )}
            </View>
            <View
              style={[grid.row, grid.alignItems, grid.justifyContentCenter]}>
              {showMediaIcon(status, 'comment', 8, 'Comments', () =>
                onClickMediaOption(2),
              )}
              {totalComments > 0 && (
                <Text
                  style={[
                    g.fs12,
                    g.FHNB,
                    g.colorWhite,
                    grid.justifyContentCenter,
                    g.txtCenter,
                    g.txtCenterVertical,
                    g.bgBlue,
                    styles.totalComments,
                  ]}>
                  {totalComments}
                </Text>
              )}
            </View>
            <View
              style={[grid.row, grid.alignItems, grid.justifyContentCenter]}>
              {showMediaIcon(status, 'share-google', 8, 'Share', () =>
                onClickMediaOption(3),
              )}
            </View>
          </View>
          {/* Post operations */}
        </View>
      </View>
    );
  }, [
    itemIndex,
    body,
    totalComments,
    author,
    postedAt,
    status,
    imageLinks,
    onClickPostOptions,
    onClickMediaOption,
    onClickUser,
    onLayout,
  ]);
}

const MyPreviousPost = ({navigation}) => {
  const refPostOptions = useRef();
  const refPostLikes = useRef();
  const refPostComments = useRef();
  const refFlatList = useRef();

  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const [postContent, setPostContent] = useState([]);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [postLikeData, setPostLikeData] = useState([]);

  useEffect(() => {
    postMode = '';
    const unsubscribe = navigation.addListener('focus', () => {
      if (global.isConnected) {
        postMode = '';
        resetCount();

        getTickers(filterObject);
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

  /**
   *
   * Like Dislike
   *
   */

  const getPostLikeDetail = (postId) => {
    getPostLikes(
      postId,
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (data.status) {
              if (data.data !== null) {
                setPostLikeData([...data.data]);
              }
            } else {
              setPostLikeData([]);
            }
            setTimeout(() => {
              if (
                refPostLikes.current !== undefined &&
                refPostLikes.current !== null
              ) {
                refPostLikes.current.open();
              }
            }, 200);
          }
        }
      },
      (error) => {},
    );
  };

  const likeUserPost = (postId) => {
    let requestObject = {
      postId: postId,
    };
    doLikePost(
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
              getPostLikeDetail(postId);
            }
          }
        }
      },
      (error) => {},
    );
  };

  const disLikeUserPost = (postId) => {
    let requestObject = {
      postId: postId,
    };
    doDislikePost(
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
              getPostLikeDetail(postId);
            }
          }
        }
      },
      (error, statusCode) => {
        console.log('error', error);
        console.log('statusCode', statusCode);
      },
    );
  };

  /**
   *
   * Like Dislike
   *
   */

  const getTickers = (requestObj) => {
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
      getTickers(filterObject);
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
    getTickers(filterObject);
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

  const isLiked = () => {
    if (
      postLikeData !== undefined &&
      postLikeData !== null &&
      postLikeData.length > 0
    ) {
      return postLikeData.find((o) => o.userId._id === global.userId);
    } else {
      return null;
    }
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
                getTickers(filterObject);
              }, 220);
            })}
        </View>
      </OptionsSheet>
    );
  };

  const showTaggedUsers = () => {
    let componentArray = [];
    for (let i = 0; i < postLikeData.length; i++) {
      let item = postLikeData[i].userId;
      const component = (
        <View key={i}>
          {showUser(
            item.profileImg,
            Helpers.concatName(item),
            `Batch ${item.batch}`,
            null,
            () => {
              refPostLikes.current.close();
              setTimeout(() => {
                navigation.navigate('UserProfile', {
                  userId: item._id,
                });
              }, 350);
            },
          )}
        </View>
      );

      componentArray.push(component);
    }
    return componentArray;
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
        customStyles={{
          container: GlobalInclude.AppStyle.sheetContainer,
        }}>
        <View style={grid.flex1}>
          <TouchableOpacity
            style={[grid.rowrow, grid.alignItems]}
            onPress={() => {
              if (isLiked() !== null) {
                disLikeUserPost(selectedPostId);
              } else {
                likeUserPost(selectedPostId);
              }
            }}>
            <View
              style={{
                marginHorizontal: scale(3),
              }}>
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(30), width: scale(30)}}
                iconColor={GlobalInclude.Color.ColorPrimary}
                iconName={isLiked() !== null ? 'dislike2' : 'like2'}
                iconSize={scale(30)}
                iconType={IconType[10]}
              />
            </View>
            <View style={[grid.justifyContentCenter, grid.alignItems]}>
              <Text
                style={[
                  g.fs14,
                  g.FHNM,
                  g.colorBlue,
                  grid.justifyContentCenter,
                  grid.alignItems,
                ]}>
                {isLiked() !== null ? 'Unlike' : 'Like This Post'}
              </Text>
            </View>
          </TouchableOpacity>
          {/*  */}
          <Text
            style={[
              g.fs18,
              g.FHNR,
              g.colorBlack,
              grid.justifyContentCenter,
              grid.alignItems,
              g.mt10,
              g.mb10,
            ]}>
            People who like this post
          </Text>
          <View style={grid.flex1}>
            {postLikeData !== undefined &&
            postLikeData !== null &&
            postLikeData.length > 0 ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[grid.row, g.mt10, grid.flexwrap]}>
                  {showTaggedUsers()}
                </View>
              </ScrollView>
            ) : (
              <View style={GlobalInclude.AppStyle.fillCenter}>
                <Text style={[g.colorBlack, g.FHNM, g.fs12, g.txtCenter]}>
                  Currently No People Liked This Post - Please Click on like
                  this post to like post
                </Text>
              </View>
            )}
          </View>
        </View>
      </OptionsSheet>
    );
  };

  const postComments = () => {
    return (
      <OptionsSheet
        ref={refPostComments}
        minClosingHeight={50}
        height={displayHeight / 2 + 100}
        duration={200}
        closeOnDragDown={false}
        onClose={() => {
          resetCount();
          getTickers(filterObject);
        }}
        keyboardAvoidingViewEnabled={false}
        customStyles={{
          container: GlobalInclude.AppStyle.sheetContainer,
        }}>
        {selectedFeed !== null && (
          <Comments navigation={navigation} postId={selectedFeed._id} />
        )}
      </OptionsSheet>
    );
  };

  const renderItem = useCallback(
    ({item, index}) => (
      <PostFeed
        index={index}
        item={item}
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
          selectedPostId = item._id;

          if (type === 1) {
            getPostLikeDetail(item._id);
          } else if (type === 2) {
            setSelectedFeed(item);

            setTimeout(() => {
              if (
                refPostComments.current !== undefined &&
                refPostComments.current !== null
              ) {
                refPostComments.current.open();
              }
            }, 200);
          }
        }}
        onClickUser={() => {
          if (item.author !== undefined && item.author !== null) {
            navigation.navigate('UserProfile', {
              userId: item.author.id,
            });
          }
        }}
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          dataSourceCords[index] = layout.y;
        }}
      />
    ),
    [navigation],
  );

  const keyExtractor = useCallback((item, index) => index, []);

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <HeaderBar title={'My Post'} navigation={navigation} showBack={true} />
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
            <View style={GlobalInclude.AppStyle.fill}>
              <Animated.FlatList
                ref={refFlatList}
                removeClippedSubviews={Platform.OS !== 'web'}
                showsVerticalScrollIndicator={false}
                extraData={postContent}
                data={postContent}
                CellRendererComponent={renderItem}
                keyExtractor={keyExtractor}
                onEndReachedThreshold={0.1}
                onEndReached={onEndReached}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                ListEmptyComponent={renderNoDataComponent}
                ListFooterComponent={renderFooter}
                scrollEventThrottle={16}
                contentContainerStyle={[
                  g.bggray3,
                  {
                    paddingBottom: scale(130),
                  },
                ]}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
      {postOptions()}
      {postLikes()}
      {postComments()}
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
  fitImage: {
    borderRadius: scale(10),
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  totalComments: {
    position: 'absolute',
    top: -1,
    left: -1,
    borderRadius: scale(30),
    height: scale(22),
    width: scale(22),
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
  emptyArea: {
    height: scale(120),
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default MyPreviousPost;
