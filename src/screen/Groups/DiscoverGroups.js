import React, {useState, useRef, useEffect, useCallback} from 'react';
import {Text, View, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';
import ProgressImage from '../../component/ProgresImage';
import {doGetGroups} from '../../Actions/GroupActions';
import {showProgess, renderNoDataComponent} from '../../component/Common';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {clearRefreshScreen} from '../../reducer/GroupReducer';
import {useNavigation} from '@react-navigation/native';

const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
};

let refreshPage = true;

const DiscoverGroups = ({content, isActive, onTap}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [postData, setPostData] = useState([]);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );

  const refreshState = useSelector(state => {
    if (state.group && state.group !== undefined) {
      let groupData = state.group;

      if (groupData && groupData !== null && groupData !== undefined) {
        if (groupData.refreshScreen) {
          refreshPage = true;
          return true;
        }
      }
    }
    return false;
  }, shallowEqual);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getGroupData();
    });
    return () => {
      unsubscribe();
    };
  }, [navigation, getGroupData]);

  useEffect(() => {
    getGroupData();
    return () => {};
  }, [getGroupData, isActive]);

  useEffect(() => {
    if (refreshPage) {
      refreshPage = false;
      setTimeout(() => {
        dispatch(clearRefreshScreen());
        getGroupData();
      }, 200);
    }
    return () => {
      refreshPage = false;
    };
  }, [refreshState, dispatch, getGroupData]);

  const getGroupData = useCallback(() => {
    doGetGroups(
      response => {
        manageResponse(response);
      },
      (code, error) => {
        setIsRefreshing(false);
        setFirstTimeLoad(false);
        setPostData([]);
      },
    );
  }, []);

  const manageResponse = response => {
    setIsRefreshing(false);
    if (response && response !== null) {
      if (
        response.data &&
        response.data !== undefined &&
        response.data !== null
      ) {
        let data = response.data;

        if (data.status) {
          setPostData([...data.groups]);
          setPaginationStatus(PaginationStatus.waiting);
        }
      }
    }

    setFirstTimeLoad(false);
  };

  const renderGroupItem = ({item, index}) => {
    return (
      <View key={index}>
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={() => onTap(item, index)}
          onPress={() => onTap(item, index)}
          style={{
            marginBottom: scale(15),
          }}>
          <View style={[g.bgWhite, g.boxShadow, {borderRadius: scale(10)}]}>
            <View style={[g.bggray3, style.backgroundBorder]}>
              <View style={style.imageStyle}>
                <ProgressImage
                  source={
                    item.profilePicture
                      ? {
                          uri: item.profilePicture,
                        }
                      : GlobalInclude.Assets.DefaultImage
                  }
                  containerStyle={style.coverImage}
                  imageStyle={style.coverImage}
                  mode={'cover'}
                />
                {item.newPost > 0 && (
                  <View style={style.newPostContainer}>
                    <Text
                      numberOfLines={1}
                      style={[
                        g.FHNB,
                        g.fs20,
                        g.colorWhite,
                        GlobalInclude.AppStyle.transform,
                      ]}>
                      {item.newPost.toString()}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[
                        g.FHNB,
                        g.fs16,
                        g.colorWhite,
                        GlobalInclude.AppStyle.transform,
                      ]}>
                      New
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View style={g.p10}>
              <Text
                numberOfLines={1}
                style={[
                  g.FHNB,
                  g.fs18,
                  g.colorBlue,
                  GlobalInclude.AppStyle.transform,
                ]}>
                {item.name !== undefined && item.name !== null
                  ? item.name
                  : 'N/A'}
              </Text>
              <Text
                style={[
                  g.fs14,
                  g.mt5,
                  g.FHNR,
                  GlobalInclude.AppStyle.transform,
                  g.colorGray,
                ]}
                numberOfLines={2}>
                {item.description !== undefined && item.description !== null
                  ? item.description
                  : 'N/A'}
              </Text>
              <Text
                style={[g.fs16, g.mt5, g.FHNM, g.colordarkGray]}
                numberOfLines={1}>
                {item.totalMember} Member(s)
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[grid.flex1]}>
      <FlatList
        showsVerticalScrollIndicator={false}
        extraData={postData}
        data={postData}
        onEndReachedThreshold={0.1}
        renderItem={renderGroupItem}
        ListEmptyComponent={renderNoDataComponent}
        contentContainerStyle={{
          paddingStart: scale(15),
          paddingEnd: scale(15),
          paddingBottom: scale(200),
        }}
        bounces={false}
        keyExtractor={(v, i) => i.toString()}
        scrollEventThrottle={16}
      />
      {showProgess(firstTimeLoad)}
    </View>
  );
};

const style = StyleSheet.create({
  imageStyle: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: scale(10),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  coverImage: {height: '100%', width: '100%'},
  grayColorText: {color: '#bababa'},
  backgroundBorder: {
    borderRadius: scale(10),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
  },
  newPostContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(62,62,62,0.6)',
    paddingHorizontal: scale(13),
    paddingVertical: scale(7),
    ...grid.alignItems,
    ...grid.justifyContentCenter,
  },
});

export default DiscoverGroups;
