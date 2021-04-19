import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import HeaderBar from '../../component/HeaderBar';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import ProgresImage from '../../component/ProgresImage';
import Slideshow from '../../component/Slideshow.js';

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

const Video = ({navigation}) => {
  const [firstTimeLoad, setFirstTimeLoad] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageContent, setPageContent] = useState([
    {item: 1},
    {item: 1},
    {item: 1},
  ]);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );

  const onPaginate = () => {
    if (paginationStatus !== PaginationStatus.allLoaded && !isRefreshing) {
      console.log('onPaginate()');
      setPaginationStatus(PaginationStatus.waiting);
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
    filterObject.index = 0;
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

  const renderItem = ({item, index}) => {
    return (
      <View style={{marginBottom: scale(15)}}>
        <View
          style={[
            g.bgWhite,
            g.boxShadow,
            g.ml5,
            g.mr5,
            {borderRadius: scale(10)},
          ]}>
          <View style={[g.bggray3, {borderRadius: scale(10)}]}>
            {/* <FlatListSlider data={imageArray} /> */}
            {index === 0 ? (
              <Slideshow
                dataSource={[
                  {url: 'http://placeimg.com/640/480/any'},
                  {url: 'http://placeimg.com/640/480/any'},
                  {url: 'http://placeimg.com/640/480/any'},
                ]}
              />
            ) : (
              <ProgresImage
                source={GlobalInclude.Assets.DefaultImage}
                containerStyle={{aspectRatio: 16 / 9, borderRadius: scale(10)}}
                imageStyle={{
                  aspectRatio: 16 / 9,
                  borderRadius: scale(10),
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }}
                mode={'cover'}
              />
            )}
          </View>
          <TouchableOpacity
            style={[g.p15]}
            onPress={() => {
              navigation.navigate('BusinessDetails');
            }}>
            <Text style={[g.FHNB, g.fs16, g.colorBlue]}>
              Incred Applications Pvt. Ltd.
            </Text>
            <Text
              style={[g.fs14, g.mt5, g.FHNR, g.colorBlack]}
              numberOfLines={2}>
              IT/Information Technology
            </Text>
            <Text
              style={[g.fs12, g.mt5, g.FHNR, g.colorBlack]}
              numberOfLines={2}>
              Montréal
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.parentStyle}>
        <HeaderBar
          title={'Yello Pages'}
          navigation={navigation}
          showBack={true}
        />
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
                  <View style={[grid.rowdir, grid.alignItems]}>
                    <Text
                      style={[
                        g.colorBlack,
                        g.FHNM,
                        g.fs12,
                        g.textCenter,
                        g.mr5,
                      ]}>
                      Results For:
                    </Text>

                    <Text style={[g.colorBlack, g.FHNM, g.fs16, g.textCenter]}>
                      IT/Information Technology
                    </Text>
                  </View>

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
                    contentContainerStyle={{
                      paddingBottom: scale(70),
                      paddingTop: scale(10),
                    }}
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
  searchIcon: {
    height: scale(20),
    width: scale(20),
    alignSelf: 'center',
    marginEnd: scale(6),
    marginStart: scale(6),
  },
  mainContainer: {
    backgroundColor: '#ffffff',
    shadowColor: '#333333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
    marginTop: scale(5),
    marginStart: scale(5),
    marginEnd: scale(5),
    marginBottom: scale(15),
  },
  videoContainer: {
    height: scale(200),
    width: '100%',
    borderRadius: scale(15),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: 'center',
  },
  overlayStyle: {
    backgroundColor: '#00000066',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 1,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderRadius: scale(15),
  },
  thumbStyle: {
    borderRadius: scale(15),
    height: scale(200),
    width: '100%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  playIconstyle: {
    position: 'absolute',
    zIndex: 9,
    bottom: 15,
    left: 15,
  },
  childVideoContainer: {
    height: scale(100),
    width: '100%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: 'center',
  },
  childThumb: {
    height: scale(100),
    width: '100%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  seeMore: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  showChildVideo: {
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
    paddingBottom: 15,
  },
  submitButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    alignContent: 'center',
    alignSelf: 'center',
  },
  contentContainer: {
    width: '100%',
    paddingStart: scale(10),
    paddingEnd: scale(10),
    paddingTop: scale(5),
    paddingBottom: scale(10),
  },
  closeButton: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    alignContent: 'flex-end',
    flex: 1,
  },
});

export default Video;
