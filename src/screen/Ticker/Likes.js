import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {IconType} from '../../helper/Constants';
import Helper from '../../helper/Helper';
import {showUser} from '../../component/Common';
import {renderNoDataComponent} from '../../component/Common';
import {
  getPostLikes,
  doLikePost,
  doDislikePost,
} from '../../Actions/TickerActions';

const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
};
let filterObject = {
  index: 0,
  size: 10,
};
let totalCount = 0;

const Likes = ({postId, navigation, onClickUser, onStatusChange}) => {
  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [postLikeData, setPostLikeData] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      resetCount();
      getPostLikeDetail();
    }, 500);
    return () => {};
  }, []);

  /**
   *
   * API
   *
   */

  const getPostLikeDetail = () => {
    getPostLikes(
      filterObject,
      (response) => {
        setFirstTimeLoad(false);
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
          }
        }
      },
      (error, message) => {
        setFirstTimeLoad(false);
      },
    );
  };

  const likeUserPost = () => {
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
              onStatusChange(true);
              getPostLikeDetail(postId);
            }
          }
        }
      },
      (error) => {},
    );
  };

  const disLikeUserPost = () => {
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
              onStatusChange(false);
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
   * API
   *
   */

  /**
   *
   * Pagination
   *
   */
  const onPaginate = () => {
    if (paginationStatus !== PaginationStatus.allLoaded && !isRefreshing) {
      setPaginationStatus(PaginationStatus.waiting);
      filterObject.index = filterObject.index + 1;
      getPostLikeDetail();
    }
  };

  const onEndReached = () => {
    if (postLikeData.length === totalCount || postLikeData.length < 10) {
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
    getPostLikeDetail();
  };

  const resetCount = () => {
    totalCount = 0;
    filterObject = {};
    filterObject.index = 0;
    filterObject.size = 10;
    filterObject.postId = postId;
  };

  const isLiked = () => {
    if (
      postLikeData !== undefined &&
      postLikeData !== null &&
      postLikeData.length > 0
    ) {
      return postLikeData.find((o) => o.userId._id === global.userId) ===
        undefined
        ? null
        : postLikeData.find((o) => o.userId._id === global.userId);
    } else {
      return null;
    }
  };

  const renderItem = ({item, index}) => {
    let object = item.userId;
    return (
      <View key={index}>
        {showUser(
          object.profileImg,
          Helper.concatName(object),
          `Batch ${object.batch}`,
          null,
          () => {
            onClickUser(object._id);
          },
        )}
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.footerView}>
        {postLikeData.length === totalCount ? (
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

  return (
    <View style={grid.flex1}>
      <TouchableOpacity
        style={[grid.rowrow, grid.alignItems]}
        onPress={() => {
          if (isLiked() !== null) {
            disLikeUserPost();
          } else {
            likeUserPost();
          }
        }}>
        <View
          style={[
            grid.justifyContentCenter,
            grid.alignItems,
            {
              marginHorizontal: scale(3),
            },
          ]}>
          <GlobalInclude.BaseIcon
            containerStyle={{height: scale(30), width: scale(30)}}
            iconColor={GlobalInclude.Color.ColorPrimary}
            iconName={isLiked() !== null ? 'like1' : 'like2'}
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
            {isLiked() !== null ? 'Liked' : 'Like This Post'}
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
            extraData={postLikeData}
            numColumns={3}
            data={postLikeData}
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

export default Likes;
