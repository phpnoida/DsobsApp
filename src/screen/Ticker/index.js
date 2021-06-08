import React, {useState, useEffect, useRef, useCallback} from 'react';
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
  Modal,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import TopHeaderView from '../../component/TopHeaderView';
import {IconType} from '../../helper/Constants';
import OptionsSheet from 'react-native-raw-bottom-sheet';
import {generateMenuOption} from '../../component/Common';
import Helpers from '../../helper/Helper';
import {renderNoDataComponent} from '../../component/Common';
import Comments from './Comments';
import Likes from './Likes';
import SingleSearchWithFilter from '../../component/SingleSearchWithFilter';
import {
  doFitlerPost,
  getCategories,
  getUserFollowing,
  doReportPost,
  doFollowUser,
  doUnFollowUser,
} from '../../Actions/TickerActions';
import FilterCategory from '../../component/FilterCategory';
import PostFeedCard from '../../component/PostFeedCard';

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
let postMode = '';
let curY = new Animated.Value(0);
let selectedIndex = -1;
let responseMessage = '';
let searchVal = '';

let dataSourceCords = [];
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
  const [showReportModal, setShowReportModal] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [reportText, setReportText] = useState('');

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
   * Follow Unfollow
   *
   */
  const followUser = () => {
    let requestObject = {
      userId: selectedFeed.author.id,
    };
    doFollowUser(
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
              responseMessage = `You successfully follow ${Helpers.concatName(
                selectedFeed.author,
              )}!`;

              getMyFollowing();
            } else {
              responseMessage = 'Error while following!';
            }

            setShowModal(true);
            setTimeout(() => {
              setShowModal(false);
            }, 2000);
          }
        }
      },
      (error) => {},
    );
  };

  const unFollowUser = () => {
    let requestObject = {
      userId: selectedFeed.author.id,
    };
    doUnFollowUser(
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
              responseMessage = `You successfully unfollow ${Helpers.concatName(
                selectedFeed.author,
              )}!`;

              getMyFollowing();
            } else {
              responseMessage = 'Error while following!';
            }

            setShowModal(true);
            setTimeout(() => {
              setShowModal(false);
            }, 2000);
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
   * Follow Unfollow
   *
   */

  const onSubmitReport = () => {
    if (reportText.trim() === '') {
      setErrorMessage({reportContent: 'This field is required'});
    } else {
      let requestData = {
        postId: selectedFeed._id,
        reportTxt: reportText,
      };
      setIsReporting(true);
      doReportPost(
        requestData,
        (response) => {
          setIsReporting(false);
          if (response && response !== null) {
            if (
              response.data &&
              response.data !== undefined &&
              response.data !== null
            ) {
              let responseData = response.data;
              if (responseData.status) {
                responseMessage = 'Post reported successfully!';
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
        (error) => {
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
                setTimeout(() => {
                  if (isFollowing() === null) {
                    followUser();
                  } else {
                    unFollowUser();
                  }
                }, 220);
              },
            )}

          {selectedFeed !== null &&
            global.userId !== selectedFeed.author.id &&
            generateMenuOption('Report Post', 'report', 5, () => {
              refPostOptions.current.close();
              setErrorMessage({});
              setReportText('');
              setTimeout(() => {
                setShowReportModal(true);
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
        onClose={() => {
          resetCount();
          getTickers(filterObject);
        }}
        customStyles={{
          container: GlobalInclude.AppStyle.sheetContainer,
        }}>
        {selectedFeed !== null && (
          <Likes
            postId={selectedFeed._id}
            navigation={navigation}
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
      <PostFeedCard
        itemIndex={index}
        author={item.author}
        status={item.status}
        postedAt={item.postedAt}
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
              searchVal = text;
              setFilterQuery(text);
              if (searchVal.trim() === '') {
                resetCount();
                getTickers(filterObject);
              }
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
            onGoPress={() => {
              if (filterQuery.trim() !== '' && filterQuery.trim().length > 0) {
                resetCount();
                filterObject.s = searchVal;
                getTickers(filterObject);
              }
            }}
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
          resetCount();
          filterObject.categoryId = item.key;
          setTimeout(() => {
            getTickers(filterObject);
          }, 200);
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
            <View style={[GlobalInclude.AppStyle.fill, g.bggray3]}>
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
                onChangeText={(comment) => {
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
  totalLikes: {
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

export default Ticker;
