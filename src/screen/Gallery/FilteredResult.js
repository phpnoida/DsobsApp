import React, {useState, useEffect} from 'react';
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
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {APP_NAME} from '../../helper/Constants';
import {doFilterGallery} from '../../Actions/GalleryActions';
import HeaderBar from '../../component/HeaderBar';
import ProgresImage from '../../component/ProgresImage';
let pageTitle = APP_NAME;
const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
};
let totalCount = 0;
let filterObject = {};

const {height, width} = Dimensions.get('window');

const FilteredResult = ({navigation, route}) => {
  const [imageData, setImageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.waiting,
  );

  useEffect(() => {
    if (route.params !== undefined && route.params !== null) {
      pageTitle = route.params.pageTitle;
      filterObject = route.params.filterBy;

      setTimeout(() => {
        getGalleryData();
      }, 100);
    }
    return () => {};
  }, []);

  const getGalleryData = () => {
    doFilterGallery(
      filterObject,
      (response) => {
        setLoading(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              let results = data.data;

              console.log('====================================');
              console.log(results);
              console.log('====================================');

              if (filterObject.index === 0) {
                totalCount = data.totalCount;
                setImageData([...results]);
              } else {
                setImageData([...imageData, ...results]);
              }
              setPaginationStatus(PaginationStatus.waiting);
            }
          }
        }
      },
      (error, message) => {
        setLoading(false);
        if (error === 404) {
          setPaginationStatus(PaginationStatus.allLoaded);
          setImageData(null);
        }
        console.log('error', message);
      },
    );
  };

  const onPaginate = () => {
    if (paginationStatus !== PaginationStatus.allLoaded && !isRefreshing) {
      console.log('onPaginate()');
      setPaginationStatus(PaginationStatus.waiting);
      filterObject.index = filterObject.index + 1;
      getGalleryData();
    }
  };

  const onEndReached = () => {
    console.log('onEndReached()');
    if (imageData.length === totalCount) {
      setPaginationStatus(PaginationStatus.allLoaded);
      return;
    }
    if (paginationStatus === PaginationStatus.waiting) {
      onPaginate();
    }
  };

  const handleRefresh = () => {
    filterObject.index = 0;
    getGalleryData();
  };

  const renderFooter = () => {
    return (
      <View style={styles.footerView}>
        {imageData.length === totalCount ? (
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

  const generateGalleryView = () => {
    let calloutSection = imageData.map((item, index) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          key={index}
          onPress={() => {
            let payload = {
              index: index,
              data: imageData,
              title: item.galleryId.title,
            };
            navigation.navigate('GalleryDetail', payload);
          }}
          style={{
            width: width / 3 - 27,
            marginTop: 10,
            marginRight: 5,
            marginLeft: 5,
          }}>
          <View style={[g.br3, g.oh, g.bggray]}>
            <ProgresImage
              source={
                item.imagesLink !== undefined &&
                item.imagesLink !== null &&
                item.imagesLink !== ''
                  ? {
                      uri: item.imagesLink,
                    }
                  : GlobalInclude.Assets.DefaultImage
              }
              containerStyle={{aspectRatio: 1 / 1}}
              imageStyle={{
                aspectRatio: 1 / 1,
              }}
            />
          </View>
        </TouchableOpacity>
      );
    });
    return calloutSection;
  };

  const renderNoDataComponent = () => {
    return (
      <View style={GlobalInclude.AppStyle.center}>
        <Text style={[g.colorBlack, g.FHNM, g.fs12, g.textCenter]}>
          No Record Found
        </Text>
      </View>
    );
  };

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.parentStyle}>
        <View style={GlobalInclude.AppStyle.fill}>
          {loading ? (
            <View style={GlobalInclude.AppStyle.fillCenter}>
              <ActivityIndicator size={'small'} color={'#2b3252'} />
            </View>
          ) : (
            <View style={GlobalInclude.AppStyle.fill}>
              <HeaderBar
                navigation={navigation}
                title={pageTitle}
                showBack={true}
              />
              {imageData &&
              imageData !== undefined &&
              imageData !== null &&
              imageData.length > 0 ? (
                <View
                  style={[
                    {
                      marginRight: 15,
                      marginLeft: 15,
                      padding: 10,
                      borderRadius: 10,
                      shadowOffset: {width: 2},
                    },
                    g.mb5,
                    g.mt10,
                    g.pb15,
                    g.bgWhite,
                    g.boxShadow,
                  ]}>
                  <View
                    style={[
                      grid.rowdir,
                      grid.alignItemsBottom,
                      grid.justifyContent,
                    ]}>
                    <View style={[g.oh]}>
                      <View style={[grid.rowdir, grid.flexwrap]}>
                        {generateGalleryView()}
                      </View>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={GlobalInclude.AppStyle.fillCenter}>
                  <Text style={[g.colorBlack, g.FHNM, g.fs12, g.textCenter]}>
                    No Record Found
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  footerView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default FilteredResult;
