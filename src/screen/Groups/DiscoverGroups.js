import React, {useState, useEffect, useCallback} from 'react';
import {View, FlatList} from 'react-native';
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

let filterObject = {
  page: 1,
  limit: 10,
};

let totalPages = 0;
let currentPage = 1;
let refreshPage = true;

const DiscoverGroups = ({content, isActive, onTap}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const [postData, setPostData] = useState([]);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      filterObject,
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

  /**
   *
   * Pagination
   *
   */
  const onPaginate = () => {
    if (paginationStatus !== PaginationStatus.allLoaded && !isRefreshing) {
      setPaginationStatus(PaginationStatus.waiting);
      filterObject.page = filterObject.page + 1;
      getGroupData();
    }
  };

  const onEndReached = () => {
    if (totalPages <= currentPage) {
      setPaginationStatus(PaginationStatus.allLoaded);
      return;
    }
    if (paginationStatus === PaginationStatus.waiting) {
      onPaginate();
    }
  };

  const handleRefresh = () => {
    filterObject.page = 1;
    totalPages = 0;
    setIsRefreshing(false);
    resetCount();
    getGroupData();
  };

  const resetCount = () => {
    totalPages = 0;
    filterObject = {};
    filterObject.page = 0;
    filterObject.size = 10;
  };
  /**
   *
   * Pagination
   *
   */

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
        onEndReached={onEndReached}
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
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        handleRefresh={handleRefresh}
      />
      {showProgess(firstTimeLoad)}
    </View>
  );
};

export default DiscoverGroups;
