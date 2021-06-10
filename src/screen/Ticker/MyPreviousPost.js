import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  Dimensions,
  Animated,
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
import {doGetMypost} from '../../Actions/TickerActions';
import PostFeedCard from '../../component/PostFeedCard';

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

let dataSourceCords = [];
const MyPreviousPost = ({navigation}) => {
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
            navigation.navigate('Comments', {data: {postId: item._id}});
          }
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
                contentContainerStyle={{
                  paddingBottom: scale(130),
                  paddingTop: scale(5),
                  flex: 1,
                }}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
      {postOptions()}
      {postLikes()}
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
