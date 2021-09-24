import React, {useState, useEffect, useCallback} from 'react';
import {View, FlatList} from 'react-native';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import {renderGroupItem} from './GroupCommon';
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

const MyGroups = ({content, isActive, onTap}) => {
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
    doGetGroups(
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

        console.log('====================================');
        console.log('data', JSON.stringify(data));
        console.log('====================================');

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

export default MyGroups;
