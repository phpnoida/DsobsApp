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
  FlatList,
  Linking,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {IconType, APP_NAME, URL_REGX} from '../../helper/Constants';
import TopHeaderView from '../../component/TopHeaderView';
import GalleryImage from '../../component/GalleryImage';
import CheckBoxIOS from 'react-native-check-box';
import FilterSheet from 'react-native-raw-bottom-sheet';
import CommonButton from '../../component/CommonButton';
import ImageShareModal from '../../component/ImageShareModal';
import {
  getAlbums,
  getGalleryCategory,
  doFilterGallery,
} from '../../Actions/GalleryActions';
import HeaderBar from '../../component/HeaderBar';
import ProgresImage from '../../component/ProgresImage';

let pageTitle = APP_NAME;
let deviceWidth = Dimensions.get('window').width;

const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
};
let totalCount = 0;
let filterObject = {};

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
    console.log('====================================');
    console.log(filterObject);
    console.log('====================================');
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
              console.log('====================================');
              console.log('data.data', JSON.stringify(data.data));
              console.log('====================================');
              let results = data.data;

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

  const generateGalleryView = ({item, index}) => {
    return (
      <TouchableOpacity activeOpacity={1} onPress={() => {}} style={[g.mb15]}>
        <View style={[g.br3, g.oh]}>
          <ProgresImage
            source={
              item.imagesLink != null && item.imagesLink !== ''
                ? {uri: item.imagesLink}
                : GlobalInclude.Assets.DefaultImage
            }
            containerStyle={[
              g.oh,
              g.bglightGray,
              {
                borderRadius: 8,
                aspectRatio: 3 / 4,
                width: deviceWidth - 30,
              },
            ]}
          />
        </View>
      </TouchableOpacity>
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
              <View
                style={{
                  paddingLeft: 15,
                  paddingRight: 15,
                  paddingTop: scale(15),
                  paddingBottom: scale(35),
                }}>
                {imageData === null || imageData.length === 0 ? (
                  <View style={GlobalInclude.AppStyle.center}>
                    <Text style={[g.colorBlack, g.FHNM, g.fs12, g.textCenter]}>
                      No Record Found
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    extraData={imageData}
                    data={imageData}
                    renderItem={generateGalleryView}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.1}
                    onEndReached={onEndReached}
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    ListFooterComponent={renderFooter}
                  />
                )}
              </View>
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
