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
  TextInput,
  Keyboard,
  Animated,
  FlatList,
  Image,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import TopHeaderView from '../../component/TopHeaderView';
import {IconType} from '../../helper/Constants';
import OptionsSheet from 'react-native-raw-bottom-sheet';
import {generateMenuOption} from '../../component/Common';
import ProgressImage from '../../component/ProgresImage';
import moment from 'moment';
import Helpers from '../../helper/Helper';
import FitImage from '../../component/FitImage';
import {ScrollView} from 'react-native';
import {showUser} from '../../component/Common';
import Comments from './Comments';
import {renderNoDataComponent} from '../../component/Common';
import SingleSearchWithFilter from '../../component/SingleSearchWithFilter';
import {
  doFitlerPost,
  getCategories,
  getUserFollowing,
  getPostLikes,
  doLikePost,
  doDislikePost,
} from '../../Actions/TickerActions';
import FilterCategory from '../../component/FilterCategory';
import MoreInfo from '../../component/MoreInfo';
const {height: displayHeight} = Dimensions.get('window');
import MasonryList from 'react-native-masonry-list';

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
let selectedMediaOption = '';
let selectedPostId = '';
let postMode = '';
let curY = new Animated.Value(0);

function showMediaIcon(iconName, iconType, label, onPress) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={[grid.rowrow, grid.alignItems, grid.justifyContentCenter]}>
      <GlobalInclude.BaseIcon
        containerStyle={{height: scale(30), width: scale(30)}}
        iconColor={GlobalInclude.Color.ColorPrimary}
        iconName={iconName}
        iconSize={scale(30)}
        iconType={IconType[iconType]}
      />
      <Text
        style={[
          g.fs15,
          g.FHNM,
          g.colorBlue,
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
}) {
  return useMemo(() => {
    return (
      <View
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
          {body !== undefined && body !== null && body !== '' ? (
            <MoreInfo text={body} linesToTruncate={3} />
          ) : null}

          {/* Post message */}

          {/* Post Image */}
          {imageLinks.length > 0 ? (
            <View style={{width: '100%'}}>
              {imageLinks.length > 1 ? (
                <MasonryList
                  images={[
                    {
                      uri: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/1622900438_601845_1622900438073.png',
                    },
                    {
                      uri: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/1622900435_398854_1622900435319.png',
                    },
                  ]}
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
              {showMediaIcon('like', 8, 'Likes', () => onClickMediaOption(1))}
            </View>
            <View
              style={[grid.row, grid.alignItems, grid.justifyContentCenter]}>
              {showMediaIcon('comment', 8, 'Comments', () =>
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
              {showMediaIcon('share-google', 8, 'Share', () =>
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
  ]);
}

const Ticker = ({navigation}) => {
  curY = new Animated.Value(0);
  const refOptions = useRef();
  const refPostOptions = useRef();
  const refPostLikes = useRef();
  const refPostComments = useRef();
  const refFlatList = useRef();
  const refCategory = useRef();

  const [myFollowing, setMyFollowing] = useState([]);

  const [firstTimeLoad, setFirstTimeLoad] = useState(true);

  const [postContent, setPostContent] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );
  const [animatedHeight, setAnimatedHeight] = useState(119);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [postLikeData, setPostLikeData] = useState([]);

  useEffect(() => {
    postMode = '';
    const unsubscribe = navigation.addListener('focus', () => {
      if (global.isConnected) {
        postMode = '';
        resetCount();
        getMyFollowing();
        getCategory();
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

  const getMyFollowing = () => {
    getUserFollowing(
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
                setMyFollowing([...data.data.following]);
              }
            }
          }
        }
      },
      (error) => {},
    );
  };

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
            console.log('====================================');
            console.log('data', data);
            console.log('====================================');
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
            console.log('====================================');
            console.log('data', data);
            console.log('====================================');
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

  const getCategory = () => {
    getCategories(
      (response) => {
        getTickers(filterObject);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              let categoryArray = [];
              if (data.data !== null) {
                data.data.map((item, index) => {
                  categoryArray.push({
                    key: item.id,
                    text: Helpers.capitalize(item.name),
                  });
                });
              }

              setCategoryList(categoryArray);
            }
          }
        }
      },
      (error) => {
        getTickers(filterObject);
      },
    );
  };

  const getTickers = (requestObj) => {
    doFitlerPost(
      requestObj,
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
            } else if (postMode === 'mediaOption') {
              setSelectedFeed(item);
              if (selectedMediaOption === 1) {
              } else if (selectedMediaOption === 2) {
              } else if (selectedMediaOption === 3) {
              }
            }
          } else {
            if (filterObject.index === 0) {
              totalCount = data.totalCount;
              console.log('====================================');
              console.log('totalCount', data.data);
              console.log('====================================');
              setPostContent([...data.data]);
            } else {
              setPostContent([...postContent, ...data.data]);
            }
            setPaginationStatus(PaginationStatus.waiting);
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

  const isFollowing = () => {
    if (
      myFollowing !== undefined &&
      myFollowing !== null &&
      myFollowing.length > 0
    ) {
      return myFollowing.find((o) => o._id === selectedFeed.author.id);
    } else {
      return null;
    }
  };

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
          {generateMenuOption('Make a New Post', 'add-to-list', 9, () => {
            refOptions.current.close();
            setTimeout(() => {
              navigation.navigate('PostTicker');
            }, 220);
          })}

          {generateMenuOption(
            'View My Previous Post',
            'infocirlceo',
            10,
            () => {
              refOptions.current.close();
              setTimeout(() => {
                navigation.navigate('MyPreviousPost');
              }, 220);
            },
          )}

          {generateMenuOption('My Settings', 'setting', 10, () => {
            refOptions.current.close();
            setTimeout(() => {
              navigation.navigate('Settings');
            }, 220);
          })}

          {generateMenuOption(
            'The Common Room Etiquette ',
            'exclamationcircleo',
            10,
            () => {
              refOptions.current.close();
              setTimeout(() => {
                navigation.navigate('Etiquette');
              }, 220);
            },
          )}
        </View>
      </OptionsSheet>
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
            global.userId === selectedFeed.author.id &&
            generateMenuOption('Edit Post', 'edit', 4, () => {
              refPostOptions.current.close();
              postMode = 'edit';
              setTimeout(() => {
                resetCount();
                filterObject.id = selectedFeed._id;
                getTickers(filterObject);
              }, 220);
            })}

          {selectedFeed !== null &&
            global.userId !== selectedFeed.author.id &&
            generateMenuOption(
              `${
                isFollowing() === null ? 'Follow' : 'UnFollow'
              } ${Helpers.concatName(selectedFeed.author)}`,
              isFollowing() !== null ? 'user-follow' : 'user-unfollow',
              2,
              () => {
                refPostOptions.current.close();
              },
            )}

          {selectedFeed !== null &&
            global.userId !== selectedFeed.author.id &&
            generateMenuOption('Report Post', 'report', 5, () => {
              refPostOptions.current.close();
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
        height={
          Platform.OS === 'ios' ? displayHeight - 100 : displayHeight - 64
        }
        duration={200}
        closeOnDragDown={true}
        customStyles={{
          container: GlobalInclude.AppStyle.sheetContainer,
        }}>
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
          <ScrollView
            style={{flexGrow: 1}}
            contentContainerStyle={{
              paddingBottom: scale(50),
              paddingTop: scale(10),
            }}></ScrollView>
        </View>
        <View
          style={[
            grid.rowrow,
            grid.justifyContentCenter,
            grid.alignItems,
            g.mb10,
          ]}>
          <TextInput
            underlineColorAndroid={'transparent'}
            style={[g.inputWhite, grid.flex1, g.mr5]}
            keyboardType={'default'}
            autoCapitalize={'none'}
            returnKeyType={'done'}
            placeholder={'Add/Paste Comment'}
            onChangeText={(value) => {}}
          />
          <View
            style={{
              height: scale(40),
              width: scale(40),
              borderRadius: scale(45),
              backgroundColor: GlobalInclude.Color.ColorPrimary,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <GlobalInclude.BaseIcon
              containerStyle={{height: scale(20), width: scale(20)}}
              iconColor={'#FFF'}
              iconName={'send-o'}
              iconSize={scale(20)}
              iconType={IconType[4]}
            />
          </View>
        </View>
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
          selectedMediaOption = type;
          selectedPostId = item._id;
          postMode = 'mediaOption';
          getPostLikeDetail(item._id);
        }}
        onClickUser={() => {
          if (item.author !== undefined && item.author !== null) {
            navigation.navigate('UserProfile', {
              userId: item.author.id,
            });
          }
        }}
      />
    ),
    [navigation],
  );

  const keyExtractor = useCallback((item, index) => index, []);

  const headerDistance = Animated.diffClamp(curY, 0, 119).interpolate({
    inputRange: [0, 1],
    outputRange: [0, -1],
  });

  const renderHeader = () => {
    return (
      <Animated.View
        style={[
          g.newHeaderConcept,
          {
            transform: [
              {
                translateY: headerDistance,
              },
            ],
          },
        ]}
        onLayout={({nativeEvent}) => {
          setAnimatedHeight(nativeEvent.layout.height);
        }}>
        <View
          style={[
            GlobalInclude.AppStyle.contentSpace,
            {marginBottom: scale(10)},
          ]}>
          <SingleSearchWithFilter
            changeText={(text) => {
              setFilterQuery(text);
            }}
            showGoButton={true}
            filterQuery={filterQuery}
            onFilterPress={() => {
              if (
                refCategory.current !== undefined &&
                refCategory.current !== null
              ) {
                refCategory.current.open();
              }
            }}
            onGoPress={() => {}}
          />
        </View>
      </Animated.View>
    );
  };

  const showCategories = () => {
    return (
      <FilterCategory
        refRBSheet={refCategory}
        dataList={categoryList}
        title={'Select Category'}
        selectedFilter={selectedCategory}
        setSelectedFilter={(value, item) => {
          Keyboard.dismiss();
          setSelectedCategory(Helpers.capitalize(value));
          refCategory.current.close();
        }}
        onClose={() => {}}
      />
    );
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <TopHeaderView
        navigation={navigation}
        index={10}
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
                renderItem={renderItem}
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
                    marginTop: animatedHeight,
                    paddingBottom: scale(130),
                  },
                ]}
                onScroll={Animated.event(
                  [{nativeEvent: {contentOffset: {y: curY}}}],
                  {useNativeDriver: true},
                )}
              />
              {renderHeader()}
            </View>
          )}
        </View>
      </SafeAreaView>
      {userOptions()}
      {postOptions()}
      {postLikes()}
      {postComments()}
      {showCategories()}
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
});

export default Ticker;
