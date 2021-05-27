import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Modal,
  FlatList,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import {IconType} from '../../helper/Constants';
import {getMagazines} from '../../Actions/RoseBowlActions';
import TopHeaderView from '../../component/TopHeaderView';
import ProgresImage from '../../component/ProgresImage';
import {renderNoDataComponent} from '../../component/Common';
import {_downloadContent} from '../../helper/mediaHelper';

let deviceWidth = Dimensions.get('window').width;
let responseMessage = '';
let selectedId = '';
let defaultPosition = 0;
let totalCount = 0;
let filterObject = {
  index: 0,
  size: 10,
};
const ITEM_HEIGHT = 609;
const PaginationStatus = {
  firstLoad: 0,
  waiting: 1,
  allLoaded: 2,
};

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function MagazineItem({index, item, isDownloading, onSelect, onDownload}) {
  return useMemo(() => {
    return (
      <View key={index} style={grid.alignItems}>
        <TouchableOpacity activeOpacity={1} onPress={onSelect} style={[g.mb15]}>
          <View style={[g.br3, g.oh]}>
            <ProgresImage
              source={
                item.contentImage.file != null && item.contentImage.file !== ''
                  ? {uri: item.contentImage.file}
                  : GlobalInclude.Assets.DefaultImage
              }
              containerStyle={[
                g.oh,
                g.bglightGray,
                {
                  borderRadius: 8,
                  aspectRatio: 3 / 4,
                  width: deviceWidth - 70,
                },
              ]}
            />
          </View>

          <View
            style={[
              grid.rowrow,
              grid.alignItems,
              grid.justifyContent,
              g.mt10,
              g.mb20,
            ]}>
            <Text style={[g.colordarkGray, g.FHNM, g.fs15]}>
              {`${monthNames[item.publishMonth - 1]} - ${item.publishYear} `}
            </Text>
            {isDownloading && item._id === selectedId ? (
              <ActivityIndicator
                size={'small'}
                color={GlobalInclude.Color.ColorPrimary}
              />
            ) : (
              <TouchableOpacity activeOpacity={1} onPress={onDownload}>
                <GlobalInclude.BaseIcon
                  containerStyle={style.downloadIcon}
                  iconColor={GlobalInclude.Color.ColorPrimary}
                  iconName={'download'}
                  iconSize={scale(20)}
                  iconType={IconType[4]}
                />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }, [index, item, isDownloading, onSelect, onDownload]);
}

const Magazine = ({route, navigation}) => {
  const flatList = useRef();
  const [pageContent, setPageContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paginationStatus, setPaginationStatus] = useState(
    PaginationStatus.firstLoad,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    resetFilter();
    getMagazine();
    return () => {};
  }, []);

  /**
   * ************************************************
   * API Section Start
   * ************************************************
   */

  const getMagazine = () => {
    getMagazines(
      filterObject,
      (response) => {
        setIsLoading(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              let results = data.data;

              if (filterObject.index === 0) {
                filterObject.size = 10;
                totalCount = data.totalCount;

                let currentYear = new Date().getFullYear();
                let currentMonth = new Date().getMonth() + 1;

                for (let i = 0; i < results.length; i++) {
                  const element = results[i];
                  if (
                    element.publishYear.toString() === currentYear.toString() &&
                    element.publishMonth.toString() === currentMonth.toString()
                  ) {
                    defaultPosition = i;
                    break;
                  }
                }
                setPageContent([...results]);

                setTimeout(() => {
                  flatList.current.scrollToIndex({
                    index: defaultPosition,
                    animated: true,
                  });
                }, 500);
              } else {
                setPageContent([...pageContent, ...results]);
              }
              setPaginationStatus(PaginationStatus.waiting);
            } else {
              setPageContent(null);
            }
          }
        }
      },
      (error) => {
        setIsLoading(false);
        if (error === 404) {
          setPaginationStatus(PaginationStatus.allLoaded);
          if (filterObject.index === 0) {
            setPageContent([]);
          }
        }

        console.log('error', error);
      },
    );
  };

  const downloadImage = useCallback(
    async (file) => {
      if (!isDownloading) {
        setIsDownloading(true);
        let result = await _downloadContent(file);

        if (result) {
          responseMessage = 'Content downloaded successfully!';
        } else {
          responseMessage = 'Error while downloading content!';
        }
        setIsDownloading(false);
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
        }, 2000);
      }
    },
    [isDownloading],
  );

  /*
   * ************************************************
   * API Section End
   * ************************************************
   */

  /**
   *
   * Pagination
   *
   */
  const callNextBatch = () => {
    filterObject.index = filterObject.index + 1;
    getMagazine();
  };
  const onPaginate = () => {
    if (paginationStatus !== PaginationStatus.allLoaded && !isRefreshing) {
      console.log('onPaginate()');
      setPaginationStatus(PaginationStatus.waiting);
      callNextBatch();
    }
  };

  const onEndReached = () => {
    console.log('onEndReached()');
    if (pageContent.length === totalCount || pageContent.length < 10) {
      setPaginationStatus(PaginationStatus.allLoaded);
      return;
    }
    if (paginationStatus === PaginationStatus.waiting) {
      onPaginate();
    }
  };

  const handleRefresh = () => {
    resetFilter();
    setIsRefreshing(false);
    getMagazine();
  };

  const resetFilter = () => {
    totalCount = 0;
    filterObject.index = 0;
    filterObject.size = 10;
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

  const keyExtractor = useCallback((item, index) => index, []);

  const getItemLayout = useCallback(
    (data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  const renderItem = useCallback(
    ({item, index}) => (
      <MagazineItem
        index={index}
        item={item}
        isDownloading={isDownloading}
        onSelect={() => {
          navigation.navigate('Summary', {
            magazineId: item._id,
          });
        }}
        onDownload={() => {
          selectedId = item._id;
          downloadImage(item.pdf.file);
        }}
      />
    ),
    [isDownloading, navigation, downloadImage],
  );

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <TopHeaderView index={1} navigation={navigation} />
      <SafeAreaView style={GlobalInclude.AppStyle.fill}>
        <View style={GlobalInclude.AppStyle.parentStyle}>
          <View
            style={[
              GlobalInclude.AppStyle.fill,
              GlobalInclude.AppStyle.contentSpace,
            ]}>
            {isLoading ? (
              <View style={GlobalInclude.AppStyle.fillCenter}>
                <ActivityIndicator
                  size={'small'}
                  color={GlobalInclude.Color.ColorPrimary}
                />
              </View>
            ) : (
              <View style={GlobalInclude.AppStyle.fill}>
                <FlatList
                  ref={flatList}
                  showsVerticalScrollIndicator={false}
                  extraData={pageContent}
                  data={pageContent}
                  renderItem={renderItem}
                  keyExtractor={keyExtractor}
                  onEndReachedThreshold={0.1}
                  onEndReached={onEndReached}
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  initialScrollIndex={defaultPosition}
                  ListEmptyComponent={renderNoDataComponent}
                  ListFooterComponent={renderFooter}
                  contentContainerStyle={{
                    paddingBottom: pageContent.length > 0 ? scale(130) : 0,
                    flexGrow: 1,
                  }}
                  getItemLayout={getItemLayout}
                  onScrollToIndexFailed={(error) => {
                    console.log('failed', error);
                    flatList.current.scrollToOffset({
                      offset: error.averageItemLength * error.index,
                      animated: true,
                    });
                    setTimeout(() => {
                      flatList.current.scrollToIndex({
                        index: error.index,
                        animated: true,
                      });
                    }, 500);
                  }}
                />
              </View>
            )}
          </View>
        </View>
        {showModal && (
          <Modal
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
              setShowModal(!showModal);
            }}
            hardwareAccelerated={true}
            visible={showModal}>
            <View style={style.centeredView}>
              <View style={style.modalView}>
                <Text style={style.headerText}>{responseMessage}</Text>
              </View>
            </View>
          </Modal>
        )}
      </SafeAreaView>
    </View>
  );
};

const style = StyleSheet.create({
  downloadIcon: {
    height: scale(20),
    width: scale(20),
    alignSelf: 'center',
  },
  searchIcon: {
    height: scale(20),
    width: scale(20),
    alignSelf: 'center',
    marginEnd: scale(6),
    marginStart: scale(6),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: deviceWidth - 50,
    backgroundColor: 'white',
    borderRadius: scale(6),
    padding: scale(7),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: scale(60),
    alignContent: 'center',
  },
  headerText: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: scale(16),
    textAlign: 'center',
    ...g.FHNR,
    ...g.colorBlue,
  },
});

export default Magazine;
