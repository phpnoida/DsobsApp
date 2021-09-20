import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import {renderGroupItem} from './GroupCommon';
import {doGetDiscoverGroups} from '../../Actions/GroupActions';
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
    doGetDiscoverGroups(
      response => {
        manageResponse(response);
      },
      (code, error) => {
        setFirstTimeLoad(false);
        setPostData([]);
      },
    );
  }, []);

  const manageResponse = response => {
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

  const renderItem = ({item, index}) => {
    return renderGroupItem(item, index, onTap);
  };

  return (
    <View style={[grid.flex1]}>
      <FlatList
        showsVerticalScrollIndicator={false}
        extraData={postData}
        data={postData}
        onEndReachedThreshold={0.1}
        renderItem={renderItem}
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
    height: scale(80),
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
    bottom: 0,
    backgroundColor: 'rgba(62,62,62,0.6)',
    paddingHorizontal: scale(13),
    paddingVertical: scale(7),
    ...grid.alignItems,
    ...grid.justifyContentCenter,
  },
});

export default DiscoverGroups;
