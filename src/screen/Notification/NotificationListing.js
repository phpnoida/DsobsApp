import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
  Image,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Clipboard,
  Alert,
  Modal,
  Linking,
  FlatList,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {IconType, APP_NAME, URL_REGX} from '../../helper/Constants';
import {getNotifications} from '../../Actions/NotificationActions';
import HeaderBar from '../../component/HeaderBar';
import Helper from '../../helper/Helper';
import ProgresImage from '../../component/ProgresImage';

const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
};

let pageIndex = 0;
let pageSize = 10;
let totalCount = 0;

const NotificationListing = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pageContent, setPageContent] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );

  useEffect(() => {
    pageIndex = 0;
    pageSize = 10;
    totalCount = 0;

    setIsLoading(true);
    getNotificationList();
    //getVideoCategory();
    //getVideoData('');
    return () => {};
  }, []);

  /**
   * ************************************************
   * API Section Start
   * ************************************************
   */
  const getNotificationList = () => {
    getNotifications(
      pageIndex,
      pageSize,
      (response) => {
        setIsLoading(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            console.log('====================================');
            console.log(JSON.stringify(data));
            console.log('====================================');

            if (pageIndex === 0) {
              totalCount = data.totalCount;
            }

            if (data.status) {
              let records = data.data;
              if (pageIndex === 0) {
                setPageContent([...records]);
              } else {
                setPageContent([...pageContent, ...records]);
              }
              setPaginationStatus(PaginationStatus.waiting);
            }
          }
        }
      },
      (error) => {
        if (pageIndex === 0) {
          setPageContent(null);
        }
        setIsLoading(false);
      },
    );
  };
  /**
   * ************************************************
   * API Section Start
   * ************************************************
   */

  const onPaginate = () => {
    if (paginationStatus !== PaginationStatus.allLoaded && !isRefreshing) {
      console.log('onPaginate()');
      setPaginationStatus(PaginationStatus.waiting);
      pageIndex = parseInt(pageIndex, 10) + 1;
      getNotificationList();
    }
  };

  const onEndReached = () => {
    console.log('onEndReached()');
    if (pageContent.length === totalCount) {
      setPaginationStatus(PaginationStatus.allLoaded);
      return;
    }
    if (paginationStatus === PaginationStatus.waiting) {
      onPaginate();
    }
  };

  const handleRefresh = () => {
    pageIndex = 0;
    getNotificationList();
  };

  const parseDate = (date) => {
    var parsedDate = new Date(date * 1000);
    return (
      parsedDate.getDate() +
      '/' +
      (parsedDate.getMonth() + 1) +
      '/' +
      parsedDate.getFullYear()
    );
  };

  const openNotification = (notification) => {
    if (
      notification.linkUrl &&
      notification.linkUrl !== null &&
      notification.linkUrl !== ''
    ) {
      navigation.navigate('CommonWebPage', {
        link: notification.linkUrl,
      });
    } else {
      let eventType = notification.eventType.toString();
      if (eventType && eventType !== null && eventType !== '') {
        openSpecificPage(eventType);
      }
    }
  };

  const openSpecificPage = (type) => {
    global.notification = null;
    global.isNotificationTap = false;

    switch (parseInt(type, 10)) {
      case 0:
        navigation.navigate('SearchDirectory');
        break;
      case 1:
        navigation.navigate('Magazine');
        break;
      default:
        break;
    }
  };

  const time_ago = (time) => {
    switch (typeof time) {
      case 'number':
        break;
      case 'string':
        time = +new Date(time);
        break;
      case 'object':
        if (time.constructor === Date) {
          time = time.getTime();
        }
        break;
      default:
        time = +new Date();
    }
    var time_formats = [
      [60, 'seconds', 1], // 60
      [120, '1 minute ago', '1 minute from now'], // 60*2
      [3600, 'minutes', 60], // 60*60, 60
      [7200, '1 hour ago', '1 hour from now'], // 60*60*2
      [86400, 'hours', 3600], // 60*60*24, 60*60
      [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
      [604800, 'days', 86400], // 60*60*24*7, 60*60*24
      [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
      [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
      [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
      [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
      [58060800000, 'centuries', 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    var seconds = (+new Date() - time) / 1000,
      token = 'ago',
      list_choice = 1;

    if (seconds == 0) {
      return 'Just now';
    }
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = 'from now';
      list_choice = 2;
    }
    var i = 0,
      format;
    while ((format = time_formats[i++])) {
      if (seconds < format[0]) {
        if (typeof format[2] == 'string') {
          return format[list_choice];
        } else {
          return (
            Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token
          );
        }
      }
    }
    return time;
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={[GlobalInclude.AppStyle.row, g.mb10]}
        activeOpacity={1}
        onPress={() => {
          openNotification(item);
        }}
        key={index}>
        <View style={[g.mb5, g.mr5, g.mt5]}>
          <ProgresImage
            source={
              item.imagelink != null && item.imagelink !== ''
                ? {uri: item.imagelink}
                : GlobalInclude.Assets.AppLogo
            }
            containerStyle={style.withImageStyle}
            imageStyle={style.withImageStyle}
            mode={'cover'}
          />
        </View>
        <View style={[GlobalInclude.AppStyle.fill, g.ml2]}>
          <View style={GlobalInclude.AppStyle.fill}>
            <View style={g.mb5}>
              <Text
                numberOfLines={2}
                ellipsizeMode={'tail'}
                style={[g.fs14, g.colorBlue1, g.FHNB, grid.flex1]}>
                {item.title !== undefined && item.title !== null
                  ? item.title
                  : 'N/A'}
              </Text>
            </View>
            <Text
              numberOfLines={2}
              ellipsizeMode={'tail'}
              style={[g.fs14, g.colorBlack, g.FHNR]}>
              {item.body !== undefined && item.body !== null
                ? item.body
                : 'N/A'}
            </Text>

            <Text
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={{
                color: '#2b3252',
                fontSize: scale(11),
                textAlign: 'left',
                fontWeight: '600',
                alignSelf: 'flex-end',
                marginTop: scale(4),
              }}>
              {time_ago(new Date(item.sent_date * 1000))}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: '#323232',
              opacity: 0.6,
              height: 0.5,
              marginTop: scale(5),
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    return (
      <View style={style.footerView}>
        {pageContent.length === totalCount ? (
          <View />
        ) : (
          <View style={{height: scale(30)}}>
            {paginationStatus === PaginationStatus.waiting ? (
              <View style={g.p10}>
                <ActivityIndicator size={'small'} color={'#2b3252'} />
              </View>
            ) : null}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.parentStyle}>
        <HeaderBar navigation={navigation} title={'NOTIFICATIONS'} />
        <View
          style={[
            GlobalInclude.AppStyle.fill,
            GlobalInclude.AppStyle.contentSpace,
          ]}>
          {isLoading ? (
            <View style={GlobalInclude.AppStyle.fillCenter}>
              <ActivityIndicator size={'small'} color={'#2b3252'} />
            </View>
          ) : (
            <View style={GlobalInclude.AppStyle.fill}>
              {pageContent === null || pageContent.length === 0 ? (
                <View style={GlobalInclude.AppStyle.center}>
                  <Text style={[g.colorBlack, g.FHNM, g.fs12, g.textCenter]}>
                    No Record Found
                  </Text>
                </View>
              ) : (
                <View style={GlobalInclude.AppStyle.fill}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    extraData={pageContent}
                    data={pageContent}
                    onEndReachedThreshold={0.1}
                    onEndReached={onEndReached}
                    renderItem={renderItem}
                    keyExtractor={(v, i) => i.toString()}
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    ListFooterComponent={renderFooter}
                    contentContainerStyle={{paddingBottom: scale(70)}}
                  />
                </View>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const style = StyleSheet.create({
  footerView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  imageBackground: {
    height: scale(50),
    width: scale(50),
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: scale(40),
    alignContent: 'center',
  },
  withImageStyle: {
    height: scale(50),
    width: scale(50),
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: scale(40),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  logoStyleBackground: {
    height: scale(50),
    width: scale(50),
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: scale(40),
    backgroundColor: '#042e31',
  },
  logoStyle: {
    height: scale(50),
    width: scale(50),
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: scale(50),
  },
});

export default NotificationListing;
