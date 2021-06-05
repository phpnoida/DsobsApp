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
import Comments from './Comments';
import {renderNoDataComponent} from '../../component/Common';
import {doGetMypost} from '../../Actions/TickerActions';
import MoreInfo from '../../component/MoreInfo';
import DocView from 'react-native-pdf';

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
let selectedFeedId = '';
let selectedMediaOption = '';
let postMode = '';

function showMediaIcon(iconName, iconType, label, onPress) {
  return (
    <View style={[grid.rowrow, grid.alignItems, grid.justifyContentCenter]}>
      <TouchableOpacity activeOpacity={1} onPress={onPress}>
        <GlobalInclude.BaseIcon
          containerStyle={{height: scale(30), width: scale(30)}}
          iconColor={GlobalInclude.Color.ColorPrimary}
          iconName={iconName}
          iconSize={scale(30)}
          iconType={IconType[iconType]}
        />
      </TouchableOpacity>
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
    </View>
  );
}

function PostFeed({
  index: itemIndex,
  item: {body, totalComments, author, postedAt, status},
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
                <ProgressImage
                  source={GlobalInclude.Assets.DefaultProfile}
                  containerStyle={styles.imageStyle}
                  mode={'cover'}
                />
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
                          containerStyle={{
                            height: scale(22),
                            width: scale(22),
                          }}
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
                    {Helpers.showFormatedDate(postedAt, false)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* User Row */}

          {/* Post Content */}

          <DocView
            singlePage
            source={{
              uri: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/1619262480_777933_1619262475866.pdf',
            }}
            onLoadComplete={(numberOfPages, filePath) => {
              // console.log(`number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              // console.log(`current page: ${page}`);
            }}
            onError={(error) => {}}
            onPressLink={(uri) => {
              // console.log(`Link presse: ${uri}`)
            }}
            style={{height: scale(94), width: scale(94)}}
          />

          {/* Post message */}
          {body !== undefined && body !== null && body !== '' ? (
            <MoreInfo text={body} linesToTruncate={3} />
          ) : null}

          {/* Post message */}

          {/* Post Image */}
          {/* <FitImage source={{uri: square}} /> */}

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
    onClickPostOptions,
    onClickMediaOption,
    onClickUser,
  ]);
}

const MyPreviousPost = ({navigation}) => {
  const refOptions = useRef();
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

  useEffect(() => {
    postMode = '';
    if (global.isConnected) {
      postMode = '';
      resetCount();
      getTickers();
    }

    return () => {};
  }, [navigation]);

  /*****
   *
   * API Section
   *
   */

  const getTickers = () => {
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
          if (postMode !== '') {
            if (postMode === 'edit') {
              postMode = '';
              let item = data.data[0];
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
      getTickers();
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
    getTickers();
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
          {generateMenuOption('Edit Post', 'edit', 4, () => {
            refPostOptions.current.close();
            postMode = 'edit';
            setTimeout(() => {
              resetCount();
              filterObject.id = selectedFeed._id;
              getTickers();
            }, 220);
          })}
        </View>
      </OptionsSheet>
    );
  };

  const showTaggedUsers = () => {
    let componentArray = [];
    for (let i = 0; i < 7; i++) {
      const component = (
        <View key={i}>
          {showUser('', 'Amit Kumar Singh', 'Batch 1985', null, () => {
            refPostLikes.current.close();
          })}
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
        <View stylre={[grid.flex1, g.mb10]}>
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
                iconName={'like'}
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
                Like This Post
              </Text>
            </View>
          </View>
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
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[grid.row, grid.flexwrap]}>
              {showUser('', 'Amit Kumar Singh', 'Batch 1985', null, () => {
                refPostLikes.current.close();
              })}
              {showUser('', 'Rahul Bhardwaj', 'Batch 1990', null, () => {
                refPostLikes.current.close();
              })}
              {showUser('', 'John Karter', 'Batch 1994', null, () => {
                refPostLikes.current.close();
              })}
            </View>
          </ScrollView>
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
          selectedFeedId = item._id;
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
          selectedFeedId = item._id;
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

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <HeaderBar
        title={'My Previous Post'}
        navigation={navigation}
        showBack={true}
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
                    marginTop: scale(5),
                    paddingBottom: scale(130),
                  },
                ]}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
      {userOptions()}
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
});

export default MyPreviousPost;
